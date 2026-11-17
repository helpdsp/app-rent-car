/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:32:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T03
 */

import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { emitirContratoTransaccional } from "@/lib/contratos/emitir";

/**
 * POST /api/contratos/[id]/emitir — Emisión transaccional con asignación de folio digital (RF-13, T-33)
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(request, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await context.params;

  const resultado = await emitirContratoTransaccional(id, {
    id: auth.sesion.usuarioId,
    nombre: auth.sesion.correo,
  });

  if (!resultado.ok) {
    const status =
      resultado.codigo === "CONTRATO_NO_ENCONTRADO"
        ? 404
        : resultado.codigo === "LICENCIA_VENCIDA" ||
          resultado.codigo === "FECHAS_INVALIDAS" ||
          resultado.codigo === "NOTA_KM_REQUERIDA" ||
          resultado.codigo === "MOTIVO_TARIFA_REQUERIDO" ||
          resultado.codigo === "TRANSICION_INVALIDA"
        ? 422
        : 400;

    return Response.json(
      { codigo: resultado.codigo, error: resultado.error },
      { status }
    );
  }

  const c = resultado.contrato;
  return Response.json({
    data: {
      ...c,
      tarifa_dia: Number(c.tarifa_dia),
      tarifa_hora_extra: Number(c.tarifa_hora_extra),
      tarifa_km_extra: Number(c.tarifa_km_extra),
      seguro_nocturno: Number(c.seguro_nocturno),
      tarifa_km_sobrescrita: c.tarifa_km_sobrescrita ? Number(c.tarifa_km_sobrescrita) : null,
      tarifa_catalogo_dia: Number(c.tarifa_catalogo_dia),
      anticipo: Number(c.anticipo),
      valor_auto_asegurado: c.valor_auto_asegurado ? Number(c.valor_auto_asegurado) : null,
      folio: resultado.folio,
      cargos: c.cargos.map((cargo) => ({
        ...cargo,
        monto: Number(cargo.monto),
      })),
    },
  });
}
