/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:45:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T07
 */

import { NextRequest, NextResponse } from "next/server";
import { registrarAuditoria } from "@/lib/db/sprint2";
import { obtenerContratos } from "@/lib/contratos/emitir";
import { obtenerVehiculoPorId } from "@/lib/db/sprint4";
import { calcularRetraso } from "@/lib/pricing";
import { insertarEventoOutbox } from "@/lib/db/outbox";

export interface ContratoRezagadoItem {
  id: string;
  folio: string;
  cliente: string;
  vehiculo: string;
  entrada_prevista: string;
  retraso_minutos: number;
  retraso_formateado: string;
  cargo_acumulado_centavos: number;
}

/**
 * Cron para detectar y marcar contratos rezagados cada 15 minutos (RF-22, T-67).
 * Actualiza el estado a 'rezagado', calcula el cargo acumulado en tiempo real
 * y alimenta el tablero del operador.
 */
export async function GET(request: NextRequest) {
  // Validación opcional de secreto de autorización para crons en producción
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "No autorizado para ejecutar tarea cron" },
      { status: 401 }
    );
  }

  const ahora = new Date();
  const todosLosContratos = obtenerContratos();
  const rezagadosProcesados: ContratoRezagadoItem[] = [];

  for (const contrato of todosLosContratos) {
    // Solo aplican contratos que están activos sin devolución
    if (contrato.estado !== "vigente" && contrato.estado !== "por_vencer" && contrato.estado !== "rezagado") {
      continue;
    }

    const entradaPrevista = new Date(contrato.entrada_prevista_en);

    if (ahora.getTime() > entradaPrevista.getTime()) {
      const msRetraso = ahora.getTime() - entradaPrevista.getTime();
      const minutosRetraso = Math.floor(msRetraso / (1000 * 60));
      const horas = Math.floor(minutosRetraso / 60);
      const minutos = minutosRetraso % 60;
      const tiempoFormateado = `${horas} h ${minutos} min`;

      // Calcular cargo de retraso acumulado
      const resultadoRetraso = calcularRetraso(
        entradaPrevista,
        ahora,
        Number(contrato.tarifa_dia),
        { seguroNocturno: Number(contrato.seguro_nocturno) > 0 }
      );

      const estadoAnterior = contrato.estado;
      const cambioAEstadoRezagado = contrato.estado !== "rezagado";

      if (cambioAEstadoRezagado) {
        contrato.estado = "rezagado";
        contrato.updated_at = ahora.toISOString();

        // Marcar vehículo como rezagado para el tablero
        const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id);
        if (vehiculo) {
          vehiculo.es_rezagado = true;
        }

        // Evento outbox
        insertarEventoOutbox("contrato_rezagado", {
          contrato_id: contrato.id,
          folio: contrato.folio,
          retraso_minutos: minutosRetraso,
          cargo_acumulado: resultadoRetraso.cargo,
        });

        // Bitácora
        registrarAuditoria({
          usuario_id: "00000000-0000-0000-0000-000000000000",
          usuario_nombre: "Cron Rezagados",
          accion: "UPDATE",
          tabla: "contratos",
          registro_id: contrato.id,
          registro_descripcion: `Contrato ${contrato.folio} marcado como REZAGADO (${tiempoFormateado} de retraso). Cargo estimado: $${(resultadoRetraso.cargo / 100).toLocaleString("es-MX")}`,
          valor_anterior: { estado: estadoAnterior },
          valor_nuevo: {
            estado: "rezagado",
            retraso_minutos: minutosRetraso,
            cargo_retraso: resultadoRetraso.cargo,
          },
        });
      }

      rezagadosProcesados.push({
        id: contrato.id,
        folio: contrato.folio || "SIN-FOLIO",
        cliente: contrato.cliente_nombre,
        vehiculo: contrato.vehiculo_descripcion,
        entrada_prevista: contrato.entrada_prevista_en,
        retraso_minutos: minutosRetraso,
        retraso_formateado: tiempoFormateado,
        cargo_acumulado_centavos: resultadoRetraso.cargo,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    ejecutado_en: ahora.toISOString(),
    total_rezagados: rezagadosProcesados.length,
    rezagados: rezagadosProcesados,
  });
}
