/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:35:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T06
 */

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav } from "@/components/ui/SidebarNav";
import { NuevoMovil } from "@/components/contratos/NuevoMovil";

interface VehiculoItem {
  id: string;
  marca: string;
  modelo: string;
  placas: string;
  color: string;
  tarifa_dia: number; // en centavos
  disponible: boolean;
  motivo_no_disponible?: string;
  badge?: { texto: string; fondo: string; color: string };
}

function ContratoNuevoContent() {
  const router = useRouter();

  // Estados del formulario
  const [salida, setSalida] = useState("16/11/2026 · 11:00");
  const [entrega, setEntrega] = useState("19/11/2026 · 11:00");
  const [destino, setDestino] = useState("Nogales");
  const [lugarDevolucion, setLugarDevolucion] = useState("Sucursal Mexicali");
  const [salidaPais, setSalidaPais] = useState(false);
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState("44444444-4444-4444-8444-444444444003");
  const [guardando, setGuardando] = useState(false);

  // Lista de vehículos según Mockup 3
  const vehiculos: VehiculoItem[] = [
    {
      id: "44444444-4444-4444-8444-444444444003",
      marca: "Hyundai",
      modelo: "Elantra",
      placas: "ATU-703-A",
      color: "Azul",
      tarifa_dia: 163300,
      disponible: true,
      badge: { texto: "Disponible", fondo: "#E3F3EA", color: "#14583A" },
    },
    {
      id: "44444444-4444-4444-8444-444444444004",
      marca: "Nissan",
      modelo: "Altima",
      placas: "BNB-112-B",
      color: "Blanco",
      tarifa_dia: 163300,
      disponible: true,
      badge: { texto: "Disponible", fondo: "#E3F3EA", color: "#14583A" },
    },
    {
      id: "44444444-4444-4444-8444-444444444002",
      marca: "Kia",
      modelo: "Forte",
      placas: "BNB-791-A",
      color: "Gris",
      tarifa_dia: 163300,
      disponible: false,
      motivo_no_disponible: "En renta hasta hoy 17:30 (folio 08160)",
      badge: { texto: "Rentado", fondo: "#FFF1D6", color: "#7A4A00" },
    },
    {
      id: "44444444-4444-4444-8444-444444444001",
      marca: "Honda",
      modelo: "CR-V",
      placas: "BC-990-A",
      color: "Negra",
      tarifa_dia: 210000,
      disponible: false,
      motivo_no_disponible: "Tarjeta de circulación vence hoy",
      badge: { texto: "Documentos", fondo: "#FBE9E7", color: "#8E1016" },
    },
  ];

  const vehiculoActivo = vehiculos.find((v) => v.id === vehiculoSeleccionadoId) ?? vehiculos[0];

  // Cálculo de cotización basado en caso 08160 (3 días)
  const tarifaDiaCentavos = vehiculoActivo.tarifa_dia;
  const diasRenta = 3;
  const anticipoCentavos = tarifaDiaCentavos * diasRenta;
  const horaExtraCentavos = Math.round(tarifaDiaCentavos / 8);
  const kmExtraCentavos = Math.round(tarifaDiaCentavos / 500);
  const kmIncluidos = diasRenta * 500;

  const handleCrearBorrador = async () => {
    setGuardando(true);
    try {
      const res = await fetch("/api/contratos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: "12700000-0000-4000-8000-000000000127",
          vehiculo_id: vehiculoActivo.id,
          salida_en: "2026-11-16T11:00:00Z",
          entrada_prevista_en: "2026-11-19T11:00:00Z",
          destino,
          lugar_devolucion: lugarDevolucion,
          salida_pais_autorizada: salidaPais,
          conductores: [
            {
              nombre: "Ricardo Medina Salazar",
              licencia_numero: "B2302042880",
              licencia_vencimiento: "2028-05-27",
              es_arrendatario: true,
            },
          ],
        }),
      });
      if (res.ok) {
        router.push("/contratos");
      } else {
        router.push("/contratos");
      }
    } catch {
      router.push("/contratos");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      {/* Vista móvil para pantallas pequeñas */}
      <div className="block md:hidden min-h-screen bg-[#F6F2E8]">
        <NuevoMovil
          clienteNombre="Ricardo Medina Salazar"
          clienteNumero="00127"
          onContinuar={handleCrearBorrador}
        />
      </div>

      {/* Vista de escritorio / tablet (Mockup 3) */}
      <div className="hidden md:flex" style={{ width: "100%", minHeight: "100vh", background: "#F6F2E8", color: "#1E1A16", fontFamily: "'Inter', system-ui, sans-serif", fontSize: 16 }}>
        <SidebarNav seccionActiva="contratos" />

        <main style={{ flex: 1, minWidth: 0, padding: "28px 36px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", color: "#6B645A" }}>
                NUEVO CONTRATO · BORRADOR
              </div>
              <h1 style={{ margin: "4px 0 0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, lineHeight: 1.1 }}>
                Vehículo y fechas
              </h1>
            </div>
            <div style={{ fontSize: 14, color: "#6B645A", textAlign: "right" }}>
              Cliente<br />
              <b style={{ color: "#1E1A16", fontSize: 16 }}>Ricardo Medina Salazar · No. 00127</b>
            </div>
          </header>

          <ol aria-label="Pasos del contrato" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
            <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#14583A" }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, background: "#14583A", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>✓</span>
              Cliente
            </li>
            <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#14583A" }} />
            <li aria-current="step" style={{ display: "flex", alignItems: "center", gap: 8, color: "#B5141B" }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, background: "#B5141B", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>2</span>
              Vehículo y fechas
            </li>
            <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#CFC8B8" }} />
            <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B645A" }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, border: "2px solid #CFC8B8", display: "inline-flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>3</span>
              Cobro y garantía
            </li>
            <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#CFC8B8" }} />
            <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B645A" }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, border: "2px solid #CFC8B8", display: "inline-flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>4</span>
              Firma
            </li>
            <li aria-hidden="true" style={{ flex: 1, height: 2, background: "#CFC8B8" }} />
            <li style={{ display: "flex", alignItems: "center", gap: 8, color: "#6B645A" }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, border: "2px solid #CFC8B8", display: "inline-flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>5</span>
              Entrega
            </li>
          </ol>

          <section style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0, 6fr) minmax(0, 4fr)", gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
              {/* Tarjeta Fechas y destino */}
              <div style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: 16, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Fechas y destino</h2>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                    Salida
                    <input
                      value={salida}
                      onChange={(e) => setSalida(e.target.value)}
                      style={{ height: 48, border: "1px solid #CFC8B8", borderRadius: 12, padding: "0 14px", font: "inherit", fontSize: 16, fontWeight: 400, color: "#1E1A16", background: "#fff" }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                    Entrega prevista
                    <input
                      value={entrega}
                      onChange={(e) => setEntrega(e.target.value)}
                      style={{ height: 48, border: "1px solid #CFC8B8", borderRadius: 12, padding: "0 14px", font: "inherit", fontSize: 16, fontWeight: 400, color: "#1E1A16", background: "#fff" }}
                    />
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                    Destino
                    <input
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      style={{ height: 48, border: "1px solid #CFC8B8", borderRadius: 12, padding: "0 14px", font: "inherit", fontSize: 16, fontWeight: 400, color: "#1E1A16", background: "#fff" }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, fontWeight: 600, color: "#4A443B" }}>
                    Lugar de devolución
                    <input
                      value={lugarDevolucion}
                      onChange={(e) => setLugarDevolucion(e.target.value)}
                      style={{ height: 48, border: "1px solid #CFC8B8", borderRadius: 12, padding: "0 14px", font: "inherit", fontSize: 16, fontWeight: 400, color: "#1E1A16", background: "#fff" }}
                    />
                  </label>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 14px", borderRadius: 12, background: "#F6F2E8", cursor: "pointer" }}
                  onClick={() => setSalidaPais(!salidaPais)}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>Salida del país</div>
                    <div style={{ fontSize: 13, color: "#6B645A" }}>
                      {salidaPais ? "Autorizada con permiso por escrito (cláusula 9.ª)" : "No autorizada. Requiere permiso por escrito (cláusula 9.ª)"}
                    </div>
                  </div>
                  <span
                    style={{
                      flex: "none",
                      width: 56,
                      height: 32,
                      borderRadius: 16,
                      background: salidaPais ? "#14583A" : "#CFC8B8",
                      padding: 3,
                      boxSizing: "border-box",
                      display: "inline-flex",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        background: "#fff",
                        transform: salidaPais ? "translateX(24px)" : "translateX(0)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* Tarjeta Vehículos */}
              <div style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: 16, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12, flex: 1, minHeight: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Vehículos para estas fechas</h2>
                  <span style={{ fontSize: 13, color: "#6B645A" }}>2 disponibles · 2 no disponibles</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
                  {vehiculos.map((v) => {
                    const isSelected = vehiculoSeleccionadoId === v.id;
                    if (!v.disponible) {
                      return (
                        <div
                          key={v.id}
                          style={{
                            padding: "14px 16px",
                            border: "1px dashed #CFC8B8",
                            borderRadius: 14,
                            background: "#FBF9F3",
                            color: "#6B645A",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            minHeight: 92,
                          }}
                        >
                          <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                            <b style={{ fontSize: 16, color: "#4A443B" }}>
                              {v.marca} {v.modelo}
                            </b>
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
                          </span>
                          <span style={{ fontSize: 14 }}>{v.color}</span>
                          <span style={{ fontSize: 13 }}>{v.motivo_no_disponible}</span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={v.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setVehiculoSeleccionadoId(v.id)}
                        style={{
                          textAlign: "left",
                          padding: "14px 16px",
                          border: isSelected ? "2px solid #B5141B" : "1px solid #CFC8B8",
                          borderRadius: 14,
                          background: isSelected ? "#FBE9E7" : "#fff",
                          font: "inherit",
                          color: "#1E1A16",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          minHeight: 92,
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                          <b style={{ fontSize: 16 }}>
                            {v.marca} {v.modelo}
                          </b>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#14583A",
                              background: "#E3F3EA",
                              padding: "2px 8px",
                              borderRadius: 10,
                            }}
                          >
                            Disponible
                          </span>
                        </span>
                        <span style={{ fontSize: 14, color: "#4A443B" }}>
                          {v.placas} · {v.color}
                        </span>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>
                          ${(v.tarifa_dia / 100).toLocaleString("es-MX")} por día
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Columna derecha: Cotización */}
            <aside aria-label="Cotización" style={{ background: "#fff", border: "1px solid #E3DCCB", borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Cotización</h2>
              <div style={{ fontSize: 14, color: "#6B645A" }}>
                Se calcula con el reglamento y se guarda una copia de las tarifas al emitir.
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
                <span>
                  Tarifa por 24 h
                  <span style={{ display: "block", fontSize: 12, color: "#6B645A" }}>
                    Catálogo ${(tarifaDiaCentavos / 100).toLocaleString("es-MX")} · editable con motivo
                  </span>
                </span>
                <b>${(tarifaDiaCentavos / 100).toLocaleString("es-MX")}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
                <span>Días de renta</span>
                <b>{diasRenta}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
                <span>Kilómetros incluidos</span>
                <b>{kmIncluidos.toLocaleString("es-MX")} (500 por día)</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
                <span>Hora extra (tarifa ÷ 8)</span>
                <b>${(horaExtraCentavos / 100).toLocaleString("es-MX")}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #EFE9DB", fontSize: 15 }}>
                <span>Km excedente</span>
                <b>${(kmExtraCentavos / 100).toLocaleString("es-MX")} por km</b>
              </div>

              <div style={{ marginTop: "auto", background: "#F6F2E8", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", color: "#6B645A" }}>
                  ANTICIPO A COBRAR · PAGO POR ADELANTADO
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 700, lineHeight: 1.15 }}>
                  ${(anticipoCentavos / 100).toLocaleString("es-MX")}
                </div>
                <div style={{ fontSize: 13, color: "#6B645A" }}>
                  {diasRenta} días × ${(tarifaDiaCentavos / 100).toLocaleString("es-MX")}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCrearBorrador}
                disabled={guardando}
                style={{
                  height: 56,
                  borderRadius: 28,
                  border: 0,
                  background: "#B5141B",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: guardando ? 0.7 : 1,
                }}
              >
                {guardando ? "Guardando..." : "Continuar al cobro"}
              </button>
              <div style={{ fontSize: 12, color: "#6B645A", textAlign: "center" }}>
                Licencia vigente hasta 27/05/2028: cubre todo el periodo
              </div>
            </aside>
          </section>
        </main>
      </div>
    </>
  );
}

export default function ContratoNuevoPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: "center" }}>Cargando formulario de contrato...</div>}>
      <ContratoNuevoContent />
    </Suspense>
  );
}
