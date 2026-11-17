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
import { crearVersionTarifa, obtenerTarifas } from "@/lib/db/sprint2";

const tarifaNuevaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre de la categoría es obligatorio."),
  tarifa_dia: z
    .number()
    .int("La tarifa diaria debe estar en centavos enteros.")
    .positive("La tarifa diaria debe ser mayor a 0."),
  seguro_nocturno: z.number().int().nonnegative().optional(),
  cuota_proteccion: z.number().int().nonnegative().optional(),
});

/**
 * GET /api/tarifas — Listar tarifas vigentes
 */
export async function GET() {
  const tarifas = obtenerTarifas();
  return Response.json({ datos: tarifas, total: tarifas.length }, { status: 200 });
}

/**
 * POST /api/tarifas — Crear versión nueva de tarifa (solo administrador; operador recibe 403)
 */
export async function POST(request: Request) {
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
      {
        codigo: "SOLICITUD_INVALIDA",
        mensaje: "El cuerpo de la solicitud debe ser JSON válido.",
      },
      { status: 400 },
    );
  }

  const parsed = tarifaNuevaSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        codigo: "VALIDACION_FALLIDA",
        mensaje: parsed.error.issues[0]?.message ?? "Datos de tarifa inválidos.",
      },
      { status: 422 },
    );
  }

  const creada = crearVersionTarifa(
    parsed.data,
    auth.sesion.usuarioId,
    auth.sesion.nombre,
  );

  return Response.json(creada, { status: 201 });
}
