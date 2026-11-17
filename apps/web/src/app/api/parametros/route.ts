/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:29:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T04, S02-T05
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { actualizarParametros, obtenerParametros } from "@/lib/db/sprint2";

/**
 * GET /api/parametros — Listar parámetros del sistema (RF-03)
 */
export async function GET() {
  const parametros = obtenerParametros();
  return Response.json(parametros, { status: 200 });
}

/**
 * PATCH /api/parametros — Modificar parámetros (solo administrador, genera entrada en bitácora)
 */
export async function PATCH(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "cambiar_catalogo_parametros",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { codigo: "SOLICITUD_INVALIDA", mensaje: "JSON inválido." },
      { status: 400 },
    );
  }

  const schema = z.record(z.string(), z.any());
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { codigo: "VALIDACION_FALLIDA", mensaje: "Estructura de parámetros inválida." },
      { status: 422 },
    );
  }

  const actualizados = actualizarParametros(
    parsed.data,
    auth.sesion.usuarioId,
    auth.sesion.nombre,
  );

  return Response.json(actualizados, { status: 200 });
}
