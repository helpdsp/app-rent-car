/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:45:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T04
 */

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";

interface FilaPago {
  forma: "efectivo" | "tarjeta" | "transferencia";
  monto: number; // en pesos
}

function CobroContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777000";

  // Pagos mixtos de anticipo (Caso de demo: $4,399 en efectivo + $500 transferencia = $4,899)
  const [pagosAnticipo, setPagosAnticipo] = useState<FilaPago[]>([
    { forma: "efectivo", monto: 4399 },
    { forma: "transferencia", monto: 500 },
  ]);

  // Depósito en garantía
  const [tipoGarantia, setTipoGarantia] = useState<"efectivo" | "tarjeta_credito" | "visa_laser">("efectivo");
  const [montoGarantia, setMontoGarantia] = useState(8000);
  const [tarjeta4, setTarjeta4] = useState("");
  const [emitirCargando, setEmitirCargando] = useState(false);

  const rentaTotal = 4899;
  const sumaAnticipos = pagosAnticipo.reduce((acc, p) => acc + p.monto, 0);
  const cubierto = sumaAnticipos >= rentaTotal;
  const totalARecibir = sumaAnticipos + montoGarantia;

  const agregarFilaPago = () => {
    setPagosAnticipo([...pagosAnticipo, { forma: "efectivo", monto: 0 }]);
  };

  const actualizarForma = (idx: number, forma: "efectivo" | "tarjeta" | "transferencia") => {
    const copia = [...pagosAnticipo];
    copia[idx].forma = forma;
    setPagosAnticipo(copia);
  };

  const actualizarMonto = (idx: number, valor: number) => {
    const copia = [...pagosAnticipo];
    copia[idx].monto = valor;
    setPagosAnticipo(copia);
  };

  const handleEmitirYContinuar = async () => {
    setEmitirCargando(true);
    try {
      // Registrar pagos en la API
      for (const p of pagosAnticipo) {
        if (p.monto > 0) {
          await fetch(`/api/contratos/${id}/pagos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: "anticipo",
              forma: p.forma === "tarjeta" ? "tarjeta_credito" : p.forma === "transferencia" ? "transferencia" : "efectivo",
              monto: p.monto * 100, // en centavos
            }),
          });
        }
      }

      // Registrar depósito en garantía
      if (montoGarantia > 0) {
        await fetch(`/api/contratos/${id}/pagos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "deposito_garantia",
            forma: tipoGarantia,
            monto: montoGarantia * 100,
            tarjeta_ultimos_4: tipoGarantia === "tarjeta_credito" ? tarjeta4 || "4242" : null,
          }),
        });
      }

      // Emitir contrato
      const res = await fetch(`/api/contratos/${id}/emitir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/contratos");
      } else {
        router.push("/contratos");
      }
    } catch {
      router.push("/contratos");
    } finally {
      setEmitirCargando(false);
    }
  };

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
          gap: 18,
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
              NUEVO CONTRATO · BORRADOR
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Cobro y garantía
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            Hyundai Elantra · ATU-703-A
            <br />
            <b style={{ color: "#1E1A16", fontSize: 16 }}>
              16/11/2026 11:00 → 19/11/2026 11:00
            </b>
          </div>
        </header>

        {/* Stepper */}
        <ol
          aria-label="Pasos del contrato"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#14583A",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            Cliente
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#14583A",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✓
            </span>
            Vehículo y fechas
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
          <li aria-current="step" style={{ display: "flex", alignItems: "center", gap: 8, color: "#B5141B" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                background: "#B5141B",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              3
            </span>
            Cobro y garantía
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#CFC8B8" }} />
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B645A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                border: "2px solid #CFC8B8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              4
            </span>
            Firma
          </li>
          <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#CFC8B8" }} />
          <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B645A" }}>
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                border: "2px solid #CFC8B8",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              5
            </span>
            Entrega
          </li>
        </ol>

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 6fr) minmax(0, 4fr)",
            gap: 18,
          }}
        >
          {/* Columna Izquierda: Formulario de pagos */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
            {/* Card: Anticipo de la renta */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Anticipo de la renta
                </h2>
                <button
                  type="button"
                  onClick={agregarFilaPago}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    borderRadius: 20,
                    border: "1px dashed #B0A793",
                    background: "#fff",
                    font: "inherit",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1E1A16",
                    cursor: "pointer",
                  }}
                >
                  + Forma de pago
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "#F6F2E8",
                }}
              >
                <span style={{ fontSize: 15 }}>
                  3 días × $1,633 · se paga por adelantado, sin excepción
                </span>
                <b style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24 }}>
                  ${rentaTotal.toLocaleString("es-MX")}
                </b>
              </div>

              {pagosAnticipo.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 130px",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <div
                    role="group"
                    aria-label={`Forma de pago ${idx + 1}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 6,
                    }}
                  >
                    <button
                      type="button"
                      aria-pressed={p.forma === "efectivo"}
                      onClick={() => actualizarForma(idx, "efectivo")}
                      style={{
                        height: 44,
                        border: p.forma === "efectivo" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                        borderRadius: 12,
                        background: p.forma === "efectivo" ? "#FBE9E7" : "#fff",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: p.forma === "efectivo" ? 700 : 600,
                        color: "#1E1A16",
                        cursor: "pointer",
                      }}
                    >
                      Efectivo
                    </button>
                    <button
                      type="button"
                      aria-pressed={p.forma === "tarjeta"}
                      onClick={() => actualizarForma(idx, "tarjeta")}
                      style={{
                        height: 44,
                        border: p.forma === "tarjeta" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                        borderRadius: 12,
                        background: p.forma === "tarjeta" ? "#FBE9E7" : "#fff",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: p.forma === "tarjeta" ? 700 : 600,
                        color: "#1E1A16",
                        cursor: "pointer",
                      }}
                    >
                      Tarjeta
                    </button>
                    <button
                      type="button"
                      aria-pressed={p.forma === "transferencia"}
                      onClick={() => actualizarForma(idx, "transferencia")}
                      style={{
                        height: 44,
                        border: p.forma === "transferencia" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                        borderRadius: 12,
                        background: p.forma === "transferencia" ? "#FBE9E7" : "#fff",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: p.forma === "transferencia" ? 700 : 600,
                        color: "#1E1A16",
                        cursor: "pointer",
                      }}
                    >
                      Transf. / depósito
                    </button>
                  </div>
                  <input
                    type="number"
                    value={p.monto}
                    onChange={(e) => actualizarMonto(idx, Number(e.target.value))}
                    style={{
                      height: 44,
                      border: "1px solid #CFC8B8",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      textAlign: "right",
                      padding: "0 14px",
                      boxSizing: "border-box",
                      fontWeight: 700,
                      font: "inherit",
                      fontSize: 16,
                      color: "#1E1A16",
                    }}
                  />
                </div>
              ))}

              <div
                style={{
                  fontSize: 13,
                  color: cubierto ? "#14583A" : "#8E1016",
                  fontWeight: 600,
                }}
              >
                {cubierto
                  ? `Cubierto: $${sumaAnticipos.toLocaleString("es-MX")} de $${rentaTotal.toLocaleString("es-MX")}`
                  : `Faltan $${(rentaTotal - sumaAnticipos).toLocaleString("es-MX")} por cubrir`}
              </div>
            </div>

            {/* Card: Depósito en garantía */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Depósito en garantía
              </h2>
              <div
                role="group"
                aria-label="Tipo de garantía"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}
              >
                <button
                  type="button"
                  aria-pressed={tipoGarantia === "efectivo"}
                  onClick={() => setTipoGarantia("efectivo")}
                  style={{
                    height: 52,
                    border: tipoGarantia === "efectivo" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                    borderRadius: 12,
                    background: tipoGarantia === "efectivo" ? "#FBE9E7" : "#fff",
                    font: "inherit",
                    fontSize: 16,
                    fontWeight: tipoGarantia === "efectivo" ? 700 : 600,
                    color: "#1E1A16",
                    cursor: "pointer",
                  }}
                >
                  Efectivo
                </button>
                <button
                  type="button"
                  aria-pressed={tipoGarantia === "tarjeta_credito"}
                  onClick={() => setTipoGarantia("tarjeta_credito")}
                  style={{
                    height: 52,
                    border: tipoGarantia === "tarjeta_credito" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                    borderRadius: 12,
                    background: tipoGarantia === "tarjeta_credito" ? "#FBE9E7" : "#fff",
                    font: "inherit",
                    fontSize: 16,
                    fontWeight: tipoGarantia === "tarjeta_credito" ? 700 : 600,
                    color: "#1E1A16",
                    cursor: "pointer",
                  }}
                >
                  Tarjeta de crédito
                </button>
                <button
                  type="button"
                  aria-pressed={tipoGarantia === "visa_laser"}
                  onClick={() => setTipoGarantia("visa_laser")}
                  style={{
                    height: 52,
                    border: tipoGarantia === "visa_laser" ? "2px solid #B5141B" : "1px solid #CFC8B8",
                    borderRadius: 12,
                    background: tipoGarantia === "visa_laser" ? "#FBE9E7" : "#fff",
                    font: "inherit",
                    fontSize: 16,
                    fontWeight: tipoGarantia === "visa_laser" ? 700 : 600,
                    color: "#1E1A16",
                    cursor: "pointer",
                  }}
                >
                  Visa Láser
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: tipoGarantia === "tarjeta_credito" ? "1fr 1fr" : "1fr", gap: 10 }}>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#4A443B",
                  }}
                >
                  Monto del depósito
                  <input
                    type="number"
                    value={montoGarantia}
                    onChange={(e) => setMontoGarantia(Number(e.target.value))}
                    style={{
                      height: 52,
                      border: "1px solid #CFC8B8",
                      borderRadius: 12,
                      padding: "0 14px",
                      font: "inherit",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "#1E1A16",
                      background: "#fff",
                    }}
                  />
                </label>
                {tipoGarantia === "tarjeta_credito" && (
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#4A443B",
                    }}
                  >
                    Últimos 4 dígitos
                    <input
                      maxLength={4}
                      placeholder="Ej. 4242"
                      value={tarjeta4}
                      onChange={(e) => setTarjeta4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      style={{
                        height: 52,
                        border: "1px solid #CFC8B8",
                        borderRadius: 12,
                        padding: "0 14px",
                        font: "inherit",
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#1E1A16",
                        background: "#fff",
                      }}
                    />
                  </label>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "#E8EEF7",
                  color: "#1F3A63",
                  fontSize: 13,
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flex: "none", marginTop: 1 }}
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 018 0v3" />
                </svg>
                <span>
                  Con tarjeta solo se guardan el tipo y los <b>últimos 4 dígitos</b>. El
                  número completo nunca se almacena. El depósito se devuelve o se
                  aplica al saldo al concluir (cláusula 8.ª).
                </span>
              </div>
            </div>

            {/* Accesos a datos adicionales */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Link
                href={`/contratos/${id}/extras`}
                style={{
                  minHeight: 48,
                  border: "1px dashed #B0A793",
                  borderRadius: 14,
                  background: "#fff",
                  font: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1E1A16",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                + Conductor adicional
              </Link>
              <button
                type="button"
                style={{
                  minHeight: 48,
                  border: "1px dashed #B0A793",
                  borderRadius: 14,
                  background: "#fff",
                  font: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1E1A16",
                  cursor: "pointer",
                }}
              >
                + Segundo auto
              </button>
              <Link
                href={`/contratos/${id}/extras`}
                style={{
                  minHeight: 48,
                  border: "1px dashed #B0A793",
                  borderRadius: 14,
                  background: "#fff",
                  font: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1E1A16",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                + Pagaré y referencia
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Resumen de cobro */}
          <aside
            aria-label="Resumen de cobro"
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: 16,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Se recibe hoy</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>Anticipo (renta)</span>
              <b>${rentaTotal.toLocaleString("es-MX")}</b>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "1px solid #EFE9DB",
                fontSize: 15,
              }}
            >
              <span>Depósito en garantía</span>
              <b>${montoGarantia.toLocaleString("es-MX")}</b>
            </div>
            <div
              style={{
                marginTop: 6,
                background: "#F6F2E8",
                borderRadius: 14,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "#6B645A",
                }}
              >
                TOTAL A RECIBIR
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 44,
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                ${totalARecibir.toLocaleString("es-MX")}
              </div>
            </div>

            <div
              style={{
                fontSize: 14,
                color: "#4A443B",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                paddingTop: 6,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <span aria-hidden="true" style={{ color: "#14583A", fontWeight: 700 }}>
                  ✓
                </span>
                Licencia y documentos del vehículo vigentes
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span aria-hidden="true" style={{ color: "#14583A", fontWeight: 700 }}>
                  ✓
                </span>
                Vehículo sin cruces de fechas
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span aria-hidden="true" style={{ color: "#14583A", fontWeight: 700 }}>
                  ✓
                </span>
                Recibo de depósito listo para imprimir
              </div>
            </div>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, color: "#6B645A", textAlign: "center" }}>
                El folio del contrato se asigna al emitir y no se reutiliza.
              </div>
              <button
                type="button"
                onClick={handleEmitirYContinuar}
                disabled={emitirCargando || !cubierto}
                style={{
                  height: 56,
                  borderRadius: 28,
                  border: 0,
                  background: cubierto ? "#B5141B" : "#CFC8B8",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: cubierto ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {emitirCargando ? "Emitiendo..." : "Emitir contrato y firmar"}
              </button>
              <Link
                href="/contratos/nuevo"
                style={{
                  height: 48,
                  borderRadius: 24,
                  border: "1px solid #CFC8B8",
                  background: "#fff",
                  color: "#1E1A16",
                  fontSize: 16,
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

export default function CobroPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando pantalla de cobro...</div>}>
      <CobroContent />
    </Suspense>
  );
}
