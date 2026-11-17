/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:55:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T03
 */

import { NextRequest, NextResponse } from "next/server";
import { aplicarODevolverDepositoYConcluir } from "@/lib/pagos/liquidar-deposito";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const {
      saldoCentavos = 0,
      formaPagoSaldo = "efectivo",
      tarjeta_ultimos_4,
      tarjeta_tipo,
      tarjeta_numero,
    } = body;

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
      rol: "operador",
    };

    const resultado = aplicarODevolverDepositoYConcluir(
      id,
      {
        saldoCentavos: Number(saldoCentavos),
        formaPagoSaldo,
        tarjeta_ultimos_4,
        tarjeta_tipo,
        tarjeta_numero,
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
