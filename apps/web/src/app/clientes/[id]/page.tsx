/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:39:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T03
 */

"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DocumentosCliente } from "@/components/clientes/DocumentosCliente";
import { HistorialRentasCliente } from "@/components/clientes/Historial";
import { MRA_TOKENS, SidebarNav, StatusChip, SurfaceCard } from "@/components/ui";
import { obtenerClientePorId, obtenerHistorialPorCliente } from "@/lib/db/sprint3";

function ClienteContenido() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "12700000-0000-4000-8000-000000000127";
  const cliente = obtenerClientePorId(id) ?? {
    id,
    numero_cliente: 127,
    nombre_completo: "Ricardo Medina Salazar",
    identificacion_numero: "B2302042880",
    domicilio: "Av. Reforma 1125, Col. Nueva, C.P. 21100",
    ciudad: "Mexicali",
    estado: "B.C.",
    telefono: "686 555 0100",
    celular: "686 555 0142",
    correo: "ricardo.medina@correo.mx",
    requiere_factura: false,
    razon_social: null,
    rfc: null,
    domicilio_fiscal: null,
    regimen_fiscal: null,
    aviso_privacidad_version: "2026.1",
    aviso_privacidad_aceptado_en: "2026-11-16T10:00:00Z",
    ghl_contact_id: null,
    created_at: "",
    updated_at: "",
    created_by: null,
    deleted_at: null,
  };

  const historial = obtenerHistorialPorCliente(cliente.id);

  const [nombre, setNombre] = useState(cliente.nombre_completo);
  const [domicilio, setDomicilio] = useState(cliente.domicilio ?? "");
  const [ciudadEstado, setCiudadEstado] = useState(`${cliente.ciudad ?? "Mexicali"}, ${cliente.estado ?? "B.C."}`);
  const [celular, setCelular] = useState(cliente.celular ?? "");
  const [telefono, setTelefono] = useState(cliente.telefono ?? "");
  const [correo, setCorreo] = useState(cliente.correo ?? "");
  const [requiereFactura, setRequiereFactura] = useState(cliente.requiere_factura);
  const [aviso, setAviso] = useState<string | null>(null);

  function guardarCambios() {
    setAviso(`Datos del cliente ${nombre} guardados y actualizados en la bitácora.`);
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
          gap: 18,
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
              CLIENTE No. {String(cliente.numero_cliente).padStart(5, "0")}
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: MRA_TOKENS.fonts.display,
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              {cliente.nombre_completo}
            </h1>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <span
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 20,
                background: MRA_TOKENS.colors.statusSuccessBg,
                color: MRA_TOKENS.colors.statusSuccessText,
                fontSize: 14,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Documentos vigentes
            </span>
            <span
              style={{
                height: 40,
                padding: "0 14px",
                borderRadius: 20,
                background: "#fff",
                border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
                fontSize: 14,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Aviso de privacidad aceptado 16/11/2026
            </span>
          </div>
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

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: 18,
          }}
        >
          {/* Columna Izquierda: Datos generales y fiscales (Mockup 2) */}
          <SurfaceCard style={{ padding: "20px 22px", gap: 14 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              Datos generales
            </h2>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: MRA_TOKENS.colors.textSecondary,
              }}
            >
              Nombre completo
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{
                  height: 48,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 12,
                  padding: "0 14px",
                  fontSize: 16,
                  color: MRA_TOKENS.colors.ink,
                  background: "#fff",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: MRA_TOKENS.colors.textSecondary,
              }}
            >
              Domicilio
              <input
                value={domicilio}
                onChange={(e) => setDomicilio(e.target.value)}
                style={{
                  height: 48,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 12,
                  padding: "0 14px",
                  fontSize: 16,
                  color: MRA_TOKENS.colors.ink,
                  background: "#fff",
                }}
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Ciudad / Estado
                <input
                  value={ciudadEstado}
                  onChange={(e) => setCiudadEstado(e.target.value)}
                  style={{
                    height: 48,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 12,
                    padding: "0 14px",
                    fontSize: 16,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Celular
                <input
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  style={{
                    height: 48,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 12,
                    padding: "0 14px",
                    fontSize: 16,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Teléfono
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{
                    height: 48,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 12,
                    padding: "0 14px",
                    fontSize: 16,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: MRA_TOKENS.colors.textSecondary,
                }}
              >
                Correo para el contrato
                <input
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  style={{
                    height: 48,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 12,
                    padding: "0 14px",
                    fontSize: 16,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: MRA_TOKENS.colors.paperCream,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  ¿Requiere factura?
                </div>
                <div style={{ fontSize: 13, color: MRA_TOKENS.colors.textMuted }}>
                  Razón social, RFC y régimen fiscal
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRequiereFactura((v) => !v)}
                style={{
                  width: 56,
                  height: 32,
                  borderRadius: 16,
                  background: requiereFactura
                    ? MRA_TOKENS.colors.brandRed
                    : MRA_TOKENS.colors.borderInput,
                  padding: 3,
                  boxSizing: "border-box",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: requiereFactura ? "flex-end" : "flex-start",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: "#fff",
                  }}
                />
              </button>
            </div>

            {/* Historial de rentas del cliente (S03-T08) */}
            <HistorialRentasCliente historial={historial} />
          </SurfaceCard>

          {/* Columna Derecha: Documentos (Licencia y Credencial) (Mockup 2) */}
          <DocumentosCliente clienteId={cliente.id} />
        </section>

        <footer
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: MRA_TOKENS.colors.textMuted,
              maxWidth: 460,
            }}
          >
            Los documentos se guardan en almacenamiento privado. Cada consulta
            queda en la bitácora de auditoría.
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={guardarCambios}
              style={{
                height: 56,
                padding: "0 28px",
                borderRadius: 28,
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                background: "#fff",
                color: MRA_TOKENS.colors.ink,
                font: "inherit",
                fontSize: 17,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Guardar cambios
            </button>
            <Link
              href="/contratos/nuevo"
              style={{
                height: 56,
                padding: "0 30px",
                borderRadius: 28,
                background: MRA_TOKENS.colors.brandRed,
                color: "#fff",
                fontSize: 17,
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Crear contrato con este cliente
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function ClienteDetallePage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: MRA_TOKENS.fonts.sans }}>Cargando cliente...</div>}>
      <ClienteContenido />
    </Suspense>
  );
}
