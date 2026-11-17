/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:55:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T06
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

interface TableroMovilProps {
  conteoAlertas: number;
  onBuscar?: (q: string) => void;
}

export function TableroMovil({ conteoAlertas, onBuscar }: TableroMovilProps) {
  const [busqueda, setBusqueda] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBuscar) onBuscar(busqueda);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        minHeight: "100vh",
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "#F6F2E8",
        color: "#1E1A16",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "16px",
      }}
    >
      {/* Header móvil */}
      <header style={{ padding: "20px 20px 12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#6B645A" }}>
              LUN 16 NOV · MEXICALI
            </div>
            <h1 style={{ margin: "2px 0 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: "30px", lineHeight: 1.1 }}>
              Tablero
            </h1>
          </div>

          <Link
            href="/admin/bitacora"
            aria-label={`Alertas, ${conteoAlertas} pendientes`}
            style={{
              position: "relative",
              width: "48px",
              height: "48px",
              borderRadius: "24px",
              border: "1px solid #E3DCCB",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1E1A16",
              textDecoration: "none",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 17v-6a6 6 0 0112 0v6l1.5 2h-15z" />
              <path d="M10 21h4" />
            </svg>
            {conteoAlertas > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "2px",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  background: "#B5141B",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {conteoAlertas}
              </span>
            )}
          </Link>
        </div>

        {/* Buscador móvil */}
        <form onSubmit={handleSearchSubmit}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              height: "48px",
              padding: "0 16px",
              borderRadius: "24px",
              background: "#fff",
              border: "1px solid #E3DCCB",
              boxSizing: "border-box",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B645A"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input
              aria-label="Buscar cliente, folio o placas"
              placeholder="Cliente, folio o placas"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                border: 0,
                outline: 0,
                background: "transparent",
                font: "inherit",
                fontSize: "16px",
                width: "100%",
                color: "#1E1A16",
              }}
            />
          </label>
        </form>
      </header>

      {/* Contenido principal móvil */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          padding: "0 20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          overflowY: "auto",
        }}
      >
        {/* Acción principal: Nuevo contrato */}
        <Link
          href="/contratos"
          style={{
            minHeight: "64px",
            borderRadius: "16px",
            background: "#B5141B",
            color: "#fff",
            textDecoration: "none",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: "19px", fontWeight: 700 }}>Nuevo contrato</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </Link>

        {/* Acciones secundarias: Entregar / Recibir */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Link
            href="/contratos"
            style={{
              minHeight: "64px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #E3DCCB",
              color: "#1E1A16",
              textDecoration: "none",
              padding: "8px 16px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 700 }}>Entregar</span>
            <span style={{ fontSize: "13px", color: "#6B645A" }}>1 por entregar</span>
          </Link>
          <Link
            href="/contratos"
            style={{
              minHeight: "64px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #E3DCCB",
              color: "#1E1A16",
              textDecoration: "none",
              padding: "8px 16px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 700 }}>Recibir</span>
            <span style={{ fontSize: "13px", color: "#6B645A" }}>3 regresan hoy</span>
          </Link>
        </div>

        {/* Resumen 4 cuadrículas */}
        <section
          aria-label="Resumen móvil"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px" }}
        >
          <div style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: "12px", padding: "8px 10px" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: 1.1 }}>
              6
            </div>
            <div style={{ fontSize: "12px", color: "#6B645A" }}>En renta</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: "12px", padding: "8px 10px" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: 1.1 }}>
              4
            </div>
            <div style={{ fontSize: "12px", color: "#6B645A" }}>Libres</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: "12px", padding: "8px 10px" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: 1.1 }}>
              2
            </div>
            <div style={{ fontSize: "12px", color: "#6B645A" }}>Hoy</div>
          </div>
          <div style={{ background: "#FBE9E7", border: "1px solid #F0C4BF", borderRadius: "12px", padding: "8px 10px" }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 700, lineHeight: 1.1, color: "#8E1016" }}>
              1
            </div>
            <div style={{ fontSize: "12px", color: "#8E1016", fontWeight: 600 }}>Rezag.</div>
          </div>
        </section>

        {/* Requiere atención */}
        <section aria-label="Atención" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2 style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: 700 }}>Requiere atención</h2>

          {/* Rezagado */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #F0C4BF",
              borderRadius: "14px",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "baseline" }}>
              <b style={{ fontSize: "15px" }}>08155 · Mazda 3</b>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#8E1016" }}>2 h 20 min tarde</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", color: "#6B645A" }}>
                Andrés Cota · cargo acumulado <b style={{ color: "#8E1016" }}>$612</b>
              </span>
              <button
                type="button"
                onClick={() => alert("Abriendo recepción de Mazda 3...")}
                style={{
                  minHeight: "44px",
                  padding: "0 16px",
                  borderRadius: "22px",
                  background: "#1E1A16",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Recibir
              </button>
            </div>
          </div>

          {/* Vence hoy */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "14px",
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div>
              <b style={{ fontSize: "15px" }}>08158 · 11:00</b>
              <div style={{ fontSize: "13px", color: "#6B645A" }}>Nissan Sentra · Laura Ibarra</div>
            </div>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                background: "#FFF1D6",
                color: "#7A4A00",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Vence hoy
            </span>
          </div>

          {/* Tarjeta de circulación por vencer */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "14px",
              padding: "12px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div>
              <b style={{ fontSize: "15px" }}>Tarjeta de circulación</b>
              <div style={{ fontSize: "13px", color: "#6B645A" }}>Honda CR-V · Negra</div>
            </div>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: "12px",
                background: "#FBE9E7",
                color: "#8E1016",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Hoy
            </span>
          </div>
        </section>
      </main>

      {/* Barra de navegación inferior móvil */}
      <nav
        aria-label="Navegación móvil"
        style={{
          flex: "none",
          height: "76px",
          background: "#fff",
          borderTop: "1px solid #E3DCCB",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          alignItems: "stretch",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: "#B5141B",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
          Tablero
        </Link>
        <Link
          href="/contratos"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: "#6B645A",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /></svg>
          Contratos
        </Link>
        <Link
          href="/clientes"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: "#6B645A",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 5a3.5 3.5 0 010 6" /><path d="M18 14c2.2.7 3.5 2.6 3.5 6" /></svg>
          Clientes
        </Link>
        <Link
          href="/vehiculos"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: "#6B645A",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-4l2-5h12l2 5v4" /><path d="M3 16h18" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="16.5" cy="17.5" r="1.8" /></svg>
          Vehículos
        </Link>
      </nav>
    </div>
  );
}
