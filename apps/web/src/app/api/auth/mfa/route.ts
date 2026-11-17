/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:12:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T06
 */

import { z } from "zod";
import {
  completarVerificacionMfa,
  extraerTokenDeRequest,
} from "@/lib/auth/session";

const mfaSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(6, "Ingrese el código de 6 dígitos o un código de respaldo."),
  token: z.string().optional(),
});

export async function POST(request: Request) {
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

  const parsed = mfaSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        codigo: "VALIDACION_FALLIDA",
        mensaje:
          parsed.error.issues[0]?.message ?? "Código de verificación inválido.",
      },
      { status: 422 },
    );
  }

  const token = parsed.data.token ?? extraerTokenDeRequest(request);
  if (!token) {
    return Response.json(
      {
        codigo: "NO_AUTENTICADO",
        mensaje: "No se encontró una sesión pendiente de verificación MFA.",
      },
      { status: 401 },
    );
  }

  const resultado = completarVerificacionMfa(token, parsed.data.codigo);
  if (!resultado.ok) {
    return Response.json(
      {
        codigo: resultado.codigo,
        mensaje: resultado.mensaje,
      },
      { status: resultado.status },
    );
  }

  return Response.json(
    {
      verificado: true,
      usuario: {
        id: resultado.sesion.usuarioId,
        nombre: resultado.sesion.nombre,
        correo: resultado.sesion.correo,
        rol: resultado.sesion.rol,
        mfa_verificado: resultado.sesion.mfaVerificado,
      },
    },
    { status: 200 },
  );
}
