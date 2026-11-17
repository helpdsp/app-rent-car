/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles design-ux-architect + design-ui-designer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T05
 */

'use client';

import React, { useState } from 'react';
import { Icons, ConfirmDialog } from '@/components/ui';
import type { ClienteRow } from '@/lib/db/sprint3';

export interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Partial<ClienteRow>) => void;
  clienteEditar?: ClienteRow | null;
}

export function ClienteModal({
  isOpen,
  onClose,
  onSave,
  clienteEditar
}: ClienteModalProps) {
  const [nombre, setNombre] = useState(clienteEditar?.nombre_completo || '');
  const [identificacion, setIdentificacion] = useState(clienteEditar?.identificacion_numero || '');
  const [telefono, setTelefono] = useState(clienteEditar?.telefono || '');
  const [correo, setCorreo] = useState(clienteEditar?.correo || '');
  const [domicilio, setDomicilio] = useState(clienteEditar?.domicilio || 'Mexicali, B.C.');
  
  const [mostrarConfirmacionDescarte, setMostrarConfirmacionDescarte] = useState(false);

  if (!isOpen) return null;

  const haCambiado =
    nombre !== (clienteEditar?.nombre_completo || '') ||
    identificacion !== (clienteEditar?.identificacion_numero || '') ||
    telefono !== (clienteEditar?.telefono || '') ||
    correo !== (clienteEditar?.correo || '') ||
    domicilio !== (clienteEditar?.domicilio || 'Mexicali, B.C.');

  const intentarCerrar = () => {
    if (haCambiado) {
      setMostrarConfirmacionDescarte(true);
    } else {
      onClose();
    }
  };

  const descartarYSalir = () => {
    setMostrarConfirmacionDescarte(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !identificacion.trim() || !telefono.trim()) return;

    onSave({
      nombre_completo: nombre.trim(),
      identificacion_numero: identificacion.trim(),
      telefono: telefono.trim(),
      celular: telefono.trim(),
      correo: correo.trim() || null,
      domicilio: domicilio.trim() || 'Mexicali, B.C.',
      ciudad: 'Mexicali',
      estado: 'B.C.'
    });
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      >
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5DECE] overflow-hidden my-8">
          {/* Encabezado */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2ECE1] bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#B5141B]/10 text-[#B5141B] flex items-center justify-center">
                <Icons.Clientes size={20} color="#B5141B" />
              </div>
              <h2 id="cliente-modal-title" className="text-lg font-bold text-[#1E1A16]">
                {clienteEditar ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
            </div>
            <button
              type="button"
              onClick={intentarCerrar}
              className="w-9 h-9 rounded-xl text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#EFEAE1] flex items-center justify-center transition-colors"
              aria-label="Cerrar ventana"
            >
              <Icons.Close size={20} />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez García"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full h-11 px-3.5 pl-10 rounded-xl border border-[#D5CDBE] bg-white text-[#1E1A16] text-sm focus:outline-none focus:ring-2 focus:ring-[#B5141B] focus:border-transparent transition-all"
                />
                <div className="absolute left-3 top-3 text-[#A89F91]">
                  <Icons.Clientes size={18} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
                  Identificación / Licencia *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="INE o Licencia"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    className="w-full h-11 px-3.5 pl-10 rounded-xl border border-[#D5CDBE] bg-white text-[#1E1A16] text-sm focus:outline-none focus:ring-2 focus:ring-[#B5141B] focus:border-transparent transition-all"
                  />
                  <div className="absolute left-3 top-3 text-[#A89F91]">
                    <Icons.FileCheck size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
                  Teléfono / Celular *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="(686) 000-0000"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full h-11 px-3.5 pl-10 rounded-xl border border-[#D5CDBE] bg-white text-[#1E1A16] text-sm focus:outline-none focus:ring-2 focus:ring-[#B5141B] focus:border-transparent transition-all"
                  />
                  <div className="absolute left-3 top-3 text-[#A89F91]">
                    <Icons.Phone size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full h-11 px-3.5 pl-10 rounded-xl border border-[#D5CDBE] bg-white text-[#1E1A16] text-sm focus:outline-none focus:ring-2 focus:ring-[#B5141B] focus:border-transparent transition-all"
                  />
                  <div className="absolute left-3 top-3 text-[#A89F91]">
                    <Icons.Email size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
                  Domicilio / Ciudad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mexicali, B.C."
                    value={domicilio}
                    onChange={(e) => setDomicilio(e.target.value)}
                    className="w-full h-11 px-3.5 pl-10 rounded-xl border border-[#D5CDBE] bg-white text-[#1E1A16] text-sm focus:outline-none focus:ring-2 focus:ring-[#B5141B] focus:border-transparent transition-all"
                  />
                  <div className="absolute left-3 top-3 text-[#A89F91]">
                    <Icons.Location size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones con botón Cancelar explícito */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 mt-2 border-t border-[#F2ECE1]">
              <button
                type="button"
                onClick={intentarCerrar}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D5CDBE] bg-white hover:bg-[#F6F2E8] text-[#1E1A16] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Icons.Close size={18} />
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#1E1A16] hover:bg-[#332C25] text-white font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Icons.Check size={18} />
                Guardar Cliente
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Diálogo de confirmación para no perder datos si cancela */}
      <ConfirmDialog
        isOpen={mostrarConfirmacionDescarte}
        title="¿Descartar cambios no guardados?"
        message="Tienes información capturada en este formulario. Si sales ahora, los datos no se guardarán."
        confirmText="Descartar cambios"
        cancelText="Continuar editando"
        variant="warning"
        onConfirm={descartarYSalir}
        onCancel={() => setMostrarConfirmacionDescarte(false)}
      />
    </>
  );
}
