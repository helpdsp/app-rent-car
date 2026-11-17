/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:17:00Z
 * @agent_roles engineering-frontend-developer + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T09
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MRA_TOKENS } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("operador@mexicorentadeautos.mx");
  const [password, setPassword] = useState("contrasena-ejemplo");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [digitos, setDigitos] = useState<string[]>(["4", "8", "1", "", "", ""]);
  const [usarRespaldo, setUsarRespaldo] = useState(false);
  const [codigoRespaldo, setCodigoRespaldo] = useState("");
  const [tokenPendiente, setTokenPendiente] = useState<string | null>(null);
  const [mensajeEstado, setMensajeEstado] = useState<{
    tipo: "error" | "exito" | "info";
    texto: string;
  } | null>(null);
  const [cargando, setCargando] = useState(false);

  function actualizarDigito(indice: number, valor: string) {
    const limpio = valor.replace(/\D/g, "").slice(-1);
    setDigitos((prev) => {
      const copia = [...prev];
      copia[indice] = limpio;
      return copia;
    });
  }

  async function manejarLogin(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setMensajeEstado(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMensajeEstado({
          tipo: "error",
          texto: data.mensaje ?? "No fue posible iniciar sesión.",
        });
        return;
      }

      setTokenPendiente(data.token);
      if (data.requiere_mfa) {
        setMensajeEstado({
          tipo: "info",
          texto: `Credenciales válidas (${data.usuario.rol}). Complete la verificación en dos pasos.`,
        });
      } else {
        setMensajeEstado({
          tipo: "exito",
          texto: `Sesión iniciada como ${data.usuario.nombre} (${data.usuario.rol}).`,
        });
        router.push("/");
      }
    } catch {
      setMensajeEstado({
        tipo: "error",
        texto: "Error de red al conectar con el servidor de autenticación.",
      });
    } finally {
      setCargando(false);
    }
  }

  async function manejarVerificarMfa(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setMensajeEstado(null);

    const codigo = usarRespaldo ? codigoRespaldo.trim() : digitos.join("");

    try {
      const res = await fetch("/api/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          token: tokenPendiente ?? undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMensajeEstado({
          tipo: "error",
          texto: data.mensaje ?? "Código de verificación inválido.",
        });
        return;
      }

      setMensajeEstado({
        tipo: "exito",
        texto: `Verificación en dos pasos completada para ${data.usuario.nombre}.`,
      });
      router.push("/admin/usuarios");
    } catch {
      setMensajeEstado({
        tipo: "error",
        texto: "Error de red al verificar el código de segundo factor.",
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <div
      style={{
        minWidth: 1194,
        minHeight: 834,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        background: MRA_TOKENS.colors.paperCream,
        color: MRA_TOKENS.colors.ink,
        fontFamily: MRA_TOKENS.fonts.sans,
        fontSize: 16,
        overflow: "hidden",
        padding: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {/* Tarjeta 1: Inicio de sesión (Mockup 8) */}
        <section
          aria-label="Inicio de sesión"
          style={{
            width: 460,
            background: "#fff",
            border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
            borderRadius: 24,
            padding: "36px 36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: MRA_TOKENS.colors.brandRed,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MRA_TOKENS.fonts.display,
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              MRA
            </div>
            <div>
              <div
                style={{
                  fontFamily: MRA_TOKENS.fonts.display,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                México Renta de Autos
              </div>
              <div style={{ fontSize: 13, color: MRA_TOKENS.colors.textMuted }}>
                Contratos digitales
              </div>
            </div>
          </div>

          <h1
            style={{
              margin: "8px 0 0",
              fontFamily: MRA_TOKENS.fonts.display,
              fontSize: 30,
              lineHeight: 1.15,
            }}
          >
            Iniciar sesión
          </h1>

          <form
            onSubmit={manejarLogin}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
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
              Correo
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                style={{
                  height: 52,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 12,
                  padding: "0 14px",
                  font: "inherit",
                  fontSize: 16,
                  fontWeight: 400,
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
              Contraseña
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 52,
                  border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                  borderRadius: 12,
                  padding: "0 6px 0 14px",
                  boxSizing: "border-box",
                  background: "#fff",
                }}
              >
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    border: 0,
                    outline: 0,
                    font: "inherit",
                    fontSize: 16,
                    color: MRA_TOKENS.colors.ink,
                    background: "transparent",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  style={{
                    height: 44,
                    padding: "0 14px",
                    border: 0,
                    borderRadius: 10,
                    background: MRA_TOKENS.colors.paperCream,
                    font: "inherit",
                    fontSize: 14,
                    fontWeight: 600,
                    color: MRA_TOKENS.colors.ink,
                    cursor: "pointer",
                  }}
                >
                  {mostrarPassword ? "Ocultar" : "Mostrar"}
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={cargando}
              style={{
                height: 56,
                borderRadius: 28,
                border: 0,
                background: MRA_TOKENS.colors.brandRed,
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
                cursor: "pointer",
              }}
            >
              Entrar
            </button>
          </form>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <a
              href="/login"
              style={{
                color: MRA_TOKENS.colors.brandRed,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Olvidé mi contraseña
            </a>
            <span style={{ color: MRA_TOKENS.colors.textMuted }}>
              Acceso solo con cuenta del equipo
            </span>
          </div>

          <div
            style={{
              fontSize: 12,
              color: MRA_TOKENS.colors.textMuted,
              borderTop: `1px solid ${MRA_TOKENS.colors.borderDivider}`,
              paddingTop: 12,
              lineHeight: 1.5,
            }}
          >
            Al entrar aceptas que tus acciones queden registradas en la bitácora.
            La sesión se cierra tras 30 minutos sin actividad.
          </div>
        </section>

        {/* Tarjeta 2: Verificación en dos pasos (Mockup 8) */}
        <section
          aria-label="Verificación en dos pasos"
          style={{
            width: 460,
            background: "#fff",
            border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
            borderRadius: 24,
            padding: "36px 36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 12,
                background: MRA_TOKENS.colors.statusInfoBg,
                color: MRA_TOKENS.colors.statusInfoText,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Paso 2 de 2
            </span>
            <span style={{ fontSize: 13, color: MRA_TOKENS.colors.textMuted }}>
              Obligatorio para administrador y titular
            </span>
          </div>

          <h2
            style={{
              margin: 0,
              fontFamily: MRA_TOKENS.fonts.display,
              fontSize: 30,
              lineHeight: 1.15,
            }}
          >
            Verificación en dos pasos
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: MRA_TOKENS.colors.textSecondary,
              lineHeight: 1.5,
            }}
          >
            Escribe el código de 6 dígitos de tu aplicación de autenticación.
          </p>

          <form
            onSubmit={manejarVerificarMfa}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {!usarRespaldo ? (
              <div
                role="group"
                aria-label="Código de 6 dígitos"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                  gap: 8,
                }}
              >
                {digitos.map((digito, index) => (
                  <input
                    key={index}
                    aria-label={`Dígito ${index + 1}`}
                    value={digito}
                    onChange={(e) => actualizarDigito(index, e.target.value)}
                    maxLength={1}
                    inputMode="numeric"
                    style={{
                      height: 64,
                      border:
                        index === 0
                          ? `2px solid ${MRA_TOKENS.colors.brandRed}`
                          : `1px solid ${MRA_TOKENS.colors.borderInput}`,
                      borderRadius: 12,
                      textAlign: "center",
                      font: "inherit",
                      fontSize: 28,
                      fontWeight: 700,
                      background: "#fff",
                      color: MRA_TOKENS.colors.ink,
                    }}
                  />
                ))}
              </div>
            ) : (
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
                Código de respaldo (formato XXXX-XXXX)
                <input
                  type="text"
                  value={codigoRespaldo}
                  onChange={(e) => setCodigoRespaldo(e.target.value)}
                  placeholder="ADMN-4810"
                  style={{
                    height: 52,
                    border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
                    borderRadius: 12,
                    padding: "0 14px",
                    font: "inherit",
                    fontSize: 18,
                    fontWeight: 700,
                    color: MRA_TOKENS.colors.ink,
                    background: "#fff",
                  }}
                />
              </label>
            )}

            <button
              type="submit"
              disabled={cargando}
              style={{
                height: 56,
                borderRadius: 28,
                border: 0,
                background: MRA_TOKENS.colors.brandRed,
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              Verificar y entrar
            </button>
          </form>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
            }}
          >
            <button
              type="button"
              onClick={() => setUsarRespaldo((v) => !v)}
              style={{
                border: 0,
                background: "transparent",
                padding: 0,
                color: MRA_TOKENS.colors.brandRed,
                font: "inherit",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {usarRespaldo
                ? "Usar código de 6 dígitos"
                : "Usar un código de respaldo"}
            </button>
            <a
              href="/login"
              style={{
                color: MRA_TOKENS.colors.textMuted,
                textDecoration: "none",
              }}
            >
              Volver
            </a>
          </div>

          <div
            style={{
              fontSize: 12,
              color: MRA_TOKENS.colors.brandRedDark,
              background: MRA_TOKENS.colors.brandRedSoft,
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            Tras 5 intentos fallidos se bloquea el acceso durante 15 minutos.
          </div>
        </section>
      </div>

      {/* Barra auxiliar de demostración para probar cuentas del Sprint 1 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          color: MRA_TOKENS.colors.textSecondary,
        }}
      >
        <span>Perfiles de prueba (demo):</span>
        <button
          type="button"
          onClick={() => {
            setCorreo("mariana@mexicorentadeautos.mx");
            setPassword("operador-mra-2026");
          }}
          style={{
            minHeight: 44,
            padding: "0 14px",
            borderRadius: 12,
            border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Operador (Mariana)
        </button>
        <button
          type="button"
          onClick={() => {
            setCorreo("carolina@mexicorentadeautos.mx");
            setPassword("admin-mra-2026");
            setDigitos(["4", "8", "1", "2", "0", "6"]);
          }}
          style={{
            minHeight: 44,
            padding: "0 14px",
            borderRadius: 12,
            border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Administrador con MFA (Carolina)
        </button>
        <button
          type="button"
          onClick={() => {
            setCorreo("titular@mexicorentadeautos.mx");
            setPassword("titular-mra-2026");
            setDigitos(["4", "8", "1", "2", "0", "6"]);
          }}
          style={{
            minHeight: 44,
            padding: "0 14px",
            borderRadius: 12,
            border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Titular con MFA
        </button>
        <button
          type="button"
          onClick={() => {
            setCorreo("luis@mexicorentadeautos.mx");
            setPassword("luis-mra-2026");
          }}
          style={{
            minHeight: 44,
            padding: "0 14px",
            borderRadius: 12,
            border: `1px solid ${MRA_TOKENS.colors.borderInput}`,
            background: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Desactivado (Luis)
        </button>
      </div>

      {mensajeEstado && (
        <div
          role="status"
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            background:
              mensajeEstado.tipo === "error"
                ? MRA_TOKENS.colors.statusDangerBg
                : mensajeEstado.tipo === "exito"
                  ? MRA_TOKENS.colors.statusSuccessBg
                  : MRA_TOKENS.colors.statusInfoBg,
            color:
              mensajeEstado.tipo === "error"
                ? MRA_TOKENS.colors.statusDangerText
                : mensajeEstado.tipo === "exito"
                  ? MRA_TOKENS.colors.statusSuccessText
                  : MRA_TOKENS.colors.statusInfoText,
          }}
        >
          {mensajeEstado.texto}
        </div>
      )}
    </div>
  );
}
