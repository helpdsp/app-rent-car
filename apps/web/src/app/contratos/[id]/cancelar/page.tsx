/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T13:10:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T06
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";

function CancelarContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777000";

  const [folio, setFolio] = useState("D-00002");
  const [vehiculoInfo, setVehiculoInfo] = useState("Nissan Altima · Sofía Rivas");
  const [salidaEn, setSalidaEn] = useState("18/11 11:00");
  const [estadoContrato, setEstadoContrato] = useState("por_firmar");

  const [motivo, setMotivo] = useState("El cliente ya no viaja");
  const [nota, setNota] = useState(
    "La cliente avisó por teléfono que cambió su viaje. Se le explicó la penalización antes de confirmar."
  );
  const [formaReembolso, setFormaReembolso] = useState<"efectivo" | "transferencia">("efectivo");

  const [guardando, setGuardando] = useState(false);
  const [canceladoExito, setCanceladoExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Valores de liquidación de cancelación (Mockup 14: total $4,899, pen 20% $980, dev $3,919)
  const totalContrato = 4_899;
  const anticipoPagado = 4_899;
  const penalizacion = 980; // 20%
  const aDevolver = totalContrato - penalizacion; // $3,919

  useEffect(() => {
    fetch(`/api/contratos/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contrato) {
          if (data.contrato.folio) setFolio(data.contrato.folio);
          setVehiculoInfo(`${data.contrato.vehiculo_descripcion} · ${data.contrato.cliente_nombre}`);
          setEstadoContrato(data.contrato.estado);
        }
      })
      .catch(() => {});
  }, [id]);

  const handleConfirmarCancelacion = async () => {
    setErrorMsg(null);
    setGuardando(true);

    try {
      const res = await fetch(`/api/contratos/${id}/cancelar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo,
          nota,
          formaReembolso,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo procesar la cancelación del contrato.");
        setGuardando(false);
        return;
      }

      setCanceladoExito(true);
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
              Cancelar contrato
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            {vehiculoInfo}
            <br />
            <b style={{ color: "#1E1A16" }}>
              {estadoContrato === "vigente" ? "Vigente" : "Por firmar"} · salida {salidaEn}
            </b>
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

        {canceladoExito && (
          <div
            style={{
              padding: "16px 20px",
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
            <div>
              ✓ Contrato {folio} cancelado formalmente. Vehículo liberado a disponible. Se registró la penalización de $
              {penalizacion.toLocaleString("es-MX")} y reembolso de ${aDevolver.toLocaleString("es-MX")}.
            </div>
            <Link
              href="/contratos"
              style={{
                padding: "8px 18px",
                background: "#137333",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Ir a contratos
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
          {/* Columna Izquierda: Motivo y Cálculo */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            {/* 1. Motivo */}
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
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Motivo</h2>

              <div
                role="group"
                aria-label="Motivo de cancelación"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 8,
                }}
              >
                {[
                  "El cliente ya no viaja",
                  "Cambio de fechas",
                  "Otro motivo",
                ].map((m) => {
                  const sel = motivo === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMotivo(m)}
                      aria-pressed={sel}
                      style={{
                        height: 48,
                        border: sel ? "2px solid #B5141B" : "1px solid #CFC8B8",
                        borderRadius: 12,
                        background: sel ? "#FBE9E7" : "#fff",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: sel ? 700 : 600,
                        color: "#1E1A16",
                        cursor: "pointer",
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                Nota (obligatoria)
                <textarea
                  rows={3}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
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

            {/* 2. Cómo se calcula la penalización Mockup 14 */}
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
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cómo se calcula la penalización</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ border: "2px solid #14583A", borderRadius: 14, padding: "12px 14px", background: "#F3FAF6" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#14583A" }}>
                    ESTA CANCELACIÓN
                  </div>
                  <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.45 }}>
                    Faltan <b>45 h 30 min</b> para la salida. Con más de 24 h de anticipación se cobra el <b>20 %</b> del total.
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginTop: 6 }}>
                    ${penalizacion.toLocaleString("es-MX")}
                  </div>
                </div>

                <div style={{ border: "1px dashed #CFC8B8", borderRadius: 14, padding: "12px 14px", background: "#FBF9F3", color: "#4A443B" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#6B645A" }}>
                    SI FALTARAN 24 H O MENOS
                  </div>
                  <div style={{ fontSize: 14, marginTop: 4, lineHeight: 1.45 }}>
                    La penalización sería el <b>total del contrato</b> (100 %).
                  </div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginTop: 6 }}>
                    ${totalContrato.toLocaleString("es-MX")}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#7A4A00", background: "#FFF1D6", borderRadius: 10, padding: "8px 12px", lineHeight: 1.4 }}>
                El reglamento es ambiguo en esta regla. El 20 % y las 24 horas son parámetros que el administrador puede cambiar.
              </div>
            </div>
          </div>

          {/* Columna Derecha: Aside Resumen financiero */}
          <aside
            aria-label="Resumen"
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
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Resumen financiero</h2>

            <div style={{ display: "flex", justifySelf: "stretch", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
              <span>Total del contrato</span>
              <b>${totalContrato.toLocaleString("es-MX")}</b>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
              <span>Anticipo pagado</span>
              <b>${anticipoPagado.toLocaleString("es-MX")}</b>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
              <span>Penalización (20 %)</span>
              <b style={{ color: "#8E1016" }}>− ${penalizacion.toLocaleString("es-MX")}</b>
            </div>

            <div style={{ background: "#F6F2E8", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "#6B645A" }}>
                A DEVOLVER AL CLIENTE
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, lineHeight: 1.15, color: "#14583A" }}>
                ${aDevolver.toLocaleString("es-MX")}
              </div>
            </div>

            <div role="group" aria-label="Forma de reembolso" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                type="button"
                onClick={() => setFormaReembolso("efectivo")}
                aria-pressed={formaReembolso === "efectivo"}
                style={{
                  height: 48,
                  border: formaReembolso === "efectivo" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                  borderRadius: 12,
                  background: formaReembolso === "efectivo" ? "#FBE9E7" : "#fff",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1E1A16",
                  cursor: "pointer",
                }}
              >
                Efectivo
              </button>
              <button
                type="button"
                onClick={() => setFormaReembolso("transferencia")}
                aria-pressed={formaReembolso === "transferencia"}
                style={{
                  height: 48,
                  border: formaReembolso === "transferencia" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                  borderRadius: 12,
                  background: formaReembolso === "transferencia" ? "#FBE9E7" : "#fff",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1E1A16",
                  cursor: "pointer",
                }}
              >
                Transferencia
              </button>
            </div>

            <div style={{ fontSize: 12, color: "#6B645A", lineHeight: 1.5 }}>
              Al cancelar, el vehículo queda libre para esas fechas. Un contrato <b>vigente</b> no se cancela: se concluye con la recepción (T-73).
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                onClick={handleConfirmarCancelacion}
                disabled={guardando}
                style={{
                  height: 56,
                  borderRadius: 28,
                  background: guardando ? "#8A8478" : "#8E1016",
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
                {guardando ? "Cancelando..." : "Confirmar cancelación"}
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
                Volver sin cancelar
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default function CancelarPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando cancelación...</div>}>
      <CancelarContent />
    </Suspense>
  );
}
