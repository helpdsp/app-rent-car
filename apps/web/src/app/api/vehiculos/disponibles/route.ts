/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:18:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T07
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  calcularDisponibilidad,
  obtenerDocumentosDeVehiculo,
  type VehiculoRow,
} from "@/lib/db/sprint4";

const querySchema = z
  .object({
    salida: z.string().datetime({ message: "La fecha de salida debe tener formato ISO 8601." }),
    entrada: z.string().datetime({ message: "La fecha de entrada debe tener formato ISO 8601." }),
  })
  .refine(
    (data) => new Date(data.entrada).getTime() > new Date(data.salida).getTime(),
    {
      message: "La fecha de entrada prevista debe ser posterior a la fecha de salida.",
      path: ["entrada"],
    }
  );

function formatearVehiculoResponse(v: VehiculoRow) {
  const docs = obtenerDocumentosDeVehiculo(v.id);
  const tarjeta = docs.find((d) => d.tipo === "tarjeta_circulacion");
  const poliza = docs.find((d) => d.tipo === "poliza");

  return {
    ...v,
    valor_asegurado: Number(v.valor_asegurado),
    tarifa_dia: Number(v.tarifa_dia),
    seguro_nocturno: Number(v.seguro_nocturno),
    tarjeta_circulacion: tarjeta
      ? {
          numero: tarjeta.numero,
          fecha_vencimiento: tarjeta.fecha_vencimiento,
          vigente: tarjeta.vigente,
        }
      : null,
    poliza: poliza
      ? {
          numero: poliza.numero,
          aseguradora: poliza.aseguradora,
          fecha_vencimiento: poliza.fecha_vencimiento,
          vigente: poliza.vigente,
        }
      : null,
  };
}

/**
 * GET /api/vehiculos/disponibles — Lista vehículos disponibles y no disponibles con motivo de exclusión (RF-09)
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const url = new URL(request.url);
  const salida = url.searchParams.get("salida");
  const entrada = url.searchParams.get("entrada");

  const parseado = querySchema.safeParse({ salida, entrada });
  if (!parseado.success) {
    return Response.json(
      {
        codigo: "PARAMETROS_INVALIDOS",
        error: parseado.error.issues.map((e) => e.message).join(" "),
      },
      { status: 422 }
    );
  }

  try {
    const { disponibles, no_disponibles } = calcularDisponibilidad(
      parseado.data.salida,
      parseado.data.entrada
    );

    return Response.json({
      data: {
        disponibles: disponibles.map(formatearVehiculoResponse),
        no_disponibles: no_disponibles.map((item) => ({
          vehiculo: formatearVehiculoResponse(item.vehiculo),
          motivo: item.motivo,
          detalle: item.detalle,
        })),
      },
    });
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : "Error al calcular disponibilidad";
    return Response.json(
      { codigo: "ERROR_DISPONIBILIDAD", error: mensaje },
      { status: 400 }
    );
  }
}
