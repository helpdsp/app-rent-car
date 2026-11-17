/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:35:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T07
 */

import { NextRequest, NextResponse } from "next/server";
import {
  enviarContratoPorCorreo,
  obtenerHistorialEnviosCorreo,
} from "@/lib/mail/contrato";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const historial = obtenerHistorialEnviosCorreo(id);

  return NextResponse.json({
    ok: true,
    contrato_id: id,
    historial,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const { correoDestino, forzarFalloSimulado = false } = body;

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
    };

    const resultado = await enviarContratoPorCorreo(
      {
        contratoId: id,
        correoDestino,
        forzarFalloSimulado,
      },
      autor
    );

    const status = resultado.exito ? 200 : 502;
    return NextResponse.json(resultado, { status });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
