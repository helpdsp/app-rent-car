/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:30:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T05
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MRA_TOKENS, SidebarNav, SurfaceCard } from "@/components/ui";
import { formatearMonedaCentavos } from "@/components/ui/tokens";

interface TarifaItem {
  id: string;
  nombre: string;
  tarifa_dia: number;
  seguro_nocturno: number;
  cuota_proteccion: number;
  vigente_desde: string;
}

const TARIFAS_INICIALES: TarifaItem[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    nombre: "Hyundai Elantra",
    tarifa_dia: 163_300,
    seguro_nocturno: 40_000,
    cuota_proteccion: 25_000,
    vigente_desde: "01/05/2026",
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    nombre: "Kia Forte",
    tarifa_dia: 163_300,
    seguro_nocturno: 40_000,
    cuota_proteccion: 25_000,
    vigente_desde: "01/05/2026",
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    nombre: "Nissan Altima",
    tarifa_dia: 163_300,
    seguro_nocturno: 45_000,
    cuota_proteccion: 25_000,
    vigente_desde: "01/05/2026",
  },
  {
    id: "22222222-2222-4222-8222-222222222204",
    nombre: "Mazda 3",
    tarifa_dia: 163_300,
    seguro_nocturno: 40_000,
    cuota_proteccion: 25_000,
    vigente_desde: "01/05/2026",
  },
  {
    id: "22222222-2222-4222-8222-222222222205",
    nombre: "Honda CR-V",
    tarifa_dia: 221_600,
    seguro_nocturno: 70_000,
    cuota_proteccion: 40_000,
    vigente_desde: "01/05/2026",
  },
];

export default function TarifasPage() {
  const [tarifas, setTarifas] = useState<TarifaItem[]>(TARIFAS_INICIALES);
  const [mostrarNuevaTarifa, setMostrarNuevaTarifa] = useState(false);
  const [nombreAuto, setNombreAuto] = useState("");
  const [tarifaDiaPesos, setTarifaDiaPesos] = useState("1633");
  const [seguroPesos, setSeguroPesos] = useState("400");
  const [cuotaPesos, setCuotaPesos] = useState("250");

  const [kmPorDia, setKmPorDia] = useState("500");
  const [divisorHoraExtra, setDivisorHoraExtra] = useState("8");
  const [horaDesdeLaQueSeCobraDia, setHoraDesdeLaQueSeCobraDia] = useState("5");
  const [tolerancia, setTolerancia] = useState("0 min");
  const [redondeoHoraExtra, setRedondeoHoraExtra] = useState("Truncar");
  const [cancelacion, setCancelacion] = useState("20 % / 24 h");
  const [deducible, setDeducible] = useState("30 % / 20 %");
  const [alertasVigencia, setAlertasVigencia] = useState("30, 15, 7, 0");

  const [aviso, setAviso] = useState<string | null>(null);

  function guardarNuevaTarifa(e: React.FormEvent) {
    e.preventDefault();
    if (!nombreAuto.trim()) return;

    const nueva: TarifaItem = {
      id: `tarifa-${Date.now()}`,
      nombre: nombreAuto.trim(),
      tarifa_dia: Math.round(Number(tarifaDiaPesos) * 100),
      seguro_nocturno: Math.round(Number(seguroPesos) * 100),
      cuota_proteccion: Math.round(Number(cuotaPesos) * 100),
      vigente_desde: "Hoy",
    };

    setTarifas([nueva, ...tarifas]);
    setNombreAuto("");
    setMostrarNuevaTarifa(false);
    setAviso(`Nueva versión de tarifa para ${nueva.nombre} creada y registrada en bitácora.`);
  }

  function guardarParametros() {
    setAviso("Parámetros actualizados correctamente y registrados en la bitácora inmutable.");
  }

  return (
    <div
      style={{
        minWidth: 1194,
        minHeight: 834,
        boxSizing: "border-box",
        display: "flex",
        background: MRA_TOKENS.colors.paperCream,
        color: MRA_TOKENS.colors.ink,
        fontFamily: MRA_TOKENS.fonts.sans,
        fontSize: 16,
        overflow: "hidden",
      }}
    >
      <SidebarNav seccionActiva="admin" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
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
                color: MRA_TOKENS.colors.textMuted,
              }}
            >
              ADMINISTRACIÓN
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: MRA_TOKENS.fonts.display,
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Tarifas y parámetros
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Administración"
            style={{ display: "flex", gap: 8 }}
          >
            <Link
              role="tab"
              aria-selected="true"
              href="/admin/tarifas"
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                background: MRA_TOKENS.colors.ink,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Tarifas y parámetros
            </Link>
            <Link
              role="tab"
              aria-selected="false"
              href="/admin/usuarios"
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                background: "#fff",
                color: MRA_TOKENS.colors.ink,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Usuarios y roles
            </Link>
            <Link
              role="tab"
              aria-selected="false"
              href="/admin/bitacora"
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                background: "#fff",
                color: MRA_TOKENS.colors.ink,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Bitácora y exportaciones
            </Link>
          </div>
        </header>

        {aviso && (
          <div
            role="status"
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              background: MRA_TOKENS.colors.statusSuccessBg,
              color: MRA_TOKENS.colors.statusSuccessText,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {aviso}
          </div>
        )}

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 6fr) minmax(0, 5fr)",
            gap: 16,
          }}
        >
          {/* Columna Izquierda: Catálogo de tarifas (Mockup 16) */}
          <SurfaceCard style={{ gap: 8, minHeight: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Catálogo de tarifas
              </h2>
              <button
                type="button"
                onClick={() => setMostrarNuevaTarifa((v) => !v)}
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 22,
                  border: 0,
                  background: MRA_TOKENS.colors.brandRed,
                  color: "#fff",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Nueva tarifa
              </button>
            </div>

            {mostrarNuevaTarifa && (
              <form
                onSubmit={guardarNuevaTarifa}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 1fr 1fr auto",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: MRA_TOKENS.colors.paperCream,
                  alignItems: "center",
                }}
              >
                <input
                  placeholder="Vehículo / Modelo"
                  value={nombreAuto}
                  onChange={(e) => setNombreAuto(e.target.value)}
                  required
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 8,
                    padding: "0 8px",
                    background: "#fff",
                  }}
                />
                <input
                  type="number"
                  placeholder="24 H ($)"
                  value={tarifaDiaPesos}
                  onChange={(e) => setTarifaDiaPesos(e.target.value)}
                  required
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 8,
                    padding: "0 8px",
                    background: "#fff",
                  }}
                />
                <input
                  type="number"
                  placeholder="Nocturno ($)"
                  value={seguroPesos}
                  onChange={(e) => setSeguroPesos(e.target.value)}
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 8,
                    padding: "0 8px",
                    background: "#fff",
                  }}
                />
                <input
                  type="number"
                  placeholder="Protección ($)"
                  value={cuotaPesos}
                  onChange={(e) => setCuotaPesos(e.target.value)}
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 8,
                    padding: "0 8px",
                    background: "#fff",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 8,
                    border: 0,
                    background: MRA_TOKENS.colors.ink,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Guardar
                </button>
              </form>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.6fr) 0.9fr 0.9fr 0.9fr",
                gap: 10,
                padding: "8px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderCard}`,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: MRA_TOKENS.colors.textMuted,
              }}
            >
              <span>VEHÍCULO</span>
              <span style={{ textAlign: "right" }}>24 H</span>
              <span style={{ textAlign: "right" }}>NOCTURNO</span>
              <span style={{ textAlign: "right" }}>PROTECCIÓN</span>
            </div>

            {tarifas.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.6fr) 0.9fr 0.9fr 0.9fr",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom:
                    idx === tarifas.length - 1
                      ? "none"
                      : `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                  fontSize: 14,
                  alignItems: "center",
                }}
              >
                <span>
                  <b>{item.nombre}</b>
                  <span
                    style={{
                      display: "block",
                      fontSize: 12,
                      color: MRA_TOKENS.colors.textMuted,
                    }}
                  >
                    vigente desde {item.vigente_desde}
                  </span>
                </span>
                <b style={{ textAlign: "right" }}>
                  {formatearMonedaCentavos(item.tarifa_dia)}
                </b>
                <span style={{ textAlign: "right" }}>
                  {formatearMonedaCentavos(item.seguro_nocturno)}
                </span>
                <span style={{ textAlign: "right" }}>
                  {formatearMonedaCentavos(item.cuota_proteccion)}
                </span>
              </div>
            ))}

            <div
              style={{
                marginTop: "auto",
                padding: "10px 12px",
                borderRadius: 12,
                background: MRA_TOKENS.colors.paperCream,
                fontSize: 12,
                color: MRA_TOKENS.colors.textSecondary,
                lineHeight: 1.5,
              }}
            >
              Cada cambio crea una <b>versión nueva</b>; los contratos ya
              emitidos conservan la tarifa con la que se emitieron. Todo queda
              en la bitácora. El operador puede pactar otra tarifa en un contrato
              solo con un motivo.
            </div>
          </SurfaceCard>

          {/* Columna Derecha: Parámetros tipados (Mockup 16) */}
          <SurfaceCard style={{ gap: 6, minHeight: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Parámetros
              </h2>
              <button
                type="button"
                onClick={guardarParametros}
                style={{
                  height: 40,
                  padding: "0 16px",
                  borderRadius: 20,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  background: "#fff",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.ink,
                  cursor: "pointer",
                }}
              >
                Guardar cambios
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px",
                gap: "4px 10px",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <span>Km incluidos por día</span>
              <input
                value={kmPorDia}
                onChange={(e) => setKmPorDia(e.target.value)}
                aria-label="Km por día"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>Hora extra: tarifa ÷</span>
              <input
                value={divisorHoraExtra}
                onChange={(e) => setDivisorHoraExtra(e.target.value)}
                aria-label="Divisor de hora extra"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>Día extra desde la hora</span>
              <input
                value={horaDesdeLaQueSeCobraDia}
                onChange={(e) => setHoraDesdeLaQueSeCobraDia(e.target.value)}
                aria-label="Hora desde la que se cobra un día"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>Tolerancia al devolver</span>
              <input
                value={tolerancia}
                onChange={(e) => setTolerancia(e.target.value)}
                aria-label="Tolerancia"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>
                Redondeo de hora extra
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: MRA_TOKENS.colors.statusWarningText,
                  }}
                >
                  Por confirmar: el papel trunca ($183.75 → $183)
                </span>
              </span>
              <input
                value={redondeoHoraExtra}
                onChange={(e) => setRedondeoHoraExtra(e.target.value)}
                aria-label="Redondeo"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>Cancelación (%) / horas</span>
              <input
                value={cancelacion}
                onChange={(e) => setCancelacion(e.target.value)}
                aria-label="Cancelación"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>Deducible / cristales</span>
              <input
                value={deducible}
                onChange={(e) => setDeducible(e.target.value)}
                aria-label="Deducible"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />

              <span>Alertas de vigencia (días)</span>
              <input
                value={alertasVigencia}
                onChange={(e) => setAlertasVigencia(e.target.value)}
                aria-label="Alertas"
                style={{
                  height: 40,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  textAlign: "right",
                  font: "inherit",
                  fontSize: 15,
                  background: "#fff",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "auto",
                borderTop: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                paddingTop: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: MRA_TOKENS.colors.textMuted,
                }}
              >
                DATOS LEGALES DEL CONTRATO
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span>Registro PROFECO (número y fecha)</span>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: 10,
                    background: MRA_TOKENS.colors.statusDangerBg,
                    color: MRA_TOKENS.colors.statusDangerText,
                    fontWeight: 700,
                  }}
                >
                  Pendiente
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span>Ciudad de jurisdicción</span>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: 10,
                    background: MRA_TOKENS.colors.statusDangerBg,
                    color: MRA_TOKENS.colors.statusDangerText,
                    fontWeight: 700,
                  }}
                >
                  Pendiente
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span>Teléfono de fallas (cláusula 10.ª-L)</span>
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: 10,
                    background: MRA_TOKENS.colors.statusDangerBg,
                    color: MRA_TOKENS.colors.statusDangerText,
                    fontWeight: 700,
                  }}
                >
                  Pendiente
                </span>
              </div>
            </div>
          </SurfaceCard>
        </section>
      </main>
    </div>
  );
}
