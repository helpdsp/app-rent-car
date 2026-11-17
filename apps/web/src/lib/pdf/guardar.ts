/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T04
 */

import crypto from "crypto";
import { registrarAuditoria } from "../db/sprint2";

export interface VersionPDF {
  id: string;
  contrato_id: string;
  version: number;
  nombre_archivo: string;
  contenido: string; // Datos serializados o base64
  sha256: string;
  firmado: boolean;
  firmado_en?: string | null;
  firmado_por?: string | null;
  dispositivo?: string | null;
  created_at: string;
}

// Almacén de versiones de PDFs inmutables
const ALMACEN_PDFS: VersionPDF[] = [];

/**
 * Calcula la huella digital criptográfica SHA-256 de un contenido (T-51, T-53).
 */
export function calcularHuellaSHA256(contenido: string | Buffer): string {
  return crypto.createHash("sha256").update(contenido).digest("hex");
}

/**
 * Guarda una versión de PDF para un contrato.
 * Si el contrato ya tiene una versión firmada inmutable, genera automáticamente una nueva versión (T-52).
 */
export function guardarVersionPDF(
  contratoId: string,
  contenido: string,
  autor: { id: string; nombre: string },
  opciones?: { firmado?: boolean; dispositivo?: string }
): VersionPDF {
  const sha256 = calcularHuellaSHA256(contenido);
  const versionesPrevias = ALMACEN_PDFS.filter((p) => p.contrato_id === contratoId);
  const siguienteVersion = versionesPrevias.length + 1;

  const ahora = new Date().toISOString();
  const id = crypto.randomUUID();
  const nombreArchivo = `contrato_${contratoId}_v${siguienteVersion}.pdf`;

  const nuevaVersion: VersionPDF = {
    id,
    contrato_id: contratoId,
    version: siguienteVersion,
    nombre_archivo: nombreArchivo,
    contenido,
    sha256,
    firmado: opciones?.firmado ?? false,
    firmado_en: opciones?.firmado ? ahora : null,
    firmado_por: opciones?.firmado ? autor.id : null,
    dispositivo: opciones?.dispositivo ?? null,
    created_at: ahora,
  };

  ALMACEN_PDFS.push(nuevaVersion);

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "documentos_pdf",
    registro_id: id,
    registro_descripcion: `PDF versión ${siguienteVersion} generado para contrato ${contratoId} (SHA-256: ${sha256.slice(0, 16)}...)`,
    valor_anterior: null,
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      version: siguienteVersion,
      sha256,
      firmado: nuevaVersion.firmado,
    },
  });

  return nuevaVersion;
}

/**
 * Intenta modificar un PDF. Si ya está firmado, rechaza la modificación directa (T-52).
 */
export function modificarVersionPDF(
  versionId: string,
  nuevoContenido: string
): { ok: true; version: VersionPDF } | { ok: false; codigo: string; error: string } {
  const version = ALMACEN_PDFS.find((v) => v.id === versionId);
  if (!version) {
    return { ok: false, codigo: "VERSION_NO_ENCONTRADA", error: "Versión de PDF no encontrada." };
  }

  // T-52: Un contrato firmado es inmutable
  if (version.firmado) {
    return {
      ok: false,
      codigo: "CONTRATO_FIRMADO_INMUTABLE",
      error:
        "CONTRATO_FIRMADO_INMUTABLE: Un contrato firmado no puede modificarse directamente. Cualquier cambio crea una versión nueva y exige firmar otra vez.",
    };
  }

  version.contenido = nuevoContenido;
  version.sha256 = calcularHuellaSHA256(nuevoContenido);
  return { ok: true, version };
}

/**
 * Verifica la integridad de un PDF contra su huella SHA-256 registrada (T-53).
 */
export function verificarIntegridadPDF(
  versionId: string,
  contenidoActual: string
): { integro: boolean; codigo?: string; hashOriginal: string; hashActual: string } {
  const version = ALMACEN_PDFS.find((v) => v.id === versionId);
  const hashActual = calcularHuellaSHA256(contenidoActual);

  if (!version) {
    return {
      integro: false,
      codigo: "VERSION_NO_ENCONTRADA",
      hashOriginal: "",
      hashActual,
    };
  }

  const integro = version.sha256 === hashActual;
  return {
    integro,
    codigo: integro ? undefined : "INTEGRIDAD_COMPROMETIDA",
    hashOriginal: version.sha256,
    hashActual,
  };
}

/**
 * Obtiene la última versión disponible de un contrato.
 */
export function obtenerUltimoPDFContrato(contratoId: string): VersionPDF | undefined {
  const versiones = ALMACEN_PDFS.filter((p) => p.contrato_id === contratoId);
  if (versiones.length === 0) return undefined;
  return versiones.sort((a, b) => b.version - a.version)[0];
}

/**
 * Resetea el almacén de PDFs para pruebas unitarias.
 */
export function resetearEstadoPDFs(): void {
  ALMACEN_PDFS.length = 0;
}
