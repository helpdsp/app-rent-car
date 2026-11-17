/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:50:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T01
 */

import { NextRequest, NextResponse } from "next/server";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";
import { obtenerVehiculoPorId } from "@/lib/db/sprint4";
import { registrarRecepcionVehiculo } from "@/lib/contratos/recibir";
import { obtenerInventarioContrato } from "@/lib/contratos/entregar";
import { obtenerEvidenciasContrato, validarEvidenciasCompletas } from "@/lib/storage/evidencias";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contrato = obtenerContratoPorId(id);
  if (!contrato) {
    return NextResponse.json(
      { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado." },
      { status: 404 }
    );
  }

  const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id);
  const inventarioEntrega = obtenerInventarioContrato(id, "entrega");
  const inventarioRecepcion = obtenerInventarioContrato(id, "recepcion");
  const evidenciasRecepcion = obtenerEvidenciasContrato(id, "recepcion");
  const validacionRecepcion = validarEvidenciasCompletas(id, "recepcion");

  return NextResponse.json({
    ok: true,
    contrato,
    vehiculo,
    inventario_entrega: inventarioEntrega,
    inventario_recepcion: inventarioRecepcion,
    evidencias_recepcion: evidenciasRecepcion,
    validacion_recepcion: validacionRecepcion,
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
      km_entrada,
      gasolina_entrada = 8,
      entrada_real_en,
      inventario,
      autorizacionAdminNota,
    } = body;

    if (km_entrada === undefined || km_entrada === null || isNaN(km_entrada)) {
      return NextResponse.json(
        { ok: false, codigo: "KILOMETRAJE_REQUERIDO", error: "El kilometraje de entrada es obligatorio." },
        { status: 400 }
      );
    }

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
      rol: "operador",
    };

    const resultado = registrarRecepcionVehiculo(
      id,
      {
        km_entrada: Number(km_entrada),
        gasolina_entrada: Number(gasolina_entrada),
        entrada_real_en,
        inventario,
        autorizacionAdminNota,
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
