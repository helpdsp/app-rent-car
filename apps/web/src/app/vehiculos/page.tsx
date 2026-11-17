/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:28:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T04
 */

"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { SidebarNav } from "@/components/ui";
import {
  obtenerVehiculos,
  obtenerDocumentosDeVehiculo,
  crearVehiculo,
  type VehiculoRow,
} from "@/lib/db/sprint4";

function VehiculosContenido() {
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [vehiculos, setVehiculos] = useState<VehiculoRow[]>(obtenerVehiculos());
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);

  // Formulario nuevo vehículo
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState("Sedán");
  const [color, setColor] = useState("");
  const [placas, setPlacas] = useState("");
  const [kilometraje, setKilometraje] = useState<number>(0);
  const [valorAsegurado, setValorAsegurado] = useState<number>(300_000);
  const [tarifaDia, setTarifaDia] = useState<number>(1_633);
  const [errorAlta, setErrorAlta] = useState<string | null>(null);

  function refrescarLista(estado = filtroEstado, q = busqueda) {
    setVehiculos(obtenerVehiculos({ estado, q }));
  }

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    refrescarLista(filtroEstado, busqueda);
  }

  function cambiarFiltro(nuevoEstado: string) {
    setFiltroEstado(nuevoEstado);
    refrescarLista(nuevoEstado, busqueda);
  }

  function handleCrearVehiculo(e: React.FormEvent) {
    e.preventDefault();
    setErrorAlta(null);

    const resultado = crearVehiculo(
      {
        marca,
        modelo,
        tipo,
        color,
        placas,
        kilometraje_actual: Number(kilometraje),
        valor_asegurado: BigInt(valorAsegurado * 100),
        tarifa_dia: BigInt(tarifaDia * 100),
      },
      {
        id: "11111111-1111-4111-8111-111111111101",
        nombre: "admin@mexicarentacar.com",
        rol: "administrador",
      }
    );

    if (!resultado.ok) {
      setErrorAlta(resultado.error);
      return;
    }

    setMostrarModalNuevo(false);
    setMarca("");
    setModelo("");
    setColor("");
    setPlacas("");
    refrescarLista();
  }

  // Conteos para los botones de filtro
  const todosTotal = obtenerVehiculos().length;
  const disponiblesTotal = obtenerVehiculos({ estado: "disponible" }).length;
  const rentadosTotal = obtenerVehiculos({ estado: "rentado" }).length;
  const mantenimientoTotal = obtenerVehiculos({ estado: "mantenimiento" }).length;
  const docsPorVencerTotal = obtenerVehiculos({ estado: "documentos_por_vencer" }).length;

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
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#6B645A",
              }}
            >
              FLOTA · {todosTotal} VEHÍCULOS
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "36px",
                lineHeight: 1.1,
              }}
            >
              Vehículos
            </h1>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <form onSubmit={handleBuscar}>
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
                  width: "290px",
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
                  aria-label="Buscar vehículo"
                  placeholder="Modelo, placas o clave"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    refrescarLista(filtroEstado, e.target.value);
                  }}
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
            </form>

            <button
              onClick={() => setMostrarModalNuevo(true)}
              style={{
                height: "48px",
                padding: "0 22px",
                borderRadius: "24px",
                border: 0,
                background: "#B5141B",
                color: "#fff",
                font: "inherit",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              + Nuevo vehículo
            </button>
          </div>
        </header>

        {/* Botones de filtro por estado */}
        <div
          role="group"
          aria-label="Filtrar por estado"
          style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
        >
          <button
            onClick={() => cambiarFiltro("todos")}
            aria-pressed={filtroEstado === "todos"}
            style={{
              height: "44px",
              padding: "0 18px",
              borderRadius: "22px",
              border: filtroEstado === "todos" ? 0 : "1px solid #CFC8B8",
              background: filtroEstado === "todos" ? "#1E1A16" : "#fff",
              color: filtroEstado === "todos" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Todos · {todosTotal}
          </button>
          <button
            onClick={() => cambiarFiltro("disponible")}
            aria-pressed={filtroEstado === "disponible"}
            style={{
              height: "44px",
              padding: "0 18px",
              borderRadius: "22px",
              border: filtroEstado === "disponible" ? 0 : "1px solid #CFC8B8",
              background: filtroEstado === "disponible" ? "#1E1A16" : "#fff",
              color: filtroEstado === "disponible" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Disponibles · {disponiblesTotal}
          </button>
          <button
            onClick={() => cambiarFiltro("rentado")}
            aria-pressed={filtroEstado === "rentado"}
            style={{
              height: "44px",
              padding: "0 18px",
              borderRadius: "22px",
              border: filtroEstado === "rentado" ? 0 : "1px solid #CFC8B8",
              background: filtroEstado === "rentado" ? "#1E1A16" : "#fff",
              color: filtroEstado === "rentado" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Rentados · {rentadosTotal}
          </button>
          <button
            onClick={() => cambiarFiltro("mantenimiento")}
            aria-pressed={filtroEstado === "mantenimiento"}
            style={{
              height: "44px",
              padding: "0 18px",
              borderRadius: "22px",
              border: filtroEstado === "mantenimiento" ? 0 : "1px solid #CFC8B8",
              background: filtroEstado === "mantenimiento" ? "#1E1A16" : "#fff",
              color: filtroEstado === "mantenimiento" ? "#fff" : "#1E1A16",
              font: "inherit",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Mantenimiento · {mantenimientoTotal}
          </button>
          <button
            onClick={() => cambiarFiltro("documentos_por_vencer")}
            aria-pressed={filtroEstado === "documentos_por_vencer"}
            style={{
              height: "44px",
              padding: "0 18px",
              borderRadius: "22px",
              border: "1px solid #F0C4BF",
              background: filtroEstado === "documentos_por_vencer" ? "#B5141B" : "#FBE9E7",
              color: filtroEstado === "documentos_por_vencer" ? "#fff" : "#8E1016",
              font: "inherit",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Documentos por vencer · {docsPorVencerTotal}
          </button>
        </div>

        {/* Listado estilo Mockup 9 */}
        <section
          aria-label="Listado"
          style={{
            flex: 1,
            minHeight: 0,
            background: "#fff",
            border: "1px solid #E3DCCB",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2.2fr) 1.5fr 1fr 1.1fr 1.1fr 0.9fr",
              gap: "12px",
              padding: "12px 20px",
              background: "#FBF9F3",
              borderBottom: "1px solid #E3DCCB",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#6B645A",
            }}
          >
            <span>VEHÍCULO</span>
            <span>ESTADO</span>
            <span style={{ textAlign: "right" }}>KILOMETRAJE</span>
            <span>TARJETA CIRC.</span>
            <span>PÓLIZA</span>
            <span style={{ textAlign: "right" }}>TARIFA / DÍA</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {vehiculos.map((v) => {
              const docs = obtenerDocumentosDeVehiculo(v.id);
              const tarjeta = docs.find((d) => d.tipo === "tarjeta_circulacion");
              const poliza = docs.find((d) => d.tipo === "poliza");
              const tarjetaVenceHoy = tarjeta?.fecha_vencimiento === "2026-11-17";
              const tarjetaVencida = tarjeta ? !tarjeta.vigente : true;
              const polizaVencida = poliza ? !poliza.vigente : true;
              const tieneDocInvalido = tarjetaVencida || polizaVencida;

              return (
                <Link
                  key={v.id}
                  href={`/vehiculos/${v.id}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 2.2fr) 1.5fr 1fr 1.1fr 1.1fr 0.9fr",
                    gap: "12px",
                    padding: "0 20px",
                    minHeight: "62px",
                    alignItems: "center",
                    borderBottom: "1px solid #EFE9DB",
                    color: "#1E1A16",
                    textDecoration: "none",
                    fontSize: "15px",
                  }}
                >
                  <span>
                    <b>
                      {v.marca} {v.modelo}
                    </b>
                    <span style={{ display: "block", fontSize: "13px", color: "#6B645A" }}>
                      {v.placas} · {v.color} · clave {v.clave_formato}
                    </span>
                  </span>

                  <span>
                    {tieneDocInvalido ? (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "#FBE9E7",
                          color: "#8E1016",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        No rentable
                      </span>
                    ) : v.estado === "disponible" ? (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "#E3F3EA",
                          color: "#14583A",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        Disponible
                      </span>
                    ) : v.estado === "rentado" ? (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: v.es_rezagado ? "#FBE9E7" : "#FFF1D6",
                          color: v.es_rezagado ? "#8E1016" : "#7A4A00",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {v.es_rezagado
                          ? `Rezagado · ${v.contrato_activo_folio ?? "08155"}`
                          : `Rentado · ${v.contrato_activo_folio ?? "08160"}`}
                      </span>
                    ) : v.estado === "mantenimiento" ? (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "#E8EEF7",
                          color: "#1F3A63",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        Mantenimiento
                      </span>
                    ) : (
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          background: "#EFE9DB",
                          color: "#6B645A",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        Baja
                      </span>
                    )}
                  </span>

                  <span style={{ textAlign: "right" }}>
                    {v.kilometraje_actual.toLocaleString("es-MX")} km
                  </span>

                  <span>
                    {tarjetaVenceHoy ? (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "10px",
                          background: "#FBE9E7",
                          color: "#8E1016",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        Vence hoy
                      </span>
                    ) : tarjeta?.fecha_vencimiento ? (
                      new Date(tarjeta.fecha_vencimiento).toLocaleDateString("es-MX")
                    ) : (
                      <span style={{ color: "#8E1016" }}>Sin tarjeta</span>
                    )}
                  </span>

                  <span>
                    {poliza?.fecha_vencimiento === "2026-11-28" ? (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: "10px",
                          background: "#FFF1D6",
                          color: "#7A4A00",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        {new Date(poliza.fecha_vencimiento).toLocaleDateString("es-MX")}
                      </span>
                    ) : poliza?.fecha_vencimiento ? (
                      new Date(poliza.fecha_vencimiento).toLocaleDateString("es-MX")
                    ) : (
                      <span style={{ color: "#8E1016" }}>Sin póliza</span>
                    )}
                  </span>

                  <span style={{ textAlign: "right", fontWeight: 700 }}>
                    ${Number(v.tarifa_dia / BigInt(100)).toLocaleString("es-MX")}
                  </span>
                </Link>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "10px 20px",
              borderTop: "1px solid #E3DCCB",
              fontSize: "13px",
              color: "#6B645A",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Mostrando {vehiculos.length} de {todosTotal}
            </span>
            <span>Un vehículo con tarjeta o póliza vencida queda como no rentable</span>
          </div>
        </section>
      </main>

      {/* Modal de nuevo vehículo */}
      {mostrarModalNuevo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-nuevo-vehiculo"
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
              maxWidth: "520px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 id="modal-nuevo-vehiculo" style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
              Alta de nuevo vehículo
            </h3>

            {errorAlta && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#FBE9E7",
                  color: "#8E1016",
                  fontSize: "13px",
                }}
              >
                {errorAlta}
              </div>
            )}

            <form onSubmit={handleCrearVehiculo} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Marca
                  <input
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Ej. Hyundai"
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Modelo
                  <input
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ej. Elantra"
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Tipo
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px", background: "#fff" }}
                  >
                    <option value="Sedán">Sedán</option>
                    <option value="SUV">SUV</option>
                    <option value="Compacto">Compacto</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Color
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ej. Azul"
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Placas
                  <input
                    value={placas}
                    onChange={(e) => setPlacas(e.target.value.toUpperCase())}
                    placeholder="ATU-703-A"
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Kilometraje inicial
                  <input
                    type="number"
                    value={kilometraje}
                    onChange={(e) => setKilometraje(Number(e.target.value))}
                    min={0}
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Valor asegurado ($)
                  <input
                    type="number"
                    value={valorAsegurado}
                    onChange={(e) => setValorAsegurado(Number(e.target.value))}
                    min={1000}
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", fontWeight: 600 }}>
                  Tarifa por día ($)
                  <input
                    type="number"
                    value={tarifaDia}
                    onChange={(e) => setTarifaDia(Number(e.target.value))}
                    min={100}
                    required
                    style={{ height: "42px", borderRadius: "8px", border: "1px solid #CFC8B8", padding: "0 10px" }}
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setMostrarModalNuevo(false)}
                  style={{
                    height: "44px",
                    padding: "0 18px",
                    borderRadius: "22px",
                    border: "1px solid #CFC8B8",
                    background: "#fff",
                    font: "inherit",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    height: "44px",
                    padding: "0 22px",
                    borderRadius: "22px",
                    border: 0,
                    background: "#B5141B",
                    color: "#fff",
                    font: "inherit",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Guardar vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VehiculosPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", textAlign: "center" }}>Cargando catálogo de vehículos...</div>}>
      <VehiculosContenido />
    </Suspense>
  );
}
