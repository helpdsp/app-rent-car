/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:25:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T05
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  agregarConductorAContrato,
  obtenerConductoresPorContrato,
} from "@/lib/contratos/conductores";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";

const ConductorSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  domicilio: z.string().optional().nullable(),
  ciudad_estado: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  licencia_numero: z.string().min(5, "Número de licencia inválido"),
  licencia_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato fecha YYYY-MM-DD"),
  licencia_foto_path: z.string().optional().nullable(),
  es_arrendatario: z.boolean().optional().default(false),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(req, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await params;
  const contrato = obtenerContratoPorId(id);
  if (!contrato) {
    return Response.json(
      { error: "Contrato no encontrado", codigo: "CONTRATO_NO_ENCONTRADO" },
      { status: 404 }
    );
  }

  const conductores = obtenerConductoresPorContrato(id);
  return Response.json({ data: conductores });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(req, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await params;
  const contrato = obtenerContratoPorId(id);
  if (!contrato) {
    return Response.json(
      { error: "Contrato no encontrado", codigo: "CONTRATO_NO_ENCONTRADO" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parseado = ConductorSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      {
        error: parseado.error.issues.map((i) => i.message).join(" "),
        codigo: "DATOS_INVALIDOS",
      },
      { status: 422 }
    );
  }

  const autor = { id: auth.sesion.usuarioId, nombre: auth.sesion.correo };
  const res = agregarConductorAContrato(id, parseado.data, autor);

  if (!res.ok) {
    return Response.json({ error: res.error, codigo: res.codigo }, { status: 422 });
  }

  return Response.json({ data: res.conductor }, { status: 201 });
}
