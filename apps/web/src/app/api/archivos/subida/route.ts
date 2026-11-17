/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:37:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T04, S03-T06
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { generarUrlFirmadaStorage, type BucketPrivado } from "@/lib/storage";

const subidaSchema = z.object({
  bucket: z.enum(["documentos", "evidencias", "contratos", "firmas"]),
  nombreArchivo: z.string().min(1),
  entidadId: z.string().min(1),
});

/**
 * POST /api/archivos/subida — Generar URL firmada para subida directa de archivos a Storage (RF-05, T-12)
 */
export async function POST(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ codigo: "SOLICITUD_INVALIDA", mensaje: "JSON inválido." }, { status: 400 });
  }

  const parsed = subidaSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ codigo: "VALIDACION_FALLIDA", mensaje: "Parámetros de subida inválidos." }, { status: 422 });
  }

  const path = `${parsed.data.entidadId}/${Date.now()}-${parsed.data.nombreArchivo}`;
  const urlFirmada = generarUrlFirmadaStorage({
    bucket: parsed.data.bucket as BucketPrivado,
    path,
    duracionSegundos: 900,
    usuarioId: auth.sesion.usuarioId,
    usuarioNombre: auth.sesion.nombre,
  });

  return Response.json({
    url_subida: urlFirmada.url,
    path_almacenado: `${parsed.data.bucket}/${path}`,
    expira_en: urlFirmada.expiraEn,
  }, { status: 200 });
}
