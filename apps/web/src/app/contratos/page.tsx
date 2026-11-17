/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:40:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T08
 */

"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/ui/SidebarNav";

interface ContratoItem {
  id: string;
  folio: string;
  esPapel: boolean;
  cliente: string;
  vehiculo: string;
  fechas: string;
  estado: string;
  estadoEtiqueta: string;
  estadoBg: string;
  estadoColor: string;
  total: string;
  totalDestacado?: boolean;
  filaAlerta?: boolean;
}

const CONTRATOS_DATA: ContratoItem[] = [
  {
    id: "c-1",
    folio: "D-00001",
    esPapel: false,
    cliente: "Ricardo Medina",
    vehiculo: "Hyundai Elantra",
    fechas: "16/11 11:00 → 19/11 11:00",
    estado: "por_firmar",
    estadoEtiqueta: "Por firmar",
    estadoBg: "#E8EEF7",
    estadoColor: "#1F3A63",
    total: "$4,899",
  },
  {
    id: "c-2",
    folio: "08160",
    esPapel: true,
    cliente: "Ricardo Medina",
    vehiculo: "Kia Forte",
    fechas: "13/11 17:30 → 16/11 17:30",
    estado: "vigente",
    estadoEtiqueta: "Vigente · vence hoy",
    estadoBg: "#FFF1D6",
    estadoColor: "#7A4A00",
    total: "$4,899",
  },
  {
    id: "c-3",
    folio: "08158",
    esPapel: true,
    cliente: "Laura Ibarra",
    vehiculo: "Nissan Sentra",
    fechas: "13/11 11:00 → 16/11 11:00",
    estado: "vigente",
    estadoEtiqueta: "Vigente · vence hoy",
    estadoBg: "#FFF1D6",
    estadoColor: "#7A4A00",
    total: "$4,899",
  },
  {
    id: "c-4",
    folio: "08155",
    esPapel: true,
    cliente: "Andrés Cota",
    vehiculo: "Mazda 3",
    fechas: "13/11 11:00 → 16/11 11:00",
    estado: "rezagado",
    estadoEtiqueta: "Rezagado · 2 h 20 min",
    estadoBg: "#FBE9E7",
    estadoColor: "#8E1016",
    total: "$5,511",
    totalDestacado: true,
    filaAlerta: true,
  },
  {
    id: "c-5",
    folio: "08871",
    esPapel: true,
    cliente: "Laura Ibarra",
    vehiculo: "Hyundai Elantra",
    fechas: "02/11 11:00 → 05/11 11:00",
    estado: "concluido",
    estadoEtiqueta: "Concluido",
    estadoBg: "#E3F3EA",
    estadoColor: "#14583A",
    total: "$4,899",
  },
  {
    id: "c-6",
    folio: "08804",
    esPapel: true,
    cliente: "Ricardo Medina",
    vehiculo: "Hyundai Elantra",
    fechas: "21/10 11:00 → 23/10 11:00",
    estado: "concluido",
    estadoEtiqueta: "Concluido",
    estadoBg: "#E3F3EA",
    estadoColor: "#14583A",
    total: "$3,266",
  },
  {
    id: "c-7",
    folio: "08755",
    esPapel: true,
    cliente: "Andrés Cota",
    vehiculo: "Hyundai Elantra",
    fechas: "09/10 11:00 → 12/10 11:00",
    estado: "concluido",
    estadoEtiqueta: "Concluido",
    estadoBg: "#E3F3EA",
    estadoColor: "#14583A",
    total: "$4,899",
  },
  {
    id: "c-8",
    folio: "08699",
    esPapel: true,
    cliente: "Sofía Rivas",
    vehiculo: "Nissan Altima",
    fechas: "28/09 11:00 → 01/10 11:00",
    estado: "cancelado",
    estadoEtiqueta: "Cancelado · penalización",
    estadoBg: "#EFEAE0",
    estadoColor: "#4A443B",
    total: "$980",
  },
];

type FiltroEstado =
  | "todos"
  | "borrador"
  | "por_firmar"
  | "vigente"
  | "rezagado"
  | "recibido"
  | "concluido"
  | "cancelado";

function ContratosContent() {
  const [filtro, setFiltro] = useState<FiltroEstado>("todos");
  const [busqueda, setBusqueda] = useState("");

  const contratosFiltrados = useMemo(() => {
    return CONTRATOS_DATA.filter((item) => {
      const cumpleFiltro =
        filtro === "todos"
          ? true
          : item.estado === filtro;

      const q = busqueda.trim().toLowerCase();
      const cumpleBusqueda =
        !q ||
        item.folio.toLowerCase().includes(q) ||
        item.cliente.toLowerCase().includes(q) ||
        item.vehiculo.toLowerCase().includes(q);

      return cumpleFiltro && cumpleBusqueda;
    });
  }, [filtro, busqueda]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        background: "#F6F2E8",
        color: "#1E1A16",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 16,
        overflow: "hidden",
      }}
    >
      <SidebarNav seccionActiva="contratos" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#6B645A",
              }}
            >
              RENTAS · NOVIEMBRE 2026
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 36,
                lineHeight: 1.1,
              }}
            >
              Contratos
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                height: 48,
                padding: "0 16px",
                borderRadius: 24,
                background: "#fff",
                border: "1px solid #E3DCCB",
                width: 300,
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
                aria-label="Buscar contrato"
                placeholder="Folio, cliente o placas"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  font: "inherit",
                  fontSize: 15,
                  width: "100%",
                  color: "#1E1A16",
                }}
              />
            </label>
            <Link
              href="/contratos/nuevo"
              style={{
                height: 48,
                padding: "0 22px",
                borderRadius: 24,
                background: "#B5141B",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              + Nuevo contrato
            </Link>
          </div>
        </header>

        {/* Filtros por estado */}
        <div
          role="group"
          aria-label="Filtrar por estado"
          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <button
            type="button"
            aria-pressed={filtro === "todos"}
            onClick={() => setFiltro("todos")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: 0,
              background: filtro === "todos" ? "#1E1A16" : "#fff",
              color: filtro === "todos" ? "#fff" : "#1E1A16",
              boxShadow: filtro === "todos" ? "none" : "inset 0 0 0 1px #CFC8B8",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Todos · 38
          </button>
          <button
            type="button"
            aria-pressed={filtro === "borrador"}
            onClick={() => setFiltro("borrador")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: filtro === "borrador" ? "0" : "1px solid #CFC8B8",
              background: filtro === "borrador" ? "#1E1A16" : "#fff",
              color: filtro === "borrador" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Borrador · 1
          </button>
          <button
            type="button"
            aria-pressed={filtro === "por_firmar"}
            onClick={() => setFiltro("por_firmar")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: filtro === "por_firmar" ? "0" : "1px solid #CFC8B8",
              background: filtro === "por_firmar" ? "#1E1A16" : "#fff",
              color: filtro === "por_firmar" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Por firmar · 1
          </button>
          <button
            type="button"
            aria-pressed={filtro === "vigente"}
            onClick={() => setFiltro("vigente")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: filtro === "vigente" ? "0" : "1px solid #CFC8B8",
              background: filtro === "vigente" ? "#1E1A16" : "#fff",
              color: filtro === "vigente" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Vigente · 5
          </button>
          <button
            type="button"
            aria-pressed={filtro === "rezagado"}
            onClick={() => setFiltro("rezagado")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: "1px solid #F0C4BF",
              background: filtro === "rezagado" ? "#8E1016" : "#FBE9E7",
              color: filtro === "rezagado" ? "#fff" : "#8E1016",
              font: "inherit",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Rezagado · 1
          </button>
          <button
            type="button"
            aria-pressed={filtro === "recibido"}
            onClick={() => setFiltro("recibido")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: filtro === "recibido" ? "0" : "1px solid #CFC8B8",
              background: filtro === "recibido" ? "#1E1A16" : "#fff",
              color: filtro === "recibido" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recibido · 2
          </button>
          <button
            type="button"
            aria-pressed={filtro === "concluido"}
            onClick={() => setFiltro("concluido")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: filtro === "concluido" ? "0" : "1px solid #CFC8B8",
              background: filtro === "concluido" ? "#1E1A16" : "#fff",
              color: filtro === "concluido" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Concluido · 26
          </button>
          <button
            type="button"
            aria-pressed={filtro === "cancelado"}
            onClick={() => setFiltro("cancelado")}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 22,
              border: filtro === "cancelado" ? "0" : "1px solid #CFC8B8",
              background: filtro === "cancelado" ? "#1E1A16" : "#fff",
              color: filtro === "cancelado" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancelado · 2
          </button>
        </div>

        {/* Tabla de contratos */}
        <section
          aria-label="Listado"
          style={{
            flex: 1,
            minHeight: 0,
            background: "#fff",
            border: "1px solid #E3DCCB",
            borderRadius: 16,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.5fr 1.4fr 1.7fr 1.3fr 0.9fr",
              gap: 12,
              padding: "12px 20px",
              background: "#FBF9F3",
              borderBottom: "1px solid #E3DCCB",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#6B645A",
            }}
          >
            <span>FOLIO</span>
            <span>CLIENTE</span>
            <span>VEHÍCULO</span>
            <span>SALIDA → ENTRADA</span>
            <span>ESTADO</span>
            <span style={{ textAlign: "right" }}>TOTAL</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {contratosFiltrados.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.9fr 1.5fr 1.4fr 1.7fr 1.3fr 0.9fr",
                  gap: 12,
                  padding: "0 20px",
                  minHeight: 58,
                  alignItems: "center",
                  borderBottom: "1px solid #EFE9DB",
                  fontSize: 14,
                  background: item.filaAlerta ? "#FDF6F5" : "transparent",
                }}
              >
                <span>
                  <b>{item.folio}</b>
                  {item.esPapel && (
                    <span style={{ display: "block", fontSize: 11, color: "#6B645A" }}>
                      folio de papel
                    </span>
                  )}
                </span>
                <span>{item.cliente}</span>
                <span>{item.vehiculo}</span>
                <span style={{ color: "#4A443B" }}>{item.fechas}</span>
                <span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 12,
                      background: item.estadoBg,
                      color: item.estadoColor,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {item.estadoEtiqueta}
                  </span>
                </span>
                <b
                  style={{
                    textAlign: "right",
                    color: item.totalDestacado ? "#8E1016" : "inherit",
                  }}
                >
                  {item.total}
                </b>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "10px 20px",
              borderTop: "1px solid #E3DCCB",
              fontSize: 13,
              color: "#6B645A",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Mostrando {contratosFiltrados.length} de 38 · página 1 de 5</span>
            <span>Los folios de papel y los digitales (D-) conviven durante la transición</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ContratosPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando contratos...</div>}>
      <ContratosContent />
    </Suspense>
  );
}
