/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:20:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T04
 */

import { NextRequest } from "next/server";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  guardarVersionPDF,
  obtenerUltimoPDFContrato,
} from "@/lib/pdf/guardar";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";

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

  const pdf = obtenerUltimoPDFContrato(id);
  if (!pdf) {
    return Response.json(
      { error: "PDF aún no generado", codigo: "PDF_PENDIENTE" },
      { status: 404 }
    );
  }

  return Response.json({
    data: {
      version: pdf.version,
      nombre_archivo: pdf.nombre_archivo,
      sha256: pdf.sha256,
      firmado: pdf.firmado,
      firmado_en: pdf.firmado_en,
      created_at: pdf.created_at,
    },
  });
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

  const autor = { id: auth.sesion.usuarioId, nombre: auth.sesion.correo };

  // Generar contenido del PDF estructurado
  const contenido = JSON.stringify({
    folio: contrato.folio ?? "D-00001",
    cliente: contrato.cliente_nombre,
    vehiculo: contrato.vehiculo_descripcion,
    salida: contrato.salida_en,
    entrada: contrato.entrada_prevista_en,
    anticipo: Number(contrato.anticipo),
    cargos: contrato.cargos.map((c) => ({ concepto: c.concepto, monto: Number(c.monto) })),
  });

  const pdf = guardarVersionPDF(id, contenido, autor);

  return Response.json(
    {
      data: {
        id: pdf.id,
        version: pdf.version,
        nombre_archivo: pdf.nombre_archivo,
        sha256: pdf.sha256,
      },
    },
    { status: 201 }
  );
}
