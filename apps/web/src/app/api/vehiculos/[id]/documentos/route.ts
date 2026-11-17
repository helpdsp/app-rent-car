/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:14:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T05
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  obtenerVehiculoPorId,
  registrarDocumentoVehiculo,
} from "@/lib/db/sprint4";

const documentoVehiculoSchema = z.object({
  tipo: z.enum(["tarjeta_circulacion", "poliza"]),
  numero: z.string().trim().optional(),
  expedido_en: z.string().trim().optional(),
  fecha_expedicion: z.string().trim().optional(),
  fecha_vencimiento: z.string().trim().optional(),
  aseguradora: z.string().trim().optional(),
  agente: z.string().trim().optional(),
  agente_contacto: z.string().trim().optional(),
  archivos: z
    .array(
      z.object({
        tipo: z.string(),
        path: z.string(),
      })
    )
    .optional(),
  observaciones: z.string().trim().optional(),
});

/**
 * POST /api/vehiculos/[id]/documentos — Registrar tarjeta de circulación o póliza (RF-08)
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
  const vehiculo = obtenerVehiculoPorId(id);
  if (!vehiculo) {
    return Response.json(
      { codigo: "VEHICULO_NO_ENCONTRADO", error: "Vehículo no encontrado" },
      { status: 404 }
    );
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

  const parseado = documentoVehiculoSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      { codigo: "VALIDACION", error: parseado.error.issues.map((e) => e.message).join(" ") },
      { status: 422 }
    );
  }

  const doc = registrarDocumentoVehiculo(id, parseado.data, {
    id: auth.sesion.usuarioId,
    nombre: auth.sesion.correo,
    rol: auth.sesion.rol,
  });

  return Response.json({ data: doc }, { status: 201 });
}
