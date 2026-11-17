/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:13:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T10
 */

import { z } from "zod";
import {
  autorizarRequest,
  respuestaErrorAutorizacion,
} from "@/lib/auth/guards";
import { actualizarUsuarioSistema } from "@/lib/auth/session";
import { ROL_USUARIO_VALUES } from "@/lib/db/schema";

const actualizarUsuarioSchema = z
  .object({
    rol: z.enum(ROL_USUARIO_VALUES).optional(),
    activo: z.boolean().optional(),
    nombre: z.string().trim().min(2).optional(),
  })
  .refine(
    (d) =>
      d.rol !== undefined || d.activo !== undefined || d.nombre !== undefined,
    {
      message: "Debe indicar al menos un campo a actualizar (rol, activo o nombre).",
    },
  );

/**
 * PATCH /api/usuarios/[id] — Cambiar rol o desactivar/reactivar usuario (solo administrador, RF-01).
 * Un usuario desactivado conserva su registro y autoría en la bitácora (T-05).
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = autorizarRequest(request, {
    accion: "gestionar_usuarios",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        codigo: "SOLICITUD_INVALIDA",
        mensaje: "El cuerpo de la solicitud debe ser JSON válido.",
      },
      { status: 400 },
    );
  }

  const parsed = actualizarUsuarioSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        codigo: "VALIDACION_FALLIDA",
        mensaje:
          parsed.error.issues[0]?.message ?? "Datos de actualización inválidos.",
      },
      { status: 422 },
    );
  }

  const resultado = actualizarUsuarioSistema(
    id,
    parsed.data,
    auth.sesion.usuarioId,
  );

  if (!resultado.ok) {
    return Response.json(
      {
        codigo: resultado.codigo,
        mensaje: resultado.mensaje,
      },
      { status: resultado.status },
    );
  }

  return Response.json({ usuario: resultado.usuario }, { status: 200 });
}
