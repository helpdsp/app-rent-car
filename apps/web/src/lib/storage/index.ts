/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:28:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T09
 */

import crypto from "node:crypto";
import { registrarAuditoria } from "@/lib/db/sprint2";

export const BUCKETS_PRIVADOS = [
  "documentos",
  "evidencias",
  "contratos",
  "firmas",
] as const;
export type BucketPrivado = (typeof BUCKETS_PRIVADOS)[number];

export interface UrlFirmada {
  url: string;
  bucket: BucketPrivado;
  path: string;
  expiraEn: string;
  duracionSegundos: number;
}

/**
 * Genera una URL firmada de corta duración para lectura o subida en Supabase Storage.
 * Si el acceso es a un documento oficial (licencia, credencial, etc.),
 * registra obligatoriamente una entrada `SELECT_SENSIBLE` en la bitácora (RF-05, T-13).
 */
export function generarUrlFirmadaStorage(opciones: {
  bucket: BucketPrivado;
  path: string;
  duracionSegundos?: number; // Por defecto 15 minutos (900 s)
  usuarioId?: string | null;
  usuarioNombre?: string;
  registrarAuditoriaSensible?: boolean;
  documentoDescripcion?: string;
}): UrlFirmada {
  const duracion = opciones.duracionSegundos ?? 900;
  const expiraTimestamp = Date.now() + duracion * 1000;
  const expiraEn = new Date(expiraTimestamp).toISOString();

  // Firma HMAC de seguridad
  const claveFirma = "mra-storage-secret-key-token";
  const token = crypto
    .createHmac("sha256", claveFirma)
    .update(`${opciones.bucket}:${opciones.path}:${expiraTimestamp}`)
    .digest("hex");

  const url = `https://supabase.local/storage/v1/object/sign/${opciones.bucket}/${opciones.path}?token=${token}&expires=${Math.floor(expiraTimestamp / 1000)}`;

  // Registro de auditoría sensible si aplica
  if (opciones.registrarAuditoriaSensible || opciones.bucket === "documentos") {
    registrarAuditoria({
      usuario_id: opciones.usuarioId ?? null,
      usuario_nombre: opciones.usuarioNombre ?? "Usuario",
      accion: "SELECT_SENSIBLE",
      tabla: "documentos",
      registro_id: null,
      registro_descripcion:
        opciones.documentoDescripcion ??
        `Consultó el archivo sensible ${opciones.path} en el bucket ${opciones.bucket}`,
      valor_anterior: null,
      valor_nuevo: {
        bucket: opciones.bucket,
        path: opciones.path,
        url_firmada_expira: expiraEn,
      },
    });
  }

  return {
    url,
    bucket: opciones.bucket,
    path: opciones.path,
    expiraEn,
    duracionSegundos: duracion,
  };
}
