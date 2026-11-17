/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:35:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T07
 */

"use client";

import React, { useState } from "react";

export interface DatosPagare {
  activado: boolean;
  monto: number; // en centavos
  interes_mensual_pct?: number | null;
  interes_texto?: string;
  ciudad_fecha?: string;
  suscriptor?: string;
}

interface PagareProps {
  initialValues?: Partial<DatosPagare>;
  clienteNombre?: string;
  onChange?: (datos: DatosPagare) => void;
}

export function Pagare({ initialValues, clienteNombre = "Ricardo Medina Salazar", onChange }: PagareProps) {
  const [activado, setActivado] = useState(initialValues?.activado ?? true);
  const [montoTexto, setMontoTexto] = useState("$8,000.00");
  const [interes, setInteres] = useState(initialValues?.interes_texto ?? "Sin interés pactado");
  const [ciudadFecha, setCiudadFecha] = useState(initialValues?.ciudad_fecha ?? "Mexicali, B.C. · 16/11/2026");
  const [suscriptor, setSuscriptor] = useState(initialValues?.suscriptor ?? clienteNombre);

  const notificar = (cambios: Partial<DatosPagare>) => {
    if (onChange) {
      onChange({
        activado,
        monto: 800000,
        interes_texto: interes,
        ciudad_fecha: ciudadFecha,
        suscriptor,
        ...cambios,
      });
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E3DCCB",
        borderRadius: 16,
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Pagaré</h2>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: activado ? "#14583A" : "#6B645A",
            cursor: "pointer",
          }}
          onClick={() => {
            const nuevo = !activado;
            setActivado(nuevo);
            notificar({ activado: nuevo });
          }}
        >
          {activado ? "Activado" : "Desactivado"}
          <span
            style={{
              width: 48,
              height: 28,
              borderRadius: 14,
              background: activado ? "#14583A" : "#CFC8B8",
              padding: 3,
              boxSizing: "border-box",
              display: "inline-flex",
              transition: "background 0.2s ease",
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                background: "#fff",
                transform: activado ? "translateX(20px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            />
          </span>
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
          Monto
          <input
            value={montoTexto}
            disabled={!activado}
            onChange={(e) => setMontoTexto(e.target.value)}
            style={{
              height: 44,
              border: "1px solid #CFC8B8",
              borderRadius: 10,
              padding: "0 12px",
              font: "inherit",
              fontSize: 15,
              fontWeight: 400,
              color: "#1E1A16",
              background: activado ? "#fff" : "#F6F2E8",
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
          Interés mensual
          <input
            value={interes}
            disabled={!activado}
            onChange={(e) => {
              setInteres(e.target.value);
              notificar({ interes_texto: e.target.value });
            }}
            style={{
              height: 44,
              border: "1px solid #CFC8B8",
              borderRadius: 10,
              padding: "0 12px",
              font: "inherit",
              fontSize: 15,
              fontWeight: 400,
              color: "#1E1A16",
              background: activado ? "#fff" : "#F6F2E8",
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
          Ciudad y fecha
          <input
            value={ciudadFecha}
            disabled={!activado}
            onChange={(e) => {
              setCiudadFecha(e.target.value);
              notificar({ ciudad_fecha: e.target.value });
            }}
            style={{
              height: 44,
              border: "1px solid #CFC8B8",
              borderRadius: 10,
              padding: "0 12px",
              font: "inherit",
              fontSize: 15,
              fontWeight: 400,
              color: "#1E1A16",
              background: activado ? "#fff" : "#F6F2E8",
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 12, fontWeight: 600, color: "#4A443B" }}>
          Suscriptor
          <input
            value={suscriptor}
            disabled={!activado}
            onChange={(e) => {
              setSuscriptor(e.target.value);
              notificar({ suscriptor: e.target.value });
            }}
            style={{
              height: 44,
              border: "1px solid #CFC8B8",
              borderRadius: 10,
              padding: "0 12px",
              font: "inherit",
              fontSize: 15,
              fontWeight: 400,
              color: "#1E1A16",
              background: activado ? "#fff" : "#F6F2E8",
            }}
          />
        </label>
      </div>
      <div style={{ fontSize: 12, color: "#6B645A" }}>
        Opcional. Va en el PDF solo si está activado y se firma en la pantalla de firma.
      </div>
    </div>
  );
}
