/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:30:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T07
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface VehiculoOpcion {
  id: string;
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  color: string;
  tarifa_dia: number; // en centavos
  disponible: boolean;
  motivo_no_disponible?: string;
  badge?: { texto: string; fondo: string; color: string };
}

interface NuevoMovilProps {
  clienteNombre?: string;
  clienteNumero?: string;
  onContinuar?: (datos: { vehiculoId: string; destino: string; salida: string; entrega: string }) => void;
}

export function NuevoMovil({
  clienteNombre = "Ricardo Medina Salazar",
  clienteNumero = "00127",
  onContinuar,
}: NuevoMovilProps) {
  const router = useRouter();
  const [salida, setSalida] = useState("16/11 · 11:00");
  const [entrega, setEntrega] = useState("19/11 · 11:00");
  const [destino, setDestino] = useState("Nogales");
  const [salidaPais, setSalidaPais] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<string>("hyundai-elantra");

  const vehiculos: VehiculoOpcion[] = [
    {
      id: "hyundai-elantra",
      marca: "Hyundai",
      modelo: "Elantra",
      anio: 2023,
      placas: "ATU-703-A",
      color: "Azul",
      tarifa_dia: 163300,
      disponible: true,
      badge: { texto: "Disponible", fondo: "#E3F3EA", color: "#14583A" },
    },
    {
      id: "nissan-altima",
      marca: "Nissan",
      modelo: "Altima",
      anio: 2022,
      placas: "BNB-112-B",
      color: "Blanco",
      tarifa_dia: 163300,
      disponible: true,
      badge: { texto: "Disponible", fondo: "#E3F3EA", color: "#14583A" },
    },
    {
      id: "honda-crv",
      marca: "Honda",
      modelo: "CR-V",
      anio: 2021,
      placas: "BC-990-A",
      color: "Negra",
      tarifa_dia: 210000,
      disponible: false,
      motivo_no_disponible: "Tarjeta de circulación vence hoy",
      badge: { texto: "Documentos", fondo: "#FBE9E7", color: "#8E1016" },
    },
    {
      id: "kia-forte",
      marca: "Kia",
      modelo: "Forte",
      anio: 2022,
      placas: "BNB-791-A",
      color: "Gris",
      tarifa_dia: 163300,
      disponible: false,
      motivo_no_disponible: "En renta hasta hoy 17:30",
      badge: { texto: "Rentado", fondo: "#FFF1D6", color: "#7A4A00" },
    },
  ];

  const handleContinuar = () => {
    if (onContinuar) {
      onContinuar({
        vehiculoId: vehiculoSeleccionado,
        destino,
        salida,
        entrega,
      });
    } else {
      router.push("/contratos");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        height: "100%",
        minHeight: 844,
        margin: "0 auto",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        background: "#F6F2E8",
        color: "#1E1A16",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 16,
        overflow: "hidden",
      }}
    >
      <header style={{ padding: "16px 16px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "#6B645A" }}>
              NUEVO CONTRATO · PASO 2 DE 5
            </div>
            <h1
              style={{
                margin: "2px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 24,
                lineHeight: 1.15,
              }}
            >
              Vehículo y fechas
            </h1>
          </div>
        </div>
        <div
          role="img"
          aria-label="Paso 2 de 5"
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}
        >
          <span style={{ height: 6, borderRadius: 3, background: "#14583A" }} />
          <span style={{ height: 6, borderRadius: 3, background: "#B5141B" }} />
          <span style={{ height: 6, borderRadius: 3, background: "#CFC8B8" }} />
          <span style={{ height: 6, borderRadius: 3, background: "#CFC8B8" }} />
          <span style={{ height: 6, borderRadius: 3, background: "#CFC8B8" }} />
        </div>
      </header>

      <main
        style={{
          flex: 1,
          minHeight: 0,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 12,
            background: "#fff",
            border: "1px solid #E3DCCB",
            fontSize: 14,
          }}
        >
          <span style={{ color: "#6B645A" }}>Cliente</span>
          <b>
            {clienteNombre} · {clienteNumero}
          </b>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1px solid #E3DCCB",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 10 }}>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: "#4A443B",
              }}
            >
              Salida
              <input
                value={salida}
                onChange={(e) => setSalida(e.target.value)}
                style={{
                  height: 48,
                  border: "1px solid #CFC8B8",
                  borderRadius: 12,
                  padding: "0 12px",
                  font: "inherit",
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#1E1A16",
                  background: "#fff",
                }}
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                fontSize: 13,
                fontWeight: 600,
                color: "#4A443B",
              }}
            >
              Entrega prevista
              <input
                value={entrega}
                onChange={(e) => setEntrega(e.target.value)}
                style={{
                  height: 48,
                  border: "1px solid #CFC8B8",
                  borderRadius: 12,
                  padding: "0 12px",
                  font: "inherit",
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#1E1A16",
                  background: "#fff",
                }}
              />
            </label>
          </div>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 13,
              fontWeight: 600,
              color: "#4A443B",
            }}
          >
            Destino
            <input
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              style={{
                height: 48,
                border: "1px solid #CFC8B8",
                borderRadius: 12,
                padding: "0 12px",
                font: "inherit",
                fontSize: 16,
                fontWeight: 400,
                color: "#1E1A16",
                background: "#fff",
              }}
            />
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => setSalidaPais(!salidaPais)}
          >
            <div style={{ fontSize: 14 }}>
              <b>Salida del país</b>
              <div style={{ fontSize: 12, color: "#6B645A" }}>
                {salidaPais ? "Autorizada (con permiso)" : "No autorizada"}
              </div>
            </div>
            <span
              style={{
                flex: "none",
                width: 52,
                height: 30,
                borderRadius: 15,
                background: salidaPais ? "#14583A" : "#CFC8B8",
                padding: 3,
                boxSizing: "border-box",
                display: "inline-flex",
                transition: "background 0.2s ease",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: "#fff",
                  transform: salidaPais ? "translateX(22px)" : "translateX(0)",
                  transition: "transform 0.2s ease",
                }}
              />
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Vehículos</h2>
          <span style={{ fontSize: 12, color: "#6B645A" }}>2 libres · 2 no disponibles</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 16 }}>
          {vehiculos.map((v) => {
            const isSelected = vehiculoSeleccionado === v.id;
            if (!v.disponible) {
              return (
                <div
                  key={v.id}
                  style={{
                    padding: "10px 14px",
                    border: "1px dashed #CFC8B8",
                    borderRadius: 14,
                    background: "#FBF9F3",
                    minHeight: 60,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    color: "#6B645A",
                    boxSizing: "border-box",
                  }}
                >
                  <span>
                    <b style={{ fontSize: 15, display: "block", color: "#4A443B" }}>
                      {v.marca} {v.modelo}
                    </b>
                    <span style={{ fontSize: 13 }}>{v.motivo_no_disponible}</span>
                  </span>
                  {v.badge && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: v.badge.color,
                        background: v.badge.fondo,
                        padding: "2px 8px",
                        borderRadius: 10,
                      }}
                    >
                      {v.badge.texto}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <button
                key={v.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setVehiculoSeleccionado(v.id)}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  border: isSelected ? "2px solid #B5141B" : "1px solid #CFC8B8",
                  borderRadius: 14,
                  background: isSelected ? "#FBE9E7" : "#fff",
                  font: "inherit",
                  color: "#1E1A16",
                  minHeight: 60,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <span>
                  <b style={{ fontSize: 15, display: "block" }}>
                    {v.marca} {v.modelo}
                  </b>
                  <span style={{ fontSize: 13, color: "#4A443B" }}>
                    {v.placas} · {v.color}
                  </span>
                </span>
                <span style={{ textAlign: "right" }}>
                  <b style={{ fontSize: 15 }}>
                    ${(v.tarifa_dia / 100).toLocaleString("es-MX")}
                  </b>
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: "#14583A",
                      fontWeight: 700,
                    }}
                  >
                    Disponible
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <footer
        style={{
          flex: "none",
          padding: "12px 16px 16px",
          background: "#fff",
          borderTop: "1px solid #E3DCCB",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: "#6B645A",
            }}
          >
            ANTICIPO · 3 DÍAS × $1,633
          </div>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            $4,899
          </div>
        </div>
        <button
          type="button"
          onClick={handleContinuar}
          style={{
            flex: "none",
            height: 56,
            padding: "0 28px",
            borderRadius: 28,
            border: 0,
            background: "#B5141B",
            color: "#fff",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            boxSizing: "border-box",
          }}
        >
          Continuar
        </button>
      </footer>
    </div>
  );
}
