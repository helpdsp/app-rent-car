/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles design-ux-architect + design-ui-designer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T02
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './icons';

export interface DatePickerProps {
  label?: string;
  value: string; // ISO YYYY-MM-DD o vacio
  onChange: (fecha: string) => void;
  minDate?: string; // YYYY-MM-DD
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DIAS_SEMANA = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  placeholder = 'Selecciona una fecha',
  required = false,
  disabled = false
}: DatePickerProps) {
  const [abierto, setAbierto] = useState(false);
  
  // Año y mes visibles en el calendario
  const hoy = new Date();
  const fechaInicial = value ? new Date(value + 'T12:00:00') : hoy;
  const [mesVisible, setMesVisible] = useState(fechaInicial.getMonth());
  const [anoVisible, setAnoVisible] = useState(fechaInicial.getFullYear());

  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    }
    if (abierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [abierto]);

  const mesAnterior = () => {
    if (mesVisible === 0) {
      setMesVisible(11);
      setAnoVisible(anoVisible - 1);
    } else {
      setMesVisible(mesVisible - 1);
    }
  };

  const mesSiguiente = () => {
    if (mesVisible === 11) {
      setMesVisible(0);
      setAnoVisible(anoVisible + 1);
    } else {
      setMesVisible(mesVisible + 1);
    }
  };

  // Cálculo de los días del mes
  const primerDiaMes = new Date(anoVisible, mesVisible, 1).getDay();
  const totalDiasMes = new Date(anoVisible, mesVisible + 1, 0).getDate();

  const fechaMinima = minDate ? new Date(minDate + 'T00:00:00') : new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  const formatearFechaDisplay = (val: string) => {
    if (!val) return '';
    try {
      const parts = val.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('es-MX', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return val;
    } catch {
      return val;
    }
  };

  const seleccionarDia = (dia: number) => {
    const mesStr = String(mesVisible + 1).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');
    const fechaISO = `${anoVisible}-${mesStr}-${diaStr}`;
    onChange(fechaISO);
    setAbierto(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
          {label} {required && <span className="text-[#B5141B]">*</span>}
        </label>
      )}

      {/* Input de activación */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setAbierto(!abierto)}
        className={`w-full min-h-[44px] px-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
          disabled
            ? 'bg-[#E5DECE]/40 border-[#D5CDBE] cursor-not-allowed opacity-60'
            : abierto
            ? 'bg-white border-[#B5141B] ring-2 ring-[#B5141B]/20'
            : 'bg-white border-[#D5CDBE] hover:border-[#1E1A16]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="text-[#B5141B]">
            <Icons.CalendarDate size={18} />
          </div>
          <span className={`text-sm ${value ? 'text-[#1E1A16] font-semibold' : 'text-[#8A8175]'}`}>
            {value ? formatearFechaDisplay(value) : placeholder}
          </span>
        </div>
        <div className="text-[#A89F91]">
          <Icons.ChevronDown size={16} />
        </div>
      </button>

      {/* Popover del Calendario */}
      {abierto && (
        <div className="absolute z-50 mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E5DECE] p-4 animate-in fade-in zoom-in-95 duration-150">
          {/* Header del Calendario */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE1]">
            <button
              type="button"
              onClick={mesAnterior}
              className="w-8 h-8 rounded-lg text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F2ECE1] flex items-center justify-center transition-colors"
              aria-label="Mes anterior"
            >
              <Icons.Back size={16} />
            </button>
            <span className="text-sm font-bold text-[#1E1A16]">
              {MESES[mesVisible]} {anoVisible}
            </span>
            <button
              type="button"
              onClick={mesSiguiente}
              className="w-8 h-8 rounded-lg text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F2ECE1] flex items-center justify-center transition-colors"
              aria-label="Mes siguiente"
            >
              <Icons.ChevronRight size={16} />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-semibold text-[#8A8175]">
            {DIAS_SEMANA.map((d, i) => (
              <div key={i} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1">
            {/* Espacios vacíos antes del primer día */}
            {Array.from({ length: primerDiaMes }).map((_, i) => (
              <div key={`vacio-${i}`} className="w-8 h-8" />
            ))}

            {/* Días activos */}
            {Array.from({ length: totalDiasMes }).map((_, i) => {
              const dia = i + 1;
              const fechaDia = new Date(anoVisible, mesVisible, dia);
              const esPasado = fechaDia < fechaMinima;

              const diaFormateado = `${anoVisible}-${String(mesVisible + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
              const esSeleccionado = value === diaFormateado;
              const esHoy =
                hoy.getDate() === dia &&
                hoy.getMonth() === mesVisible &&
                hoy.getFullYear() === anoVisible;

              return (
                <button
                  key={dia}
                  type="button"
                  disabled={esPasado}
                  onClick={() => seleccionarDia(dia)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-medium flex items-center justify-center transition-all ${
                    esSeleccionado
                      ? 'bg-[#B5141B] text-white font-bold shadow-md'
                      : esPasado
                      ? 'text-[#CFC8B8] cursor-not-allowed opacity-40'
                      : esHoy
                      ? 'bg-[#FAF7F2] text-[#B5141B] font-bold border border-[#B5141B]'
                      : 'text-[#1E1A16] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          {/* Pie con botón de hoy */}
          <div className="mt-3 pt-2.5 border-t border-[#F2ECE1] flex justify-between items-center text-xs">
            <button
              type="button"
              onClick={() => {
                const mesStr = String(hoy.getMonth() + 1).padStart(2, '0');
                const diaStr = String(hoy.getDate()).padStart(2, '0');
                onChange(`${hoy.getFullYear()}-${mesStr}-${diaStr}`);
                setAbierto(false);
              }}
              className="text-[#B5141B] font-bold hover:underline"
            >
              Seleccionar Hoy
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setAbierto(false);
              }}
              className="text-[#7E756B] hover:text-[#1E1A16]"
            >
              Borrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
