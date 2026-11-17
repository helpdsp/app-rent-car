/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:31:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 16
 * @sprint_number 16
 * @task_id S16-T05
 */

'use client';

import React, { useState, useRef } from 'react';
import { Icons } from './icons';
import { comprimirImagenAWebP, type ResultadoCompresion } from '@/lib/storage/image-compression';

export interface PhotoCaptureProps {
  label: string;
  sublabel?: string;
  onPhotoCaptured: (resultado: ResultadoCompresion) => void;
  required?: boolean;
  disabled?: boolean;
}

export function PhotoCapture({
  label,
  sublabel,
  onPhotoCaptured,
  required = false,
  disabled = false
}: PhotoCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [comprimiendo, setComprimiendo] = useState<boolean>(false);
  const [infoCompresion, setInfoCompresion] = useState<{
    tamanoKb: number;
    ahorroPct: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComprimiendo(true);
    try {
      const res = await comprimirImagenAWebP(file, { maxAncho: 1200, calidad: 0.82 });
      setPreview(res.dataUrl);
      setInfoCompresion({
        tamanoKb: Math.round(res.tamanoFinalBytes / 1024),
        ahorroPct: res.ahorroPorcentaje,
      });
      onPhotoCaptured(res);
    } catch (err) {
      console.error("Error al procesar foto:", err);
    } finally {
      setComprimiendo(false);
    }
  };

  const handleRetomar = () => {
    setPreview(null);
    setInfoCompresion(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E5DECE] p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#1E1A16] flex items-center gap-1.5">
            <span>{label}</span>
            {required && <span className="text-[#B5141B]">*</span>}
          </h4>
          {sublabel && <p className="text-xs text-[#7E756B]">{sublabel}</p>}
        </div>
        {preview && (
          <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Icons.Check size={13} />
            <span>Capturada</span>
          </span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment" // Dispara la cámara trasera en celular/tableta
        className="hidden"
        disabled={disabled || comprimiendo}
        onChange={handleFileChange}
      />

      {/* Vista previa si ya se tomó la foto */}
      {preview ? (
        <div className="flex flex-col gap-2">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/5 border border-[#E5DECE]">
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#665E55] px-1">
            {infoCompresion && (
              <span>WebP: <b>{infoCompresion.tamanoKb} KB</b> ({infoCompresion.ahorroPct}% optimizado)</span>
            )}
            <button
              type="button"
              onClick={handleRetomar}
              className="text-[#B5141B] font-bold hover:underline flex items-center gap-1 min-h-[36px]"
            >
              <Icons.Refresh size={14} />
              <span>Tomar de nuevo</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || comprimiendo}
          onClick={() => fileInputRef.current?.click()}
          className="w-full min-h-[96px] rounded-xl border-2 border-dashed border-[#D5CDBE] hover:border-[#B5141B] bg-[#FAF7F2] hover:bg-[#FFF5F5] flex flex-col items-center justify-center gap-2 p-4 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#B5141B]">
            <Icons.Camera size={20} />
          </div>
          <span className="text-xs font-bold text-[#1E1A16]">
            {comprimiendo ? "Procesando y optimizando..." : "Tomar foto con cámara"}
          </span>
          <span className="text-[11px] text-[#7E756B]">
            Se optimiza automáticamente a WebP (&lt;350 KB)
          </span>
        </button>
      )}
    </div>
  );
}
