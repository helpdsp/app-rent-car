/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:12:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T03
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  actualizarVehiculo,
  obtenerVehiculoPorId,
  obtenerDocumentosDeVehiculo,
  obtenerBloqueosDeVehiculo,
  obtenerHistorialKm,
} from "@/lib/db/sprint4";

const actualizarVehiculoSchema = z.object({
  marca: z.string().trim().min(1).optional(),
  modelo: z.string().trim().min(1).optional(),
  tipo: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
  placas: z.string().trim().min(1).optional(),
  kilometraje_actual: z.number().int().min(0).optional(),
  valor_asegurado: z.number().int().positive().optional(),
  tarifa_dia: z.number().int().positive().optional(),
  seguro_nocturno: z.number().int().optional(),
  estado: z.enum(["disponible", "rentado", "mantenimiento", "baja"]).optional(),
  categoria_tarifa_id: z.string().uuid().nullable().optional(),
  observaciones: z.string().trim().nullable().optional(),
  motivo_correccion_km: z.string().trim().optional(),
});

/**
 * GET /api/vehiculos/[id] — Obtener ficha completa del vehículo (RF-07)
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
  const vehiculo = obtenerVehiculoPorId(id);

  if (!vehiculo) {
    return Response.json(
      { codigo: "VEHICULO_NO_ENCONTRADO", error: "Vehículo no encontrado" },
      { status: 404 }
    );
  }

  const documentos = obtenerDocumentosDeVehiculo(id);
  const bloqueos = obtenerBloqueosDeVehiculo(id);
  const historialKm = obtenerHistorialKm(id);

  return Response.json({
    data: {
      ...vehiculo,
      valor_asegurado: Number(vehiculo.valor_asegurado),
      tarifa_dia: Number(vehiculo.tarifa_dia),
      seguro_nocturno: Number(vehiculo.seguro_nocturno),
      documentos,
      bloqueos,
      historial_km: historialKm,
    },
  });
}

/**
 * PATCH /api/vehiculos/[id] — Editar datos o corregir kilometraje con auditoría (RF-07, T-15)
 */
export async function PATCH(
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { codigo: "CUERPO_INVALIDO", error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const parseado = actualizarVehiculoSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      { codigo: "VALIDACION", error: parseado.error.issues.map((e) => e.message).join(" ") },
      { status: 422 }
    );
  }

  const resultado = actualizarVehiculo(id, parseado.data, {
    id: auth.sesion.usuarioId,
    nombre: auth.sesion.correo,
    rol: auth.sesion.rol,
  });

  if (!resultado.ok) {
    const status =
      resultado.codigo === "VEHICULO_NO_ENCONTRADO"
        ? 404
        : resultado.codigo === "KILOMETRAJE_INVALIDO"
        ? 403
        : 422;
    return Response.json({ codigo: resultado.codigo, error: resultado.error }, { status });
  }

  return Response.json({
    data: {
      ...resultado.vehiculo,
      valor_asegurado: Number(resultado.vehiculo.valor_asegurado),
      tarifa_dia: Number(resultado.vehiculo.tarifa_dia),
      seguro_nocturno: Number(resultado.vehiculo.seguro_nocturno),
    },
  });
}
