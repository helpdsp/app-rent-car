/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:25:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T03
 */

import { NextRequest, NextResponse } from "next/server";
import {
  registrarEvidencia,
  obtenerEvidenciasContrato,
  validarEvidenciasCompletas,
  rechazarModificacionEvidencia,
  type AnguloEvidencia,
  type MomentoEvidencia,
} from "@/lib/storage/evidencias";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const momento = (searchParams.get("momento") as MomentoEvidencia) || "entrega";

  const evidencias = obtenerEvidenciasContrato(id, momento);
  const validacion = validarEvidenciasCompletas(id, momento);

  return NextResponse.json({
    ok: true,
    contrato_id: id,
    momento,
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
      momento = "entrega",
      tipo = "foto",
      angulo,
      path,
      tamano_bytes = 1024 * 500,
      sha256,
      dispositivo = "Tableta Mostrador 1",
      nota,
      km_capturado,
      contenido,
    } = body;

    if (!angulo || !path) {
      return NextResponse.json(
        { ok: false, codigo: "CAMPOS_REQUERIDOS", error: "Ángulo y ruta de archivo son obligatorios." },
        { status: 400 }
      );
    }

    const autor = {
      id: "11111111-1111-4111-8111-111111111101",
      nombre: "Operador Mostrador",
    };

    const resultado = registrarEvidencia(
      id,
      {
        momento: momento as MomentoEvidencia,
        tipo: tipo as "foto" | "video",
        angulo: angulo as AnguloEvidencia,
        path,
        tamano_bytes,
        sha256,
        dispositivo,
        nota,
        km_capturado: km_capturado !== undefined ? Number(km_capturado) : null,
        contenido,
      },
      autor
    );

    if (!resultado.ok) {
      const status = resultado.codigo === "CONTRATO_NO_ENCONTRADO" ? 404 : 422;
      return NextResponse.json(resultado, { status });
    }

    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// T-76: Inmutabilidad de evidencias. Se rechaza cualquier UPDATE o DELETE.
export async function PUT() {
  const rechazo = rechazarModificacionEvidencia();
  return NextResponse.json(rechazo, { status: 405 });
}

export async function DELETE() {
  const rechazo = rechazarModificacionEvidencia();
  return NextResponse.json(rechazo, { status: 405 });
}
