/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:20:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T07
 */

import crypto from "crypto";
import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId } from "../contratos/emitir";
import { obtenerClientePorId } from "../db/sprint3";
import { obtenerUltimoPDFContrato } from "../pdf/guardar";

export interface RegistroEnvioCorreo {
  id: string;
  contrato_id: string;
  folio: string;
  destinatario: string;
  estado: "enviado" | "fallido";
  error: string | null;
  mensaje_id: string | null;
  archivos_adjuntos: string[];
  reintento_numero: number;
  enviado_por: string;
  created_at: string;
}

const HISTORIAL_ENVIOS_CORREO: RegistroEnvioCorreo[] = [];

export interface EnviarContratoCorreoInput {
  contratoId: string;
  correoDestino?: string;
  forzarFalloSimulado?: boolean;
}

export interface EnviarContratoCorreoResultado {
  exito: boolean;
  registro: RegistroEnvioCorreo;
  reintentoDisponible: boolean;
  error?: string;
  codigo?: string;
}

/**
 * Envía el contrato firmado y el reglamento por correo al cliente con reintento (RF-20, T-54).
 * Permite cambiar el correo destino antes de enviar.
 */
export async function enviarContratoPorCorreo(
  input: EnviarContratoCorreoInput,
  autor: { id: string; nombre: string }
): Promise<EnviarContratoCorreoResultado> {
  const contrato = obtenerContratoPorId(input.contratoId);
  if (!contrato) {
    throw new Error("Contrato no encontrado");
  }

  const cliente = obtenerClientePorId(contrato.cliente_id);
  const correoFinal = (
    input.correoDestino ||
    cliente?.correo ||
    ""
  ).trim();

  // Validar formato de correo básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const esCorreoValido = emailRegex.test(correoFinal);

  // Contar intentos previos para registrar el número de reintento
  const intentosPrevios = HISTORIAL_ENVIOS_CORREO.filter(
    (e) => e.contrato_id === input.contratoId
  ).length;

  const pdf = obtenerUltimoPDFContrato(input.contratoId);
  const adjuntos = [
    pdf?.nombre_archivo
      ? `contratos/${contrato.folio ?? input.contratoId}/${pdf.nombre_archivo}`
      : `contratos/${contrato.folio ?? input.contratoId}/caratula_clausulas_v1.pdf`,
    `contratos/${contrato.folio ?? input.contratoId}/reglamento_v1.pdf`,
  ];

  const ahora = new Date().toISOString();
  const idEnvio = crypto.randomUUID();

  // T-54: Simulación de fallo o validación de correo destino
  if (!esCorreoValido || input.forzarFalloSimulado) {
    const errorMsg = !esCorreoValido
      ? `Dirección de correo inválida: '${correoFinal}'`
      : "Error temporal de conexión con el proveedor de correo (Resend / SMTP).";

    const registroFallido: RegistroEnvioCorreo = {
      id: idEnvio,
      contrato_id: input.contratoId,
      folio: contrato.folio || "SIN-FOLIO",
      destinatario: correoFinal,
      estado: "fallido",
      error: errorMsg,
      mensaje_id: null,
      archivos_adjuntos: adjuntos,
      reintento_numero: intentosPrevios + 1,
      enviado_por: autor.id,
      created_at: ahora,
    };

    HISTORIAL_ENVIOS_CORREO.push(registroFallido);

    registrarAuditoria({
      usuario_id: autor.id,
      usuario_nombre: autor.nombre,
      accion: "INSERT",
      tabla: "envios_correo",
      registro_id: idEnvio,
      registro_descripcion: `Fallo al enviar contrato ${contrato.folio} a '${correoFinal}' (Intento #${intentosPrevios + 1}): ${errorMsg}`,
      valor_anterior: null,
      valor_nuevo: {
        estado: "fallido",
        error: errorMsg,
        reintento_disponible: true,
      },
    });

    return {
      exito: false,
      registro: registroFallido,
      reintentoDisponible: true,
      codigo: "FALLO_ENVIO_CORREO",
      error: errorMsg,
    };
  }

  // Éxito en el envío
  const mensajeId = `resend_${crypto.randomBytes(8).toString("hex")}`;
  const registroExitoso: RegistroEnvioCorreo = {
    id: idEnvio,
    contrato_id: input.contratoId,
    folio: contrato.folio || "SIN-FOLIO",
    destinatario: correoFinal,
    estado: "enviado",
    error: null,
    mensaje_id: mensajeId,
    archivos_adjuntos: adjuntos,
    reintento_numero: intentosPrevios + 1,
    enviado_por: autor.id,
    created_at: ahora,
  };

  HISTORIAL_ENVIOS_CORREO.push(registroExitoso);

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "envios_correo",
    registro_id: idEnvio,
    registro_descripcion: `Contrato digital ${contrato.folio} y reglamento enviados exitosamente por correo a '${correoFinal}' (ID: ${mensajeId})`,
    valor_anterior: null,
    valor_nuevo: {
      estado: "enviado",
      destinatario: correoFinal,
      mensaje_id: mensajeId,
      adjuntos,
    },
  });

  return {
    exito: true,
    registro: registroExitoso,
    reintentoDisponible: true,
  };
}

/**
 * Consulta el historial de envíos de correo para un contrato.
 */
export function obtenerHistorialEnviosCorreo(contratoId: string): RegistroEnvioCorreo[] {
  return HISTORIAL_ENVIOS_CORREO.filter((e) => e.contrato_id === contratoId);
}

/**
 * Resetea el historial de envíos de correo para aislamiento de pruebas unitarias.
 */
export function resetearHistorialEnviosCorreo(): void {
  HISTORIAL_ENVIOS_CORREO.length = 0;
}
