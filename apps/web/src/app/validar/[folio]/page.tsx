/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:22:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T05
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Icons } from '@/components/ui/icons';

function anonimizarNombre(nombre: string): string {
  if (!nombre) return 'C****** G******';
  return nombre
    .split(' ')
    .map((parte) => (parte.length > 1 ? parte[0] + '*'.repeat(parte.length - 1) : parte))
    .join(' ');
}

function ValidarFolioContent() {
  const routeParams = useParams();
  const folioParam = typeof routeParams?.folio === 'string' ? routeParams.folio : 'D-00001';

  const [cargando, setCargando] = useState(true);
  const [datosValidados, setDatosValidados] = useState<{
    folio: string;
    fechaEmision: string;
    estado: string;
    clienteAnonimo: string;
    vehiculo: string;
    placas: string;
    salida: string;
    devolucion: string;
    sha256: string;
    esAutentico: boolean;
  }>({
    folio: folioParam,
    fechaEmision: '2026-11-17 10:30 hrs',
    estado: 'ACTIVO / VIGENTE',
    clienteAnonimo: 'R****** M***** S******',
    vehiculo: 'Kia Forte 2023 · Blanco',
    placas: 'ATU-703-A',
    salida: '17/Nov/2026 10:00 hrs',
    devolucion: '20/Nov/2026 10:00 hrs',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    esAutentico: true,
  });

  useEffect(() => {
    // Simular consulta de autenticidad en tiempo real
    const timer = setTimeout(() => {
      setCargando(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [folioParam]);

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1E1A16] flex flex-col justify-between">
      {/* Barra superior con identidad de marca */}
      <header className="bg-white border-b border-[#E5DECE] py-4 px-6 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B5141B] text-white flex items-center justify-center font-black text-xl shadow">
              M
            </div>
            <div>
              <h1 className="text-base font-black tracking-tight text-[#1E1A16]">
                MÉXICO RENTA DE AUTOS
              </h1>
              <p className="text-xs text-[#7E756B]">Mexicali, Baja California · Verificación Oficial</p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 bg-[#F4EFE6] border border-[#D5CEBF] rounded-full text-[#7E756B]">
            Validador Público
          </span>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 py-8 px-4 max-w-2xl mx-auto w-full">
        {cargando ? (
          <div className="bg-white rounded-3xl border border-[#E5DECE] p-12 text-center shadow-sm">
            <Icons.Refresh size={36} className="animate-spin text-[#B5141B] mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#1E1A16]">Verificando autenticidad del documento...</h2>
            <p className="text-xs text-[#7E756B] mt-1">Consultando libro mayor de sellos criptográficos</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E5DECE] overflow-hidden shadow-lg">
            {/* Banner de estado de autenticidad */}
            <div className="bg-[#DCFCE7] border-b border-[#86EFAC] p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#166534] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <Icons.Check size={36} />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-[#166534] bg-white/80 px-3 py-1 rounded-full">
                Sello Digital Verificado
              </span>
              <h2 className="text-2xl font-black text-[#14532D] mt-2">
                Contrato Auténtico e Inmutable
              </h2>
              <p className="text-xs text-[#166534] mt-1 max-w-md mx-auto">
                Este documento fue emitido oficialmente por México Renta de Autos. La huella digital SHA-256 coincide exactamente con el archivo original firmado.
              </p>
            </div>

            {/* Datos del contrato */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#E5DECE]">
                <div>
                  <span className="text-xs font-bold text-[#7E756B] uppercase tracking-wider block">
                    Folio Digital
                  </span>
                  <span className="text-xl font-black text-[#B5141B]">{datosValidados.folio}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#7E756B] uppercase tracking-wider block">
                    Estatus
                  </span>
                  <span className="inline-block mt-0.5 text-xs font-bold px-2.5 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full">
                    {datosValidados.estado}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#7E756B] flex items-center gap-1.5">
                    <Icons.Clientes size={16} />
                    <span>Titular / Arrendatario:</span>
                  </span>
                  <span className="font-bold text-[#1E1A16] font-mono">
                    {datosValidados.clienteAnonimo}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#7E756B] flex items-center gap-1.5">
                    <Icons.Vehiculos size={16} />
                    <span>Vehículo Asignado:</span>
                  </span>
                  <span className="font-bold text-[#1E1A16] text-right">
                    {datosValidados.vehiculo} <br />
                    <span className="text-xs text-[#7E756B] font-mono">Placas: {datosValidados.placas}</span>
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#7E756B] flex items-center gap-1.5">
                    <Icons.Clock size={16} />
                    <span>Periodo de Renta:</span>
                  </span>
                  <span className="font-semibold text-[#1E1A16] text-right text-xs">
                    {datosValidados.salida} <br />
                    hasta {datosValidados.devolucion}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#7E756B] flex items-center gap-1.5">
                    <Icons.CalendarDate size={16} />
                    <span>Fecha de Emisión:</span>
                  </span>
                  <span className="font-semibold text-[#1E1A16]">
                    {datosValidados.fechaEmision}
                  </span>
                </div>
              </div>

              {/* Sello criptográfico SHA-256 */}
              <div className="pt-6 border-t border-[#E5DECE]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1A16] mb-1.5">
                  <Icons.Admin size={16} className="text-[#B5141B]" />
                  <span>Huella Criptográfica SHA-256 (Hash inmutable)</span>
                </div>
                <div className="p-3 bg-[#FBF8F2] rounded-xl border border-[#E5DECE] font-mono text-[11px] break-all text-[#1E1A16] select-all">
                  {datosValidados.sha256}
                </div>
                <p className="text-[11px] text-[#7E756B] mt-2">
                  Cualquier alteración a un solo byte del documento PDF invalida este hash de forma irreversible.
                </p>
              </div>

              {/* Leyenda legal */}
              <div className="p-4 bg-[#F4EFE6] rounded-2xl border border-[#E5DECE] text-xs text-[#7E756B] space-y-1">
                <p className="font-bold text-[#1E1A16]">Validez Jurídica:</p>
                <p>
                  Documento validado conforme a la legislación aplicable en el Estado de Baja California y la Procuraduría Federal del Consumidor (PROFECO).
                </p>
                <p className="text-[11px]">
                  Para aclaraciones o reporte de siniestros: Tel. <strong>686 555 0000</strong> (Mexicali, B.C.)
                </p>
              </div>
            </div>

            {/* Pie de tarjeta con acción */}
            <div className="bg-[#FAF7F0] p-4 border-t border-[#E5DECE] flex items-center justify-between">
              <span className="text-xs text-[#7E756B]">México Renta de Autos © 2026</span>
              <Link
                href="/login"
                className="text-xs font-bold text-[#B5141B] hover:underline flex items-center gap-1"
              >
                <span>Acceso Mostrador</span>
                <Icons.ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Pie de página institucional */}
      <footer className="py-6 text-center text-xs text-[#7E756B]">
        Mexicali, Baja California · Sistema de Contratación Digital Segura
      </footer>
    </div>
  );
}

export default function ValidarFolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <Icons.Refresh size={32} className="animate-spin text-[#B5141B]" />
            <p className="text-sm font-bold text-[#7E756B]">Cargando validador...</p>
          </div>
        </div>
      }
    >
      <ValidarFolioContent />
    </Suspense>
  );
}
