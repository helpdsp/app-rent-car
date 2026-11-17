/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:10:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T03
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  crearVehiculo,
  obtenerVehiculos,
  obtenerDocumentosDeVehiculo,
} from "@/lib/db/sprint4";

const vehiculoNuevoSchema = z.object({
  marca: z.string().trim().min(1, "La marca es obligatoria."),
  modelo: z.string().trim().min(1, "El modelo es obligatorio."),
  tipo: z.string().trim().min(1, "El tipo de vehículo es obligatorio (ej. Sedán, SUV)."),
  color: z.string().trim().min(1, "El color es obligatorio."),
  placas: z.string().trim().min(1, "Las placas son obligatorias."),
  kilometraje_actual: z
    .number()
    .int("El kilometraje debe ser un número entero.")
    .min(0, "El kilometraje no puede ser negativo."),
  valor_asegurado: z
    .number()
    .int("El valor asegurado debe ser un número entero en centavos.")
    .positive("El valor asegurado debe ser mayor a 0."),
  tarifa_dia: z
    .number()
    .int("La tarifa diaria debe ser un número entero en centavos.")
    .positive()
    .optional(),
  seguro_nocturno: z
    .number()
    .int("El seguro nocturno debe ser en centavos.")
    .optional(),
  estado: z.enum(["disponible", "rentado", "mantenimiento", "baja"]).optional(),
  categoria_tarifa_id: z.string().uuid().nullable().optional(),
  observaciones: z.string().trim().nullable().optional(),
});

function serializarVehiculo(v: ReturnType<typeof obtenerVehiculos>[number]) {
  const docs = obtenerDocumentosDeVehiculo(v.id);
  const tarjeta = docs.find((d) => d.tipo === "tarjeta_circulacion");
  const poliza = docs.find((d) => d.tipo === "poliza");

  return {
    ...v,
    valor_asegurado: Number(v.valor_asegurado),
    tarifa_dia: Number(v.tarifa_dia),
    seguro_nocturno: Number(v.seguro_nocturno),
    tarjeta_circulacion: tarjeta ? {
      numero: tarjeta.numero,
      fecha_vencimiento: tarjeta.fecha_vencimiento,
      vigente: tarjeta.vigente,
    } : null,
    poliza: poliza ? {
      numero: poliza.numero,
      aseguradora: poliza.aseguradora,
      fecha_vencimiento: poliza.fecha_vencimiento,
      vigente: poliza.vigente,
    } : null,
  };
}

/**
 * GET /api/vehiculos — Listar vehículos con filtros de estado o término de búsqueda (RF-07)
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const url = new URL(request.url);
  const estado = url.searchParams.get("estado") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const lista = obtenerVehiculos({ estado, q });
  const serializados = lista.map(serializarVehiculo);

  return Response.json({
    data: serializados,
    total: serializados.length,
  });
}

/**
 * POST /api/vehiculos — Crear un nuevo vehículo con clave automática y placas únicas (RF-07)
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
      { codigo: "CUERPO_INVALIDO", error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const parseado = vehiculoNuevoSchema.safeParse(body);
  if (!parseado.success) {
    const errorMsg = parseado.error.issues.map((e) => e.message).join(" ");
    return Response.json(
      { codigo: "VALIDACION", error: errorMsg, detalles: parseado.error.format() },
      { status: 422 }
    );
  }

  const resultado = crearVehiculo(parseado.data, {
    id: auth.sesion.usuarioId,
    nombre: auth.sesion.correo,
    rol: auth.sesion.rol,
  });

  if (!resultado.ok) {
    return Response.json(
      { codigo: resultado.codigo, error: resultado.error },
      { status: resultado.codigo === "PLACAS_DUPLICADAS" ? 409 : 422 }
    );
  }

  return Response.json(
    { data: serializarVehiculo(resultado.vehiculo) },
    { status: 201 }
  );
}
