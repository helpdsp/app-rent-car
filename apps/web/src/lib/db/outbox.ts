/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:10:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T06
 */

import crypto from "crypto";

export interface OutboxRow {
  id: string;
  evento: string;
  payload: Record<string, unknown>;
  creado_en: string;
  procesado_en: string | null;
}

const ALMACEN_OUTBOX: OutboxRow[] = [];

/**
 * Inserta un evento desacoplado en la tabla outbox (RF-29, T-82).
 */
export function insertarEventoOutbox(
  evento: string,
  payload: Record<string, unknown>
): OutboxRow {
  const row: OutboxRow = {
    id: crypto.randomUUID(),
    evento,
    payload,
    creado_en: new Date().toISOString(),
    procesado_en: null,
  };
  ALMACEN_OUTBOX.push(row);
  return row;
}

/**
 * Obtiene los eventos encolados en el outbox.
 */
export function obtenerEventosOutbox(filtro?: { evento?: string }): OutboxRow[] {
  if (filtro?.evento) {
    return ALMACEN_OUTBOX.filter((e) => e.evento === filtro.evento);
  }
  return [...ALMACEN_OUTBOX];
}

/**
 * Resetea el almacén de outbox para pruebas unitarias.
 */
export function resetearEstadoOutbox(): void {
  ALMACEN_OUTBOX.length = 0;
}
