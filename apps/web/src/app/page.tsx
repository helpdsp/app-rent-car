/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:00:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T05, S05-T06, S05-T07
 */

"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/ui";
import { TableroMovil } from "@/components/tablero/TableroMovil";
import { obtenerTodasLasAlertas } from "@/lib/alertas/revisar";

interface ResultadoBusqueda {
  clientes: Array<{ id: string; numero: number; nombre: string; telefono?: string }>;
  vehiculos: Array<{ id: string; clave: string; marca: string; modelo: string; placas: string; estado: string }>;
  contratos: Array<{ id: string; folio: string; cliente_nombre: string; vehiculo: string; estado: string }>;
}

function TableroContenido() {
  const [esMovil, setEsMovil] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<ResultadoBusqueda | null>(null);
  const [buscando, setBuscando] = useState(false);

  const alertas = obtenerTodasLasAlertas({ estado: "pendiente" });

  useEffect(() => {
    function verificarAncho() {
      setEsMovil(window.innerWidth <= 768);
    }
    verificarAncho();
    window.addEventListener("resize", verificarAncho);
    return () => window.removeEventListener("resize", verificarAncho);
  }, []);

  const handleBuscar = async (termino: string) => {
    setBusqueda(termino);
    if (!termino.trim()) {
      setResultados(null);
      return;
    }

    setBuscando(true);
    try {
      const res = await fetch(`/api/busqueda?q=${encodeURIComponent(termino)}`);
      if (res.ok) {
        const json = await res.json();
        setResultados(json.data);
      }
    } catch {
      // Ignorar error de red en búsqueda en vivo
    } finally {
      setBuscando(false);
    }
  };

  if (esMovil) {
    return (
      <TableroMovil
        conteoAlertas={alertas.length}
        onBuscar={(q) => handleBuscar(q)}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        background: "#F6F2E8",
        color: "#1E1A16",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "16px",
      }}
    >
      <SidebarNav seccionActiva="tablero" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "22px",
        }}
      >
        {/* Header estilo Mockup 1 */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#6B645A",
              }}
            >
              LUNES 16 DE NOVIEMBRE · MEXICALI
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "36px",
                lineHeight: 1.1,
              }}
            >
              Tablero
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
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
                width: "320px",
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
                placeholder="Buscar cliente, folio o placas"
                value={busqueda}
                onChange={(e) => handleBuscar(e.target.value)}
                style={{
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  font: "inherit",
                  fontSize: "15px",
                  width: "100%",
                  color: "#1E1A16",
                }}
              />
            </label>

            {/* Menú desplegable de resultados de búsqueda global */}
            {resultados && busqueda.trim() !== "" && (
              <div
                style={{
                  position: "absolute",
                  top: "54px",
                  left: 0,
                  width: "360px",
                  background: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  border: "1px solid #E3DCCB",
                  zIndex: 50,
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#6B645A", letterSpacing: "0.05em" }}>
                  RESULTADOS DE BÚSQUEDA GLOBAL
                </div>

                {resultados.clientes.length === 0 &&
                  resultados.vehiculos.length === 0 &&
                  resultados.contratos.length === 0 && (
                    <div style={{ fontSize: "13px", color: "#6B645A", padding: "8px 0" }}>
                      No se encontraron coincidencias para &quot;{busqueda}&quot;
                    </div>
                  )}

                {resultados.clientes.length > 0 && (
                  <div>
                    <b style={{ fontSize: "12px", color: "#B5141B" }}>Clientes</b>
                    {resultados.clientes.map((c) => (
                      <Link
                        key={c.id}
                        href={`/clientes/${c.id}`}
                        style={{
                          display: "block",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#1E1A16",
                          textDecoration: "none",
                        }}
                      >
                        {c.nombre} <span style={{ color: "#6B645A" }}>· #{c.numero}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {resultados.vehiculos.length > 0 && (
                  <div>
                    <b style={{ fontSize: "12px", color: "#B5141B" }}>Vehículos</b>
                    {resultados.vehiculos.map((v) => (
                      <Link
                        key={v.id}
                        href={`/vehiculos/${v.id}`}
                        style={{
                          display: "block",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#1E1A16",
                          textDecoration: "none",
                        }}
                      >
                        {v.marca} {v.modelo}{" "}
                        <span style={{ color: "#6B645A" }}>
                          · {v.placas} ({v.clave})
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {resultados.contratos.length > 0 && (
                  <div>
                    <b style={{ fontSize: "12px", color: "#B5141B" }}>Contratos</b>
                    {resultados.contratos.map((con) => (
                      <Link
                        key={con.id}
                        href="/contratos"
                        style={{
                          display: "block",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          color: "#1E1A16",
                          textDecoration: "none",
                        }}
                      >
                        Folio {con.folio}{" "}
                        <span style={{ color: "#6B645A" }}>· {con.cliente_nombre}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                height: "48px",
                padding: "0 16px",
                borderRadius: "24px",
                background: "#fff",
                border: "1px solid #E3DCCB",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: 600,
                boxSizing: "border-box",
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "14px",
                  background: "#1E1A16",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                OP
              </span>
              Operador
            </div>
          </div>
        </header>

        {/* Sección Resumen: 4 cuadrículas */}
        <section
          aria-label="Resumen"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6B645A", fontWeight: 500 }}>En renta</div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "40px",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              6
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6B645A", fontWeight: 500 }}>Disponibles</div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "40px",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              4 <span style={{ fontSize: "18px", color: "#6B645A", fontWeight: 500 }}>de 10</span>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#6B645A", fontWeight: 500 }}>Vencen hoy</div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "40px",
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              2
            </div>
          </div>

          <div
            style={{
              background: "#FBE9E7",
              border: "1px solid #F0C4BF",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#8E1016", fontWeight: 600 }}>Rezagados</div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "40px",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#8E1016",
              }}
            >
              1
            </div>
          </div>
        </section>

        {/* Acciones rápidas (4 botones) */}
        <section
          aria-label="Acciones rápidas"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <Link
            href="/contratos"
            style={{
              minHeight: "88px",
              borderRadius: "16px",
              background: "#B5141B",
              color: "#fff",
              textDecoration: "none",
              padding: "14px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: 700 }}>Nuevo contrato</span>
            <span style={{ fontSize: "14px", opacity: 0.92 }}>Cliente, vehículo y fechas</span>
          </Link>

          <Link
            href="/contratos"
            style={{
              minHeight: "88px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #E3DCCB",
              color: "#1E1A16",
              textDecoration: "none",
              padding: "14px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: 700 }}>Entregar vehículo</span>
            <span style={{ fontSize: "14px", color: "#6B645A" }}>1 contrato por entregar</span>
          </Link>

          <Link
            href="/contratos"
            style={{
              minHeight: "88px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #E3DCCB",
              color: "#1E1A16",
              textDecoration: "none",
              padding: "14px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: 700 }}>Recibir vehículo</span>
            <span style={{ fontSize: "14px", color: "#6B645A" }}>3 regresan hoy</span>
          </Link>

          <Link
            href="/clientes"
            style={{
              minHeight: "88px",
              borderRadius: "16px",
              background: "#fff",
              border: "1px solid #E3DCCB",
              color: "#1E1A16",
              textDecoration: "none",
              padding: "14px 20px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: 700 }}>Nuevo cliente</span>
            <span style={{ fontSize: "14px", color: "#6B645A" }}>Credencial y licencia</span>
          </Link>
        </section>

        {/* Sección Atención: 3 columnas */}
        <section
          aria-label="Atención"
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          {/* Columna 1: Documentos por vencer */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>Documentos por vencer</h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #EFE9DB",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Tarjeta de circulación</div>
                <div style={{ fontSize: "14px", color: "#6B645A" }}>Honda CR-V · Negra</div>
              </div>
              <span
                style={{
                  flex: "none",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: "#FBE9E7",
                  color: "#8E1016",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Hoy
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #EFE9DB",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Licencia de conducir</div>
                <div style={{ fontSize: "14px", color: "#6B645A" }}>Ricardo Medina Salazar</div>
              </div>
              <span
                style={{
                  flex: "none",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: "#FFF1D6",
                  color: "#7A4A00",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                7 días
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #EFE9DB",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Póliza de seguro</div>
                <div style={{ fontSize: "14px", color: "#6B645A" }}>Kia Forte · BNB-791-A</div>
              </div>
              <span
                style={{
                  flex: "none",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: "#FFF1D6",
                  color: "#7A4A00",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                12 días
              </span>
            </div>
          </div>

          {/* Columna 2: Vencen hoy */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700 }}>Vencen hoy</h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #EFE9DB",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Folio 08158 · 11:00</div>
                <div style={{ fontSize: "14px", color: "#6B645A" }}>Nissan Sentra · Laura Ibarra</div>
              </div>
              <Link
                href="/contratos"
                style={{
                  flex: "none",
                  minHeight: "44px",
                  padding: "0 16px",
                  borderRadius: "22px",
                  background: "#1E1A16",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                Recibir
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                paddingTop: "10px",
                borderTop: "1px solid #EFE9DB",
              }}
            >
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Folio 08160 · 17:30</div>
                <div style={{ fontSize: "14px", color: "#6B645A" }}>Kia Forte · Ricardo Medina</div>
              </div>
              <Link
                href="/contratos"
                style={{
                  flex: "none",
                  minHeight: "44px",
                  padding: "0 16px",
                  borderRadius: "22px",
                  background: "#1E1A16",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                Recibir
              </Link>
            </div>
          </div>

          {/* Columna 3: Rezagados */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #F0C4BF",
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#8E1016" }}>
              Rezagados
            </h2>

            <div
              style={{
                paddingTop: "10px",
                borderTop: "1px solid #F6DAD6",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <div style={{ fontSize: "15px", fontWeight: 600 }}>Folio 08155 · Mazda 3</div>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#8E1016" }}>
                  2 h 20 min tarde
                </span>
              </div>
              <div style={{ fontSize: "14px", color: "#6B645A" }}>
                Andrés Cota · cargo acumulado por retraso
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#8E1016",
                }}
              >
                $612
              </div>
              <div style={{ fontSize: "13px", color: "#6B645A" }}>
                3 horas × $204 (cada hora o fracción)
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Cargando tablero...</div>}>
      <TableroContenido />
    </Suspense>
  );
}
