/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T05
 */

import { NextRequest, NextResponse } from "next/server";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";
import {
  obtenerEvidenciasContrato,
  ANGULOS_OBLIGATORIOS,
  type EvidenciaRow,
} from "@/lib/storage/evidencias";
import { obtenerInventarioContrato } from "@/lib/contratos/entregar";

export interface ComparacionAnguloItem {
  angulo: string;
  etiqueta: string;
  entrega: EvidenciaRow | null;
  recepcion: EvidenciaRow | null;
  danos_entrega: Array<{ id: number; vista: string; nota: string }>;
  danos_recepcion: Array<{ id: number; vista: string; nota: string }>;
  danos_nuevos: Array<{ id: number; vista: string; nota: string }>;
}

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

  const evidenciasEntrega = obtenerEvidenciasContrato(id, "entrega");
  const evidenciasRecepcion = obtenerEvidenciasContrato(id, "recepcion");

  const invEntrega = obtenerInventarioContrato(id, "entrega");
  const invRecepcion = obtenerInventarioContrato(id, "recepcion");

  const nombresAmigables: Record<string, string> = {
    frente: "Frente",
    atras: "Atrás",
    izquierda: "Izquierda",
    derecha: "Derecha",
    tablero_km: "Tablero y km",
    interior: "Interior",
  };

  // T-78: Un par por ángulo; el lado faltante viene nulo
  const comparaciones: ComparacionAnguloItem[] = ANGULOS_OBLIGATORIOS.map((angulo) => {
    // Tomar la última evidencia registrada para cada ángulo
    const fotosEnt = evidenciasEntrega.filter((e) => e.angulo === angulo && e.tipo === "foto");
    const fotosRec = evidenciasRecepcion.filter((e) => e.angulo === angulo && e.tipo === "foto");

    const entrega = fotosEnt.length > 0 ? fotosEnt[fotosEnt.length - 1]! : null;
    const recepcion = fotosRec.length > 0 ? fotosRec[fotosRec.length - 1]! : null;

    // Daños mapeados por ángulo/vista
    const danosEnt = (invEntrega?.danos || []).filter((d) => d.vista === angulo);
    const danosRec = (invRecepcion?.danos || []).filter((d) => d.vista === angulo);

    // Daños nuevos que no estaban en la entrega
    const notasEntregaSet = new Set(danosEnt.map((d) => d.nota.toLowerCase()));
    const danosNuevos = danosRec.filter((d) => !notasEntregaSet.has(d.nota.toLowerCase()));

    return {
      angulo,
      etiqueta: nombresAmigables[angulo] ?? angulo,
      entrega,
      recepcion,
      danos_entrega: danosEnt,
      danos_recepcion: danosRec,
      danos_nuevos: danosNuevos,
    };
  });

  return NextResponse.json({
    ok: true,
    contrato_id: id,
    comparaciones,
  });
}
