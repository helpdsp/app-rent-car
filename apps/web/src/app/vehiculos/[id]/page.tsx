/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:30:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T04, S04-T05, S04-T06
 */

"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SidebarNav } from "@/components/ui";
import { DocumentosVehiculo } from "@/components/vehiculos/DocumentosVehiculo";
import { Bloqueos } from "@/components/vehiculos/Bloqueos";
import {
  obtenerVehiculoPorId,
  obtenerDocumentosDeVehiculo,
  obtenerBloqueosDeVehiculo,
  obtenerHistorialKm,
  actualizarVehiculo,
  type VehiculoRow,
} from "@/lib/db/sprint4";

function VehiculoContenido() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : "44444444-4444-4444-8444-444444444003";

  const vehiculoInicial =
    obtenerVehiculoPorId(id) ??
    ({
      id,
      clave_auto: 3,
      clave_formato: "0003",
      marca: "Hyundai",
      modelo: "Elantra",
      tipo: "Sedán",
      color: "Azul",
      placas: "ATU-703-A",
      kilometraje_actual: 47_215,
      valor_asegurado: BigInt(36_000_000),
      tarifa_dia: BigInt(163_300),
      seguro_nocturno: BigInt(40_000),
      estado: "disponible",
      categoria_tarifa_id: null,
      observaciones: null,
      created_at: "",
      updated_at: "",
      created_by: null,
      deleted_at: null,
    } as VehiculoRow);

  const [vehiculo, setVehiculo] = useState<VehiculoRow>(vehiculoInicial);
  const [documentos, setDocumentos] = useState(obtenerDocumentosDeVehiculo(vehiculo.id));
  const [bloqueos, setBloqueos] = useState(obtenerBloqueosDeVehiculo(vehiculo.id));
  const [historialKm] = useState(obtenerHistorialKm(vehiculo.id));

  // Modal para editar datos y corrección de kilometraje
  const [modalEditar, setModalEditar] = useState(false);
  const [kmEdit, setKmEdit] = useState<number>(vehiculo.kilometraje_actual);
  const [motivoKm, setMotivoKm] = useState("");
  const [errorEdit, setErrorEdit] = useState<string | null>(null);

  const refrescarDatos = () => {
    const v = obtenerVehiculoPorId(vehiculo.id);
    if (v) {
      setVehiculo(v);
      setKmEdit(v.kilometraje_actual);
    }
    setDocumentos(obtenerDocumentosDeVehiculo(vehiculo.id));
    setBloqueos(obtenerBloqueosDeVehiculo(vehiculo.id));
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorEdit(null);

    const resultado = actualizarVehiculo(
      vehiculo.id,
      {
        kilometraje_actual: kmEdit,
        motivo_correccion_km: motivoKm || undefined,
      },
      {
        id: "11111111-1111-4111-8111-111111111101",
        nombre: "admin@mexicarentacar.com",
        rol: "administrador",
      }
    );

    if (!resultado.ok) {
      setErrorEdit(resultado.error);
      return;
    }

    setModalEditar(false);
    setMotivoKm("");
    refrescarDatos();
  };

  const exportarCsvKm = () => {
    const cabeceras = "Contrato,Cliente,Fecha,Dias,Km Salida,Km Entrada,Recorridos,Km/Dia\n";
    const filas = historialKm
      .map(
        (h) =>
          `"${h.contrato_folio}","${h.cliente_nombre}","${h.fecha}",${h.dias},${h.km_salida},${h.km_entrada},${h.recorridos},${h.km_dia}`
      )
      .join("\n");
    const blob = new Blob([cabeceras + filas], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `historial_km_${vehiculo.clave_formato}.csv`;
    link.click();
  };

  const totalKmRecorridos = historialKm.reduce((acc, h) => acc + h.recorridos, 0);

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
      <SidebarNav seccionActiva="vehiculos" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div>
            <Link
              href="/vehiculos"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#B5141B",
                textDecoration: "none",
              }}
            >
              ← Vehículos
            </Link>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#6B645A",
                marginTop: "6px",
              }}
            >
              CLAVE {vehiculo.clave_formato} · {vehiculo.placas}
            </div>
            <h1
              style={{
                margin: "2px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "34px",
                lineHeight: 1.1,
              }}
            >
              {vehiculo.marca} {vehiculo.modelo}{" "}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: "14px",
                  background:
                    vehiculo.estado === "disponible"
                      ? "#E3F3EA"
                      : vehiculo.estado === "rentado"
                      ? "#FFF1D6"
                      : "#E8EEF7",
                  color:
                    vehiculo.estado === "disponible"
                      ? "#14583A"
                      : vehiculo.estado === "rentado"
                      ? "#7A4A00"
                      : "#1F3A63",
                  verticalAlign: "middle",
                  marginLeft: "8px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
              </span>
            </h1>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setModalEditar(true)}
              style={{
                height: "48px",
                padding: "0 22px",
                borderRadius: "24px",
                border: "1px solid #CFC8B8",
                background: "#fff",
                color: "#1E1A16",
                font: "inherit",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Editar datos
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("seccion-bloqueos");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                height: "48px",
                padding: "0 22px",
                borderRadius: "24px",
                border: 0,
                background: "#1E1A16",
                color: "#fff",
                font: "inherit",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Bloquear por mantenimiento
            </button>
          </div>
        </header>

        {/* Sección de 2 columnas como Mockup 10 */}
        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: "16px",
          }}
        >
          {/* Columna Izquierda: Datos del vehículo y Documentos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: 0 }}>
            {/* Tarjeta Datos del vehículo */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Datos del vehículo</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: "10px 16px",
                  fontSize: "14px",
                }}
              >
                <div>
                  <div style={{ color: "#6B645A", fontSize: "12px", fontWeight: 600 }}>
                    MARCA Y MODELO
                  </div>
                  {vehiculo.marca} {vehiculo.modelo}
                </div>
                <div>
                  <div style={{ color: "#6B645A", fontSize: "12px", fontWeight: 600 }}>COLOR</div>
                  {vehiculo.color}
                </div>
                <div>
                  <div style={{ color: "#6B645A", fontSize: "12px", fontWeight: 600 }}>
                    KILOMETRAJE ACTUAL
                  </div>
                  <b>{vehiculo.kilometraje_actual.toLocaleString("es-MX")} km</b>
                </div>
                <div>
                  <div style={{ color: "#6B645A", fontSize: "12px", fontWeight: 600 }}>
                    VALOR ASEGURADO
                  </div>
                  ${Number(vehiculo.valor_asegurado / BigInt(100)).toLocaleString("es-MX")}
                </div>
                <div>
                  <div style={{ color: "#6B645A", fontSize: "12px", fontWeight: 600 }}>
                    TARIFA DEL CATÁLOGO
                  </div>
                  <b>${Number(vehiculo.tarifa_dia / BigInt(100)).toLocaleString("es-MX")}</b> por día
                </div>
                <div>
                  <div style={{ color: "#6B645A", fontSize: "12px", fontWeight: 600 }}>
                    SEGURO NOCTURNO
                  </div>
                  ${Number(vehiculo.seguro_nocturno / BigInt(100)).toLocaleString("es-MX")}
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#6B645A",
                  paddingTop: "8px",
                  borderTop: "1px solid #EFE9DB",
                }}
              >
                El kilometraje solo sube con las recepciones; una corrección la hace un administrador y
                queda en la bitácora.
              </div>
            </div>

            {/* Documentos vigentes del vehículo */}
            <DocumentosVehiculo
              vehiculoId={vehiculo.id}
              documentos={documentos}
              onDocumentoActualizado={refrescarDatos}
            />
          </div>

          {/* Columna Derecha: Mantenimiento y bloqueos + Historial de rentas y km */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: 0 }}>
            {/* Mantenimiento y bloqueos */}
            <div id="seccion-bloqueos">
              <Bloqueos
                vehiculoId={vehiculo.id}
                bloqueos={bloqueos}
                onBloqueoCreado={refrescarDatos}
              />
            </div>

            {/* Historial de rentas y kilometraje */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #E3DCCB",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flex: 1,
                minHeight: 0,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                  Historial de rentas y kilometraje
                </h2>
                <button
                  type="button"
                  onClick={exportarCsvKm}
                  style={{
                    height: "40px",
                    padding: "0 14px",
                    borderRadius: "20px",
                    border: "1px solid #CFC8B8",
                    background: "#fff",
                    font: "inherit",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1E1A16",
                    cursor: "pointer",
                  }}
                >
                  Exportar CSV
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.5fr) 0.9fr 1.4fr 0.8fr 0.7fr",
                  gap: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: "#6B645A",
                  padding: "6px 0",
                  borderBottom: "1px solid #EFE9DB",
                }}
              >
                <span>CONTRATO</span>
                <span>DÍAS</span>
                <span>KM SALIDA → ENTRADA</span>
                <span style={{ textAlign: "right" }}>RECORRIDOS</span>
                <span style={{ textAlign: "right" }}>KM/DÍA</span>
              </div>

              <div style={{ flex: 1, overflowY: "auto" }}>
                {historialKm.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1.5fr) 0.9fr 1.4fr 0.8fr 0.7fr",
                      gap: "10px",
                      fontSize: "14px",
                      padding: "8px 0",
                      borderBottom: "1px solid #EFE9DB",
                      alignItems: "baseline",
                    }}
                  >
                    <span>
                      <b>{h.contrato_folio}</b>
                      <span style={{ display: "block", fontSize: "12px", color: "#6B645A" }}>
                        {h.fecha} · {h.cliente_nombre}
                      </span>
                    </span>
                    <span>{h.dias}</span>
                    <span>
                      {h.km_salida.toLocaleString("es-MX")} → {h.km_entrada.toLocaleString("es-MX")}
                    </span>
                    <span style={{ textAlign: "right", fontWeight: 700 }}>
                      {h.recorridos.toLocaleString("es-MX")} km
                    </span>
                    <span style={{ textAlign: "right" }}>{h.km_dia}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: "8px",
                  fontSize: "13px",
                  color: "#6B645A",
                }}
              >
                <span>Acumulado en estas {historialKm.length} rentas</span>
                <b style={{ color: "#1E1A16", fontSize: "16px" }}>
                  {totalKmRecorridos.toLocaleString("es-MX")} km
                </b>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de edición con regla de kilometraje (T-15) */}
      {modalEditar && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30, 26, 22, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
              Editar datos / Corrección de odómetro
            </h3>

            {errorEdit && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#FBE9E7",
                  color: "#8E1016",
                  fontSize: "13px",
                }}
              >
                {errorEdit}
              </div>
            )}

            <form onSubmit={handleGuardarEdicion} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                Kilometraje actual (km)
                <input
                  type="number"
                  value={kmEdit}
                  onChange={(e) => setKmEdit(Number(e.target.value))}
                  min={0}
                  required
                  style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                />
              </label>

              {kmEdit < vehiculo.kilometraje_actual && (
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    background: "#FFF1D6",
                    color: "#7A4A00",
                    fontSize: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <b>¡Atención! Reducción de kilometraje detectada</b>
                  <span>
                    El kilometraje registrado ({vehiculo.kilometraje_actual.toLocaleString("es-MX")} km) se está reduciendo. Solo un administrador puede realizar esta corrección y debe justificarse obligatoriamente para la auditoría (RF-07, T-15).
                  </span>
                  <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontWeight: 600, marginTop: "4px" }}>
                    Motivo de la corrección
                    <input
                      placeholder="Ej. Error tipográfico en recepción previa #08871"
                      value={motivoKm}
                      onChange={(e) => setMotivoKm(e.target.value)}
                      required
                      style={{ height: "38px", borderRadius: "6px", border: "1px solid #CFC8B8", padding: "0 8px", background: "#fff" }}
                    />
                  </label>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setModalEditar(false)}
                  style={{ height: "40px", padding: "0 16px", borderRadius: "20px", border: "1px solid #CFC8B8", background: "#fff", cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ height: "40px", padding: "0 20px", borderRadius: "20px", border: 0, background: "#B5141B", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VehiculoFichaPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Cargando ficha del vehículo...</div>}>
      <VehiculoContenido />
    </Suspense>
  );
}
