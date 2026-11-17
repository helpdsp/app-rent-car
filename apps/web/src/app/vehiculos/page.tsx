/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer + design-ux-architect
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T04
 */

"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { SidebarNav, Icons, ConfirmDialog } from "@/components/ui";
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
  const [mostrarConfirmDescarte, setMostrarConfirmDescarte] = useState(false);

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

  const formularioSucio = Boolean(marca || modelo || color || placas || kilometraje > 0);

  function intentarCerrarModal() {
    if (formularioSucio) {
      setMostrarConfirmDescarte(true);
    } else {
      cerrarModalDefinitivo();
    }
  }

  function cerrarModalDefinitivo() {
    setMostrarModalNuevo(false);
    setMostrarConfirmDescarte(false);
    setMarca("");
    setModelo("");
    setColor("");
    setPlacas("");
    setKilometraje(0);
    setErrorAlta(null);
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

    cerrarModalDefinitivo();
    refrescarLista();
  }

  const todosTotal = obtenerVehiculos().length;
  const disponiblesTotal = obtenerVehiculos({ estado: "disponible" }).length;
  const rentadosTotal = obtenerVehiculos({ estado: "rentado" }).length;
  const mantenimientoTotal = obtenerVehiculos({ estado: "mantenimiento" }).length;
  const docsPorVencerTotal = obtenerVehiculos({ estado: "documentos_por_vencer" }).length;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-[#F6F2E8] text-[#1E1A16] font-sans pb-20 md:pb-0">
      <SidebarNav seccionActiva="vehiculos" />

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col gap-5">
        {/* Encabezado Responsivo */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#1E1A16] text-[#F6F2E8] flex items-center justify-center shadow-sm">
                <Icons.Vehiculos size={22} color="#F6F2E8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1A16]">
                Flota de Vehículos
              </h1>
            </div>
            <p className="text-sm text-[#7E756B] mt-1">
              Control de unidades, disponibilidad, pólizas y kilometraje.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <form onSubmit={handleBuscar} className="relative flex-1 sm:w-64">
              <input
                aria-label="Buscar vehículo"
                placeholder="Modelo, placas o clave..."
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  refrescarLista(filtroEstado, e.target.value);
                }}
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#D5CDBE] bg-white text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
              />
              <div className="absolute left-3 top-3 text-[#A89F91]">
                <Icons.Search size={18} />
              </div>
            </form>

            <button
              onClick={() => setMostrarModalNuevo(true)}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Icons.Plus size={18} />
              <span>Nuevo Vehículo</span>
            </button>
          </div>
        </header>

        {/* Filtros por Estado */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filtrar por estado">
          <button
            onClick={() => cambiarFiltro("todos")}
            className={`min-h-[38px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filtroEstado === "todos"
                ? "bg-[#1E1A16] text-white shadow-sm"
                : "bg-white border border-[#D5CDBE] text-[#4B443B] hover:bg-[#F2ECE1]"
            }`}
          >
            <span>Todos</span>
            <span className="opacity-75 font-normal">({todosTotal})</span>
          </button>
          <button
            onClick={() => cambiarFiltro("disponible")}
            className={`min-h-[38px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filtroEstado === "disponible"
                ? "bg-[#166534] text-white shadow-sm"
                : "bg-white border border-[#D5CDBE] text-[#166534] hover:bg-[#DCFCE7]"
            }`}
          >
            <Icons.Success size={15} color={filtroEstado === "disponible" ? "#ffffff" : "#166534"} />
            <span>Disponibles</span>
            <span className="opacity-75 font-normal">({disponiblesTotal})</span>
          </button>
          <button
            onClick={() => cambiarFiltro("rentado")}
            className={`min-h-[38px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filtroEstado === "rentado"
                ? "bg-[#1E40AF] text-white shadow-sm"
                : "bg-white border border-[#D5CDBE] text-[#1E40AF] hover:bg-[#DBEAFE]"
            }`}
          >
            <span>Rentados</span>
            <span className="opacity-75 font-normal">({rentadosTotal})</span>
          </button>
          <button
            onClick={() => cambiarFiltro("mantenimiento")}
            className={`min-h-[38px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filtroEstado === "mantenimiento"
                ? "bg-[#9A3412] text-white shadow-sm"
                : "bg-white border border-[#D5CDBE] text-[#9A3412] hover:bg-[#FFEDD5]"
            }`}
          >
            <Icons.Warning size={15} color={filtroEstado === "mantenimiento" ? "#ffffff" : "#9A3412"} />
            <span>Taller</span>
            <span className="opacity-75 font-normal">({mantenimientoTotal})</span>
          </button>
          {docsPorVencerTotal > 0 && (
            <button
              onClick={() => cambiarFiltro("documentos_por_vencer")}
              className={`min-h-[38px] px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                filtroEstado === "documentos_por_vencer"
                  ? "bg-[#991B1B] text-white shadow-sm"
                  : "bg-white border border-[#D5CDBE] text-[#991B1B] hover:bg-[#FEE2E2]"
              }`}
            >
              <Icons.Danger size={15} color={filtroEstado === "documentos_por_vencer" ? "#ffffff" : "#991B1B"} />
              <span>Docs por Vencer</span>
              <span className="opacity-75 font-normal">({docsPorVencerTotal})</span>
            </button>
          )}
        </div>

        {/* 1. Vista Móvil en Tarjetas Táctiles (<md) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
          {vehiculos.map((v) => {
            const docs = obtenerDocumentosDeVehiculo(v.id);
            const poliza = docs.find((d) => d.tipo === "poliza");
            const esDisponible = v.estado === "disponible";

            return (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-white border border-[#E5DECE] shadow-sm flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#7E756B] bg-[#F2ECE1] px-2 py-0.5 rounded-md">
                        {v.clave_formato} · {v.tipo}
                      </span>
                      <h3 className="text-base font-bold text-[#1E1A16] mt-1">
                        {v.marca} {v.modelo}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        esDisponible
                          ? "bg-[#DCFCE7] text-[#166534]"
                          : v.estado === "rentado"
                          ? "bg-[#DBEAFE] text-[#1E40AF]"
                          : "bg-[#FFEDD5] text-[#9A3412]"
                      }`}
                    >
                      {v.estado === "disponible" ? "Disponible" : v.estado === "rentado" ? "Rentado" : "En Taller"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#665E55] mt-3 pt-3 border-t border-[#F2ECE1]">
                    <div className="flex items-center gap-1.5">
                      <Icons.Vehiculos size={14} />
                      <span className="font-semibold text-[#1E1A16]">{v.placas}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icons.Odometer size={14} />
                      <span>{v.kilometraje_actual.toLocaleString("es-MX")} km</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Icons.FileCheck size={14} />
                      <span>
                        Póliza:{" "}
                        {poliza?.fecha_vencimiento
                          ? new Date(poliza.fecha_vencimiento).toLocaleDateString("es-MX")
                          : "Sin póliza"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE1]">
                  <div>
                    <span className="text-xs text-[#7E756B] block">Tarifa día</span>
                    <span className="text-base font-extrabold text-[#1E1A16]">
                      ${Number(v.tarifa_dia / BigInt(100)).toLocaleString("es-MX")}{" "}
                      <span className="text-xs font-normal text-[#7E756B]">MXN</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/vehiculos/${v.id}`}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#D5CDBE] text-xs font-semibold text-[#1E1A16] hover:bg-[#F6F2E8] flex items-center gap-1"
                    >
                      <Icons.Eye size={15} />
                      Ver
                    </Link>
                    {esDisponible && (
                      <Link
                        href={`/contratos/nuevo?vehiculo=${v.id}`}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#B5141B] text-xs font-bold text-white hover:bg-[#8F1015] flex items-center gap-1 shadow-sm"
                      >
                        <Icons.Plus size={15} />
                        Rentar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {vehiculos.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-[#E5DECE] text-[#7E756B]">
              <Icons.Vehiculos size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium text-sm">No se encontraron vehículos en este filtro.</p>
            </div>
          )}
        </div>

        {/* 2. Vista de Escritorio en Tabla Tradicional (md y superior) */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#E5DECE] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DECE] text-xs font-bold text-[#7E756B] uppercase tracking-wider">
                <th className="py-3.5 px-4">Clave</th>
                <th className="py-3.5 px-4">Vehículo</th>
                <th className="py-3.5 px-4">Placas / Odómetro</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Póliza Seguro</th>
                <th className="py-3.5 px-4">Tarifa / Día</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-sm">
              {vehiculos.map((v) => {
                const docs = obtenerDocumentosDeVehiculo(v.id);
                const poliza = docs.find((d) => d.tipo === "poliza");
                const esDisponible = v.estado === "disponible";

                return (
                  <tr key={v.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#1E1A16]">
                      {v.clave_formato}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1E1A16]">{v.marca} {v.modelo}</div>
                      <div className="text-xs text-[#7E756B]">{v.tipo} · {v.color}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4B443B]">
                      <div className="font-medium">{v.placas}</div>
                      <div className="text-xs text-[#7E756B] flex items-center gap-1">
                        <Icons.Odometer size={13} />
                        {v.kilometraje_actual.toLocaleString("es-MX")} km
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          esDisponible
                            ? "bg-[#DCFCE7] text-[#166534]"
                            : v.estado === "rentado"
                            ? "bg-[#DBEAFE] text-[#1E40AF]"
                            : "bg-[#FFEDD5] text-[#9A3412]"
                        }`}
                      >
                        {v.estado === "disponible" ? "Disponible" : v.estado === "rentado" ? "Rentado" : "En Taller"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#4B443B]">
                      {poliza?.fecha_vencimiento
                        ? new Date(poliza.fecha_vencimiento).toLocaleDateString("es-MX")
                        : <span className="text-[#991B1B] font-semibold">Sin póliza</span>}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#1E1A16]">
                      ${Number(v.tarifa_dia / BigInt(100)).toLocaleString("es-MX")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/vehiculos/${v.id}`}
                          className="p-2 rounded-lg text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F2ECE1] transition-colors"
                          title="Ver detalle"
                        >
                          <Icons.Eye size={16} />
                        </Link>
                        {esDisponible && (
                          <Link
                            href={`/contratos/nuevo?vehiculo=${v.id}`}
                            className="px-3 py-1.5 rounded-lg bg-[#B5141B] hover:bg-[#8F1015] text-white text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <Icons.Plus size={14} />
                            Rentar
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {vehiculos.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7E756B]">
                    No se encontraron vehículos en este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de nuevo vehículo con dirty check y botón de cancelar */}
      {mostrarModalNuevo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-nuevo-vehiculo"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5DECE] overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2ECE1] bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#B5141B]/10 text-[#B5141B] flex items-center justify-center">
                  <Icons.Vehiculos size={20} color="#B5141B" />
                </div>
                <h3 id="modal-nuevo-vehiculo" className="text-lg font-bold text-[#1E1A16]">
                  Alta de Nuevo Vehículo
                </h3>
              </div>
              <button
                type="button"
                onClick={intentarCerrarModal}
                className="w-9 h-9 rounded-xl text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#EFEAE1] flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <Icons.Close size={20} />
              </button>
            </div>

            {errorAlta && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs font-semibold">
                {errorAlta}
              </div>
            )}

            <form onSubmit={handleCrearVehiculo} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Marca *
                  </label>
                  <input
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Ej. Hyundai"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Modelo *
                  </label>
                  <input
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ej. Elantra"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Tipo
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  >
                    <option value="Sedán">Sedán</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Minivan">Minivan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Color *
                  </label>
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ej. Plata"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Placas *
                  </label>
                  <input
                    value={placas}
                    onChange={(e) => setPlacas(e.target.value.toUpperCase())}
                    placeholder="ABC-123-A"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] font-mono focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    value={kilometraje}
                    onChange={(e) => setKilometraje(Number(e.target.value))}
                    min={0}
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Valor Asegurado ($)
                  </label>
                  <input
                    type="number"
                    value={valorAsegurado}
                    onChange={(e) => setValorAsegurado(Number(e.target.value))}
                    min={1000}
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1">
                    Tarifa / Día ($)
                  </label>
                  <input
                    type="number"
                    value={tarifaDia}
                    onChange={(e) => setTarifaDia(Number(e.target.value))}
                    min={100}
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
              </div>

              {/* Botones de acción con Cancelar explícito */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#F2ECE1] mt-2">
                <button
                  type="button"
                  onClick={intentarCerrarModal}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D5CDBE] bg-white hover:bg-[#F6F2E8] text-[#1E1A16] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Close size={18} />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <Icons.Check size={18} />
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación al descartar cambios */}
      <ConfirmDialog
        isOpen={mostrarConfirmDescarte}
        title="¿Descartar cambios no guardados?"
        message="Tienes información ingresada en el alta del vehículo. Si cancelas ahora, no se registrará la unidad."
        confirmText="Descartar cambios"
        cancelText="Continuar editando"
        variant="warning"
        onConfirm={cerrarModalDefinitivo}
        onCancel={() => setMostrarConfirmDescarte(false)}
      />
    </div>
  );
}

export default function VehiculosPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[#7E756B]">Cargando catálogo de vehículos...</div>}>
      <VehiculosContenido />
    </Suspense>
  );
}
