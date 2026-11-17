/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:55:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T05
 */

import { NextRequest, NextResponse } from "next/server";
import { cancelarContrato } from "@/lib/contratos/cancelar";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { motivo, nota, fechaSolicitud, formaReembolso } = body;

    if (!motivo || !nota) {
      return NextResponse.json(
        { ok: false, error: "El motivo y la nota explicativa de cancelación son obligatorios." },
        { status: 400 }
      );
    }

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
      rol: "operador",
    };

    const resultado = cancelarContrato(
      id,
      {
        motivo,
        nota,
        fechaSolicitud,
        formaReembolso,
      },
      autor
    );

    if (!resultado.ok) {
      return NextResponse.json(resultado, { status: resultado.status });
    }

    return NextResponse.json(resultado, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
