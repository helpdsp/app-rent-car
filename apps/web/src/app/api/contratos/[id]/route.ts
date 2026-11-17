/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:28:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T05
 */

import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  obtenerContratoPorId,
  type ContratoCompletoRow,
} from "@/lib/contratos/emitir";

function serializarContrato(c: ContratoCompletoRow) {
  return {
    ...c,
    tarifa_dia: Number(c.tarifa_dia),
    tarifa_hora_extra: Number(c.tarifa_hora_extra),
    tarifa_km_extra: Number(c.tarifa_km_extra),
    seguro_nocturno: Number(c.seguro_nocturno),
    tarifa_km_sobrescrita: c.tarifa_km_sobrescrita ? Number(c.tarifa_km_sobrescrita) : null,
    tarifa_catalogo_dia: Number(c.tarifa_catalogo_dia),
    anticipo: Number(c.anticipo),
    valor_auto_asegurado: c.valor_auto_asegurado ? Number(c.valor_auto_asegurado) : null,
    cargos: c.cargos.map((cargo) => ({
      ...cargo,
      monto: Number(cargo.monto),
    })),
  };
}

/**
 * GET /api/contratos/[id] — Obtener detalle completo de un contrato (RF-13)
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await context.params;
  const contrato = obtenerContratoPorId(id);

  if (!contrato) {
    return Response.json(
      { codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado" },
      { status: 404 }
    );
  }

  return Response.json({ data: serializarContrato(contrato) });
}
