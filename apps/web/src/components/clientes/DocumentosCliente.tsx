/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:38:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T05
 */

"use client";

import React, { useState } from "react";
import { MRA_TOKENS, StatusChip, SurfaceCard } from "@/components/ui";

interface DocumentosProps {
  clienteId: string;
}

export function DocumentosCliente({ clienteId }: DocumentosProps) {
  const [frenteLicencia, setFrenteLicencia] = useState(true);
  const [reversoLicencia, setReversoLicencia] = useState(true);
  const [frenteIne, setFrenteIne] = useState(true);
  const [reversoIne, setReversoIne] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);

  function simularCapturaCamara(tipoDoc: string, lado: string) {
    setMensaje(`Captura de cámara para ${tipoDoc} (${lado}) completada y subida a Storage privado con éxito.`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {mensaje && (
        <div
          role="status"
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            background: MRA_TOKENS.colors.statusSuccessBg,
            color: MRA_TOKENS.colors.statusSuccessText,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {mensaje}
        </div>
      )}

      {/* Licencia de conducir (Mockup 2) */}
      <SurfaceCard style={{ padding: "18px 22px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyItems: "space-between", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Licencia de conducir</h2>
          <StatusChip variant="success">Vigente hasta 27/05/2028</StatusChip>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            type="button"
            onClick={() => simularCapturaCamara("Licencia", "frente")}
            style={{
              height: 120,
              border: `2px dashed ${MRA_TOKENS.colors.borderInput}`,
              borderRadius: 14,
              background: MRA_TOKENS.colors.paperSubtle,
              color: MRA_TOKENS.colors.textSecondary,
              font: "inherit",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
            {frenteLicencia ? "Frente · foto capturada ✓" : "Frente · foto de la licencia"}
          </button>

          <button
            type="button"
            onClick={() => simularCapturaCamara("Licencia", "reverso")}
            style={{
              height: 120,
              border: `2px dashed ${MRA_TOKENS.colors.borderInput}`,
              borderRadius: 14,
              background: MRA_TOKENS.colors.paperSubtle,
              color: MRA_TOKENS.colors.textSecondary,
              font: "inherit",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
            {reversoLicencia ? "Reverso · foto capturada ✓" : "Reverso · foto de la licencia"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr 1fr 1fr", gap: 10, fontSize: 14 }}>
          <div><div style={{ color: MRA_TOKENS.colors.textMuted, fontSize: 12, fontWeight: 600 }}>NÚMERO</div>B2302042880</div>
          <div><div style={{ color: MRA_TOKENS.colors.textMuted, fontSize: 12, fontWeight: 600 }}>TIPO</div>A</div>
          <div><div style={{ color: MRA_TOKENS.colors.textMuted, fontSize: 12, fontWeight: 600 }}>EXPEDIDA EN</div>Mexicali, B.C.</div>
          <div><div style={{ color: MRA_TOKENS.colors.textMuted, fontSize: 12, fontWeight: 600 }}>VENCE</div>27/05/2028</div>
        </div>
      </SurfaceCard>

      {/* Credencial (Mockup 2) */}
      <SurfaceCard style={{ padding: "18px 22px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Credencial</h2>
          <StatusChip variant="warning">Vence en 7 días</StatusChip>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <button
            type="button"
            onClick={() => simularCapturaCamara("INE", "frente")}
            style={{
              height: 90,
              border: `2px dashed ${MRA_TOKENS.colors.borderInput}`,
              borderRadius: 14,
              background: MRA_TOKENS.colors.paperSubtle,
              color: MRA_TOKENS.colors.textSecondary,
              font: "inherit",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
            {frenteIne ? "Frente ✓" : "Frente"}
          </button>

          <button
            type="button"
            onClick={() => simularCapturaCamara("INE", "reverso")}
            style={{
              height: 90,
              border: `2px dashed ${MRA_TOKENS.colors.borderInput}`,
              borderRadius: 14,
              background: MRA_TOKENS.colors.paperSubtle,
              color: MRA_TOKENS.colors.textSecondary,
              font: "inherit",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
            {reversoIne ? "Reverso ✓" : "Reverso"}
          </button>
        </div>
      </SurfaceCard>
    </div>
  );
}
