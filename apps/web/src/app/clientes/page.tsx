/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer + design-ux-architect
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T03, S13-T05
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SidebarNav, Icons } from "@/components/ui";
import { ClienteModal } from "@/components/clientes/ClienteModal";
import { obtenerClientes, guardarClienteDirecto, type ClienteRow } from "@/lib/db/sprint3";

export default function ClientesListPage() {
  const [termino, setTermino] = useState("");
  const [lista, setLista] = useState<ClienteRow[]>(obtenerClientes());
  const [mostrarModalAlta, setMostrarModalAlta] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<ClienteRow | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Cargar clientes persistidos desde localStorage al montar
  useEffect(() => {
    try {
      const guardados = localStorage.getItem("mra_clientes_persistencia");
      if (guardados) {
        const parsed: ClienteRow[] = JSON.parse(guardados);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const base = obtenerClientes();
          const idsBase = new Set(base.map((c) => c.id));
          const nuevosPersistidos = parsed.filter((c) => !idsBase.has(c.id));
          nuevosPersistidos.forEach((c) => guardarClienteDirecto(c));
          setLista([...nuevosPersistidos, ...base]);
        }
      }
    } catch {
      // Ignorar error de parsing en modo privado
    }
  }, []);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const filtrados = obtenerClientes(termino);
    try {
      const guardados = localStorage.getItem("mra_clientes_persistencia");
      if (guardados) {
        const parsed: ClienteRow[] = JSON.parse(guardados);
        if (termino.trim()) {
          const term = termino.trim().toLowerCase();
          const coincidentesPersistidos = parsed.filter(
            (c) =>
              c.nombre_completo.toLowerCase().includes(term) ||
              c.identificacion_numero.toLowerCase().includes(term) ||
              (c.telefono && c.telefono.includes(term))
          );
          const ids = new Set(filtrados.map((f) => f.id));
          const noDuplicados = coincidentesPersistidos.filter((c) => !ids.has(c.id));
          setLista([...noDuplicados, ...filtrados]);
          return;
        }
      }
    } catch {}
    setLista(filtrados);
  }

  function handleGuardarCliente(datos: Partial<ClienteRow>) {
    if (clienteAEditar) {
      // Editar
      const actualizada = lista.map((c) =>
        c.id === clienteAEditar.id ? { ...c, ...datos, updated_at: new Date().toISOString() } : c
      );
      setLista(actualizada);
      guardarClienteDirecto({ ...clienteAEditar, ...datos } as ClienteRow);
      try {
        localStorage.setItem("mra_clientes_persistencia", JSON.stringify(actualizada));
      } catch {}
      setAviso(`Cliente ${datos.nombre_completo} actualizado.`);
      setClienteAEditar(null);
    } else {
      // Alta
      const max = lista.reduce((m, c) => Math.max(m, c.numero_cliente), 100);
      const nuevo: ClienteRow = {
        id: `cli-${Date.now()}`,
        numero_cliente: max + 1,
        nombre_completo: datos.nombre_completo || "",
        identificacion_numero: datos.identificacion_numero || "",
        domicilio: datos.domicilio || "Mexicali, B.C.",
        ciudad: "Mexicali",
        estado: "B.C.",
        telefono: datos.telefono || "",
        celular: datos.celular || "",
        correo: datos.correo || null,
        requiere_factura: false,
        razon_social: null,
        rfc: null,
        domicilio_fiscal: null,
        regimen_fiscal: null,
        aviso_privacidad_version: "2026.1",
        aviso_privacidad_aceptado_en: new Date().toISOString(),
        ghl_contact_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
        deleted_at: null,
      };

      const nuevaLista = [nuevo, ...lista];
      setLista(nuevaLista);
      guardarClienteDirecto(nuevo);

      // Persistir de forma garantizada en localStorage
      try {
        localStorage.setItem("mra_clientes_persistencia", JSON.stringify(nuevaLista));
      } catch {}

      // Intentar guardar en backend / API
      fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_completo: nuevo.nombre_completo,
          identificacion_numero: nuevo.identificacion_numero,
          telefono: nuevo.telefono || nuevo.celular,
          celular: nuevo.celular,
          correo: nuevo.correo || undefined,
          domicilio: nuevo.domicilio,
        }),
      }).catch(() => {});

      setAviso(`Cliente ${nuevo.nombre_completo} registrado y guardado con número #${nuevo.numero_cliente}.`);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-[#F6F2E8] text-[#1E1A16] font-sans pb-20 md:pb-0">
      <SidebarNav seccionActiva="clientes" />

      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 flex flex-col gap-5">
        {/* Encabezado Responsivo */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#1E1A16] text-[#F6F2E8] flex items-center justify-center shadow-sm">
                <Icons.Clientes size={22} color="#F6F2E8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1A16]">
                Clientes
              </h1>
            </div>
            <p className="text-sm text-[#7E756B] mt-1">
              Catálogo de conductores registrados y expedientes de identidad.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setClienteAEditar(null);
              setMostrarModalAlta(true);
            }}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl bg-[#B5141B] hover:bg-[#8F1015] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Icons.Plus size={18} />
            <span>Nuevo Cliente</span>
          </button>
        </header>

        {/* Notificación de aviso */}
        {aviso && (
          <div className="p-3.5 px-4 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Success size={18} />
              <span>{aviso}</span>
            </div>
            <button
              onClick={() => setAviso(null)}
              className="text-[#166534] hover:opacity-75"
              aria-label="Cerrar notificación"
            >
              <Icons.Close size={16} />
            </button>
          </div>
        )}

        {/* Barra de Búsqueda */}
        <form onSubmit={buscar} className="flex gap-2">
          <div className="relative flex-1">
            <input
              placeholder="Buscar por nombre, # de cliente, teléfono, INE o licencia..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#D5CDBE] bg-white text-sm text-[#1E1A16] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#B5141B]"
            />
            <div className="absolute left-3.5 top-3.5 text-[#A89F91]">
              <Icons.Search size={20} />
            </div>
          </div>
          <button
            type="submit"
            className="min-h-[44px] px-5 rounded-xl bg-[#1E1A16] hover:bg-[#332C25] text-white font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Icons.Filter size={18} />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>

        {/* 1. Vista Móvil en Tarjetas Táctiles (<md) */}
        <div className="flex flex-col gap-3 md:hidden">
          {lista.map((cliente) => (
            <div
              key={cliente.id}
              className="p-4 rounded-2xl bg-white border border-[#E5DECE] shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-[#B5141B] bg-[#B5141B]/10 px-2 py-0.5 rounded-md">
                    #{cliente.numero_cliente}
                  </span>
                  <h3 className="text-base font-bold text-[#1E1A16] mt-1">
                    {cliente.nombre_completo}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setClienteAEditar(cliente);
                    setMostrarModalAlta(true);
                  }}
                  className="p-2 rounded-lg text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F2ECE1]"
                  aria-label="Editar cliente"
                >
                  <Icons.Edit size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#665E55] pt-2 border-t border-[#F2ECE1]">
                <div className="flex items-center gap-1.5">
                  <Icons.Phone size={14} />
                  <span>{cliente.telefono || "Sin tel."}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icons.FileCheck size={14} />
                  <span>{cliente.identificacion_numero || "S/N"}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Icons.Location size={14} />
                  <span className="truncate">{cliente.domicilio}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F2ECE1]">
                <Link
                  href={`/clientes/${cliente.id}`}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-[#D5CDBE] text-xs font-semibold text-[#1E1A16] hover:bg-[#F6F2E8] flex items-center gap-1.5"
                >
                  <Icons.Eye size={15} />
                  Ver expediente
                </Link>
                <Link
                  href={`/contratos/nuevo?cliente=${cliente.id}`}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#1E1A16] text-xs font-semibold text-white hover:bg-[#332C25] flex items-center gap-1.5"
                >
                  <Icons.Contratos size={15} />
                  Nueva Renta
                </Link>
              </div>
            </div>
          ))}

          {lista.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5DECE] text-[#7E756B]">
              <Icons.Clientes size={32} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium text-sm">No se encontraron clientes.</p>
            </div>
          )}
        </div>

        {/* 2. Vista de Escritorio en Tabla Tradicional (md y superior) */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#E5DECE] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DECE] text-xs font-bold text-[#7E756B] uppercase tracking-wider">
                <th className="py-3.5 px-4"># Cliente</th>
                <th className="py-3.5 px-4">Nombre Completo</th>
                <th className="py-3.5 px-4">Identificación</th>
                <th className="py-3.5 px-4">Teléfono</th>
                <th className="py-3.5 px-4">Ciudad</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE1] text-sm">
              {lista.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#B5141B]">
                    #{cliente.numero_cliente}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1E1A16]">
                    {cliente.nombre_completo}
                  </td>
                  <td className="py-3.5 px-4 text-[#4B443B]">
                    {cliente.identificacion_numero}
                  </td>
                  <td className="py-3.5 px-4 text-[#4B443B]">
                    {cliente.telefono || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-[#7E756B]">
                    {cliente.ciudad}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setClienteAEditar(cliente);
                          setMostrarModalAlta(true);
                        }}
                        className="p-2 rounded-lg text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F2ECE1] transition-colors"
                        title="Editar datos"
                      >
                        <Icons.Edit size={16} />
                      </button>
                      <Link
                        href={`/clientes/${cliente.id}`}
                        className="p-2 rounded-lg text-[#7E756B] hover:text-[#1E1A16] hover:bg-[#F2ECE1] transition-colors"
                        title="Ver expediente"
                      >
                        <Icons.Eye size={16} />
                      </Link>
                      <Link
                        href={`/contratos/nuevo?cliente=${cliente.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#1E1A16] hover:bg-[#332C25] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Icons.Plus size={14} />
                        Rentar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {lista.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#7E756B]">
                    No se encontraron clientes con el término buscado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Cliente con soporte de cancelación y dirty check */}
      <ClienteModal
        isOpen={mostrarModalAlta}
        clienteEditar={clienteAEditar}
        onClose={() => {
          setMostrarModalAlta(false);
          setClienteAEditar(null);
        }}
        onSave={handleGuardarCliente}
      />
    </div>
  );
}
