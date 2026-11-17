/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T01
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerVehiculoPorId, actualizarVehiculo } from "../db/sprint4";
import { obtenerContratoPorId, type ContratoCompletoRow } from "./emitir";
import {
  validarEvidenciasCompletas,
  obtenerEvidenciasContrato,
} from "../storage/evidencias";
import {
  guardarInventarioContrato,
  type DanoDiagrama,
  type InventarioContratoRow,
} from "./entregar";

export interface RegistrarRecepcionInput {
  km_entrada: number;
  gasolina_entrada: number; // 0 a 8 octavos
  entrada_real_en?: string;
  inventario?: {
    refacciones?: boolean;
    gato?: boolean;
    herramienta?: boolean;
    reflejantes?: boolean;
    tapetes?: boolean;
    radio?: boolean;
    bocinas?: boolean;
    cinturones?: boolean;
    placas?: boolean;
    antena?: boolean;
    danos?: DanoDiagrama[];
    notas?: string | null;
  };
  autorizacionAdminNota?: string | null;
}

export type RegistrarRecepcionResultado =
  | {
      ok: true;
      contrato: ContratoCompletoRow;
      inventario: InventarioContratoRow;
    }
  | {
      ok: false;
      codigo: string;
      error: string;
      status: number;
      angulosFaltantes?: string[];
    };

/**
 * Registra la recepción física del vehículo al finalizar la renta (RF-21, T-77).
 * Valida los 6 ángulos de foto de recepción, odómetro y nivel de combustible.
 */
export function registrarRecepcionVehiculo(
  contratoId: string,
  datos: RegistrarRecepcionInput,
  autor: { id: string; nombre: string; rol: string }
): RegistrarRecepcionResultado {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado.",
      status: 404,
    };
  }

  // 1. Validar que el contrato esté en estado apto para recibir
  const estadosAptos = ["vigente", "por_vencer", "rezagado", "en_incidente"];
  if (!estadosAptos.includes(contrato.estado)) {
    return {
      ok: false,
      codigo: "ESTADO_INVALIDO",
      error: `No se puede recibir un contrato en estado '${contrato.estado}'.`,
      status: 422,
    };
  }

  // 2. Validar que el kilometraje de entrada sea >= al de salida (RF-21)
  const kmSalida = contrato.km_salida ?? 0;
  if (datos.km_entrada < kmSalida) {
    return {
      ok: false,
      codigo: "KILOMETRAJE_ENTRADA_INVALIDO",
      error: `El kilometraje de entrada (${datos.km_entrada.toLocaleString()} km) no puede ser menor al kilometraje de salida (${kmSalida.toLocaleString()} km).`,
      status: 422,
    };
  }

  // 3. Validar evidencias de recepción (6 ángulos obligatorios o excepción de administrador, T-77)
  const validacionEvidencias = validarEvidenciasCompletas(
    contratoId,
    "recepcion",
    datos.autorizacionAdminNota
  );

  if (!validacionEvidencias.completo) {
    const nombresAmigables: Record<string, string> = {
      frente: "Frente",
      atras: "Atrás",
      izquierda: "Izquierda",
      derecha: "Derecha",
      tablero_km: "Tablero y km",
      interior: "Interior",
    };
    const listaFaltantes = validacionEvidencias.angulosFaltantes.map(
      (a) => nombresAmigables[a] ?? a
    );

    return {
      ok: false,
      codigo: "ANGULOS_RECEPCION_INCOMPLETOS",
      error: `Se requieren los 6 ángulos de foto de recepción obligatorios. Faltan: ${listaFaltantes.join(", ")} (T-77).`,
      angulosFaltantes: validacionEvidencias.angulosFaltantes,
      status: 409,
    };
  }

  // 4. Validar foto del tablero con km de entrada capturado ligado si no hay excepción
  if (!validacionEvidencias.autorizadoPorExcepcion) {
    const evidenciasRecepcion = obtenerEvidenciasContrato(contratoId, "recepcion");
    const fotoTablero = evidenciasRecepcion.find(
      (e) => e.tipo === "foto" && e.angulo === "tablero_km"
    );

    if (!fotoTablero || fotoTablero.km_capturado === null) {
      return {
        ok: false,
        codigo: "ODOMETRO_FOTO_REQUERIDA",
        error: "La foto del tablero con el kilometraje de entrada capturado es obligatoria.",
        status: 422,
      };
    }

    if (fotoTablero.km_capturado !== datos.km_entrada) {
      return {
        ok: false,
        codigo: "KILOMETRAJE_NO_COINCIDE",
        error: `El kilometraje capturado en la foto de entrada (${fotoTablero.km_capturado.toLocaleString()} km) no coincide con el kilometraje ingresado (${datos.km_entrada.toLocaleString()} km).`,
        status: 422,
      };
    }
  }

  // 5. Guardar inventario y daños de recepción
  const inventario = guardarInventarioContrato(
    contratoId,
    "recepcion",
    datos.inventario || {},
    autor
  );

  // 6. Transición del contrato a 'recibido'
  const estadoAnterior = contrato.estado;
  const ahora = datos.entrada_real_en || new Date().toISOString();
  contrato.estado = "recibido";
  contrato.km_entrada = datos.km_entrada;
  contrato.gasolina_entrada = datos.gasolina_entrada;
  contrato.entrada_real_en = ahora;
  contrato.updated_at = ahora;

  // 7. Actualizar el odómetro del vehículo
  const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id);
  if (vehiculo) {
    actualizarVehiculo(
      vehiculo.id,
      {
        kilometraje_actual: datos.km_entrada,
      },
      autor
    );
  }

  // 8. Bitácora de auditoría
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: contrato.id,
    registro_descripcion: `Recepción de vehículo para contrato ${contrato.folio ?? contratoId}. Estado pasó de '${estadoAnterior}' a 'recibido'. Km entrada: ${datos.km_entrada}, Gasolina: ${datos.gasolina_entrada}/8.`,
    valor_anterior: {
      estado: estadoAnterior,
      km_entrada: null,
      gasolina_entrada: null,
    },
    valor_nuevo: {
      estado: "recibido",
      km_entrada: datos.km_entrada,
      gasolina_entrada: datos.gasolina_entrada,
      entrada_real_en: ahora,
    },
  });

  return {
    ok: true,
    contrato,
    inventario,
  };
}
