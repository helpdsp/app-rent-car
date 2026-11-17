/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T13:05:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T04
 */

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";

function RenovarContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777001"; // 08160 (Kia Forte)

  const [folio, setFolio] = useState("08160");
  const [vehiculoInfo, setVehiculoInfo] = useState("Kia Forte · Ricardo Medina");
  const [destino, setDestino] = useState("Nogales");
  const [nuevaEntrada, setNuevaEntrada] = useState("2026-11-19T17:30");
  const [pasarDeposito, setPasarDeposito] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/contratos/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.contrato) {
          if (data.contrato.folio) setFolio(data.contrato.folio);
          setVehiculoInfo(`${data.contrato.vehiculo_descripcion} · ${data.contrato.cliente_nombre}`);
          if (data.contrato.destino) setDestino(data.contrato.destino);
        }
      })
      .catch(() => {});
  }, [id]);

  const handleCrearRenovacion = async () => {
    setErrorMsg(null);
    setGuardando(true);

    try {
      const res = await fetch(`/api/contratos/${id}/renovar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nuevaEntradaPrevista: new Date(nuevaEntrada).toISOString(),
          destino,
          pasarDepositoNuevo: pasarDeposito,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "No se pudo generar la renovación del contrato.");
        setGuardando(false);
        return;
      }

      router.push(`/contratos/${data.nuevoContrato.id}/cobro`);
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
              Renovar contrato
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            {vehiculoInfo}
            <br />
            <b style={{ color: "#1E1A16" }}>Vence hoy a las 17:30</b>
          </div>
        </header>

        {/* Banner azul de no prórroga tácita (cláusula 3.ª) */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            padding: "12px 16px",
            borderRadius: 14,
            background: "#E8EEF7",
            color: "#1F3A63",
            fontSize: 14,
            lineHeight: 1.45,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flex: "none", marginTop: 1 }}
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <path d="M12 16.5v.01" />
          </svg>
          <span>
            <b>No hay prórroga automática (cláusula 3.ª).</b> Seguir con el vehículo exige un contrato nuevo, ligado a este, con su propio anticipo, firma y fotos (RF-24).
          </span>
        </div>

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

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 6fr) minmax(0, 4fr)",
            gap: 16,
          }}
        >
          {/* Columna Izquierda: Comparación de contratos y Validaciones */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
            {/* Tarjetas comparativas */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #E3DCCB",
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#6B645A" }}>
                  CONTRATO ACTUAL
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{folio}</div>
                <div style={{ fontSize: 14, color: "#4A443B", lineHeight: 1.5 }}>
                  13/11 17:30 → <b>16/11 17:30</b>
                  <br />
                  3 días · $1,633 por día
                  <br />
                  Anticipo $4,899 pagado
                  <br />
                  Saldo pendiente: <b style={{ color: "#14583A" }}>$0</b>
                </div>
              </div>

              <div
                style={{
                  background: "#fff",
                  border: "2px solid #B5141B",
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: "#B5141B" }}>
                  CONTRATO NUEVO · BORRADOR
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Se asigna al emitir</div>
                <div style={{ fontSize: 14, color: "#4A443B", lineHeight: 1.5 }}>
                  16/11 17:30 → <b>19/11 17:30</b>
                  <br />
                  3 días · $1,633 por día
                  <br />
                  Ligado al contrato {folio}
                  <br />
                  Mismo cliente, vehículo y conductores
                </div>
              </div>
            </div>

            {/* Nueva fecha de entrega */}
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
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Nueva fecha de entrega</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                  Entrega prevista
                  <input
                    type="datetime-local"
                    value={nuevaEntrada}
                    onChange={(e) => setNuevaEntrada(e.target.value)}
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
                  Destino
                  <input
                    type="text"
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
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
            </div>

            {/* Validaciones automáticas Mockup 13 */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flex: 1,
                minHeight: 0,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Validaciones</h2>
              <div style={{ display: "flex", gap: 10, fontSize: 14, alignItems: "baseline" }}>
                <b style={{ color: "#14583A" }}>✓</b>
                <span>El vehículo no tiene otra renta ni bloqueo hasta el 19/11 17:30</span>
              </div>
              <div style={{ display: "flex", gap: 10, fontSize: 14, alignItems: "baseline" }}>
                <b style={{ color: "#14583A" }}>✓</b>
                <span>Licencia del conductor vigente en todo el periodo (T-70)</span>
              </div>
              <div style={{ display: "flex", gap: 10, fontSize: 14, alignItems: "baseline" }}>
                <b style={{ color: "#14583A" }}>✓</b>
                <span>Tarjeta de circulación y póliza vigentes</span>
              </div>
              <div style={{ display: "flex", gap: 10, fontSize: 14, alignItems: "baseline" }}>
                <b style={{ color: "#7A4A00" }}>!</b>
                <span>El contrato {folio} debe recibirse y liquidarse antes de entregar el nuevo</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Cobro de renovación */}
          <aside
            aria-label="Cobro de la renovación"
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
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cobro de la renovación</h2>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
              <span>Tarifa por 24 h</span>
              <b>$1,633</b>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
              <span>Días</span>
              <b>3</b>
            </div>

            <div style={{ background: "#F6F2E8", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: "#6B645A" }}>
                ANTICIPO DEL CONTRATO NUEVO
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, lineHeight: 1.15 }}>
                $4,899
              </div>
            </div>

            <div style={{ padding: "12px 14px", border: "1px solid #E3DCCB", borderRadius: 12, fontSize: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <b>Depósito en garantía ($8,000)</b>
              <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="dep"
                  checked={pasarDeposito}
                  onChange={() => setPasarDeposito(true)}
                  style={{ width: 20, height: 20, accentColor: "#B5141B" }}
                />
                Pasa al contrato nuevo
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, cursor: "pointer" }}>
                <input
                  type="radio"
                  name="dep"
                  checked={!pasarDeposito}
                  onChange={() => setPasarDeposito(false)}
                  style={{ width: 20, height: 20, accentColor: "#B5141B" }}
                />
                Devolver y cobrar uno nuevo
              </label>
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                type="button"
                onClick={handleCrearRenovacion}
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
                {guardando ? "Generando..." : "Crear contrato nuevo"}
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
                Volver
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default function RenovarPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando renovación...</div>}>
      <RenovarContent />
    </Suspense>
  );
}
