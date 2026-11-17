/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer + design-ux-architect
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T05
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav, Icons } from "@/components/ui";
import { obtenerReservaciones, type ReservacionRow } from "@/lib/db/reservaciones";

export default function ReservacionesPage() {
  const router = useRouter();
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [reservas, setReservas] = useState<ReservacionRow[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargarReservas = () => {
    const data = obtenerReservaciones({ estado: filtroEstado, q: busqueda });
    setReservas(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarReservas();
  }, [filtroEstado, busqueda]);

  const handleConvertir = async (id: string, folio: string) => {
    try {
      const res = await fetch(`/api/reservaciones/${id}/convertir`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setMensaje(`Reservación ${folio} convertida a Contrato con folio ${json.data.contratoFolio}.`);
        cargarReservas();
        // Redirigir a contratos
        setTimeout(() => {
          router.push(`/contratos`);
        }, 1200);
      }
    } catch {
      setMensaje("Error al convertir la reservación a contrato.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-[#F6F2E8] text-[#1E1A16] font-sans pb-20 md:pb-0">
      <SidebarNav seccionActiva="reservaciones" />

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col gap-5">
        {/* Encabezado Responsivo */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#B5141B] text-white flex items-center justify-center shadow-sm">
                <Icons.Reservaciones size={22} color="#ffffff" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1A16]">
                Reservaciones de Flota
              </h1>
            </div>
            <p className="text-sm text-[#7E756B] mt-1">
              Apartados previos, disponibilidad futura y conversión directa a contrato en mostrador.
            </p>
          </div>

          <Link
            href="/reservaciones/nueva"
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Icons.Plus size={18} />
            <span>Nueva Reservación</span>
          </Link>
        </header>

        {/* Notificación de éxito */}
        {mensaje && (
          <div className="p-3.5 px-4 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Success size={18} />
              <span>{mensaje}</span>
            </div>
            <button onClick={() => setMensaje(null)} className="text-[#166534] hover:opacity-75">
              <Icons.Close size={16} />
            </button>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              placeholder="Buscar por folio (R-00001), cliente o vehículo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#D5CDBE] bg-white text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
            />
            <div className="absolute left-3 top-3 text-[#A89F91]">
              <Icons.Search size={18} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setFiltroEstado("todos")}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filtroEstado === "todos"
                  ? "bg-[#1E1A16] text-white"
                  : "bg-white border border-[#D5CDBE] text-[#4B443B] hover:bg-[#F2ECE1]"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroEstado("confirmada")}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filtroEstado === "confirmada"
                  ? "bg-[#166534] text-white"
                  : "bg-white border border-[#D5CDBE] text-[#166534] hover:bg-[#DCFCE7]"
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setFiltroEstado("pendiente")}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filtroEstado === "pendiente"
                  ? "bg-[#D97706] text-white"
                  : "bg-white border border-[#D5CDBE] text-[#D97706] hover:bg-[#FEF3C7]"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado("convertida")}
              className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filtroEstado === "convertida"
                  ? "bg-[#1E40AF] text-white"
                  : "bg-white border border-[#D5CDBE] text-[#1E40AF] hover:bg-[#DBEAFE]"
              }`}
            >
              En Contrato
            </button>
          </div>
        </div>

        {/* 1. Vista Móvil en Tarjetas (<md) */}
        <div className="flex flex-col gap-3.5 md:hidden">
          {reservas.map((r) => {
            const fechaIni = new Date(r.fecha_inicio).toLocaleDateString("es-MX", { month: "short", day: "numeric" });
            const fechaDev = new Date(r.fecha_fin).toLocaleDateString("es-MX", { month: "short", day: "numeric" });

            return (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-white border border-[#E5DECE] shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#B5141B] bg-[#B5141B]/10 px-2.5 py-0.5 rounded-md">
                      {r.folio}
                    </span>
                    <h3 className="text-base font-bold text-[#1E1A16] mt-1">
                      {r.cliente_nombre}
                    </h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      r.estado === "confirmada"
                        ? "bg-[#DCFCE7] text-[#166534]"
                        : r.estado === "pendiente"
                        ? "bg-[#FEF3C7] text-[#B45309]"
                        : r.estado === "convertida"
                        ? "bg-[#DBEAFE] text-[#1E40AF]"
                        : "bg-[#FEE2E2] text-[#991B1B]"
                    }`}
                  >
                    {r.estado.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-[#4B443B] bg-[#FAF7F2] p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Icons.Vehiculos size={16} />
                    <span>{r.vehiculo_descripcion}</span>
                  </div>
                  <span className="text-[#7E756B]">{r.vehiculo_placas}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#665E55] pt-1">
                  <div className="flex items-center gap-1.5">
                    <Icons.CalendarDate size={15} />
                    <span>{fechaIni} → {fechaDev} ({r.dias_renta}d)</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 font-bold text-[#1E1A16]">
                    <span>Anticipo: ${(Number(r.anticipo_requerido) / 100).toLocaleString("es-MX")}</span>
                  </div>
                </div>

                {r.estado !== "convertida" && r.estado !== "cancelada" && (
                  <div className="pt-2 border-t border-[#F2ECE1] flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleConvertir(r.id, r.folio)}
                      className="w-full sm:w-auto min-h-[40px] px-4 py-2 rounded-xl bg-[#1E1A16] hover:bg-[#332C25] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Icons.Contratos size={15} />
                      <span>Entregar Auto (Generar Contrato)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {reservas.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5DECE] text-[#7E756B]">
              <Icons.Reservaciones size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium text-sm">No hay reservaciones registradas.</p>
            </div>
          )}
        </div>

        {/* 2. Vista de Escritorio en Tabla (md y superior) */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#E5DECE] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DECE] text-xs font-bold text-[#7E756B] uppercase tracking-wider">
                <th className="py-3.5 px-4">Folio</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Vehículo</th>
                <th className="py-3.5 px-4">Periodo de Renta</th>
                <th className="py-3.5 px-4">Anticipo</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-sm">
              {reservas.map((r) => {
                const fIni = new Date(r.fecha_inicio).toLocaleDateString("es-MX", { month: "short", day: "numeric" });
                const fFin = new Date(r.fecha_fin).toLocaleDateString("es-MX", { month: "short", day: "numeric" });

                return (
                  <tr key={r.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#B5141B]">
                      {r.folio}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1E1A16]">{r.cliente_nombre}</div>
                      <div className="text-xs text-[#7E756B]">{r.cliente_telefono || "Sin tel."}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#1E1A16]">{r.vehiculo_descripcion}</div>
                      <div className="text-xs text-[#7E756B]">{r.vehiculo_placas}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4B443B]">
                      <div className="font-medium">{fIni} al {fFin}</div>
                      <div className="text-xs text-[#7E756B]">{r.dias_renta} días calculados</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1E1A16]">
                        ${(Number(r.anticipo_requerido) / 100).toLocaleString("es-MX")}
                      </div>
                      <div className="text-xs text-[#7E756B]">
                        Pagado: ${(Number(r.anticipo_pagado) / 100).toLocaleString("es-MX")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          r.estado === "confirmada"
                            ? "bg-[#DCFCE7] text-[#166534]"
                            : r.estado === "pendiente"
                            ? "bg-[#FEF3C7] text-[#B45309]"
                            : r.estado === "convertida"
                            ? "bg-[#DBEAFE] text-[#1E40AF]"
                            : "bg-[#FEE2E2] text-[#991B1B]"
                        }`}
                      >
                        {r.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {r.estado !== "convertida" && r.estado !== "cancelada" ? (
                        <button
                          type="button"
                          onClick={() => handleConvertir(r.id, r.folio)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#1E1A16] hover:bg-[#332C25] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Icons.Contratos size={14} />
                          Entregar Auto
                        </button>
                      ) : (
                        <span className="text-xs text-[#7E756B] font-medium">Concluida</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {reservas.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#7E756B]">
                    No se encontraron reservaciones en este filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
