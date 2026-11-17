/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 12
 * @sprint_number 12
 * @task_id S12-T01
 * @description Route Handler para exportación a CSV de clientes, vehículos, contratos y documentos (RF-27)
 */

import { NextRequest, NextResponse } from "next/server";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  generarExportacionCsv,
  type EntidadExportable,
  type FiltrosExportacion,
} from "@/lib/exportaciones/csv";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ entidad: string }> }
) {
  const { entidad } = await context.params;

  // 1. Autorización: solo administrador y titular pueden exportar (RF-27)
  const auth = autorizarRequest(request, {
    rolesPermitidos: ["administrador", "titular"],
  });

  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  // 2. Validar entidad
  const entidadesPermitidas: EntidadExportable[] = [
    "clientes",
    "vehiculos",
    "contratos",
    "documentos",
  ];

  if (!entidadesPermitidas.includes(entidad as EntidadExportable)) {
    return NextResponse.json(
      {
        ok: false,
        codigo: "ENTIDAD_INVALIDA",
        error: `Entidad '${entidad}' no válida para exportación. Valores permitidos: ${entidadesPermitidas.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // 3. Extraer filtros
  const { searchParams } = new URL(request.url);
  const filtros: FiltrosExportacion = {
    desde: searchParams.get("desde") || undefined,
    hasta: searchParams.get("hasta") || undefined,
    estado: searchParams.get("estado") || undefined,
    termino: searchParams.get("termino") || undefined,
  };

  // 4. Generar CSV y registrar en bitácora
  const resultado = generarExportacionCsv(
    entidad as EntidadExportable,
    filtros,
    {
      id: auth.sesion.usuarioId,
      nombre: auth.sesion.nombre,
      rol: auth.sesion.rol,
    }
  );

  return new NextResponse(resultado.csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resultado.filename}"`,
      "X-Total-Filas": String(resultado.totalFilas),
    },
  });
}
