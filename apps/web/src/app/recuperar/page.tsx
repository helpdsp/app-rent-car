/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:23:00Z
 * @agent_roles engineering-identity-access-engineer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 15
 * @sprint_number 15
 * @task_id S15-T05
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/ui";

export default function RecuperarPage() {
  const [correo, setCorreo] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo.trim()) return;

    setCargando(true);
    // Simular envío de enlace seguro
    setTimeout(() => {
      setCargando(false);
      setEnviado(true);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F2E8] text-[#1E1A16] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E5DECE] p-8 flex flex-col gap-6">
        {/* Logo y Encabezado */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#B5141B] text-white flex items-center justify-center font-bold text-2xl shadow-md mb-3">
            MRA
          </div>
          <h1 className="text-2xl font-bold text-[#1E1A16]">
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-[#7E756B] mt-1">
            Ingresa tu correo institucional registrado para recibir un enlace de restablecimiento.
          </p>
        </div>

        {enviado ? (
          <div className="p-5 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-center flex flex-col items-center gap-3">
            <Icons.Success size={32} color="#166534" />
            <h3 className="text-sm font-bold text-[#166534]">
              Enlace de recuperación enviado
            </h3>
            <p className="text-xs text-[#166534]/80">
              Hemos enviado las instrucciones para restablecer tu contraseña a <b>{correo}</b>. Por favor revisa tu bandeja de entrada o spam.
            </p>
            <Link
              href="/login"
              className="mt-2 text-xs font-bold text-[#166534] underline hover:opacity-80"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4B443B] uppercase tracking-wide mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="operador@mexicorentadeautos.mx"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 rounded-xl border border-[#D5CDBE] text-sm text-[#1E1A16] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
                />
                <div className="absolute left-3 top-3.5 text-[#A89F91]">
                  <Icons.Email size={18} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full min-h-[48px] rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Icons.Email size={18} />
              <span>{cargando ? "Enviando..." : "Enviar Enlace Seguro"}</span>
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#7E756B] hover:text-[#1E1A16] inline-flex items-center gap-1.5"
              >
                <Icons.Back size={14} />
                <span>Volver a Iniciar Sesión</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
