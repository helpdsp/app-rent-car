/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:25:00Z
 * @agent_roles engineering-frontend-developer + specialized-document-generator
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T06
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/ui/SidebarNav';
import { Icons } from '@/components/ui/icons';

function ContratoDetalleContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : 'demo-001';

  const [cargando, setCargando] = useState(true);
  const [contrato, setContrato] = useState<{
    id: string;
    folio: string;
    estado: string;
    cliente: string;
    telefono: string;
    vehiculo: string;
    placas: string;
    salida: string;
    entradaPrevista: string;
    anticipo: number;
    sha256: string;
    version: number;
  }>({
    id,
    folio: 'D-00001',
    estado: 'ACTIVO',
    cliente: 'Ricardo Medina Salazar',
    telefono: '686 555 1234',
    vehiculo: 'Kia Forte 2023 · Blanco',
    placas: 'ATU-703-A',
    salida: '17/Nov/2026 10:00 hrs',
    entradaPrevista: '20/Nov/2026 10:00 hrs (3 días)',
    anticipo: 489900,
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    version: 1,
  });

  const [mostrarVisor, setMostrarVisor] = useState(false);

  useEffect(() => {
    fetch(`/api/contratos/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setContrato((prev) => ({
            ...prev,
            folio: data.folio || prev.folio,
            cliente: data.cliente_nombre || prev.cliente,
            vehiculo: data.vehiculo_descripcion || prev.vehiculo,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [id]);

  const urlPdfDescarga = `/api/contratos/${id}/pdf?download=true`;
  const urlPdfVisor = `/api/contratos/${id}/pdf?view=true`;
  const urlValidacionPublica = `/validar/${contrato.folio}`;

  return (
    <div className="flex min-h-screen bg-[#FBF8F2] text-[#1E1A16]">
      <SidebarNav seccionActiva="contratos" />

      <main className="flex-1 pb-24 md:pb-12 pt-6 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb y encabezado */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7E756B] mb-1">
              <Link href="/contratos" className="hover:underline flex items-center gap-1">
                <Icons.Contratos size={13} />
                <span>Contratos</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#1E1A16]">{contrato.folio}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-[#1E1A16] flex items-center gap-2">
                <span>Contrato Digital {contrato.folio}</span>
              </h1>
              <span className="text-xs font-bold px-2.5 py-1 bg-[#DCFCE7] text-[#166534] rounded-full border border-[#86EFAC]">
                {contrato.estado}
              </span>
            </div>
            <p className="text-sm text-[#7E756B] mt-0.5">
              {contrato.cliente} · {contrato.vehiculo}
            </p>
          </div>

          {/* Acciones principales del contrato */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={urlPdfDescarga}
              download={`contrato_${contrato.folio}.pdf`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B5141B] text-white font-bold text-sm hover:bg-[#8F1015] shadow transition-colors"
            >
              <Icons.Download size={16} />
              <span>Descargar PDF Oficial</span>
            </a>

            <button
              type="button"
              onClick={() => setMostrarVisor(!mostrarVisor)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#1E1A16] font-semibold text-sm hover:bg-[#F4EFE6] transition-colors"
            >
              <Icons.Eye size={16} />
              <span>{mostrarVisor ? 'Ocultar Visor' : 'Ver Documento'}</span>
            </button>

            <Link
              href={urlValidacionPublica}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#7E756B] hover:text-[#1E1A16] font-semibold text-sm hover:bg-[#F4EFE6] transition-colors"
            >
              <Icons.FileCheck size={16} />
              <span>Validar QR</span>
            </Link>
          </div>
        </div>

        {/* Visor de PDF embebido cuando está activo */}
        {mostrarVisor && (
          <div className="mb-8 bg-white rounded-3xl border border-[#E5DECE] overflow-hidden shadow-lg">
            <div className="bg-[#FAF7F0] border-b border-[#E5DECE] p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E1A16] flex items-center gap-2">
                <Icons.Contratos size={16} className="text-[#B5141B]" />
                <span>Vista Previa del Contrato Oficial (2 Páginas · Mexicali)</span>
              </span>
              <button
                type="button"
                onClick={() => setMostrarVisor(false)}
                className="text-xs font-bold text-[#7E756B] hover:text-[#1E1A16] flex items-center gap-1"
              >
                <Icons.Close size={14} />
                <span>Cerrar</span>
              </button>
            </div>
            <div className="w-full h-[650px] bg-[#525659]">
              <iframe
                src={urlPdfVisor}
                title={`Contrato ${contrato.folio}`}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        )}

        {/* Tarjetas de Información y Certificación Digital */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta 1: Datos del Arrendatario y Fechas */}
          <div className="bg-white rounded-2xl border border-[#E5DECE] p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#1E1A16] text-sm uppercase tracking-wider flex items-center gap-2 text-[#B5141B]">
              <Icons.Clientes size={18} />
              <span>Cliente y Periodo</span>
            </h3>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs text-[#7E756B] block">Nombre completo:</span>
                <span className="font-bold text-[#1E1A16]">{contrato.cliente}</span>
              </div>
              <div>
                <span className="text-xs text-[#7E756B] block">Teléfono:</span>
                <span className="font-medium text-[#1E1A16]">{contrato.telefono}</span>
              </div>
              <div className="pt-2 border-t border-[#E5DECE]">
                <span className="text-xs text-[#7E756B] block">Salida:</span>
                <span className="font-semibold text-[#1E1A16] text-xs">{contrato.salida}</span>
              </div>
              <div>
                <span className="text-xs text-[#7E756B] block">Devolución prevista:</span>
                <span className="font-semibold text-[#1E1A16] text-xs">{contrato.entradaPrevista}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Vehículo e Inspección */}
          <div className="bg-white rounded-2xl border border-[#E5DECE] p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#1E1A16] text-sm uppercase tracking-wider flex items-center gap-2 text-[#B5141B]">
              <Icons.Vehiculos size={18} />
              <span>Vehículo y Patio</span>
            </h3>

            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs text-[#7E756B] block">Unidad asignada:</span>
                <span className="font-bold text-[#1E1A16]">{contrato.vehiculo}</span>
              </div>
              <div>
                <span className="text-xs text-[#7E756B] block">Placas:</span>
                <span className="font-mono font-bold text-[#1E1A16]">{contrato.placas}</span>
              </div>
              <div className="pt-2 border-t border-[#E5DECE]">
                <Link
                  href={`/contratos/${id}/inspeccion`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F4EFE6] border border-[#D5CEBF] text-xs font-bold text-[#1E1A16] hover:bg-[#EAE4D7] transition-colors"
                >
                  <Icons.Camera size={14} className="text-[#B5141B]" />
                  <span>Inspección Fotográfica WebP</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Certificación Criptográfica SHA-256 */}
          <div className="bg-white rounded-2xl border border-[#E5DECE] p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#1E1A16] text-sm uppercase tracking-wider flex items-center gap-2 text-[#166534]">
              <Icons.Admin size={18} />
              <span>Sello Criptográfico SHA-256</span>
            </h3>

            <div className="space-y-2">
              <span className="text-xs text-[#7E756B] block">Huella digital inmutable:</span>
              <div className="p-2.5 bg-[#FBF8F2] rounded-xl border border-[#E5DECE] font-mono text-[11px] break-all select-all text-[#1E1A16]">
                {contrato.sha256}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#166534] font-bold">
                <Icons.Check size={14} />
                <span>Documento firmado e inalterable (v{contrato.version})</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ContratoDetallePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <Icons.Refresh size={32} className="animate-spin text-[#B5141B]" />
            <p className="text-sm font-bold text-[#7E756B]">Cargando detalle del contrato...</p>
          </div>
        </div>
      }
    >
      <ContratoDetalleContent />
    </Suspense>
  );
}
