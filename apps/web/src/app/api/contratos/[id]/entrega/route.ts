/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T06
 */

import { NextRequest, NextResponse } from "next/server";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";
import { obtenerVehiculoPorId } from "@/lib/db/sprint4";
import {
  completarEntregaVehiculo,
  obtenerInventarioContrato,
} from "@/lib/contratos/entregar";
import {
  obtenerEvidenciasContrato,
  validarEvidenciasCompletas,
} from "@/lib/storage/evidencias";
import { enviarContratoPorCorreo } from "@/lib/mail/contrato";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contrato = obtenerContratoPorId(id);
  if (!contrato) {
    return NextResponse.json(
      { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado" },
      { status: 404 }
    );
  }

  const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id);
  const inventario = obtenerInventarioContrato(id, "entrega");
  const evidencias = obtenerEvidenciasContrato(id, "entrega");
  const validacion = validarEvidenciasCompletas(id, "entrega");

  return NextResponse.json({
    ok: true,
    contrato,
    vehiculo,
    inventario,
    evidencias,
    validacion,
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
      km_salida,
      gasolina_salida = 8,
      inventario,
      autorizacionAdminNota,
      correoDestino,
    } = body;

    if (km_salida === undefined || km_salida === null || isNaN(km_salida)) {
      return NextResponse.json(
        {
          ok: false,
          codigo: "KILOMETRAJE_REQUERIDO",
          error: "El kilometraje de salida es obligatorio.",
        },
        { status: 400 }
      );
    }

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
      rol: "operador",
    };

    const resultado = completarEntregaVehiculo(
      id,
      {
        km_salida: Number(km_salida),
        gasolina_salida: Number(gasolina_salida),
        inventario,
        autorizacionAdminNota,
      },
      autor
    );

    if (!resultado.ok) {
      return NextResponse.json(resultado, { status: resultado.status });
    }

    // Tras la entrega exitosa, enviar contrato firmado y reglamento por correo (RF-20)
    let envioCorreo = null;
    try {
      envioCorreo = await enviarContratoPorCorreo(
        {
          contratoId: id,
          correoDestino,
        },
        autor
      );
    } catch (e) {
      console.warn("Fallo al enviar correo tras entrega:", (e as Error).message);
    }

    return NextResponse.json(
      {
        ok: true,
        contrato: resultado.contrato,
        inventario: resultado.inventario,
        outbox_event: resultado.outbox_event,
        envio_correo: envioCorreo,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
