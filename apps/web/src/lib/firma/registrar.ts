/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:25:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T06
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId } from "../contratos/emitir";
import { obtenerUltimoPDFContrato, guardarVersionPDF } from "../pdf/guardar";

export type TipoFirmante = "arrendatario" | "conductor_adicional" | "pagare";

export interface RegistroFirma {
  id: string;
  contrato_id: string;
  firmante_tipo: TipoFirmante;
  firmante_nombre: string;
  imagen_base64: string;
  pdf_sha256: string;
  usuario_id: string;
  usuario_nombre: string;
  dispositivo: string;
  ip?: string | null;
  created_at: string;
}

// Almacén en memoria de firmas digitales
const ALMACEN_FIRMAS: RegistroFirma[] = [];

/**
 * Registra formalmente una firma digital para un contrato (RF-18, T-51).
 */
export function registrarFirmaDigital(
  contratoId: string,
  datos: {
    firmante_tipo: TipoFirmante;
    firmante_nombre: string;
    imagen_base64: string;
    dispositivo: string;
    ip?: string | null;
  },
  autor: { id: string; nombre: string }
): { ok: true; firma: RegistroFirma } | { ok: false; codigo: string; error: string } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado." };
  }

  // Obtener o asegurar el PDF asociado
  let pdf = obtenerUltimoPDFContrato(contratoId);
  if (!pdf) {
    pdf = guardarVersionPDF(
      contratoId,
      JSON.stringify({ folio: contrato.folio, cliente: contrato.cliente_nombre }),
      autor
    );
  }

  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();

  const nuevaFirma: RegistroFirma = {
    id,
    contrato_id: contratoId,
    firmante_tipo: datos.firmante_tipo,
    firmante_nombre: datos.firmante_nombre,
    imagen_base64: datos.imagen_base64,
    pdf_sha256: pdf.sha256,
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    dispositivo: datos.dispositivo || "Tableta mostrador",
    ip: datos.ip ?? null,
    created_at: ahora,
  };

  ALMACEN_FIRMAS.push(nuevaFirma);

  // Marcar el PDF como firmado e inmutable
  pdf.firmado = true;
  pdf.firmado_en = ahora;
  pdf.firmado_por = autor.id;
  pdf.dispositivo = nuevaFirma.dispositivo;

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "firmas_digitales",
    registro_id: id,
    registro_descripcion: `Firma digital de ${datos.firmante_tipo} (${datos.firmante_nombre}) registrada en contrato ${contrato.folio ?? contratoId} en tableta ${nuevaFirma.dispositivo}`,
    valor_anterior: null,
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      firmante_tipo: datos.firmante_tipo,
      pdf_sha256: pdf.sha256,
      dispositivo: nuevaFirma.dispositivo,
    },
  });

  return { ok: true, firma: nuevaFirma };
}

/**
 * Obtiene todas las firmas registradas para un contrato.
 */
export function obtenerFirmasPorContrato(contratoId: string): RegistroFirma[] {
  return ALMACEN_FIRMAS.filter((f) => f.contrato_id === contratoId);
}

/**
 * Resetea las firmas para aislamiento de pruebas unitarias.
 */
export function resetearEstadoFirmas(): void {
  ALMACEN_FIRMAS.length = 0;
}
