/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T05
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { calcularCotizacion } from "@/lib/contratos/emitir";

const cotizacionSchema = z.object({
  salida_en: z.string().datetime(),
  entrada_prevista_en: z.string().datetime(),
  tarifa_dia_centavos: z.number().int().positive(),
  tarifa_km_sobrescrita: z.number().int().nullable().optional(),
});

/**
 * POST /api/contratos/[id]/cotizacion — Recalcular cotización en tiempo real (RF-14, T-30)
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
    return Response.json(
      { codigo: "CUERPO_INVALIDO", error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const parseado = cotizacionSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      { codigo: "VALIDACION", error: parseado.error.issues.map((i) => i.message).join(" ") },
      { status: 422 }
    );
  }

  const cot = calcularCotizacion(parseado.data);

  return Response.json({
    data: {
      dias: cot.dias,
      tarifa_dia: Number(cot.tarifa_dia),
      tarifa_hora_extra: Number(cot.tarifa_hora_extra),
      tarifa_km_extra: Number(cot.tarifa_km_extra),
      anticipo: Number(cot.anticipo),
      km_incluidos: cot.km_incluidos,
    },
  });
}
