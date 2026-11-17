/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T06
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  registrarFirmaDigital,
  obtenerFirmasPorContrato,
  type TipoFirmante,
} from "@/lib/firma/registrar";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";

const FirmaSchema = z.object({
  firmante_tipo: z.enum(["arrendatario", "conductor_adicional", "pagare"]),
  firmante_nombre: z.string().min(3, "El nombre del firmante es obligatorio"),
  imagen_base64: z.string().min(10, "Imagen de firma en base64 obligatoria"),
  dispositivo: z.string().optional().default("Tableta Mostrador"),
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

  const firmas = obtenerFirmasPorContrato(id);
  return Response.json({ data: firmas });
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

  const parseado = FirmaSchema.safeParse(body);
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
  const userAgent = req.headers.get("user-agent") || parseado.data.dispositivo;
  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");

  const res = registrarFirmaDigital(
    id,
    {
      firmante_tipo: parseado.data.firmante_tipo as TipoFirmante,
      firmante_nombre: parseado.data.firmante_nombre,
      imagen_base64: parseado.data.imagen_base64,
      dispositivo: userAgent,
      ip: clientIp,
    },
    autor
  );

  if (!res.ok) {
    return Response.json({ error: res.error, codigo: res.codigo }, { status: 422 });
  }

  return Response.json({ data: res.firma }, { status: 201 });
}
