/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:40:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T05
 */

"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";

function FirmaContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === "string" ? routeParams.id : "77777777-7777-4777-8777-777777777000";

  const [documentoTab, setDocumentoTab] = useState<"contrato" | "reglamento">("contrato");
  const [terminosAceptados, setTerminosAceptados] = useState(true);
  const [firmado, setFirmado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Canvas interactivo de firma
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dibujar firma inicial demostrativa tipo bezier
    ctx.strokeStyle = "#1E1A16";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(60, 120);
    ctx.bezierCurveTo(80, 40, 110, 40, 105, 100);
    ctx.bezierCurveTo(100, 150, 140, 60, 160, 90);
    ctx.bezierCurveTo(175, 112, 190, 70, 215, 85);
    ctx.bezierCurveTo(240, 100, 250, 60, 275, 95);
    ctx.bezierCurveTo(290, 118, 300, 80, 330, 82);
    ctx.bezierCurveTo(360, 84, 380, 110, 450, 70);
    ctx.stroke();
    setFirmado(true);
  }, []);

  const limpiarCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFirmado(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setFirmado(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleConfirmarFirma = async () => {
    if (!terminosAceptados || !firmado) return;
    setGuardando(true);
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas ? canvas.toDataURL() : "data:image/png;base64,demo";

      await fetch(`/api/contratos/${id}/firmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firmante_tipo: "arrendatario",
          firmante_nombre: "Ricardo Medina Salazar",
          imagen_base64: dataUrl,
          dispositivo: "Tableta mostrador 1",
        }),
      });

      router.push("/contratos");
    } catch {
      router.push("/contratos");
    } finally {
      setGuardando(false);
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
              CONTRATO D-00001 · POR FIRMAR
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Firma del arrendatario
            </h1>
          </div>
          <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
            Entregue la tableta al cliente
            <br />
            <b style={{ color: "#1E1A16", fontSize: 16 }}>Ricardo Medina Salazar</b>
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
            Cobro y garantía
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
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: 18,
          }}
        >
          {/* Columna Izquierda: Vista previa del documento */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E3DCCB",
              borderRadius: 16,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              minHeight: 0,
            }}
          >
            <div role="tablist" aria-label="Documento" style={{ display: "flex", gap: 8 }}>
              <button
                role="tab"
                aria-selected={documentoTab === "contrato"}
                onClick={() => setDocumentoTab("contrato")}
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 22,
                  border: 0,
                  background: documentoTab === "contrato" ? "#1E1A16" : "#fff",
                  color: documentoTab === "contrato" ? "#fff" : "#1E1A16",
                  boxShadow: documentoTab === "contrato" ? "none" : "inset 0 0 0 1px #CFC8B8",
                  font: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Contrato
              </button>
              <button
                role="tab"
                aria-selected={documentoTab === "reglamento"}
                onClick={() => setDocumentoTab("reglamento")}
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 22,
                  border: 0,
                  background: documentoTab === "reglamento" ? "#1E1A16" : "#fff",
                  color: documentoTab === "reglamento" ? "#fff" : "#1E1A16",
                  boxShadow: documentoTab === "reglamento" ? "none" : "inset 0 0 0 1px #CFC8B8",
                  font: "inherit",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reglamento
              </button>
              <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: 13, color: "#6B645A" }}>
                Página 1 de 2
              </span>
            </div>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                background: "#FBF7E9",
                border: "1px solid #E3DCCB",
                borderRadius: 10,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#B5141B" }}>
                    MÉXICO RENTA DE AUTOS
                  </div>
                  <div style={{ fontSize: 12, color: "#4A443B" }}>
                    Calz. de Las Américas 837-E, Mexicali, B.C.
                  </div>
                </div>
                <div style={{ border: "2px solid #B5141B", borderRadius: 8, padding: "4px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em" }}>CONTRATO</div>
                  <div style={{ fontWeight: 700, color: "#B5141B", fontSize: 16 }}>D-00001</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>NOMBRE</div>
                  Ricardo Medina Salazar
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>LICENCIA · TIPO A</div>
                  B2302042880 · vence 27/05/2028
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>AUTO · PLACAS</div>
                  Hyundai Elantra · ATU-703-A
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>DESTINO</div>
                  Nogales
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>SALIDA</div>
                  16/11/26 · 11:00
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>ENTRADA</div>
                  19/11/26 · 11:00
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>TARIFA 24 H · DÍAS</div>
                  $1,633 · 3
                </div>
                <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, color: "#6B645A", fontWeight: 600 }}>HORA EXTRA · KM EXTRA</div>
                  $204 · $3
                </div>
              </div>

              <div style={{ border: "1px solid #D8CFB8", borderRadius: 6, padding: 8, fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                <span><b>Anticipo</b> pagado en efectivo</span>
                <b>$4,899</b>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }} aria-hidden="true">
                <div style={{ height: 6, background: "#E5DCC3", borderRadius: 3 }} />
                <div style={{ height: 6, background: "#E5DCC3", borderRadius: 3, width: "96%" }} />
                <div style={{ height: 6, background: "#E5DCC3", borderRadius: 3, width: "92%" }} />
                <div style={{ height: 6, background: "#E5DCC3", borderRadius: 3, width: "97%" }} />
                <div style={{ height: 6, background: "#E5DCC3", borderRadius: 3, width: "60%" }} />
              </div>

              <div style={{ fontSize: 12, color: "#6B645A", marginTop: "auto" }}>
                Cláusulas 1.ª a 21.ª en la página 2. Deslice para leer.
              </div>
            </div>
          </div>

          {/* Columna Derecha: Recuadro táctil de firma */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
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
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Firme dentro del recuadro
                </h2>
                <button
                  type="button"
                  onClick={limpiarCanvas}
                  style={{
                    height: 44,
                    padding: "0 16px",
                    borderRadius: 22,
                    border: "1px solid #CFC8B8",
                    background: "#fff",
                    font: "inherit",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#1E1A16",
                    cursor: "pointer",
                  }}
                >
                  Borrar
                </button>
              </div>

              <div
                style={{
                  flex: 1,
                  minHeight: 200,
                  border: "2px dashed #B0A793",
                  borderRadius: 14,
                  background: "#FDFCF8",
                  position: "relative",
                  touchAction: "none",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={520}
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ width: "100%", height: "100%", cursor: "crosshair" }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: 36,
                    height: 1,
                    background: "#B0A793",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 24,
                    bottom: 10,
                    fontSize: 12,
                    color: "#6B645A",
                    pointerEvents: "none",
                  }}
                >
                  Firma del arrendatario
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  fontSize: 14,
                  color: "#4A443B",
                  lineHeight: 1.4,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={terminosAceptados}
                  onChange={(e) => setTerminosAceptados(e.target.checked)}
                  style={{
                    width: 28,
                    height: 28,
                    flex: "none",
                    accentColor: "#B5141B",
                    margin: 0,
                  }}
                />
                <span>
                  He leído todas las cláusulas, tarifas, términos y condiciones del anverso y
                  reverso de este contrato y del reglamento, y estoy de acuerdo con ellas.
                </span>
              </label>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: 16,
                padding: "14px 20px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                fontSize: 13,
              }}
            >
              <div>
                <div style={{ color: "#6B645A", fontWeight: 600 }}>ARRENDATARIO</div>
                <span style={{ color: "#7A4A00", fontWeight: 700 }}>
                  {firmado ? "Firmando ahora" : "Pendiente"}
                </span>
              </div>
              <div>
                <div style={{ color: "#6B645A", fontWeight: 600 }}>CONDUCTOR ADICIONAL</div>
                No aplica
              </div>
              <div>
                <div style={{ color: "#6B645A", fontWeight: 600 }}>PAGARÉ</div>
                No aplica
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 12, color: "#6B645A", maxWidth: 340 }}>
                Al confirmar, el PDF queda inmutable y se guarda su huella (SHA-256),
                fecha, hora, usuario y dispositivo.
              </div>
              <button
                type="button"
                onClick={handleConfirmarFirma}
                disabled={guardando || !terminosAceptados || !firmado}
                style={{
                  height: 60,
                  padding: "0 32px",
                  borderRadius: 30,
                  border: 0,
                  background: terminosAceptados && firmado ? "#B5141B" : "#CFC8B8",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: terminosAceptados && firmado ? "pointer" : "not-allowed",
                  display: "inline-flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                }}
              >
                {guardando ? "Guardando..." : "Confirmar firma"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function FirmaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando pantalla de firma...</div>}>
      <FirmaContent />
    </Suspense>
  );
}
