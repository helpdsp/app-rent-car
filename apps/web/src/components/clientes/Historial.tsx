/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:39:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T08
 */

import React from "react";
import { MRA_TOKENS } from "@/components/ui";
import { formatearMonedaCentavos } from "@/components/ui/tokens";
import type { HistorialRentaCliente } from "@/lib/db/sprint3";

export function HistorialRentasCliente({
  historial,
}: {
  historial: HistorialRentaCliente[];
}) {
  return (
    <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${MRA_TOKENS.colors.borderDivider}` }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Historial de rentas</h2>

      {historial.length === 0 ? (
        <div style={{ fontSize: 13, color: MRA_TOKENS.colors.textMuted, padding: "8px 0" }}>
          Sin contratos registrados previamente.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) 76px 128px",
              gap: 10,
              fontSize: 12,
              fontWeight: 600,
              color: MRA_TOKENS.colors.textMuted,
              paddingBottom: 2,
            }}
          >
            <span>CONTRATO</span>
            <span style={{ textAlign: "right" }}>KM</span>
            <span style={{ textAlign: "right" }}>ESTADO · TOTAL</span>
          </div>

          {historial.map((h) => (
            <div
              key={h.contrato_folio}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 76px 128px",
                gap: 10,
                alignItems: "baseline",
                fontSize: 14,
                padding: "6px 0",
                borderTop: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
              }}
            >
              <span>
                <b>{h.contrato_folio}</b> · {h.vehiculo_modelo} · {h.dias} días
              </span>
              <span style={{ textAlign: "right", color: h.kilometros === "En curso" ? MRA_TOKENS.colors.textMuted : MRA_TOKENS.colors.ink, fontWeight: h.kilometros === "En curso" ? 400 : 600 }}>
                {h.kilometros}
              </span>
              <span style={{ textAlign: "right", color: MRA_TOKENS.colors.textMuted }}>
                {h.estado} · {formatearMonedaCentavos(h.total)}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
