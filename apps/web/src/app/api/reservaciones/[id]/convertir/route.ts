/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T07
 */

import { NextRequest, NextResponse } from "next/server";
import { convertirReservacionEnContrato } from "@/lib/db/reservaciones";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resultado = convertirReservacionEnContrato(id, {
      id: "operador-1",
      nombre: "Operador de Mostrador",
      rol: "operador",
    });

    if (!resultado.ok) {
      return NextResponse.json({ ok: false, error: resultado.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      data: {
        reservacion: {
          ...resultado.reservacion,
          tarifa_dia: Number(resultado.reservacion.tarifa_dia),
          anticipo_requerido: Number(resultado.reservacion.anticipo_requerido),
          anticipo_pagado: Number(resultado.reservacion.anticipo_pagado),
          deposito_garantia: Number(resultado.reservacion.deposito_garantia),
        },
        contratoId: resultado.contratoId,
        contratoFolio: resultado.contratoFolio,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Error al convertir reservación a contrato." },
      { status: 500 }
    );
  }
}
