/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:12:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T05
 */

import { z } from "zod";
import {
  COOKIE_SESION_NOMBRE,
  iniciarSesionConCredenciales,
} from "@/lib/auth/session";

const loginSchema = z.object({
  correo: z
    .string()
    .trim()
    .email("Debe proporcionar un correo electrónico válido."),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria."),
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

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        codigo: "VALIDACION_FALLIDA",
        mensaje:
          parsed.error.issues[0]?.message ?? "Datos de inicio de sesión inválidos.",
      },
      { status: 422 },
    );
  }

  const resultado = iniciarSesionConCredenciales(
    parsed.data.correo,
    parsed.data.password,
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

  const cookieValue = `${COOKIE_SESION_NOMBRE}=${encodeURIComponent(
    resultado.sesion.token,
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=1800`;

  return Response.json(
    {
      token: resultado.sesion.token,
      requiere_mfa: resultado.requiereSegundoFactor,
      usuario: {
        id: resultado.sesion.usuarioId,
        nombre: resultado.sesion.nombre,
        correo: resultado.sesion.correo,
        rol: resultado.sesion.rol,
        mfa_verificado: resultado.sesion.mfaVerificado,
      },
    },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookieValue,
      },
    },
  );
}
