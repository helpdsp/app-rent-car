/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:32:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 12
 * @sprint_number 12
 * @task_id S12-T01
 * @description Pantalla Bitácora y exportaciones (Mockup 18) con descarga en vivo de CSV
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MRA_TOKENS, SidebarNav, SurfaceCard, StatusChip } from "@/components/ui";

interface ItemBitacora {
  id: string | number;
  fechaTexto: string;
  usuario: string;
  accionTexto: string;
  accionTipo: "Cambio" | "Consulta" | "Alta" | "Exportación" | "Baja";
  titulo: string;
  detalle: string;
}

const BITACORA_INICIAL: ItemBitacora[] = [
  {
    id: 1,
    fechaTexto: "16/11 13:20",
    usuario: "Sistema",
    accionTexto: "Cambio",
    accionTipo: "Cambio",
    titulo: "Contrato 08155",
    detalle: "estado: vigente → rezagado",
  },
  {
    id: 2,
    fechaTexto: "16/11 12:41",
    usuario: "Carolina M.",
    accionTexto: "Cambio",
    accionTipo: "Cambio",
    titulo: "Contrato D-00002",
    detalle: "tarifa pactada: $1,633 → $1,500 · motivo: cliente frecuente",
  },
  {
    id: 3,
    fechaTexto: "16/11 11:05",
    usuario: "Mariana R.",
    accionTexto: "Consulta",
    accionTipo: "Consulta",
    titulo: "Licencia de Ricardo Medina",
    detalle: "consultó el archivo del documento (dato sensible)",
  },
  {
    id: 4,
    fechaTexto: "16/11 10:58",
    usuario: "Mariana R.",
    accionTexto: "Alta",
    accionTipo: "Alta",
    titulo: "Fotos de entrega · 08158",
    detalle: "6 fotos y 1 video · kilometraje 72,640 km",
  },
  {
    id: 5,
    fechaTexto: "16/11 09:12",
    usuario: "Carolina M.",
    accionTexto: "Exportación",
    accionTipo: "Exportación",
    titulo: "Clientes · CSV",
    detalle: "127 filas · filtro: todos",
  },
  {
    id: 6,
    fechaTexto: "13/11 17:41",
    usuario: "Mariana R.",
    accionTexto: "Cambio",
    accionTipo: "Cambio",
    titulo: "Vehículo Mazda 3",
    detalle: "kilometraje: 31,480 → 33,120 (recepción)",
  },
];

export default function BitacoraPage() {
  const [filtroEntidad, setFiltroEntidad] = useState("Todos");
  const [filtroUsuario, setFiltroUsuario] = useState("Todos");
  const [filtroFechas, setFiltroFechas] = useState("10/11 – 16/11/2026");
  const [entidadExportar, setEntidadExportar] = useState<"clientes" | "vehiculos" | "contratos" | "documentos">("contratos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [cargando, setCargando] = useState(false);
  const [avisoExportacion, setAvisoExportacion] = useState<string | null>(null);
  const [errorExportacion, setErrorExportacion] = useState<string | null>(null);
  const [bitacoraItems, setBitacoraItems] = useState<ItemBitacora[]>(BITACORA_INICIAL);

  async function ejecutarExportacion() {
    setCargando(true);
    setErrorExportacion(null);
    setAvisoExportacion(null);

    try {
      const res = await fetch(`/api/exportaciones/${entidadExportar}?estado=${encodeURIComponent(filtroEstado)}`);
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Error ${res.status} al exportar.`);
      }

      const totalFilas = res.headers.get("X-Total-Filas") || "registros";
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mra_${entidadExportar}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setAvisoExportacion(
        `Exportación de ${entidadExportar} (${totalFilas} filas) descargada con éxito y registrada en la bitácora inmutable.`
      );

      // Agregar fila local en la vista
      setBitacoraItems((prev) => [
        {
          id: Date.now(),
          fechaTexto: "Ahora",
          usuario: "Usuario Actual",
          accionTexto: "Exportación",
          accionTipo: "Exportación",
          titulo: `${entidadExportar.toUpperCase()} · CSV`,
          detalle: `${totalFilas} filas · filtro: ${filtroEstado}`,
        },
        ...prev,
      ]);
    } catch (err: any) {
      setErrorExportacion(err.message || "Error al generar la exportación");
    } finally {
      setCargando(false);
    }
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
              Bitácora y exportaciones
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Administración"
            style={{ display: "flex", gap: 8 }}
          >
            <Link
              role="tab"
              aria-selected="false"
              href="/admin/tarifas"
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
              aria-selected="true"
              href="/admin/bitacora"
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
              Bitácora y exportaciones
            </Link>
          </div>
        </header>

        {avisoExportacion && (
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: "#E3F3EA",
              border: "1px solid #14583A",
              color: "#14583A",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ✓ {avisoExportacion}
          </div>
        )}

        {errorExportacion && (
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              background: "#FDEAEA",
              border: "1px solid #B5141B",
              color: "#B5141B",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            ✕ {errorExportacion}
          </div>
        )}

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 7fr) minmax(0, 4fr)",
            gap: 16,
          }}
        >
          {/* Panel Izquierdo: Bitácora de solo lectura */}
          <div
            style={{
              background: "#fff",
              border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Quién hizo qué y cuándo
              </h2>
              <span
                style={{ fontSize: 12, color: MRA_TOKENS.colors.textMuted }}
              >
                Solo lectura: nadie puede editarla ni borrarla
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr)",
                gap: 8,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Contrato, cliente o vehículo
                <input
                  value={filtroEntidad}
                  onChange={(e) => setFiltroEntidad(e.target.value)}
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 10,
                    padding: "0 12px",
                    font: "inherit",
                    fontSize: 14,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Usuario
                <input
                  value={filtroUsuario}
                  onChange={(e) => setFiltroUsuario(e.target.value)}
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 10,
                    padding: "0 12px",
                    font: "inherit",
                    fontSize: 14,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Fechas
                <input
                  value={filtroFechas}
                  onChange={(e) => setFiltroFechas(e.target.value)}
                  style={{
                    height: 40,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 10,
                    padding: "0 12px",
                    font: "inherit",
                    fontSize: 14,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "0.9fr 1fr 0.9fr minmax(0, 2fr)",
                gap: 8,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderCard}`,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: MRA_TOKENS.colors.textMuted,
              }}
            >
              <span>FECHA</span>
              <span>USUARIO</span>
              <span>ACCIÓN</span>
              <span>REGISTRO Y CAMBIO</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {bitacoraItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.9fr 1fr 0.9fr minmax(0, 2fr)",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                    fontSize: 13,
                    alignItems: "start",
                  }}
                >
                  <span style={{ color: MRA_TOKENS.colors.textSecondary }}>
                    {item.fechaTexto}
                  </span>
                  <span>{item.usuario}</span>
                  <span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        background:
                          item.accionTipo === "Alta"
                            ? "#E3F3EA"
                            : item.accionTipo === "Consulta"
                            ? "#FFF1D6"
                            : item.accionTipo === "Exportación"
                            ? "#EFEAE0"
                            : "#E8EEF7",
                        color:
                          item.accionTipo === "Alta"
                            ? "#14583A"
                            : item.accionTipo === "Consulta"
                            ? "#7A4A00"
                            : item.accionTipo === "Exportación"
                            ? "#4A443B"
                            : "#1F3A63",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {item.accionTexto}
                    </span>
                  </span>
                  <span>
                    <b>{item.titulo}</b>
                    <span
                      style={{
                        display: "block",
                        fontSize: 12,
                        color: MRA_TOKENS.colors.textMuted,
                      }}
                    >
                      {item.detalle}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                fontSize: 12,
                color: MRA_TOKENS.colors.textMuted,
              }}
            >
              Mostrando {bitacoraItems.length} movimientos en el periodo
            </div>
          </div>

          {/* Panel Derecho: Exportar a CSV (Mockup 18) */}
          <aside
            aria-label="Exportaciones"
            style={{
              background: "#fff",
              border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
              borderRadius: 16,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Exportar a CSV
            </h2>

            <div
              role="group"
              aria-label="Qué exportar"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                gap: 8,
              }}
            >
              {(
                [
                  { id: "clientes", label: "Clientes" },
                  { id: "vehiculos", label: "Vehículos" },
                  { id: "contratos", label: "Contratos" },
                  { id: "documentos", label: "Documentos" },
                ] as const
              ).map((tipo) => {
                const activo = entidadExportar === tipo.id;
                return (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => setEntidadExportar(tipo.id)}
                    aria-pressed={activo}
                    style={{
                      height: 48,
                      border: activo
                        ? `2px solid ${MRA_TOKENS.colors.brandRed}`
                        : `1px solid ${MRA_TOKENS.colors.borderInput}`,
                      borderRadius: 12,
                      background: activo ? "#FBE9E7" : "#fff",
                      font: "inherit",
                      fontSize: 14,
                      fontWeight: activo ? 700 : 600,
                      color: MRA_TOKENS.colors.ink,
                      cursor: "pointer",
                    }}
                  >
                    {tipo.label}
                  </button>
                );
              })}
            </div>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                fontSize: 12,
                fontWeight: 600,
                color: MRA_TOKENS.colors.textSecondary,
              }}
            >
              Fechas
              <input
                defaultValue="01/11 – 16/11/2026"
                style={{
                  height: 44,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  font: "inherit",
                  fontSize: 14,
                  background: "#fff",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                fontSize: 12,
                fontWeight: 600,
                color: MRA_TOKENS.colors.textSecondary,
              }}
            >
              Estado
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                style={{
                  height: 44,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 10,
                  padding: "0 12px",
                  font: "inherit",
                  fontSize: 14,
                  background: "#fff",
                }}
              >
                <option value="Todos">Todos</option>
                <option value="vigente">Vigente</option>
                <option value="concluido">Concluido</option>
                <option value="cancelado">Cancelado</option>
                <option value="disponible">Disponible</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </label>

            <button
              type="button"
              disabled={cargando}
              onClick={ejecutarExportacion}
              style={{
                height: 52,
                borderRadius: 26,
                border: 0,
                background: cargando ? "#CCC" : MRA_TOKENS.colors.brandRed,
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: cargando ? "wait" : "pointer",
              }}
            >
              {cargando ? "Generando CSV..." : `Exportar ${entidadExportar}`}
            </button>

            <div
              style={{
                fontSize: 12,
                color: MRA_TOKENS.colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              Cada exportación queda en la bitácora con quién la pidió y cuántas
              filas incluyó. Solo administrador y titular pueden exportar.
            </div>

            <div
              style={{
                marginTop: "auto",
                borderTop: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                paddingTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 6,
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
                ÚLTIMAS EXPORTACIONES
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span>Clientes · Carolina M.</span>
                <span style={{ color: MRA_TOKENS.colors.textMuted }}>
                  hoy 09:12
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                }}
              >
                <span>Contratos · Titular</span>
                <span style={{ color: MRA_TOKENS.colors.textMuted }}>
                  13/11 18:25
                </span>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
