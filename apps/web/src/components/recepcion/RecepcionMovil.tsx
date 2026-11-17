/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:40:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T06
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { type ComparacionAnguloItem } from "@/app/api/contratos/[id]/comparacion-fotos/route";

interface RecepcionMovilProps {
  folio?: string;
  vehiculoInfo?: string;
  esRezagado?: boolean;
  tiempoRetraso?: string;
  comparaciones: ComparacionAnguloItem[];
  totalCentavos?: number;
  anticipoCentavos?: number;
  saldoCentavos?: number;
  depositoTotalCentavos?: number;
  onConcluir?: () => void;
  onTomarFoto?: () => void;
}

export default function RecepcionMovil({
  folio = "08155",
  vehiculoInfo = "Mazda 3",
  esRezagado = true,
  tiempoRetraso = "2 h 20 min",
  comparaciones,
  totalCentavos = 673_100,
  anticipoCentavos = 489_900,
  saldoCentavos = 183_200,
  depositoTotalCentavos = 800_000,
  onConcluir,
  onTomarFoto,
}: RecepcionMovilProps) {
  const [anguloActivo, setAnguloActivo] = useState<string>("frente");

  const comparacionActual =
    comparaciones.find((c) => c.angulo === anguloActivo) || comparaciones[0];

  const fotosCompletas = comparaciones.filter((c) => c.recepcion !== null).length;
  const fotosTotal = comparaciones.length || 6;
  const faltantes = comparaciones
    .filter((c) => c.recepcion === null)
    .map((c) => c.etiqueta);

  const saldo = saldoCentavos / 100;
  const deposito = depositoTotalCentavos / 100;
  const seDevuelve = Math.max(0, deposito - saldo);

  return (
    <div
      style={{
        width: 390,
        height: 844,
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "#F6F2E8",
        color: "#1E1A16",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Cabecera Mockup M4 */}
      <header
        style={{
          padding: "16px 16px 8px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flex: "none",
        }}
      >
        <Link
          href="/"
          aria-label="Volver al tablero"
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            border: "1px solid #E3DCCB",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1E1A16",
            textDecoration: "none",
            flex: "none",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M11 6l-6 6 6 6" />
          </svg>
        </Link>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#6B645A",
            }}
          >
            RECEPCIÓN · CONTRATO {folio}
          </div>
          <h1
            style={{
              margin: "2px 0 0",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 22,
              lineHeight: 1.15,
            }}
          >
            Comparar fotos
          </h1>
        </div>

        {esRezagado && (
          <span
            style={{
              flex: "none",
              padding: "4px 10px",
              borderRadius: 12,
              background: "#FBE9E7",
              color: "#8E1016",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Rezagado
          </span>
        )}
      </header>

      {/* Selector de ángulos */}
      <div
        role="tablist"
        aria-label="Ángulo"
        style={{
          flex: "none",
          padding: "6px 16px 10px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {comparaciones.map((c) => {
          const esActivo = c.angulo === anguloActivo;
          const tieneDano = c.danos_nuevos.length > 0;
          return (
            <button
              key={c.angulo}
              role="tab"
              aria-selected={esActivo}
              type="button"
              onClick={() => setAnguloActivo(c.angulo)}
              style={{
                flex: "none",
                height: 44,
                padding: "0 16px",
                borderRadius: 22,
                border: tieneDano && esActivo ? 0 : "1px solid #CFC8B8",
                background: tieneDano && esActivo ? "#B5141B" : esActivo ? "#1E1A16" : "#fff",
                font: "inherit",
                fontSize: 14,
                fontWeight: esActivo ? 700 : 600,
                color: esActivo ? "#fff" : "#1E1A16",
                cursor: "pointer",
              }}
            >
              {tieneDano ? `${c.etiqueta}: daño nuevo` : c.etiqueta}
            </button>
          );
        })}
      </div>

      {/* Cuerpo principal con fotos y liquidación */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
        }}
      >
        {/* Foto Entrega */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <b>Entrega</b>
            <span style={{ color: "#6B645A" }}>13/11 · 11:00 · Operador</span>
          </div>
          <div
            role="img"
            aria-label="Foto de entrega"
            style={{
              height: 140,
              borderRadius: 14,
              background: "#E8E1CF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B645A",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {comparacionActual?.entrega
              ? `Foto de entrega · ${comparacionActual.etiqueta}`
              : "Sin foto de entrega"}
          </div>
        </div>

        {/* Foto Hoy */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <b>Hoy</b>
            <span style={{ color: "#6B645A" }}>16/11 · 13:20 · Operador</span>
          </div>
          <div
            role="img"
            aria-label="Foto de hoy"
            style={{
              height: 140,
              borderRadius: 14,
              background: "#E8E1CF",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B645A",
              fontSize: 13,
              fontWeight: 600,
              border: comparacionActual?.danos_nuevos?.length ? "2px solid #B5141B" : "none",
              boxSizing: "border-box",
            }}
          >
            {comparacionActual?.recepcion
              ? `Foto de hoy · ${comparacionActual.etiqueta}`
              : "Pendiente de captura"}
            {comparacionActual?.danos_nuevos?.length ? (
              <span
                style={{
                  position: "absolute",
                  left: "38%",
                  bottom: 24,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: "#B5141B",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </span>
            ) : null}
          </div>
        </div>

        {/* Tarjeta de Daño nuevo si aplica */}
        {comparacionActual?.danos_nuevos?.length ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 12,
              background: "#FBE9E7",
              color: "#8E1016",
              fontSize: 14,
            }}
          >
            <span>
              <b>Daño nuevo:</b> {comparacionActual.danos_nuevos[0]?.nota || "Detalle superficial"}
            </span>
            <span style={{ flex: "none", fontWeight: 700 }}>Sin cargo</span>
          </div>
        ) : null}

        {/* Resumen de liquidación móvil Mockup M4 */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E3DCCB",
            borderRadius: 16,
            padding: "12px 14px",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "4px 12px",
            fontSize: 14,
            alignItems: "baseline",
          }}
        >
          <span>Total de la renta</span>
          <b>${(totalCentavos / 100).toLocaleString("es-MX")}</b>
          <span>Anticipo pagado</span>
          <b>− ${(anticipoCentavos / 100).toLocaleString("es-MX")}</b>
          <b>Saldo a cobrar</b>
          <b
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 24,
              color: "#B5141B",
            }}
          >
            ${saldo.toLocaleString("es-MX")}
          </b>
          <span style={{ fontSize: 13, color: "#14583A", gridColumn: "1 / -1" }}>
            Depósito ${deposito.toLocaleString("es-MX")}: se aplica ${saldo.toLocaleString("es-MX")} y se devuelven ${seDevuelve.toLocaleString("es-MX")}
          </span>
        </div>
      </main>

      {/* Barra inferior */}
      <footer
        style={{
          flex: "none",
          padding: "10px 16px 16px",
          background: "#fff",
          borderTop: "1px solid #E3DCCB",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B645A" }}>
          <span>Fotos de hoy: {fotosCompletas} de {fotosTotal}</span>
          <span>{faltantes.length > 0 ? `Falta: ${faltantes.join(", ")}` : "Completas ✓"}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)", gap: 10 }}>
          <button
            type="button"
            onClick={onTomarFoto}
            style={{
              height: 56,
              borderRadius: 28,
              border: "1px solid #CFC8B8",
              background: "#fff",
              color: "#1E1A16",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Tomar foto
          </button>
          <button
            type="button"
            onClick={onConcluir}
            style={{
              height: 56,
              borderRadius: 28,
              border: "none",
              background: "#B5141B",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Cobrar y concluir
          </button>
        </div>
      </footer>
    </div>
  );
}
