/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:35:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T05
 */

"use client";

import React, { useState } from "react";
import { type ComparacionAnguloItem } from "@/app/api/contratos/[id]/comparacion-fotos/route";

interface ComparacionFotosProps {
  comparaciones: ComparacionAnguloItem[];
  onTomarFotoFaltante?: (angulo: string) => void;
}

export default function ComparacionFotos({
  comparaciones,
  onTomarFotoFaltante,
}: ComparacionFotosProps) {
  const [anguloActivo, setAnguloActivo] = useState<string>("frente");

  const comparacionActual =
    comparaciones.find((c) => c.angulo === anguloActivo) || comparaciones[0];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E3DCCB",
        borderRadius: 16,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Fotos: entrega y hoy</h2>
        <span style={{ fontSize: 12, color: "#6B645A" }}>Mismos 6 ángulos que en la entrega (T-78)</span>
      </div>

      {/* Pestañas de selección por ángulo */}
      <div
        role="tablist"
        aria-label="Ángulos para comparar"
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {comparaciones.map((c) => {
          const esActivo = c.angulo === anguloActivo;
          const tieneDanoNuevo = c.danos_nuevos.length > 0;
          return (
            <button
              key={c.angulo}
              role="tab"
              aria-selected={esActivo}
              type="button"
              onClick={() => setAnguloActivo(c.angulo)}
              style={{
                height: 38,
                padding: "0 14px",
                borderRadius: 19,
                border: tieneDanoNuevo
                  ? "2px solid #B5141B"
                  : esActivo
                  ? "2px solid #1E1A16"
                  : "1px solid #CFC8B8",
                background: tieneDanoNuevo
                  ? esActivo
                    ? "#B5141B"
                    : "#FBE9E7"
                  : esActivo
                  ? "#1E1A16"
                  : "#fff",
                color: tieneDanoNuevo
                  ? esActivo
                    ? "#fff"
                    : "#8E1016"
                  : esActivo
                  ? "#fff"
                  : "#1E1A16",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {c.etiqueta}
              {tieneDanoNuevo && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: esActivo ? "#fff" : "#B5141B",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Comparación lado a lado de fotos entrega vs hoy (T-78) */}
      {comparacionActual && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {/* Foto de Entrega */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <b>Entrega</b>
                <span style={{ color: "#6B645A" }}>
                  {comparacionActual.entrega
                    ? new Date(comparacionActual.entrega.tomada_en).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "No capturada"}
                </span>
              </div>
              <div
                style={{
                  height: 140,
                  borderRadius: 12,
                  background: "#E8E1CF",
                  border: "1px solid #D5CEBE",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4A443B",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 8,
                  textAlign: "center",
                }}
              >
                {comparacionActual.entrega ? (
                  <>
                    <span>Foto entrega · {comparacionActual.etiqueta}</span>
                    <span style={{ fontSize: 11, color: "#6B645A", marginTop: 4 }}>
                      SHA-256: {comparacionActual.entrega.sha256.substring(0, 12)}...
                    </span>
                    {comparacionActual.entrega.km_capturado && (
                      <span style={{ fontSize: 11, color: "#14583A", fontWeight: 700, marginTop: 2 }}>
                        Odómetro: {comparacionActual.entrega.km_capturado.toLocaleString()} km
                      </span>
                    )}
                  </>
                ) : (
                  <span style={{ color: "#8A8478" }}>Sin foto de entrega (lado nulo)</span>
                )}
              </div>
            </div>

            {/* Foto de Recepción / Hoy */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <b>Hoy (Recepción)</b>
                <span style={{ color: "#6B645A" }}>
                  {comparacionActual.recepcion
                    ? new Date(comparacionActual.recepcion.tomada_en).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Pendiente"}
                </span>
              </div>
              <div
                style={{
                  height: 140,
                  borderRadius: 12,
                  background: comparacionActual.recepcion ? "#D9E8DF" : "#FBF9F3",
                  border: comparacionActual.recepcion
                    ? comparacionActual.danos_nuevos.length > 0
                      ? "2px solid #B5141B"
                      : "1px solid #14583A"
                    : "2px dashed #B5141B",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: comparacionActual.recepcion ? "#14583A" : "#8E1016",
                  fontSize: 13,
                  fontWeight: 600,
                  padding: 8,
                  textAlign: "center",
                }}
              >
                {comparacionActual.recepcion ? (
                  <>
                    <span>Foto hoy · {comparacionActual.etiqueta} ✓</span>
                    <span style={{ fontSize: 11, color: "#4A443B", marginTop: 4 }}>
                      SHA-256: {comparacionActual.recepcion.sha256.substring(0, 12)}...
                    </span>
                    {comparacionActual.recepcion.km_capturado && (
                      <span style={{ fontSize: 11, color: "#14583A", fontWeight: 700, marginTop: 2 }}>
                        Odómetro: {comparacionActual.recepcion.km_capturado.toLocaleString()} km
                      </span>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onTomarFotoFaltante && onTomarFotoFaltante(comparacionActual.angulo)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8E1016",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    + Tomar foto de recepción
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Aviso de daño nuevo si fue detectado en este ángulo */}
          {comparacionActual.danos_nuevos.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 8,
                background: "#FBE9E7",
                color: "#8E1016",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span>
                <b>Daño nuevo detectado:</b>{" "}
                {comparacionActual.danos_nuevos.map((d) => d.nota).join(", ")}
              </span>
              <span style={{ fontSize: 12, color: "#B5141B" }}>No existía en la entrega</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
