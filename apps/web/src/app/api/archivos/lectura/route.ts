/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:38:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T06
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { generarUrlFirmadaStorage, type BucketPrivado } from "@/lib/storage";

const lecturaSchema = z.object({
  bucket: z.enum(["documentos", "evidencias", "contratos", "firmas"]),
  path: z.string().min(1),
  documento_descripcion: z.string().optional(),
});

/**
 * POST /api/archivos/lectura — Generar URL firmada de lectura y registrar SELECT_SENSIBLE (RF-05, T-13)
 */
export async function POST(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
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

  const parsed = lecturaSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ codigo: "VALIDACION_FALLIDA", mensaje: "Parámetros de lectura inválidos." }, { status: 422 });
  }

  const urlFirmada = generarUrlFirmadaStorage({
    bucket: parsed.data.bucket as BucketPrivado,
    path: parsed.data.path,
    duracionSegundos: 600, // 10 minutos
    usuarioId: auth.sesion.usuarioId,
    usuarioNombre: auth.sesion.nombre,
    registrarAuditoriaSensible: true,
    documentoDescripcion: parsed.data.documento_descripcion,
  });

  return Response.json(urlFirmada, { status: 200 });
}
