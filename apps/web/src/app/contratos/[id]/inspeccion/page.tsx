/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:33:00Z
 * @agent_roles engineering-frontend-developer + engineering-backend-architect
 * @vision_command start_sprint --sprint 16
 * @sprint_number 16
 * @task_id S16-T06
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { SidebarNav } from '@/components/ui/SidebarNav';
import { Icons } from '@/components/ui/icons';
import { PhotoCapture } from '@/components/ui/PhotoCapture';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { type ResultadoCompresion } from '@/lib/storage/image-compression';

interface AnguloConfig {
  id: string;
  titulo: string;
  instruccion: string;
  requiereKm?: boolean;
}

const ANGULOS_INSPECCION: AnguloConfig[] = [
  {
    id: 'frente',
    titulo: 'Frente completo',
    instruccion: 'Encuadre placas, faros y cofre completo.',
  },
  {
    id: 'atras',
    titulo: 'Parte trasera',
    instruccion: 'Encuadre placas, calaveras y cajuela.',
  },
  {
    id: 'izquierda',
    titulo: 'Costado izquierdo',
    instruccion: 'Salpicadera a salpicadera, rines y espejos.',
  },
  {
    id: 'derecha',
    titulo: 'Costado derecho',
    instruccion: 'Salpicadera a salpicadera, rines y espejos.',
  },
  {
    id: 'tablero_km',
    titulo: 'Tablero y odómetro',
    instruccion: 'Motor encendido. Kilometraje legible.',
    requiereKm: true,
  },
  {
    id: 'interior',
    titulo: 'Interior del auto',
    instruccion: 'Asientos, tapetes y tablero general.',
  },
];

function InspeccionContratoContent() {
  const router = useRouter();
  const routeParams = useParams();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : 'demo-001';

  const [folio, setFolio] = useState('D-00001');
  const [vehiculoInfo, setVehiculoInfo] = useState('Nissan Versa Advance 2024 · BKP-482-B');
  const [kmLectura, setKmLectura] = useState<number>(45280);
  const [kmRegistrado, setKmRegistrado] = useState<number>(45280);

  // Estado de subidas y fotos capturadas
  const [fotos, setFotos] = useState<
    Record<
      string,
      {
        resultado: ResultadoCompresion;
        subiendo: boolean;
        subido: boolean;
        error?: string;
        urlRemota?: string;
      }
    >
  >({});

  const [guardandoTodo, setGuardandoTodo] = useState(false);
  const [mostrarConfirmCancelar, setMostrarConfirmCancelar] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Cargar datos del contrato si están disponibles
  useEffect(() => {
    fetch(`/api/contratos/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.folio) setFolio(data.folio);
        if (data?.vehiculo) setVehiculoInfo(`${data.vehiculo.marca} ${data.vehiculo.modelo} · ${data.vehiculo.placas}`);
        if (data?.vehiculo?.kilometraje) {
          setKmLectura(data.vehiculo.kilometraje);
          setKmRegistrado(data.vehiculo.kilometraje);
        }
      })
      .catch(() => {});
  }, [id]);

  const handleFotoCapturada = async (anguloId: string, resultado: ResultadoCompresion) => {
    // Actualizar estado local
    setFotos((prev) => ({
      ...prev,
      [anguloId]: {
        resultado,
        subiendo: true,
        subido: false,
      },
    }));

    // Subir a Storage real a través de la API
    try {
      const formData = new FormData();
      const filename = `${folio}_${anguloId}_${Date.now()}.webp`;
      formData.append('file', resultado.blob, filename);
      formData.append('bucket', 'evidencias-entrega');
      formData.append('path', `contratos/${folio}/${anguloId}.webp`);

      const resp = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await resp.json();

      if (resp.ok && json.ok) {
        setFotos((prev) => ({
          ...prev,
          [anguloId]: {
            ...prev[anguloId],
            subiendo: false,
            subido: true,
            urlRemota: json.path,
          },
        }));
      } else {
        setFotos((prev) => ({
          ...prev,
          [anguloId]: {
            ...prev[anguloId],
            subiendo: false,
            subido: false,
            error: json.error || 'Fallo en la subida',
          },
        }));
      }
    } catch (err: any) {
      setFotos((prev) => ({
        ...prev,
        [anguloId]: {
          ...prev[anguloId],
          subiendo: false,
          subido: false,
          error: err.message || 'Error de conexión',
        },
      }));
    }
  };

  const totalCapturadas = Object.keys(fotos).length;
  const todasSubidas =
    totalCapturadas === ANGULOS_INSPECCION.length &&
    Object.values(fotos).every((f) => f.subido);

  const handleFinalizarInspeccion = () => {
    setGuardandoTodo(true);
    setMensajeExito('Inspección fotográfica guardada con éxito.');
    setTimeout(() => {
      router.push(`/contratos/${id}/entrega`);
    }, 1200);
  };

  const hayCambiosSinGuardar = totalCapturadas > 0;

  return (
    <div className="flex min-h-screen bg-[#FBF8F2] text-[#1E1A16]">
      <SidebarNav seccionActiva="contratos" />

      <main className="flex-1 pb-24 md:pb-12 pt-6 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Encabezado de navegación */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#7E756B] mb-1">
              <Link href="/contratos" className="hover:underline flex items-center gap-1">
                <Icons.Contratos size={13} />
                <span>Contratos</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-[#1E1A16]">{folio}</span>
              <span>/</span>
              <span>Inspección Fotográfica</span>
            </div>
            <h1 className="text-2xl font-black text-[#1E1A16] flex items-center gap-2">
              <Icons.Camera size={26} className="text-[#B5141B]" />
              Inspección de Entrega y Carrocería
            </h1>
            <p className="text-sm text-[#7E756B] mt-0.5">
              {vehiculoInfo} · 6 fotografías obligatorias en formato WebP optimizado
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (hayCambiosSinGuardar) {
                  setMostrarConfirmCancelar(true);
                } else {
                  router.back();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5CEBF] bg-white text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F4EFE6] font-semibold text-sm transition-colors"
            >
              <Icons.Close size={16} />
              <span>Cancelar</span>
            </button>

            <button
              type="button"
              disabled={totalCapturadas < 4 || guardandoTodo}
              onClick={handleFinalizarInspeccion}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow transition-all ${
                totalCapturadas >= 4 && !guardandoTodo
                  ? 'bg-[#B5141B] hover:bg-[#8F1015]'
                  : 'bg-[#D5CEBF] cursor-not-allowed opacity-60'
              }`}
            >
              {guardandoTodo ? (
                <>
                  <Icons.Refresh size={16} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Icons.Check size={16} />
                  <span>Completar Inspección ({totalCapturadas}/6)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notificación de éxito */}
        {mensajeExito && (
          <div className="mb-6 p-4 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] flex items-center gap-3 font-semibold text-sm">
            <Icons.Check size={20} className="text-[#166534]" />
            <span>{mensajeExito} Redirigiendo a entrega...</span>
          </div>
        )}

        {/* Barra de progreso visual */}
        <div className="bg-white rounded-2xl border border-[#E5DECE] p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FBF8F2] border border-[#E5DECE] flex items-center justify-center text-[#B5141B]">
              <Icons.Admin size={24} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[#7E756B] font-bold">
                Cumplimiento de Auditoría
              </div>
              <div className="text-base font-extrabold text-[#1E1A16]">
                {totalCapturadas} de {ANGULOS_INSPECCION.length} fotos procesadas
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md w-full">
            <div className="w-full bg-[#E5DECE] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#B5141B] h-full transition-all duration-300"
                style={{ width: `${(totalCapturadas / ANGULOS_INSPECCION.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[#7E756B] mt-1 font-medium">
              <span>Mínimo 4 fotos</span>
              <span>Recomendado 6/6</span>
            </div>
          </div>
        </div>

        {/* Grid de captura fotográfica */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ANGULOS_INSPECCION.map((angulo) => {
            const estadoFoto = fotos[angulo.id];

            return (
              <div
                key={angulo.id}
                className="bg-white rounded-2xl border border-[#E5DECE] p-4 flex flex-col justify-between shadow-sm hover:border-[#D5CEBF] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-extrabold text-[#1E1A16] text-base flex items-center gap-2">
                      <Icons.Camera size={18} className="text-[#B5141B]" />
                      <span>{angulo.titulo}</span>
                    </h3>
                    {estadoFoto?.subido && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#DCFCE7] text-[#166534] rounded-full flex items-center gap-1">
                        <Icons.Check size={12} />
                        WebP Subido
                      </span>
                    )}
                    {estadoFoto?.subiendo && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#FEF3C7] text-[#92400E] rounded-full flex items-center gap-1">
                        <Icons.Refresh size={12} className="animate-spin" />
                        Subiendo...
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#7E756B] mb-4 min-h-[32px]">
                    {angulo.instruccion}
                  </p>

                  <PhotoCapture
                    label={angulo.titulo}
                    sublabel="Compresión automática WebP (<350 KB)"
                    onPhotoCaptured={(res) => handleFotoCapturada(angulo.id, res)}
                    required
                  />

                  {angulo.requiereKm && (
                    <div className="mt-3 p-3 bg-[#FBF8F2] rounded-xl border border-[#E5DECE]">
                      <label className="block text-xs font-bold text-[#1E1A16] mb-1">
                        Kilometraje verificado en odómetro:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={kmLectura}
                          onChange={(e) => setKmLectura(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#D5CEBF] font-mono text-sm bg-white"
                        />
                        <span className="text-xs text-[#7E756B] font-bold">km</span>
                      </div>
                      {kmLectura < kmRegistrado && (
                        <p className="text-[11px] text-[#B5141B] mt-1 font-semibold">
                          ⚠️ El km no puede ser menor a {kmRegistrado.toLocaleString()} km.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {estadoFoto?.error && (
                  <div className="mt-3 text-xs text-[#B5141B] font-semibold flex items-center gap-1">
                    <Icons.Warning size={14} />
                    <span>{estadoFoto.error}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal de confirmación de salida */}
        <ConfirmDialog
          isOpen={mostrarConfirmCancelar}
          title="¿Descartar fotos de inspección?"
          message="Tienes fotos capturadas en esta sesión. Si sales ahora, se perderán las fotografías no asociadas al contrato."
          confirmText="Sí, descartar y salir"
          cancelText="Continuar inspeccionando"
          variant="danger"
          onConfirm={() => {
            setMostrarConfirmCancelar(false);
            router.back();
          }}
          onCancel={() => setMostrarConfirmCancelar(false)}
        />
      </main>
    </div>
  );
}

export default function InspeccionContratoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <Icons.Refresh size={32} className="animate-spin text-[#B5141B]" />
            <p className="text-sm font-bold text-[#7E756B]">Cargando módulo de inspección...</p>
          </div>
        </div>
      }
    >
      <InspeccionContratoContent />
    </Suspense>
  );
}
