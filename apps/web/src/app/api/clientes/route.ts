/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:37:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T02, S03-T07
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { crearCliente, obtenerClientes } from "@/lib/db/sprint3";

// Validación estricta de RFC (Persona Física o Moral) con CHECK equivalente a DB (T-11)
const rfcRegex = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;

const clienteNuevoSchema = z
  .object({
    nombre_completo: z
      .string()
      .trim()
      .min(3, "El nombre completo debe tener al menos 3 caracteres."),
    identificacion_numero: z
      .string()
      .trim()
      .min(1, "El número de identificación oficial es obligatorio."),
    domicilio: z.string().trim().optional(),
    ciudad: z.string().trim().optional(),
    estado: z.string().trim().optional(),
    telefono: z.string().trim().optional(),
    celular: z.string().trim().optional(),
    correo: z.string().trim().email("Correo electrónico inválido.").optional().or(z.literal("")),
    requiere_factura: z.boolean().optional(),
    razon_social: z.string().trim().optional(),
    rfc: z
      .string()
      .trim()
      .toUpperCase()
      .regex(rfcRegex, "El RFC no tiene un formato válido (ej. PEGJ800101XYZ o GAS900101XYZ).")
      .optional()
      .or(z.literal("")),
    aviso_privacidad_aceptado: z.boolean().optional(),
  })
  .refine((data) => Boolean(data.telefono || data.celular), {
    message: "Debe proporcionar al menos un teléfono de contacto o celular.",
    path: ["telefono"],
  });

/**
 * GET /api/clientes — Buscar clientes por nombre, número, identificación, teléfono o RFC (RF-06)
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  const clientes = obtenerClientes(q);

  return Response.json({ datos: clientes, total: clientes.length }, { status: 200 });
}

/**
 * POST /api/clientes — Crear cliente con validación Zod y detección de duplicados 409 (RF-04)
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
    return Response.json(
      { codigo: "SOLICITUD_INVALIDA", mensaje: "El cuerpo debe ser JSON válido." },
      { status: 400 },
    );
  }

  const parsed = clienteNuevoSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        codigo: "VALIDACION_FALLIDA",
        mensaje: parsed.error.issues[0]?.message ?? "Datos del cliente inválidos.",
        detalle: parsed.error.format(),
      },
      { status: 422 },
    );
  }

  const resultado = crearCliente(
    parsed.data,
    auth.sesion.usuarioId,
    auth.sesion.nombre,
  );

  if (!resultado.ok) {
    return Response.json(
      { codigo: resultado.codigo, mensaje: resultado.mensaje },
      { status: resultado.status },
    );
  }

  return Response.json(resultado.cliente, { status: 201 });
}
