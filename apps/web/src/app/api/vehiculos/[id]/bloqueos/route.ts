/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:16:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T06
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { registrarBloqueoMantenimiento } from "@/lib/db/sprint4";

const bloqueoSchema = z.object({
  desde: z.string().datetime({ message: "La fecha 'desde' debe tener formato ISO 8601." }),
  hasta: z.string().datetime({ message: "La fecha 'hasta' debe tener formato ISO 8601." }),
  motivo: z.string().trim().min(3, "El motivo del bloqueo debe tener al menos 3 caracteres."),
});

/**
 * POST /api/vehiculos/[id]/bloqueos — Bloquear por mantenimiento (RF-09, T-22)
 * Solo administradores o titulares. Rechazado con 409 si cruza con una renta activa.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(request, {
    rolesPermitidos: ["administrador", "titular"],
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
      { codigo: "CUERPO_INVALIDO", error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const parseado = bloqueoSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      { codigo: "VALIDACION", error: parseado.error.issues.map((e) => e.message).join(" ") },
      { status: 422 }
    );
  }

  const resultado = registrarBloqueoMantenimiento(id, parseado.data, {
    id: auth.sesion.usuarioId,
    nombre: auth.sesion.correo,
    rol: auth.sesion.rol,
  });

  if (!resultado.ok) {
    const status =
      resultado.codigo === "VEHICULO_NO_ENCONTRADO"
        ? 404
        : resultado.codigo === "CRUCE_CONTRATO_EXISTENTE"
        ? 409
        : 422;
    return Response.json(
      {
        codigo: resultado.codigo,
        error: resultado.error,
        contrato_folio: resultado.contrato_folio,
      },
      { status }
    );
  }

  return Response.json({ data: resultado.bloqueo }, { status: 201 });
}
