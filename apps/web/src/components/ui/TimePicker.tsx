/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles design-ux-architect + design-ui-designer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T03
 */

'use client';

import React from 'react';
import { Icons } from './icons';

export interface TimePickerProps {
  label?: string;
  value: string; // HH:mm (ej. "11:00")
  onChange: (hora: string) => void;
  required?: boolean;
  disabled?: boolean;
}

// Genera intervalos de 30 minutos de 06:00 a 22:30
const HORAS_DISPONIBLES: string[] = [];
for (let h = 6; h <= 22; h++) {
  const hStr = String(h).padStart(2, '0');
  HORAS_DISPONIBLES.push(`${hStr}:00`);
  HORAS_DISPONIBLES.push(`${hStr}:30`);
}

export function TimePicker({
  label,
  value,
  onChange,
  required = false,
  disabled = false
}: TimePickerProps) {
  // Horario nocturno: 20:00 a 07:30
  const horaNum = parseInt(value?.split(':')[0] || '12', 10);
  const esNocturno = horaNum >= 20 || horaNum < 8;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide">
            {label} {required && <span className="text-[#B5141B]">*</span>}
          </label>
          {esNocturno && (
            <span className="text-[11px] font-semibold text-[#9A3412] bg-[#FFEDD5] px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>🌙</span> Nocturno
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-h-[44px] pl-10 pr-8 rounded-xl border appearance-none text-sm font-semibold transition-all ${
            disabled
              ? 'bg-[#E5DECE]/40 border-[#D5CDBE] cursor-not-allowed opacity-60 text-[#8A8175]'
              : 'bg-white border-[#D5CDBE] text-[#1E1A16] hover:border-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]'
          }`}
        >
          {HORAS_DISPONIBLES.map((hora) => (
            <option key={hora} value={hora}>
              {hora} hrs {parseInt(hora.split(':')[0], 10) >= 20 || parseInt(hora.split(':')[0], 10) < 8 ? '(Nocturno)' : ''}
            </option>
          ))}
        </select>

        <div className="absolute left-3 top-3 text-[#B5141B] pointer-events-none">
          <Icons.Clock size={18} />
        </div>

        <div className="absolute right-3 top-3 text-[#A89F91] pointer-events-none">
          <Icons.ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}
