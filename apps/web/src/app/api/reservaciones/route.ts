/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T04
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  obtenerReservaciones,
  crearReservacion,
  type NuevaReservacionInput,
} from "@/lib/db/reservaciones";

const CrearReservacionSchema = z.object({
  cliente_id: z.string().min(1, "El cliente es requerido"),
  vehiculo_id: z.string().min(1, "El vehículo es requerido"),
  fecha_inicio: z.string().min(1, "Fecha de inicio requerida"),
  fecha_fin: z.string().min(1, "Fecha de devolución requerida"),
  lugar_entrega: z.string().optional(),
  lugar_devolucion: z.string().optional(),
  anticipo_pagado: z.number().optional(),
  observaciones: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado") || undefined;
  const q = searchParams.get("q") || undefined;

  const reservaciones = obtenerReservaciones({ estado, q });

  // Serializar BigInt a string / number para JSON
  const data = reservaciones.map((r) => ({
    ...r,
    tarifa_dia: Number(r.tarifa_dia),
    anticipo_requerido: Number(r.anticipo_requerido),
    anticipo_pagado: Number(r.anticipo_pagado),
    deposito_garantia: Number(r.deposito_garantia),
  }));

  return NextResponse.json({ ok: true, data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CrearReservacionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0].message, codigo: "DATOS_INVALIDOS" },
        { status: 400 }
      );
    }

    const input: NuevaReservacionInput = {
      cliente_id: parsed.data.cliente_id,
      vehiculo_id: parsed.data.vehiculo_id,
      fecha_inicio: parsed.data.fecha_inicio,
      fecha_fin: parsed.data.fecha_fin,
      lugar_entrega: parsed.data.lugar_entrega,
      lugar_devolucion: parsed.data.lugar_devolucion,
      anticipo_pagado: parsed.data.anticipo_pagado ? BigInt(parsed.data.anticipo_pagado) : undefined,
      observaciones: parsed.data.observaciones,
    };

    const resultado = crearReservacion(input, {
      id: "operador-1",
      nombre: "Operador de Mostrador",
      rol: "operador",
    });

    if (!resultado.ok) {
      return NextResponse.json(
        { ok: false, error: resultado.error, codigo: resultado.codigo },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: {
          ...resultado.reservacion,
          tarifa_dia: Number(resultado.reservacion.tarifa_dia),
          anticipo_requerido: Number(resultado.reservacion.anticipo_requerido),
          anticipo_pagado: Number(resultado.reservacion.anticipo_pagado),
          deposito_garantia: Number(resultado.reservacion.deposito_garantia),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Error interno al crear reservación.", codigo: "ERROR_INTERNO" },
      { status: 500 }
    );
  }
}
