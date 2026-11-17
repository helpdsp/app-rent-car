/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:28:00Z
 * @agent_roles engineering-backend-architect + engineering-frontend-developer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T03
 */

import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { consultarBitacora } from "@/lib/db/sprint2";

/**
 * GET /api/auditoria — Consultar bitácora inmutable (administrador y titular) (RF-02)
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_bitacora",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const url = new URL(request.url);
  const tabla = url.searchParams.get("tabla") ?? undefined;
  const usuario_id = url.searchParams.get("usuario_id") ?? undefined;
  const desde = url.searchParams.get("desde") ?? undefined;
  const hasta = url.searchParams.get("hasta") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const entradas = consultarBitacora({ tabla, usuario_id, desde, hasta, q });

  return Response.json(
    {
      datos: entradas,
      total: entradas.length,
    },
    { status: 200 },
  );
}
