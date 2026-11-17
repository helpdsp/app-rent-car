/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:40:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T09
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MRA_TOKENS, SidebarNav, SurfaceCard } from "@/components/ui";
import { obtenerClientes, type ClienteRow } from "@/lib/db/sprint3";

export default function ClientesListPage() {
  const [termino, setTermino] = useState("");
  const [lista, setLista] = useState<ClienteRow[]>(obtenerClientes());
  const [mostrarAlta, setMostrarAlta] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaId, setNuevaId] = useState("");
  const [nuevoTel, setNuevoTel] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    setLista(obtenerClientes(termino));
  }

  function crearClienteRapido(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoNombre || !nuevaId || !nuevoTel) return;

    const max = lista.reduce((m, c) => Math.max(m, c.numero_cliente), 100);
    const nuevo: ClienteRow = {
      id: `cli-${Date.now()}`,
      numero_cliente: max + 1,
      nombre_completo: nuevoNombre.trim(),
      identificacion_numero: nuevaId.trim(),
      domicilio: "Mexicali, B.C.",
      ciudad: "Mexicali",
      estado: "B.C.",
      telefono: nuevoTel.trim(),
      celular: nuevoTel.trim(),
      correo: null,
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

    setLista([nuevo, ...lista]);
    setNuevoNombre("");
    setNuevaId("");
    setNuevoTel("");
    setMostrarAlta(false);
    setAviso(`Cliente ${nuevo.nombre_completo} registrado con número ${nuevo.numero_cliente}.`);
  }

  return (
    <div
      style={{
        minWidth: 1194,
        minHeight: 834,
        boxSizing: "border-box",
        display: "flex",
        background: MRA_TOKENS.colors.paperCream,
        color: MRA_TOKENS.colors.ink,
        fontFamily: MRA_TOKENS.fonts.sans,
        fontSize: 16,
        overflow: "hidden",
      }}
    >
      <SidebarNav seccionActiva="clientes" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: MRA_TOKENS.colors.textMuted,
              }}
            >
              CATÁLOGO DE CLIENTES
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: MRA_TOKENS.fonts.display,
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Clientes registrados
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setMostrarAlta((v) => !v)}
            style={{
              height: 44,
              padding: "0 22px",
              borderRadius: 22,
              background: MRA_TOKENS.colors.brandRed,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              border: 0,
              cursor: "pointer",
            }}
          >
            + Nuevo cliente
          </button>
        </header>

        {aviso && (
          <div
            role="status"
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              background: MRA_TOKENS.colors.statusSuccessBg,
              color: MRA_TOKENS.colors.statusSuccessText,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {aviso}
          </div>
        )}

        {mostrarAlta && (
          <form
            onSubmit={crearClienteRapido}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr auto",
              gap: 10,
              padding: 14,
              background: "#fff",
              borderRadius: 12,
              border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
              alignItems: "center",
            }}
          >
            <input
              placeholder="Nombre completo"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              required
              style={{
                height: 40,
                padding: "0 10px",
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                borderRadius: 8,
              }}
            />
            <input
              placeholder="Identificación / Licencia"
              value={nuevaId}
              onChange={(e) => setNuevaId(e.target.value)}
              required
              style={{
                height: 40,
                padding: "0 10px",
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                borderRadius: 8,
              }}
            />
            <input
              placeholder="Teléfono / Celular"
              value={nuevoTel}
              onChange={(e) => setNuevoTel(e.target.value)}
              required
              style={{
                height: 40,
                padding: "0 10px",
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                borderRadius: 8,
              }}
            />
            <button
              type="submit"
              style={{
                height: 40,
                padding: "0 18px",
                borderRadius: 8,
                border: 0,
                background: MRA_TOKENS.colors.ink,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Guardar
            </button>
          </form>
        )}

        <form onSubmit={buscar} style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Buscar por nombre, número de cliente, INE, licencia, teléfono o RFC..."
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
              padding: "0 14px",
              background: "#fff",
              fontSize: 15,
            }}
          />
          <button
            type="submit"
            style={{
              height: 48,
              padding: "0 22px",
              borderRadius: 12,
              background: MRA_TOKENS.colors.ink,
              color: "#fff",
              fontWeight: 700,
              border: 0,
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
        </form>

        <SurfaceCard style={{ flex: 1, gap: 10, minHeight: 0 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 2fr 1.2fr 1fr 1fr",
              gap: 12,
              padding: "8px 0",
              borderBottom: `1px solid ${MRA_TOKENS.colors.borderCard}`,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: MRA_TOKENS.colors.textMuted,
            }}
          >
            <span>NO.</span>
            <span>NOMBRE COMPLETO</span>
            <span>IDENTIFICACIÓN</span>
            <span>TELÉFONO</span>
            <span style={{ textAlign: "right" }}>ACCIONES</span>
          </div>

          {lista.map((c, idx) => (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 2fr 1.2fr 1fr 1fr",
                gap: 12,
                padding: "10px 0",
                borderBottom:
                  idx === lista.length - 1
                    ? "none"
                    : `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 14,
                alignItems: "center",
              }}
            >
              <b style={{ color: MRA_TOKENS.colors.textSecondary }}>
                #{String(c.numero_cliente).padStart(5, "0")}
              </b>
              <span>
                <b>{c.nombre_completo}</b>
                <span
                  style={{
                    display: "block",
                    fontSize: 12,
                    color: MRA_TOKENS.colors.textMuted,
                  }}
                >
                  {c.correo ?? "Sin correo"}
                </span>
              </span>
              <span>{c.identificacion_numero}</span>
              <span>{c.telefono ?? c.celular ?? "—"}</span>
              <div style={{ textAlign: "right" }}>
                <Link
                  href={`/clientes/${c.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 36,
                    padding: "0 14px",
                    borderRadius: 18,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    background: "#fff",
                    color: MRA_TOKENS.colors.ink,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Ver ficha
                </Link>
              </div>
            </div>
          ))}
        </SurfaceCard>
      </main>
    </div>
  );
}
