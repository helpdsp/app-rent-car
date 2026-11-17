/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:35:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T03
 */

import crypto from "crypto";
import { registrarAuditoria } from "../db/sprint2";
import {
  obtenerContratoPorId,
  obtenerContratos,
  crearBorrador,
  type ContratoCompletoRow,
} from "./emitir";
import { validarRequisitosEmision } from "./validar";
import { calcularDisponibilidad } from "../db/sprint4";

export interface RenovarContratoInput {
  nuevaEntradaPrevista: string; // ISO string
  destino?: string;
  pasarDepositoNuevo?: boolean;
}

export type RenovarContratoResultado =
  | {
      ok: true;
      nuevoContrato: ContratoCompletoRow;
      contratoOrigen: ContratoCompletoRow;
    }
  | {
      ok: false;
      codigo: string;
      error: string;
      status: number;
    };

/**
 * Renueva un contrato creando uno nuevo formalmente ligado al anterior (RF-24, T-70).
 * No hay prórroga tácita (cláusula 3.ª). Revalida disponibilidad del vehículo y vigencia de licencias.
 */
export function renovarContrato(
  contratoId: string,
  datos: RenovarContratoInput,
  autor: { id: string; nombre: string; rol?: string }
): RenovarContratoResultado {
  const contratoOrigen = obtenerContratoPorId(contratoId);
  if (!contratoOrigen) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato original no encontrado.",
      status: 404,
    };
  }

  // La nueva renta inicia exactamente donde terminaba la prevista del contrato anterior (o now)
  const nuevaSalida = contratoOrigen.entrada_prevista_en;
  const nuevaEntrada = datos.nuevaEntradaPrevista;

  const msSalida = new Date(nuevaSalida).getTime();
  const msEntrada = new Date(nuevaEntrada).getTime();

  if (msEntrada <= msSalida) {
    return {
      ok: false,
      codigo: "FECHAS_INVALIDAS",
      error: "La nueva fecha de entrega debe ser posterior a la fecha de inicio.",
      status: 422,
    };
  }

  // 1. Validar disponibilidad de la flota para el nuevo rango de fechas (T-70, RF-09)
  const disponibilidad = calcularDisponibilidad(
    nuevaSalida,
    nuevaEntrada
  );

  // Verificar otros contratos que no sean el origen
  const contratosActivos = obtenerContratos().filter(
    (c) =>
      c.id !== contratoOrigen.id &&
      c.vehiculo_id === contratoOrigen.vehiculo_id &&
      !["borrador", "cancelado", "concluido"].includes(c.estado)
  );

  const hayCruce = contratosActivos.some((c) => {
    const cSalida = new Date(c.salida_en).getTime();
    const cEntrada = new Date(c.entrada_prevista_en).getTime();
    return msSalida < cEntrada && msEntrada > cSalida;
  });

  if (hayCruce) {
    return {
      ok: false,
      codigo: "VEHICULO_NO_DISPONIBLE",
      error: "El vehículo ya tiene otra reserva o bloqueo programado para esas fechas (T-70).",
      status: 409,
    };
  }

  // 2. Revalidar vigencia de licencias para todo el nuevo periodo (T-70, T-31)
  const validacionRequisitos = validarRequisitosEmision({
    salida_en: nuevaSalida,
    entrada_prevista_en: nuevaEntrada,
    vehiculo_id: contratoOrigen.vehiculo_id,
    conductores: contratoOrigen.conductores,
    tarifa_dia: contratoOrigen.tarifa_dia,
    tarifa_catalogo_dia: contratoOrigen.tarifa_catalogo_dia,
  });

  if (!validacionRequisitos.valido) {
    return {
      ok: false,
      codigo: validacionRequisitos.codigo || "LICENCIA_VENCIDA",
      error: validacionRequisitos.error || "Licencia vencida en el nuevo periodo (T-70).",
      status: 422,
    };
  }

  // 3. Crear el nuevo contrato ligado al contrato de origen (RF-24)
  const nuevoId = crypto.randomUUID();
  const nuevoContrato = crearBorrador(
    {
      cliente_id: contratoOrigen.cliente_id,
      vehiculo_id: contratoOrigen.vehiculo_id,
      salida_en: nuevaSalida,
      entrada_prevista_en: nuevaEntrada,
      destino: datos.destino || contratoOrigen.destino,
      lugar_devolucion: contratoOrigen.lugar_devolucion,
      conductores: contratoOrigen.conductores,
      tarifa_dia: Number(contratoOrigen.tarifa_dia),
    },
    { id: autor.id, nombre: autor.nombre }
  );

  nuevoContrato.contrato_origen_id = contratoOrigen.id;

  // Registrar en auditoría
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "contratos",
    registro_id: nuevoContrato.id,
    registro_descripcion: `Renovación formal: Contrato nuevo ${nuevoContrato.id} ligado al contrato ${contratoOrigen.folio ?? contratoOrigen.id} (RF-24, cláusula 3.ª)`,
    valor_anterior: null,
    valor_nuevo: {
      id: nuevoContrato.id,
      contrato_origen_id: contratoOrigen.id,
      salida_en: nuevaSalida,
      entrada_prevista_en: nuevaEntrada,
      vehiculo_id: nuevoContrato.vehiculo_id,
    },
  });

  return {
    ok: true,
    nuevoContrato,
    contratoOrigen,
  };
}
