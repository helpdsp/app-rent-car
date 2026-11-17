/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:18:00Z
 * @agent_roles engineering-frontend-developer + engineering-backend-architect
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T10
 */

"use client";

import React, { useState } from "react";
import {
  MRA_TOKENS,
  SidebarNav,
  StatusChip,
  type StatusChipVariant,
  SurfaceCard,
} from "@/components/ui";
import type { RolUsuario } from "@/lib/db/schema";

interface UsuarioVista {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo: boolean;
  mfa_activo: boolean;
  ultimoAccesoTexto: string;
}

const EQUIPO_INICIAL: UsuarioVista[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Mariana Rojas",
    correo: "mariana@mexicorentadeautos.mx",
    rol: "operador",
    activo: true,
    mfa_activo: false,
    ultimoAccesoTexto: "Hoy 08:02",
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    nombre: "Haaron González",
    correo: "haaron@bajaworks.org",
    rol: "administrador",
    activo: true,
    mfa_activo: true,
    ultimoAccesoTexto: "En línea (Sesión activa)",
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    nombre: "Titular",
    correo: "titular@mexicorentadeautos.mx",
    rol: "titular",
    activo: true,
    mfa_activo: true,
    ultimoAccesoTexto: "13/11 18:20",
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    nombre: "Luis Pérez",
    correo: "luis@mexicorentadeautos.mx",
    rol: "operador",
    activo: false,
    mfa_activo: false,
    ultimoAccesoTexto: "02/10 17:55",
  },
];

function obtenerChipRol(u: UsuarioVista): {
  etiqueta: string;
  variante: StatusChipVariant;
} {
  if (!u.activo) {
    const base =
      u.rol === "administrador"
        ? "Administrador"
        : u.rol === "titular"
          ? "Titular"
          : "Operador";
    return { etiqueta: `${base} · desactivado`, variante: "neutral" };
  }
  if (u.rol === "administrador") {
    return { etiqueta: "Administrador", variante: "danger" };
  }
  if (u.rol === "titular") {
    return { etiqueta: "Titular", variante: "success" };
  }
  return { etiqueta: "Operador", variante: "info" };
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioVista[]>(EQUIPO_INICIAL);
  const [mostrarFormularioAlta, setMostrarFormularioAlta] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoRol, setNuevoRol] = useState<RolUsuario>("operador");
  const [usuarioEditandoId, setUsuarioEditandoId] = useState<string | null>(
    null,
  );
  const [avisoOperacion, setAvisoOperacion] = useState<string | null>(null);

  function crearUsuarioLocal(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoNombre.trim() || !nuevoCorreo.trim()) return;

    const mfaRequerido =
      nuevoRol === "administrador" || nuevoRol === "titular";
    const creado: UsuarioVista = {
      id: `usr-${Date.now()}`,
      nombre: nuevoNombre.trim(),
      correo: nuevoCorreo.trim().toLowerCase(),
      rol: nuevoRol,
      activo: true,
      mfa_activo: mfaRequerido,
      ultimoAccesoTexto: "Sin acceso",
    };

    setUsuarios((prev) => [...prev, creado]);
    setNuevoNombre("");
    setNuevoCorreo("");
    setNuevoRol("operador");
    setMostrarFormularioAlta(false);
    setAvisoOperacion(
      `Usuario ${creado.nombre} creado con rol ${creado.rol}.`,
    );
  }

  function cambiarRolUsuario(id: string, rol: RolUsuario) {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              rol,
              mfa_activo:
                rol === "administrador" || rol === "titular"
                  ? true
                  : u.mfa_activo,
            }
          : u,
      ),
    );
    setAvisoOperacion("Rol de usuario actualizado y registrado en bitácora.");
  }

  function alternarEstadoActivo(id: string) {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const nuevoActivo = !u.activo;
        setAvisoOperacion(
          nuevoActivo
            ? `Usuario ${u.nombre} reactivado.`
            : `Usuario ${u.nombre} desactivado. Su autoría histórica en la bitácora se conserva intacta.`,
        );
        return { ...u, activo: nuevoActivo };
      }),
    );
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
      <SidebarNav seccionActiva="admin" />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "28px 36px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
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
              ADMINISTRACIÓN
            </div>
            <h1
              style={{
                margin: "4px 0 0",
                fontFamily: MRA_TOKENS.fonts.display,
                fontSize: 34,
                lineHeight: 1.1,
              }}
            >
              Usuarios y roles
            </h1>
          </div>

          <div
            role="tablist"
            aria-label="Administración"
            style={{ display: "flex", gap: 8 }}
          >
            <a
              role="tab"
              aria-selected="false"
              href="/admin/tarifas"
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                background: "#fff",
                color: MRA_TOKENS.colors.ink,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Tarifas y parámetros
            </a>
            <a
              role="tab"
              aria-selected="true"
              href="/admin/usuarios"
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                background: MRA_TOKENS.colors.ink,
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Usuarios y roles
            </a>
            <a
              role="tab"
              aria-selected="false"
              href="/admin/bitacora"
              style={{
                height: 44,
                padding: "0 18px",
                borderRadius: 22,
                border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                background: "#fff",
                color: MRA_TOKENS.colors.ink,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              Bitácora y exportaciones
            </a>
          </div>
        </header>

        {avisoOperacion && (
          <div
            role="status"
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              background: MRA_TOKENS.colors.statusSuccessBg,
              color: MRA_TOKENS.colors.statusSuccessText,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {avisoOperacion}
          </div>
        )}

        <section
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "minmax(0, 6fr) minmax(0, 5fr)",
            gap: 16,
          }}
        >
          {/* Columna izquierda: Equipo (Mockup 17) */}
          <SurfaceCard style={{ gap: 8, minHeight: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Equipo
              </h2>
              <button
                type="button"
                onClick={() => setMostrarFormularioAlta((v) => !v)}
                style={{
                  height: 44,
                  padding: "0 18px",
                  borderRadius: 22,
                  border: 0,
                  background: MRA_TOKENS.colors.brandRed,
                  color: "#fff",
                  font: "inherit",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Nuevo usuario
              </button>
            </div>

            {mostrarFormularioAlta && (
              <form
                onSubmit={crearUsuarioLocal}
                aria-label="Crear nuevo usuario"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1.4fr 1fr auto",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: MRA_TOKENS.colors.paperCream,
                  alignItems: "center",
                }}
              >
                <input
                  aria-label="Nombre del nuevo usuario"
                  placeholder="Nombre completo"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  required
                  style={{
                    height: 44,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 10,
                    padding: "0 10px",
                    fontSize: 14,
                    background: "#fff",
                  }}
                />
                <input
                  type="email"
                  aria-label="Correo del nuevo usuario"
                  placeholder="correo@mexicorentadeautos.mx"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  required
                  style={{
                    height: 44,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 10,
                    padding: "0 10px",
                    fontSize: 14,
                    background: "#fff",
                  }}
                />
                <select
                  aria-label="Rol del nuevo usuario"
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value as RolUsuario)}
                  style={{
                    height: 44,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 10,
                    padding: "0 10px",
                    fontSize: 14,
                    background: "#fff",
                  }}
                >
                  <option value="operador">Operador</option>
                  <option value="administrador">Administrador</option>
                  <option value="titular">Titular</option>
                </select>
                <button
                  type="submit"
                  style={{
                    height: 44,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: 0,
                    background: MRA_TOKENS.colors.ink,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Guardar
                </button>
              </form>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.8fr) 1fr 0.8fr 1fr",
                gap: 10,
                padding: "8px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderCard}`,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: MRA_TOKENS.colors.textMuted,
              }}
            >
              <span>USUARIO</span>
              <span>ROL</span>
              <span>MFA</span>
              <span>ÚLTIMO ACCESO</span>
            </div>

            {usuarios.map((u, idx) => {
              const chip = obtenerChipRol(u);
              const esUltimo = idx === usuarios.length - 1;
              const editando = usuarioEditandoId === u.id;

              return (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "10px 0",
                    borderBottom: esUltimo
                      ? "none"
                      : `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                    fontSize: 14,
                    color: u.activo
                      ? MRA_TOKENS.colors.ink
                      : MRA_TOKENS.colors.textMuted,
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1.8fr) 1fr 0.8fr 1fr",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <b>{u.nombre}</b>
                      <span
                        style={{
                          display: "block",
                          fontSize: 12,
                          color: MRA_TOKENS.colors.textMuted,
                        }}
                      >
                        {u.correo}
                      </span>
                    </span>

                    <span>
                      <StatusChip variant={chip.variante}>
                        {chip.etiqueta}
                      </StatusChip>
                    </span>

                    <span
                      style={{
                        color: !u.activo
                          ? MRA_TOKENS.colors.textMuted
                          : u.mfa_activo
                            ? MRA_TOKENS.colors.statusSuccessText
                            : MRA_TOKENS.colors.textMuted,
                        fontWeight: u.activo && u.mfa_activo ? 700 : 400,
                      }}
                    >
                      {!u.activo ? "—" : u.mfa_activo ? "Activo" : "Opcional"}
                    </span>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                        color: u.activo
                          ? MRA_TOKENS.colors.textSecondary
                          : MRA_TOKENS.colors.textMuted,
                      }}
                    >
                      <span>{u.ultimoAccesoTexto}</span>
                      <button
                        type="button"
                        aria-label={`Gestionar ${u.nombre}`}
                        onClick={() =>
                          setUsuarioEditandoId(editando ? null : u.id)
                        }
                        style={{
                          minHeight: 44,
                          padding: "0 10px",
                          borderRadius: 10,
                          border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                          background: "#fff",
                          color: MRA_TOKENS.colors.ink,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {editando ? "Cerrar" : "Editar"}
                      </button>
                    </span>
                  </div>

                  {editando && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 10,
                        background: MRA_TOKENS.colors.paperCream,
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          color: MRA_TOKENS.colors.textSecondary,
                        }}
                      >
                        Cambiar rol:
                        <select
                          aria-label={`Cambiar rol de ${u.nombre}`}
                          value={u.rol}
                          onChange={(e) =>
                            cambiarRolUsuario(
                              u.id,
                              e.target.value as RolUsuario,
                            )
                          }
                          style={{
                            height: 44,
                            border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                            borderRadius: 10,
                            padding: "0 10px",
                            background: "#fff",
                            fontSize: 13,
                          }}
                        >
                          <option value="operador">Operador</option>
                          <option value="administrador">Administrador</option>
                          <option value="titular">Titular</option>
                        </select>
                      </label>

                      <button
                        type="button"
                        onClick={() => alternarEstadoActivo(u.id)}
                        style={{
                          height: 44,
                          padding: "0 14px",
                          borderRadius: 10,
                          border: 0,
                          background: u.activo
                            ? MRA_TOKENS.colors.statusDangerBg
                            : MRA_TOKENS.colors.statusSuccessBg,
                          color: u.activo
                            ? MRA_TOKENS.colors.statusDangerText
                            : MRA_TOKENS.colors.statusSuccessText,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {u.activo ? "Desactivar usuario" : "Reactivar usuario"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            <div
              style={{
                marginTop: "auto",
                padding: "10px 12px",
                borderRadius: 12,
                background: MRA_TOKENS.colors.paperCream,
                fontSize: 12,
                color: MRA_TOKENS.colors.textSecondary,
                lineHeight: 1.5,
              }}
            >
              Desactivar a un usuario no borra su historial: sus acciones siguen
              visibles en la bitácora. El administrador y el titular deben usar
              verificación en dos pasos.
            </div>
          </SurfaceCard>

          {/* Columna derecha: Permisos por rol (Mockup 17) */}
          <SurfaceCard style={{ gap: 4, minHeight: 0 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700 }}>
              Permisos por rol
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderCard}`,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                color: MRA_TOKENS.colors.textMuted,
                textAlign: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>ACCIÓN</span>
              <span>OPERADOR</span>
              <span>ADMIN.</span>
              <span>TITULAR</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>
                Crear clientes, vehículos y contratos
              </span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>Ver</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>
                Entregar y recibir vehículos
              </span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>
                Pactar tarifa en un contrato (con motivo)
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: MRA_TOKENS.colors.statusWarningText,
                  }}
                >
                  Por confirmar con el cliente
                </span>
              </span>
              <span
                style={{
                  color: MRA_TOKENS.colors.statusWarningText,
                  fontWeight: 700,
                }}
              >
                ?
              </span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>
                Cambiar el catálogo y parámetros
              </span>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>
                Eliminar un contrato en borrador
              </span>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>Ver la bitácora</span>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                borderBottom: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>Exportar a CSV</span>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 2.4fr) 1fr 1fr 1fr",
                gap: 6,
                padding: "6px 0",
                fontSize: 13,
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <span style={{ textAlign: "left" }}>Gestionar usuarios</span>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
              <b style={{ color: MRA_TOKENS.colors.statusSuccessText }}>✓</b>
              <span style={{ color: MRA_TOKENS.colors.textMuted }}>—</span>
            </div>

            <div
              style={{
                marginTop: "auto",
                fontSize: 12,
                color: MRA_TOKENS.colors.textMuted,
                lineHeight: 1.5,
              }}
            >
              Los permisos se aplican en el servidor y en la base de datos, no
              solo ocultando botones. Esta matriz es una propuesta por defecto.
            </div>
          </SurfaceCard>
        </section>
      </main>
    </div>
  );
}
