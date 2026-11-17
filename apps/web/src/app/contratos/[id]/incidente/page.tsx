/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T13:00:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T02
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";
import { type TipoIncidente } from "@/lib/contratos/incidentes";

const TIPOS_INCIDENTE: Array<{ id: TipoIncidente; etiqueta: string }> = [
  { id: "accidente", etiqueta: "Accidente" },
  { id: "robo", etiqueta: "Robo" },
  { id: "falla_mecanica", etiqueta: "Falla mecánica" },
  { id: "perdida_llaves", etiqueta: "Pérdida de llaves" },
  { id: "retencion_indebida", etiqueta: "Retención indebida" },
  { id: "otro", etiqueta: "Otro" },
];

function IncidenteContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777000";

  const [folio, setFolio] = useState("08158");
  const [vehiculoInfo, setVehiculoInfo] = useState("Nissan Sentra · Laura Ibarra");
  const [tipo, setTipo] = useState<TipoIncidente>("accidente");

  // Fechas (Mockup 12: ocurrió el 15/11 21:40, se avisó el 16/11 09:10 -> aviso tardío)
  const [ocurridoEn, setOcurridoEn] = useState("2026-11-15T21:40");
  const [avisadoEn, setAvisadoEn] = useState("2026-11-16T09:10");

  const [descripcion, setDescripcion] = useState(
    "Choque leve al estacionarse en Calzada de las Américas. Daño en defensa trasera y farola derecha. Sin lesionados."
  );
  const [cargoCliente, setCargoCliente] = useState(0);
  const [folioSiniestro, setFolioSiniestro] = useState("Folio pendiente");

  const [guardando, setGuardando] = useState(false);
  const [guardadoExito, setGuardadoExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detección de aviso tardío (T-68)
  const fechaOcurrido = ocurridoEn.split("T")[0]!;
  const fechaAvisado = avisadoEn.split("T")[0]!;
  const esAvisoTardio = fechaAvisado > fechaOcurrido;

  useEffect(() => {
    fetch(`/api/contratos/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contrato) {
          if (data.contrato.folio) setFolio(data.contrato.folio);
          setVehiculoInfo(`${data.contrato.vehiculo_descripcion} · ${data.contrato.cliente_nombre}`);
        }
      })
      .catch(() => {});
  }, [id]);

  const handleGuardar = async () => {
    setErrorMsg(null);
    setGuardando(true);

    try {
      const res = await fetch(`/api/contratos/${id}/incidente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo,
          ocurrido_en: new Date(ocurridoEn).toISOString(),
          avisado_en: new Date(avisadoEn).toISOString(),
          descripcion,
          cargo_cliente: cargoCliente * 100,
          aseguradora_referencia: folioSiniestro,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Error al registrar el incidente.");
        setGuardando(false);
        return;
      }

      setGuardadoExito(true);
      setGuardando(false);
    } catch (e) {
      setErrorMsg((e as Error).message);
      setGuardando(false);
    }
  };

  return (
    <div
      style={{
        width: 1194,
        height: 834,
        boxSizing: "border-box",
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
          overflowY: "auto",
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
            <Link
              href="/contratos"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#B5141B",
                textDecoration: "none",
              }}
            >
              ← Contrato {folio}
            </Link>
            <h1
              style={{
                margin: "6px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Registrar incidente
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            {vehiculoInfo}
            <br />
            <b style={{ color: "#1E1A16" }}>Vigente · 13/11 → 16/11</b>
          </div>
        </header>

        {errorMsg && (
          <div
            role="alert"
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              background: "#FCE8E6",
              border: "1px solid #D93025",
              color: "#C5221F",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {errorMsg}
          </div>
        )}

        {guardadoExito && (
          <div
            style={{
              padding: "14px 18px",
              borderRadius: 12,
              background: "#E6F4EA",
              border: "1px solid #137333",
              color: "#137333",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>✓ Incidente guardado. El contrato está marcado como &apos;en incidente&apos;.</span>
            <Link
              href="/contratos"
              style={{
                padding: "6px 14px",
                background: "#137333",
                color: "#fff",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Ver contratos
            </Link>
          </div>
        )}

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 6fr) minmax(0, 4fr)",
            gap: 16,
          }}
        >
          {/* Columna Izquierda */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            {/* 1. Tipo y fechas */}
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
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Tipo y fechas</h2>

              <div
                role="group"
                aria-label="Tipo de incidente"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 8,
                }}
              >
                {TIPOS_INCIDENTE.map((t) => {
                  const seleccionado = tipo === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTipo(t.id)}
                      aria-pressed={seleccionado}
                      style={{
                        height: 48,
                        border: seleccionado ? "2px solid #B5141B" : "1px solid #CFC8B8",
                        borderRadius: 12,
                        background: seleccionado ? "#FBE9E7" : "#fff",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: seleccionado ? 700 : 600,
                        color: "#1E1A16",
                        cursor: "pointer",
                      }}
                    >
                      {t.etiqueta}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                  Ocurrió el
                  <input
                    type="datetime-local"
                    value={ocurridoEn}
                    onChange={(e) => setOcurridoEn(e.target.value)}
                    style={{
                      height: 48,
                      border: "1px solid #CFC8B8",
                      borderRadius: 12,
                      padding: "0 14px",
                      font: "inherit",
                      fontSize: 15,
                    }}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                  Se avisó el
                  <input
                    type="datetime-local"
                    value={avisadoEn}
                    onChange={(e) => setAvisadoEn(e.target.value)}
                    style={{
                      height: 48,
                      border: "1px solid #CFC8B8",
                      borderRadius: 12,
                      padding: "0 14px",
                      font: "inherit",
                      fontSize: 15,
                    }}
                  />
                </label>
              </div>

              {/* Aviso tardío banner (T-68, Mockup 12) */}
              {esAvisoTardio && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "#FFF1D6",
                    color: "#7A4A00",
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  <b style={{ flex: "none" }}>Aviso tardío.</b>
                  <span>
                    El aviso debió darse el mismo día del hecho (cláusula 12.ª). El retraso se considera incumplimiento y queda marcado en el expediente (T-68).
                  </span>
                </div>
              )}

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                Descripción
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  style={{
                    border: "1px solid #CFC8B8",
                    borderRadius: 12,
                    padding: "10px 14px",
                    font: "inherit",
                    fontSize: 15,
                    resize: "none",
                  }}
                />
              </label>
            </div>

            {/* 2. Evidencias */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flex: 1,
                minHeight: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Evidencias</h2>
                <span style={{ fontSize: 13, color: "#6B645A" }}>4 fotos · 1 documento</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8 }}>
                {["Foto 1", "Foto 2", "Foto 3", "Foto 4"].map((f, i) => (
                  <div
                    key={i}
                    style={{
                      height: 64,
                      borderRadius: 10,
                      background: "#E8E1CF",
                      color: "#4A443B",
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {f}
                  </div>
                ))}
                <button
                  type="button"
                  style={{
                    height: 64,
                    border: "2px dashed #B0A793",
                    borderRadius: 10,
                    background: "#FBF9F3",
                    font: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#4A443B",
                    cursor: "pointer",
                  }}
                >
                  + Foto
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "10px 14px",
                  border: "1px solid #E3DCCB",
                  borderRadius: 12,
                  fontSize: 14,
                }}
              >
                <span>
                  <b>Reporte de la aseguradora</b>
                  <span style={{ display: "block", fontSize: 12, color: "#6B645A" }}>
                    PDF · subido hoy
                  </span>
                </span>
                <button
                  type="button"
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 20,
                    border: "1px dashed #B0A793",
                    background: "#FBF9F3",
                    font: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  + Avalúo
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Aside Cargos y responsabilidad */}
          <aside
            aria-label="Efecto en el contrato"
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: 16,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 0,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cargos y responsabilidad</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "6px 12px",
                fontSize: 14,
                alignItems: "baseline",
              }}
            >
              <span style={{ color: "#6B645A" }}>Deducible por accidente</span>
              <b>30 %</b>
              <span style={{ color: "#6B645A" }}>Valor asegurado</span>
              <b>$280,000</b>
              <span style={{ color: "#6B645A" }}>Deducible máximo</span>
              <b>$84,000</b>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
              Cargo al cliente
              <input
                type="number"
                value={cargoCliente}
                onChange={(e) => setCargoCliente(Number(e.target.value))}
                style={{
                  height: 48,
                  border: "1px solid #CFC8B8",
                  borderRadius: 12,
                  padding: "0 14px",
                  font: "inherit",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
              Siniestro con la aseguradora
              <input
                type="text"
                value={folioSiniestro}
                onChange={(e) => setFolioSiniestro(e.target.value)}
                style={{
                  height: 48,
                  border: "1px solid #CFC8B8",
                  borderRadius: 12,
                  padding: "0 14px",
                  font: "inherit",
                  fontSize: 16,
                }}
              />
            </label>

            <div
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: "#F6F2E8",
                fontSize: 13,
                color: "#4A443B",
                lineHeight: 1.4,
              }}
            >
              Para una <b>falla mecánica</b> aquí se registra la unidad sustituta y la bonificación del tiempo sin uso (cláusula 17.ª).
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#FBE9E7",
                  color: "#8E1016",
                  fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                <b>Contrato en incidente.</b> No podrá concluirse hasta cerrar el incidente (T-69).
              </div>

              <button
                type="button"
                onClick={handleGuardar}
                disabled={guardando}
                style={{
                  height: 56,
                  borderRadius: 28,
                  background: guardando ? "#8A8478" : "#B5141B",
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: 700,
                  border: "none",
                  cursor: guardando ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {guardando ? "Guardando..." : "Guardar incidente"}
              </button>

              <Link
                href="/contratos"
                style={{
                  height: 48,
                  borderRadius: 24,
                  border: "1px solid #CFC8B8",
                  background: "#fff",
                  color: "#1E1A16",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Cancelar
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default function IncidentePage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando incidente...</div>}>
      <IncidenteContent />
    </Suspense>
  );
}
