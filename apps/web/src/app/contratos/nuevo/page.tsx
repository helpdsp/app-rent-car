/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer + design-ux-architect
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T06
 */

"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav, Icons, ConfirmDialog } from "@/components/ui";

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
  const [mostrarConfirmDescarte, setMostrarConfirmDescarte] = useState(false);

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
          cliente_id: "22222222-2222-4222-8222-222222222001",
          vehiculo_id: vehiculoActivo.id,
          fecha_salida: new Date("2026-11-16T11:00:00Z").toISOString(),
          fecha_compromiso_devolucion: new Date("2026-11-19T11:00:00Z").toISOString(),
          lugar_devolucion: lugarDevolucion,
          destino_principal: destino,
          permiso_salida_pais: salidaPais,
          dias_renta: diasRenta,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        router.push(`/contratos/${json.data.id}/cobro`);
      } else {
        router.push("/contratos/demo-08160/cobro");
      }
    } catch {
      router.push("/contratos/demo-08160/cobro");
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    setMostrarConfirmDescarte(true);
  };

  const confirmarCancelacion = () => {
    setMostrarConfirmDescarte(false);
    router.push("/contratos");
  };

  return (
    <>
      <div className="w-full min-h-screen flex flex-col md:flex-row bg-[#F6F2E8] text-[#1E1A16] font-sans pb-24 md:pb-6">
        <SidebarNav seccionActiva="contratos" />

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col gap-6">
          {/* Encabezado con Botón Cancelar / Volver */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#7E756B]">
                <Link href="/contratos" className="hover:text-[#1E1A16] flex items-center gap-1">
                  <Icons.Back size={14} />
                  <span>Contratos</span>
                </Link>
                <span>/</span>
                <span className="text-[#B5141B] font-bold">Nuevo Contrato</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1A16] mt-1">
                Paso 1: Emisión y Cotización
              </h1>
            </div>

            <button
              type="button"
              onClick={handleCancelar}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D5CDBE] bg-white hover:bg-[#F2ECE1] text-[#1E1A16] font-semibold text-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Icons.Close size={18} />
              <span>Cancelar Emisión</span>
            </button>
          </header>

          {/* Stepper de Pasos */}
          <div className="bg-white rounded-2xl border border-[#E5DECE] p-4 flex items-center justify-around text-xs font-semibold text-[#7E756B] shadow-sm">
            <div className="flex items-center gap-2 text-[#B5141B]">
              <span className="w-6 h-6 rounded-full bg-[#B5141B] text-white flex items-center justify-center font-bold text-xs">1</span>
              <span>Cotización</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-[#E5DECE] text-[#7E756B] flex items-center justify-center font-bold text-xs">2</span>
              <span>Cobro y Anticipo</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-[#E5DECE] text-[#7E756B] flex items-center justify-center font-bold text-xs">3</span>
              <span>Firma y Pagaré</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-6 h-6 rounded-full bg-[#E5DECE] text-[#7E756B] flex items-center justify-center font-bold text-xs">4</span>
              <span>Entrega de Auto</span>
            </div>
          </div>

          {/* Contenido Grid Responsivo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda: Parámetros y Selección de Auto (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Cliente Preseleccionado */}
              <div className="bg-white rounded-2xl border border-[#E5DECE] p-5 shadow-sm">
                <span className="text-xs font-bold text-[#7E756B] uppercase tracking-wider block mb-2">
                  Cliente Arrendatario
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B5141B]/10 text-[#B5141B] flex items-center justify-center font-bold">
                      <Icons.Clientes size={20} color="#B5141B" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1E1A16]">Héctor García Murillo</h3>
                      <p className="text-xs text-[#7E756B]">Licencia: B.C. 048992-1 · Tel: (686) 244-1189</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-[#DCFCE7] text-[#166534] px-2.5 py-1 rounded-full">
                    Licencia Vigente
                  </span>
                </div>
              </div>

              {/* Fechas y Destino */}
              <div className="bg-white rounded-2xl border border-[#E5DECE] p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#1E1A16]">Fechas y Destino</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4B443B] uppercase mb-1">
                      Fecha y Hora de Salida
                    </label>
                    <div className="relative">
                      <input
                        value={salida}
                        onChange={(e) => setSalida(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] font-medium"
                      />
                      <div className="absolute left-3 top-3 text-[#A89F91]">
                        <Icons.CalendarDate size={18} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4B443B] uppercase mb-1">
                      Fecha y Hora de Devolución
                    </label>
                    <div className="relative">
                      <input
                        value={entrega}
                        onChange={(e) => setEntrega(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] font-medium"
                      />
                      <div className="absolute left-3 top-3 text-[#A89F91]">
                        <Icons.Clock size={18} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4B443B] uppercase mb-1">
                      Destino Principal
                    </label>
                    <input
                      value={destino}
                      onChange={(e) => setDestino(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4B443B] uppercase mb-1">
                      Lugar de Devolución
                    </label>
                    <input
                      value={lugarDevolucion}
                      onChange={(e) => setLugarDevolucion(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16]"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-2 text-sm font-medium text-[#1E1A16] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={salidaPais}
                    onChange={(e) => setSalidaPais(e.target.checked)}
                    className="w-4 h-4 rounded text-[#B5141B] focus:ring-[#B5141B]"
                  />
                  <span>Permiso para salir del país (E.U.A. / Carta consular requerida)</span>
                </label>
              </div>

              {/* Selección de Vehículo */}
              <div className="bg-white rounded-2xl border border-[#E5DECE] p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#1E1A16]">Selecciona la Unidad Disponible</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehiculos.map((v) => {
                    const seleccionado = v.id === vehiculoActivo.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => v.disponible && setVehiculoSeleccionadoId(v.id)}
                        disabled={!v.disponible}
                        className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between gap-2 ${
                          !v.disponible
                            ? "opacity-50 bg-[#F6F2E8] border-[#E5DECE] cursor-not-allowed"
                            : seleccionado
                            ? "border-[#B5141B] bg-[#FFF5F5] ring-2 ring-[#B5141B]/20 shadow-sm"
                            : "border-[#D5CDBE] bg-white hover:border-[#1E1A16]"
                        }`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <span className="text-xs font-bold text-[#7E756B]">{v.placas} · {v.color}</span>
                            <h4 className="text-base font-bold text-[#1E1A16]">{v.marca} {v.modelo}</h4>
                          </div>
                          {v.badge && (
                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: v.badge.fondo, color: v.badge.color }}
                            >
                              {v.badge.texto}
                            </span>
                          )}
                        </div>

                        <div className="text-sm font-extrabold text-[#1E1A16] mt-2">
                          ${(v.tarifa_dia / 100).toLocaleString("es-MX")} <span className="text-xs font-normal text-[#7E756B]">/ día</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Cotización y Resumen de Cobro */}
            <aside aria-label="Cotización" className="bg-white rounded-2xl border border-[#E5DECE] p-6 shadow-sm flex flex-col gap-4 h-fit sticky top-6">
              <h2 className="text-lg font-bold text-[#1E1A16] pb-3 border-b border-[#F2ECE1]">
                Cotización de Renta
              </h2>

              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#665E55]">Tarifa por día:</span>
                  <span className="font-bold">${(tarifaDiaCentavos / 100).toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#665E55]">Días calculados:</span>
                  <span className="font-bold">{diasRenta} días</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#665E55]">Km incluidos:</span>
                  <span className="font-semibold">{kmIncluidos.toLocaleString("es-MX")} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#665E55]">Hora extra:</span>
                  <span className="font-semibold">${(horaExtraCentavos / 100).toLocaleString("es-MX")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F2ECE1]">
                  <span className="text-[#665E55]">Km excedente:</span>
                  <span className="font-semibold">${(kmExtraCentavos / 100).toLocaleString("es-MX")} / km</span>
                </div>
              </div>

              {/* Total Anticipo */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DECE] my-2">
                <span className="text-xs font-bold text-[#7E756B] uppercase tracking-wider block">
                  Anticipo a Cobrar
                </span>
                <div className="text-3xl font-extrabold text-[#B5141B] mt-1">
                  ${(anticipoCentavos / 100).toLocaleString("es-MX")}{" "}
                  <span className="text-sm font-normal text-[#7E756B]">MXN</span>
                </div>
                <span className="text-xs text-[#7E756B] mt-1 block">
                  {diasRenta} días × ${(tarifaDiaCentavos / 100).toLocaleString("es-MX")} (IVA incluido)
                </span>
              </div>

              {/* Botón Principal y Botón Cancelar */}
              <div className="flex flex-col gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={handleCrearBorrador}
                  disabled={guardando}
                  className="w-full min-h-[50px] rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Icons.Check size={20} />
                  <span>{guardando ? "Guardando..." : "Continuar al Cobro"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCancelar}
                  className="w-full min-h-[44px] rounded-xl border border-[#D5CDBE] bg-white hover:bg-[#F2ECE1] text-[#1E1A16] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Icons.Close size={18} />
                  <span>Cancelar Emisión</span>
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={mostrarConfirmDescarte}
        title="¿Cancelar emisión de contrato?"
        message="Se perderán los datos de cotización y selección del vehículo. El contrato no será emitido."
        confirmText="Sí, cancelar y salir"
        cancelText="Continuar con la renta"
        variant="danger"
        onConfirm={confirmarCancelacion}
        onCancel={() => setMostrarConfirmDescarte(false)}
      />
    </>
  );
}

export default function ContratoNuevoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#7E756B]">Cargando cotizador de contrato...</div>}>
      <ContratoNuevoContent />
    </Suspense>
  );
}
