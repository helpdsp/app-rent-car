/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:24:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T06
 */

"use client";

import React, { useState } from "react";
import type { BloqueoVehiculoRow } from "@/lib/db/sprint4";

interface BloqueosProps {
  vehiculoId: string;
  bloqueos: BloqueoVehiculoRow[];
  onBloqueoCreado?: () => void;
}

export function Bloqueos({ vehiculoId, bloqueos, onBloqueoCreado }: BloqueosProps) {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(false);

    try {
      // Formatear fechas como ISO 8601
      const desdeIso = new Date(desde).toISOString();
      const hastaIso = new Date(hasta).toISOString();

      const res = await fetch(`/api/vehiculos/${vehiculoId}/bloqueos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desde: desdeIso,
          hasta: hastaIso,
          motivo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error(
            data.contrato_folio
              ? `Rechazado: El bloqueo cruza con la renta activa (Contrato ${data.contrato_folio}). Modifique las fechas.`
              : data.error || "Cruce con contrato existente"
          );
        }
        throw new Error(data.error || "Error al registrar el bloqueo");
      }

      setExito(true);
      setDesde("");
      setHasta("");
      setMotivo("");
      if (onBloqueoCreado) {
        onBloqueoCreado();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E3DCCB",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Mantenimiento y bloqueos</h2>
        <span style={{ fontSize: "13px", color: "#6B645A" }}>
          {bloqueos.length === 0
            ? "Sin bloqueos activos"
            : `${bloqueos.length} bloqueo(s) registrado(s)`}
        </span>
      </div>

      {/* Lista de bloqueos existentes */}
      {bloqueos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "8px" }}>
          {bloqueos.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                background: "#FBF9F3",
                border: "1px solid #EFE9DB",
                fontSize: "13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <b>{b.motivo}</b>
                <span style={{ display: "block", color: "#6B645A", fontSize: "12px" }}>
                  {new Date(b.desde).toLocaleDateString("es-MX")} →{" "}
                  {new Date(b.hasta).toLocaleDateString("es-MX")}
                </span>
              </div>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background: "#E8EEF7",
                  color: "#1F3A63",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Mantenimiento
              </span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#FBE9E7",
            color: "#8E1016",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {error}
        </div>
      )}

      {exito && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#E3F3EA",
            color: "#14583A",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Bloqueo por mantenimiento registrado correctamente.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "8px",
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#4A443B",
            }}
          >
            Desde
            <input
              type="datetime-local"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              required
              style={{
                height: "44px",
                border: "1px solid #CFC8B8",
                borderRadius: "10px",
                padding: "0 10px",
                font: "inherit",
                fontSize: "13px",
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#4A443B",
            }}
          >
            Hasta
            <input
              type="datetime-local"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              required
              style={{
                height: "44px",
                border: "1px solid #CFC8B8",
                borderRadius: "10px",
                padding: "0 10px",
                font: "inherit",
                fontSize: "13px",
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "12px",
              fontWeight: 600,
              color: "#4A443B",
            }}
          >
            Motivo
            <input
              placeholder="Ej. Cambio de aceite y frenos"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
              style={{
                height: "44px",
                border: "1px solid #CFC8B8",
                borderRadius: "10px",
                padding: "0 12px",
                font: "inherit",
                fontSize: "14px",
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "12px", color: "#6B645A" }}>
            Si el bloqueo cruza una renta existente, el sistema lo rechaza y muestra el contrato.
          </div>
          <button
            type="submit"
            disabled={cargando}
            style={{
              height: "40px",
              padding: "0 18px",
              borderRadius: "20px",
              border: 0,
              background: "#1E1A16",
              color: "#fff",
              font: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {cargando ? "Guardando..." : "Bloquear unidad"}
          </button>
        </div>
      </form>
    </div>
  );
}
