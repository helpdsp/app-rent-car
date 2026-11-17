/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:13:00Z
 * @agent_roles engineering-backend-architect + engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T10
 */

import { z } from "zod";
import {
  autorizarRequest,
  respuestaErrorAutorizacion,
} from "@/lib/auth/guards";
import {
  crearUsuarioSistema,
  listarUsuariosPublicos,
} from "@/lib/auth/session";
import { ROL_USUARIO_VALUES } from "@/lib/db/schema";

const crearUsuarioSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre completo del usuario es obligatorio."),
  correo: z
    .string()
    .trim()
    .email("El correo electrónico no tiene un formato válido."),
  rol: z.enum(ROL_USUARIO_VALUES, {
    message: "El rol debe ser operador, administrador o titular.",
  }),
  password: z.string().min(8).optional(),
});

/**
 * GET /api/usuarios — Listar usuarios (solo administrador, según api-spec.yaml).
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "gestionar_usuarios",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const usuarios = listarUsuariosPublicos();
  return Response.json({ datos: usuarios, total: usuarios.length }, { status: 200 });
}

/**
 * POST /api/usuarios — Crear usuario con rol (solo administrador, RF-01).
 */
export async function POST(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "gestionar_usuarios",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

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

  const parsed = crearUsuarioSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        codigo: "VALIDACION_FALLIDA",
        mensaje:
          parsed.error.issues[0]?.message ?? "Datos de usuario inválidos.",
      },
      { status: 422 },
    );
  }

  const creado = crearUsuarioSistema({
    nombre: parsed.data.nombre,
    correo: parsed.data.correo,
    rol: parsed.data.rol,
    password: parsed.data.password,
    creadoPorId: auth.sesion.usuarioId,
  });

  if (!creado.ok) {
    return Response.json(
      {
        codigo: creado.codigo,
        mensaje: creado.mensaje,
      },
      { status: creado.status },
    );
  }

  return Response.json(
    {
      usuario: creado.usuario,
      codigos_respaldo: creado.codigosRespaldo,
    },
    { status: 201 },
  );
}
