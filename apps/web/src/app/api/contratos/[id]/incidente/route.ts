/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:45:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T02
 */

import { NextRequest, NextResponse } from "next/server";
import {
  registrarIncidente,
  obtenerIncidentesContrato,
  type TipoIncidente,
} from "@/lib/contratos/incidentes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const incidentes = obtenerIncidentesContrato(id);

  return NextResponse.json({
    ok: true,
    contrato_id: id,
    incidentes,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      tipo,
      ocurrido_en,
      avisado_en,
      descripcion,
      avaluo,
      cargo_cliente,
      aseguradora_referencia,
      unidad_sustituta_id,
      bonificacion,
      cerrado_en,
    } = body;

    if (!tipo || !ocurrido_en || !descripcion) {
      return NextResponse.json(
        { ok: false, error: "Tipo de incidente, fecha de ocurrencia y descripción son obligatorios." },
        { status: 400 }
      );
    }

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
      rol: "operador",
    };

    const resultado = registrarIncidente(
      id,
      {
        tipo: tipo as TipoIncidente,
        ocurrido_en,
        avisado_en,
        descripcion,
        avaluo: avaluo !== undefined ? Number(avaluo) : 0,
        cargo_cliente: cargo_cliente !== undefined ? Number(cargo_cliente) : 0,
        aseguradora_referencia,
        unidad_sustituta_id,
        bonificacion: bonificacion !== undefined ? Number(bonificacion) : 0,
        cerrado_en,
      },
      autor
    );

    if (!resultado.ok) {
      return NextResponse.json(resultado, { status: resultado.status });
    }

    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
