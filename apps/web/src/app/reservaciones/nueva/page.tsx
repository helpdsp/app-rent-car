/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer + design-ux-architect
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T06
 */

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav, Icons, DatePicker, TimePicker, ConfirmDialog } from "@/components/ui";
import { obtenerVehiculos, type VehiculoRow } from "@/lib/db/sprint4";
import { obtenerClientes, type ClienteRow } from "@/lib/db/sprint3";

function NuevaReservacionContent() {
  const router = useRouter();

  // Paso actual (1: Fechas y Auto, 2: Cotización y Anticipo, 3: Cliente y Confirmación)
  const [paso, setPaso] = useState<number>(1);

  // Parámetros de Fechas
  const hoyStr = new Date().toISOString().split("T")[0];
  const dentroDeTresDias = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];

  const [fechaSalida, setFechaSalida] = useState<string>(hoyStr);
  const [horaSalida, setHoraSalida] = useState<string>("11:00");
  const [fechaDevolucion, setFechaDevolucion] = useState<string>(dentroDeTresDias);
  const [horaDevolucion, setHoraDevolucion] = useState<string>("11:00");

  // Vehículo seleccionado
  const vehiculos = obtenerVehiculos({ estado: "disponible" });
  const [vehiculoSeleccionadoId, setVehiculoSeleccionadoId] = useState<string>(
    vehiculos[0]?.id || "44444444-4444-4444-8444-444444444003"
  );

  // Cliente seleccionado
  const clientes = obtenerClientes();
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<string>(
    clientes[0]?.id || "22222222-2222-4222-8222-222222222001"
  );
  const [observaciones, setObservaciones] = useState<string>("");
  const [anticipoPagado, setAnticipoPagado] = useState<number>(0);

  const [guardando, setGuardando] = useState<boolean>(false);
  const [mostrarConfirmCancelar, setMostrarConfirmCancelar] = useState<boolean>(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const vehiculoActivo =
    vehiculos.find((v) => v.id === vehiculoSeleccionadoId) || vehiculos[0];
  const clienteActivo =
    clientes.find((c) => c.id === clienteSeleccionadoId) || clientes[0];

  // Cálculo de días
  const fIni = new Date(`${fechaSalida}T${horaSalida}:00`);
  const fFin = new Date(`${fechaDevolucion}T${horaDevolucion}:00`);
  const diffHoras = Math.max(24, (fFin.getTime() - fIni.getTime()) / (1000 * 60 * 60));
  const diasCalculados = Math.max(1, Math.ceil(diffHoras / 24));

  const tarifaDia = vehiculoActivo ? Number(vehiculoActivo.tarifa_dia) : 163300;
  const anticipoTotal = tarifaDia * diasCalculados;

  const handleCrearReservacion = async () => {
    setGuardando(true);
    setErrorEnvio(null);

    try {
      const res = await fetch("/api/reservaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clienteActivo.id,
          vehiculo_id: vehiculoActivo.id,
          fecha_inicio: fIni.toISOString(),
          fecha_fin: fFin.toISOString(),
          lugar_entrega: "Sucursal Mexicali",
          lugar_devolucion: "Sucursal Mexicali",
          anticipo_pagado: anticipoPagado > 0 ? anticipoPagado * 100 : anticipoTotal,
          observaciones,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorEnvio(json.error || "No se pudo registrar la reservación.");
        return;
      }

      router.push("/reservaciones");
    } catch {
      setErrorEnvio("Error de conexión al guardar la reservación.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col md:flex-row bg-[#F6F2E8] text-[#1E1A16] font-sans pb-24 md:pb-6">
        <SidebarNav seccionActiva="reservaciones" />

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          {/* Encabezado */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7E756B]">
                <Link href="/reservaciones" className="hover:text-[#1E1A16] flex items-center gap-1">
                  <Icons.Back size={14} />
                  <span>Reservaciones</span>
                </Link>
                <span>/</span>
                <span className="text-[#B5141B] font-bold">Nueva Reservación</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1A16] mt-1">
                Apartado y Disponibilidad de Unidad
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setMostrarConfirmCancelar(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D5CDBE] bg-white hover:bg-[#F2ECE1] text-[#1E1A16] font-semibold text-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Icons.Close size={18} />
              <span>Cancelar</span>
            </button>
          </header>

          {/* Stepper de 3 Pasos */}
          <div className="bg-white rounded-2xl border border-[#E5DECE] p-4 flex items-center justify-around text-xs font-semibold text-[#7E756B] shadow-sm">
            <button
              type="button"
              onClick={() => setPaso(1)}
              className={`flex items-center gap-2 transition-colors ${
                paso === 1 ? "text-[#B5141B] font-bold" : "opacity-80"
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                paso === 1 ? "bg-[#B5141B] text-white" : "bg-[#F2ECE1] text-[#7E756B]"
              }`}>1</span>
              <span>Fechas y Auto</span>
            </button>
            <span className="text-[#CFC8B8]">→</span>
            <button
              type="button"
              onClick={() => setPaso(2)}
              className={`flex items-center gap-2 transition-colors ${
                paso === 2 ? "text-[#B5141B] font-bold" : "opacity-80"
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                paso === 2 ? "bg-[#B5141B] text-white" : "bg-[#F2ECE1] text-[#7E756B]"
              }`}>2</span>
              <span>Cotización</span>
            </button>
            <span className="text-[#CFC8B8]">→</span>
            <button
              type="button"
              onClick={() => setPaso(3)}
              className={`flex items-center gap-2 transition-colors ${
                paso === 3 ? "text-[#B5141B] font-bold" : "opacity-80"
              }`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                paso === 3 ? "bg-[#B5141B] text-white" : "bg-[#F2ECE1] text-[#7E756B]"
              }`}>3</span>
              <span>Cliente y Confirmación</span>
            </button>
          </div>

          {errorEnvio && (
            <div className="p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-sm font-semibold flex items-center gap-2">
              <Icons.Danger size={20} />
              <span>{errorEnvio}</span>
            </div>
          )}

          {/* Contenido del Paso 1: Fechas y Selección de Auto */}
          {paso === 1 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl border border-[#E5DECE] p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-base font-bold text-[#1E1A16] flex items-center gap-2">
                  <Icons.CalendarDate size={20} color="#B5141B" />
                  <span>Selección de Fechas y Horarios (DatePicker Interactivo)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DatePicker
                    label="Fecha de Salida"
                    value={fechaSalida}
                    onChange={(val) => setFechaSalida(val)}
                    minDate={hoyStr}
                    required
                  />

                  <TimePicker
                    label="Hora de Salida"
                    value={horaSalida}
                    onChange={(val) => setHoraSalida(val)}
                    required
                  />

                  <DatePicker
                    label="Fecha de Devolución"
                    value={fechaDevolucion}
                    onChange={(val) => setFechaDevolucion(val)}
                    minDate={fechaSalida || hoyStr}
                    required
                  />

                  <TimePicker
                    label="Hora de Devolución"
                    value={horaDevolucion}
                    onChange={(val) => setHoraDevolucion(val)}
                    required
                  />
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5DECE] flex items-center justify-between text-xs text-[#665E55]">
                  <span>Duración de renta calculada: <b>{diasCalculados} días</b> (tolerancia oficial 59 min)</span>
                  <span className="font-semibold text-[#1E1A16]">Mexicali, B.C. (America/Tijuana)</span>
                </div>
              </div>

              {/* Selección de Vehículo */}
              <div className="bg-white rounded-2xl border border-[#E5DECE] p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#1E1A16] flex items-center gap-2">
                  <Icons.Vehiculos size={20} color="#B5141B" />
                  <span>Vehículos Disponibles para las Fechas Seleccionadas</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {vehiculos.map((v) => {
                    const seleccionado = v.id === vehiculoActivo?.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVehiculoSeleccionadoId(v.id)}
                        className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 ${
                          seleccionado
                            ? "border-[#B5141B] bg-[#FFF5F5] ring-2 ring-[#B5141B]/20 shadow-sm"
                            : "border-[#D5CDBE] bg-white hover:border-[#1E1A16]"
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <span className="text-xs font-bold text-[#7E756B] bg-[#F2ECE1] px-2 py-0.5 rounded-md">
                              {v.clave_formato} · {v.tipo}
                            </span>
                            <h4 className="text-base font-bold text-[#1E1A16] mt-1">{v.marca} {v.modelo}</h4>
                          </div>
                          <span className="text-xs font-bold bg-[#DCFCE7] text-[#166534] px-2.5 py-0.5 rounded-full">
                            Disponible
                          </span>
                        </div>

                        <div className="text-xs text-[#665E55] flex items-center gap-3 pt-2 border-t border-[#F2ECE1]">
                          <span>Placas: <b>{v.placas}</b></span>
                          <span>Color: <b>{v.color}</b></span>
                        </div>

                        <div className="text-base font-extrabold text-[#1E1A16] pt-1">
                          ${(Number(v.tarifa_dia) / 100).toLocaleString("es-MX")}{" "}
                          <span className="text-xs font-normal text-[#7E756B]">/ día</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-[#F2ECE1]">
                  <button
                    type="button"
                    onClick={() => setPaso(2)}
                    className="min-h-[46px] px-6 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Continuar a Cotización</span>
                    <Icons.ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contenido del Paso 2: Cotización y Resumen */}
          {paso === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5DECE] p-6 shadow-sm flex flex-col gap-5">
                <h3 className="text-lg font-bold text-[#1E1A16]">Desglose de Cotización de Reserva</h3>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
                    <span className="text-[#665E55]">Vehículo seleccionado:</span>
                    <span className="font-bold text-[#1E1A16]">{vehiculoActivo?.marca} {vehiculoActivo?.modelo} ({vehiculoActivo?.placas})</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
                    <span className="text-[#665E55]">Tarifa diaria oficial:</span>
                    <span className="font-bold">${(tarifaDia / 100).toLocaleString("es-MX")} MXN</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
                    <span className="text-[#665E55]">Días calculados:</span>
                    <span className="font-bold">{diasCalculados} días</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
                    <span className="text-[#665E55]">Kilómetros incluidos:</span>
                    <span className="font-semibold">{diasCalculados * 500} km (500 km por día)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F2ECE1]">
                    <span className="text-[#665E55]">Depósito en garantía (voucher en mostrador):</span>
                    <span className="font-semibold">$8,000.00 MXN</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DECE] flex flex-col gap-2">
                  <label className="block text-xs font-bold text-[#4B443B] uppercase">
                    Anticipo a pagar para confirmar reserva
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#B5141B]">$</span>
                    <input
                      type="number"
                      placeholder={`${anticipoTotal / 100}`}
                      defaultValue={anticipoTotal / 100}
                      onChange={(e) => setAnticipoPagado(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] bg-white text-base font-bold text-[#1E1A16]"
                    />
                  </div>
                  <p className="text-xs text-[#7E756B]">
                    El anticipo mínimo recomendado es el 100% de la tarifa ({diasCalculados} días × ${(tarifaDia / 100).toLocaleString("es-MX")}).
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1]">
                  <button
                    type="button"
                    onClick={() => setPaso(1)}
                    className="min-h-[44px] px-5 rounded-xl border border-[#D5CDBE] text-sm font-semibold hover:bg-[#F2ECE1]"
                  >
                    Volver a Fechas
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaso(3)}
                    className="min-h-[46px] px-6 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                  >
                    <span>Asignar Cliente</span>
                    <Icons.ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Resumen Lateral */}
              <aside className="bg-white rounded-2xl border border-[#E5DECE] p-6 shadow-sm flex flex-col justify-between gap-4 h-fit">
                <div>
                  <h4 className="text-base font-bold text-[#1E1A16] pb-2 border-b border-[#F2ECE1]">
                    Resumen de Apartado
                  </h4>
                  <div className="text-xs text-[#665E55] mt-3 flex flex-col gap-2">
                    <div><b>Salida:</b> {fechaSalida} a las {horaSalida} hrs</div>
                    <div><b>Retorno:</b> {fechaDevolucion} a las {horaDevolucion} hrs</div>
                    <div><b>Lugar:</b> Sucursal Mexicali</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1E1A16] text-white">
                  <span className="text-xs font-bold text-[#CFC8B8] block">Total Anticipo</span>
                  <div className="text-3xl font-extrabold mt-1">
                    ${(anticipoTotal / 100).toLocaleString("es-MX")}{" "}
                    <span className="text-xs font-normal text-[#CFC8B8]">MXN</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Contenido del Paso 3: Asignación de Cliente y Confirmación */}
          {paso === 3 && (
            <div className="bg-white rounded-2xl border border-[#E5DECE] p-6 shadow-sm flex flex-col gap-6 animate-in fade-in duration-150">
              <h3 className="text-lg font-bold text-[#1E1A16] flex items-center gap-2">
                <Icons.Clientes size={20} color="#B5141B" />
                <span>Asignación de Cliente y Confirmación de Apartado</span>
              </h3>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase mb-1.5">
                    Selecciona al Cliente Registrado
                  </label>
                  <select
                    value={clienteSeleccionadoId}
                    onChange={(e) => setClienteSeleccionadoId(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl border border-[#D5CDBE] bg-white text-sm font-semibold text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  >
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        #{c.numero_cliente} · {c.nombre_completo} ({c.telefono || "Sin teléfono"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B443B] uppercase mb-1.5">
                    Observaciones y Notas de la Reservación
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Instrucciones especiales, viaje a EUA, requerimiento de silla de bebé, etc."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#D5CDBE] bg-white text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                  />
                </div>
              </div>

              {/* Botones de Finalización */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F2ECE1]">
                <button
                  type="button"
                  onClick={() => setPaso(2)}
                  className="w-full sm:w-auto min-h-[44px] px-5 rounded-xl border border-[#D5CDBE] text-sm font-semibold hover:bg-[#F2ECE1]"
                >
                  Volver a Cotización
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmCancelar(true)}
                    className="w-full sm:w-auto min-h-[44px] px-5 rounded-xl border border-[#D5CDBE] text-sm font-semibold hover:bg-[#F2ECE1]"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={guardando}
                    onClick={handleCrearReservacion}
                    className="w-full sm:w-auto min-h-[46px] px-6 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Icons.Check size={18} />
                    <span>{guardando ? "Generando Folio..." : "Confirmar y Generar Reservación"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirm Dialog al cancelar */}
      <ConfirmDialog
        isOpen={mostrarConfirmCancelar}
        title="¿Cancelar nueva reservación?"
        message="Se descartarán las fechas y el vehículo seleccionado. La reserva no se registrará."
        confirmText="Sí, cancelar y salir"
        cancelText="Continuar con la reserva"
        variant="danger"
        onConfirm={() => {
          setMostrarConfirmCancelar(false);
          router.push("/reservaciones");
        }}
        onCancel={() => setMostrarConfirmCancelar(false)}
      />
    </>
  );
}

export default function NuevaReservacionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7E756B]">Cargando wizard de reservación...</div>}>
      <NuevaReservacionContent />
    </Suspense>
  );
}
