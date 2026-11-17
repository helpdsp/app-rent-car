/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:40:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T05
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId, type ContratoCompletoRow } from "./emitir";
import { obtenerVehiculoPorId, actualizarVehiculo } from "../db/sprint4";
import { penalizacionCancelacion } from "../pricing";
import { insertarEventoOutbox } from "../db/outbox";

export interface CancelarContratoInput {
  motivo: string;
  nota: string;
  fechaSolicitud?: string | Date;
  formaReembolso?: "efectivo" | "transferencia";
}

export type CancelarContratoResultado =
  | {
      ok: true;
      contrato: ContratoCompletoRow;
      totalContratoCentavos: number;
      anticipoPagadoCentavos: number;
      horasAnticipacion: number;
      porcentajePenalizacion: number;
      penalizacionCentavos: number;
      reembolsoClienteCentavos: number;
    }
  | {
      ok: false;
      codigo: string;
      error: string;
      status: number;
    };

/**
 * Cancela una reservación o contrato no vigente aplicando la regla de penalización (RF-25, T-71, T-72, T-73).
 * - > 24 h de anticipación: 20 % de penalización (T-71).
 * - <= 24 h de anticipación: 100 % de penalización (T-72).
 * - Contrato en estado 'vigente': Rechazo con 409 (T-73).
 */
export function cancelarContrato(
  contratoId: string,
  datos: CancelarContratoInput,
  autor: { id: string; nombre: string; rol?: string }
): CancelarContratoResultado {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado.",
      status: 404,
    };
  }

  // T-73: Un contrato vigente no se cancela; debe concluirse con la recepción
  if (contrato.estado === "vigente") {
    return {
      ok: false,
      codigo: "CONTRATO_VIGENTE_NO_CANCELABLE",
      error: "Un contrato vigente no puede cancelarse. La terminación debe realizarse formalmente mediante la recepción del vehículo (T-73).",
      status: 409,
    };
  }

  if (contrato.estado === "cancelado" || contrato.estado === "concluido") {
    return {
      ok: false,
      codigo: "ESTADO_INVALIDO",
      error: `El contrato ya se encuentra en estado '${contrato.estado}'.`,
      status: 422,
    };
  }

  const salida = new Date(contrato.salida_en);
  const solicitud = new Date(datos.fechaSolicitud || new Date());

  const msAnticipacion = salida.getTime() - solicitud.getTime();
  const horasAnticipacion = msAnticipacion / (1000 * 60 * 60);

  const totalContratoCentavos = Number(contrato.anticipo);
  const anticipoPagadoCentavos = Number(contrato.anticipo);

  // Regla del motor de tarifas para cancelación (RF-25)
  const penalizacionCentavos = penalizacionCancelacion(
    totalContratoCentavos,
    horasAnticipacion
  );

  const porcentajePenalizacion = horasAnticipacion <= 24 ? 100 : 20;
  const reembolsoClienteCentavos = Math.max(0, anticipoPagadoCentavos - penalizacionCentavos);

  // Transición a 'cancelado'
  const estadoAnterior = contrato.estado;
  const ahora = new Date().toISOString();
  contrato.estado = "cancelado";
  contrato.updated_at = ahora;

  // Liberar el vehículo
  const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id);
  if (vehiculo) {
    vehiculo.estado = "disponible";
    vehiculo.contrato_activo_folio = null;
    vehiculo.es_rezagado = false;
    actualizarVehiculo(
      vehiculo.id,
      {
        estado: "disponible",
      },
      { ...autor, rol: autor.rol || "operador" }
    );
  }

  // Evento outbox
  insertarEventoOutbox("contrato_cancelado", {
    contrato_id: contrato.id,
    folio: contrato.folio,
    vehiculo_id: contrato.vehiculo_id,
    cliente_id: contrato.cliente_id,
    motivo: datos.motivo,
    nota: datos.nota,
    penalizacion: penalizacionCentavos,
    reembolso: reembolsoClienteCentavos,
    horas_anticipacion: horasAnticipacion,
  });

  // Auditoría
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: contrato.id,
    registro_descripcion: `Contrato ${contrato.folio ?? contratoId} cancelado. Motivo: ${datos.motivo}. Anticipación: ${horasAnticipacion.toFixed(1)} h. Penalización: $${(penalizacionCentavos / 100).toLocaleString("es-MX")} (${porcentajePenalizacion}%). Reembolso: $${(reembolsoClienteCentavos / 100).toLocaleString("es-MX")}.`,
    valor_anterior: { estado: estadoAnterior },
    valor_nuevo: {
      estado: "cancelado",
      motivo: datos.motivo,
      penalizacion: penalizacionCentavos,
      reembolso: reembolsoClienteCentavos,
      vehiculo_estado: "disponible",
    },
  });

  return {
    ok: true,
    contrato,
    totalContratoCentavos,
    anticipoPagadoCentavos,
    horasAnticipacion,
    porcentajePenalizacion,
    penalizacionCentavos,
    reembolsoClienteCentavos,
  };
}
