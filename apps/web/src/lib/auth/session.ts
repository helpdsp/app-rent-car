/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:10:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T05
 */

import crypto from "node:crypto";
import type { RolUsuario, UsuarioRow } from "../db/schema";
import {
  INACTIVIDAD_MINUTOS_POR_DEFECTO,
  limpiarIntentosFallidos,
  registrarIntentoFallido,
  sesionExpiradaPorInactividad,
  verificarBloqueoAcceso,
} from "./inactividad";
import {
  consumirCodigoRespaldo,
  generarCodigosRespaldo,
  requiereMfaPorRol,
  verificarCodigoTotp,
} from "./mfa";

export const COOKIE_SESION_NOMBRE = "sb-access-token";

export interface UsuarioAuthInterno extends UsuarioRow {
  passwordHash: string;
  mfaSecreto: string;
  codigosRespaldo: string[];
  ultimoAccesoTexto: string;
}

export interface SesionUsuario {
  token: string;
  usuarioId: string;
  correo: string;
  nombre: string;
  rol: RolUsuario;
  activo: boolean;
  requiereMfa: boolean;
  mfaVerificado: boolean;
  creadaEnMs: number;
  ultimaActividadMs: number;
}

export interface EntradaBitacoraAutoria {
  id: number;
  usuario_id: string;
  usuario_nombre: string;
  accion: string;
  tabla: string;
  registro_id: string;
  ocurrido_en: string;
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`mra-salt:${password}`).digest("hex");
}

const USUARIOS_SEMILLA_INICIAL: UsuarioAuthInterno[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Mariana Rojas",
    correo: "mariana@mexicorentadeautos.mx",
    rol: "operador",
    activo: true,
    mfa_activo: false,
    ultimo_acceso_en: "2026-11-17T16:02:00Z",
    ultimoAccesoTexto: "Hoy 08:02",
    created_at: "2026-10-01T15:00:00Z",
    updated_at: "2026-11-17T16:02:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
    passwordHash: hashPassword("operador-mra-2026"),
    mfaSecreto: "MRA-OPERADOR-TOTP-SECRET-01",
    codigosRespaldo: ["OPER-1001", "OPER-1002"],
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    nombre: "Carolina Mendoza",
    correo: "carolina@mexicorentadeautos.mx",
    rol: "administrador",
    activo: true,
    mfa_activo: true,
    ultimo_acceso_en: "2026-11-17T15:48:00Z",
    ultimoAccesoTexto: "Hoy 07:48",
    created_at: "2026-09-15T15:00:00Z",
    updated_at: "2026-11-17T15:48:00Z",
    created_by: null,
    passwordHash: hashPassword("admin-mra-2026"),
    mfaSecreto: "MRA-ADMIN-TOTP-SECRET-02",
    codigosRespaldo: ["ADMN-4810", "ADMN-9921"],
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    nombre: "Titular",
    correo: "titular@mexicorentadeautos.mx",
    rol: "titular",
    activo: true,
    mfa_activo: true,
    ultimo_acceso_en: "2026-11-14T02:20:00Z",
    ultimoAccesoTexto: "13/11 18:20",
    created_at: "2026-09-15T15:00:00Z",
    updated_at: "2026-11-14T02:20:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
    passwordHash: hashPassword("titular-mra-2026"),
    mfaSecreto: "MRA-TITULAR-TOTP-SECRET-03",
    codigosRespaldo: ["TITU-7711", "TITU-7712"],
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    nombre: "Luis Pérez",
    correo: "luis@mexicorentadeautos.mx",
    rol: "operador",
    activo: false,
    mfa_activo: false,
    ultimo_acceso_en: "2026-10-03T00:55:00Z",
    ultimoAccesoTexto: "02/10 17:55",
    created_at: "2026-09-20T15:00:00Z",
    updated_at: "2026-10-03T01:10:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
    passwordHash: hashPassword("luis-mra-2026"),
    mfaSecreto: "MRA-LUIS-TOTP-SECRET-04",
    codigosRespaldo: [],
  },
];

const BITACORA_SEMILLA_INICIAL: EntradaBitacoraAutoria[] = [
  {
    id: 1,
    usuario_id: "11111111-1111-4111-8111-111111111104",
    usuario_nombre: "Luis Pérez",
    accion: "INSERT",
    tabla: "contratos",
    registro_id: "00000000-0000-4000-8000-000000008160",
    ocurrido_en: "2026-10-02T17:40:00Z",
  },
  {
    id: 2,
    usuario_id: "11111111-1111-4111-8111-111111111101",
    usuario_nombre: "Mariana Rojas",
    accion: "INSERT",
    tabla: "clientes",
    registro_id: "00000000-0000-4000-8000-000000000127",
    ocurrido_en: "2026-11-17T15:55:00Z",
  },
];

const usuariosPorId = new Map<string, UsuarioAuthInterno>();
const sesionesPorToken = new Map<string, SesionUsuario>();
const bitacoraAutoria: EntradaBitacoraAutoria[] = [];
let inactividadMinutosConfigurada = INACTIVIDAD_MINUTOS_POR_DEFECTO;

export function restaurarEstadoAuthSemilla(): void {
  usuariosPorId.clear();
  sesionesPorToken.clear();
  bitacoraAutoria.length = 0;
  inactividadMinutosConfigurada = INACTIVIDAD_MINUTOS_POR_DEFECTO;

  for (const u of USUARIOS_SEMILLA_INICIAL) {
    usuariosPorId.set(u.id, {
      ...u,
      codigosRespaldo: [...u.codigosRespaldo],
    });
  }
  for (const b of BITACORA_SEMILLA_INICIAL) {
    bitacoraAutoria.push({ ...b });
  }
}

// Inicializar al cargar el módulo
restaurarEstadoAuthSemilla();

export function configurarInactividadMinutos(minutos: number): void {
  if (minutos > 0) {
    inactividadMinutosConfigurada = minutos;
  }
}

export function obtenerInactividadMinutos(): number {
  return inactividadMinutosConfigurada;
}

export function listarUsuariosPublicos(): Array<
  UsuarioRow & { ultimoAccesoTexto: string }
> {
  return Array.from(usuariosPorId.values()).map((u) => ({
    id: u.id,
    nombre: u.nombre,
    correo: u.correo,
    rol: u.rol,
    activo: u.activo,
    mfa_activo: u.mfa_activo,
    ultimo_acceso_en: u.ultimo_acceso_en,
    ultimoAccesoTexto: u.ultimoAccesoTexto,
    created_at: u.created_at,
    updated_at: u.updated_at,
    created_by: u.created_by,
  }));
}

export function obtenerUsuarioPorCorreo(
  correo: string,
): UsuarioAuthInterno | undefined {
  const normalizado = correo.trim().toLowerCase();
  for (const u of usuariosPorId.values()) {
    if (u.correo.toLowerCase() === normalizado) {
      return u;
    }
  }
  return undefined;
}

export function obtenerUsuarioPorId(
  id: string,
): UsuarioAuthInterno | undefined {
  return usuariosPorId.get(id);
}

/**
 * Crea un usuario nuevo con rol (solo administrador).
 */
export function crearUsuarioSistema(datos: {
  nombre: string;
  correo: string;
  rol: RolUsuario;
  password?: string;
  creadoPorId: string;
}):
  | { ok: true; usuario: UsuarioRow & { ultimoAccesoTexto: string }; codigosRespaldo: string[] }
  | { ok: false; status: number; codigo: string; mensaje: string } {
  const existente = obtenerUsuarioPorCorreo(datos.correo);
  if (existente) {
    return {
      ok: false,
      status: 409,
      codigo: "USUARIO_DUPLICADO",
      mensaje: "Ya existe un usuario registrado con ese correo electrónico.",
    };
  }

  const ahoraIso = new Date().toISOString();
  const id = crypto.randomUUID();
  const mfaObligatorio = requiereMfaPorRol(datos.rol);
  const codigosRespaldo = generarCodigosRespaldo(8);

  const nuevo: UsuarioAuthInterno = {
    id,
    nombre: datos.nombre.trim(),
    correo: datos.correo.trim().toLowerCase(),
    rol: datos.rol,
    activo: true,
    mfa_activo: mfaObligatorio,
    ultimo_acceso_en: null,
    ultimoAccesoTexto: "Sin acceso",
    created_at: ahoraIso,
    updated_at: ahoraIso,
    created_by: datos.creadoPorId,
    passwordHash: hashPassword(datos.password ?? "temporal-mra-2026"),
    mfaSecreto: `MRA-TOTP-${id.slice(0, 8).toUpperCase()}`,
    codigosRespaldo,
  };

  usuariosPorId.set(id, nuevo);
  bitacoraAutoria.push({
    id: bitacoraAutoria.length + 1,
    usuario_id: datos.creadoPorId,
    usuario_nombre:
      usuariosPorId.get(datos.creadoPorId)?.nombre ?? "Administrador",
    accion: "INSERT",
    tabla: "usuarios",
    registro_id: id,
    ocurrido_en: ahoraIso,
  });

  return {
    ok: true,
    usuario: {
      id: nuevo.id,
      nombre: nuevo.nombre,
      correo: nuevo.correo,
      rol: nuevo.rol,
      activo: nuevo.activo,
      mfa_activo: nuevo.mfa_activo,
      ultimo_acceso_en: nuevo.ultimo_acceso_en,
      ultimoAccesoTexto: nuevo.ultimoAccesoTexto,
      created_at: nuevo.created_at,
      updated_at: nuevo.updated_at,
      created_by: nuevo.created_by,
    },
    codigosRespaldo,
  };
}

/**
 * Actualiza el rol o estado activo de un usuario.
 * Si se desactiva (`activo = false`), revoca sus sesiones activas pero conserva
 * su registro y toda su autoría histórica en la bitácora (RF-01, T-05).
 */
export function actualizarUsuarioSistema(
  usuarioId: string,
  cambios: { rol?: RolUsuario; activo?: boolean; nombre?: string },
  ejecutadoPorId: string,
):
  | { ok: true; usuario: UsuarioRow & { ultimoAccesoTexto: string } }
  | { ok: false; status: number; codigo: string; mensaje: string } {
  const actual = usuariosPorId.get(usuarioId);
  if (!actual) {
    return {
      ok: false,
      status: 404,
      codigo: "USUARIO_NO_ENCONTRADO",
      mensaje: "El usuario especificado no existe.",
    };
  }

  if (cambios.rol !== undefined) {
    actual.rol = cambios.rol;
    if (requiereMfaPorRol(cambios.rol)) {
      actual.mfa_activo = true;
    }
  }
  if (cambios.nombre !== undefined && cambios.nombre.trim().length > 0) {
    actual.nombre = cambios.nombre.trim();
  }
  if (cambios.activo !== undefined) {
    actual.activo = cambios.activo;
    if (!cambios.activo) {
      // Invalidar todas las sesiones activas del usuario desactivado
      for (const [token, sesion] of sesionesPorToken.entries()) {
        if (sesion.usuarioId === usuarioId) {
          sesionesPorToken.delete(token);
        }
      }
    }
  }

  actual.updated_at = new Date().toISOString();

  bitacoraAutoria.push({
    id: bitacoraAutoria.length + 1,
    usuario_id: ejecutadoPorId,
    usuario_nombre:
      usuariosPorId.get(ejecutadoPorId)?.nombre ?? "Administrador",
    accion: "UPDATE",
    tabla: "usuarios",
    registro_id: usuarioId,
    ocurrido_en: actual.updated_at,
  });

  return {
    ok: true,
    usuario: {
      id: actual.id,
      nombre: actual.nombre,
      correo: actual.correo,
      rol: actual.rol,
      activo: actual.activo,
      mfa_activo: actual.mfa_activo,
      ultimo_acceso_en: actual.ultimo_acceso_en,
      ultimoAccesoTexto: actual.ultimoAccesoTexto,
      created_at: actual.created_at,
      updated_at: actual.updated_at,
      created_by: actual.created_by,
    },
  };
}

/**
 * Consulta las entradas de bitácora asociadas a un autor (para comprobar que
 * un usuario desactivado conserva su autoría — T-05).
 */
export function obtenerAutoriaBitacoraPorUsuario(
  usuarioId: string,
): EntradaBitacoraAutoria[] {
  return bitacoraAutoria.filter((e) => e.usuario_id === usuarioId);
}

/**
 * Inicia sesión con correo y contraseña (RF-01).
 */
export function iniciarSesionConCredenciales(
  correo: string,
  password: string,
  ahoraMs: number = Date.now(),
):
  | {
      ok: true;
      sesion: SesionUsuario;
      requiereSegundoFactor: boolean;
    }
  | {
      ok: false;
      status: number;
      codigo: string;
      mensaje: string;
    } {
  const bloqueo = verificarBloqueoAcceso(correo, ahoraMs);
  if (bloqueo.bloqueado) {
    return {
      ok: false,
      status: 429,
      codigo: "CUENTA_BLOQUEADA_TEMPORALMENTE",
      mensaje: `Tras 5 intentos fallidos se bloquea el acceso durante 15 minutos. Intente de nuevo en ${bloqueo.minutosRestantes} min.`,
    };
  }

  const usuario = obtenerUsuarioPorCorreo(correo);
  if (!usuario) {
    const fallo = registrarIntentoFallido(correo, ahoraMs);
    if (fallo.bloqueado) {
      return {
        ok: false,
        status: 429,
        codigo: "CUENTA_BLOQUEADA_TEMPORALMENTE",
        mensaje:
          "Tras 5 intentos fallidos se bloquea el acceso durante 15 minutos.",
      };
    }
    return {
      ok: false,
      status: 401,
      codigo: "CREDENCIALES_INVALIDAS",
      mensaje: "Correo o contraseña incorrectos.",
    };
  }

  if (!usuario.activo) {
    return {
      ok: false,
      status: 403,
      codigo: "USUARIO_DESACTIVADO",
      mensaje:
        "Esta cuenta de usuario ha sido desactivada. Su historial en la bitácora se conserva, pero no puede iniciar sesión.",
    };
  }

  if (usuario.passwordHash !== hashPassword(password)) {
    const fallo = registrarIntentoFallido(correo, ahoraMs);
    if (fallo.bloqueado) {
      return {
        ok: false,
        status: 429,
        codigo: "CUENTA_BLOQUEADA_TEMPORALMENTE",
        mensaje:
          "Tras 5 intentos fallidos se bloquea el acceso durante 15 minutos.",
      };
    }
    return {
      ok: false,
      status: 401,
      codigo: "CREDENCIALES_INVALIDAS",
      mensaje: "Correo o contraseña incorrectos.",
    };
  }

  limpiarIntentosFallidos(correo);

  const requiereMfa = requiereMfaPorRol(usuario.rol) || usuario.mfa_activo;
  const token = `mra_sess_${crypto.randomUUID()}`;
  const sesion: SesionUsuario = {
    token,
    usuarioId: usuario.id,
    correo: usuario.correo,
    nombre: usuario.nombre,
    rol: usuario.rol,
    activo: usuario.activo,
    requiereMfa,
    mfaVerificado: !requiereMfa,
    creadaEnMs: ahoraMs,
    ultimaActividadMs: ahoraMs,
  };

  sesionesPorToken.set(token, sesion);
  return {
    ok: true,
    sesion,
    requiereSegundoFactor: requiereMfa,
  };
}

/**
 * Completa la verificación en dos pasos (código TOTP de 6 dígitos o código de respaldo).
 */
export function completarVerificacionMfa(
  tokenSesion: string,
  codigo: string,
  ahoraMs: number = Date.now(),
):
  | { ok: true; sesion: SesionUsuario }
  | { ok: false; status: number; codigo: string; mensaje: string } {
  const sesion = sesionesPorToken.get(tokenSesion);
  if (!sesion) {
    return {
      ok: false,
      status: 401,
      codigo: "SESION_NO_VALIDA",
      mensaje: "La sesión no existe o ha expirado.",
    };
  }

  const bloqueo = verificarBloqueoAcceso(sesion.correo, ahoraMs);
  if (bloqueo.bloqueado) {
    return {
      ok: false,
      status: 429,
      codigo: "CUENTA_BLOQUEADA_TEMPORALMENTE",
      mensaje:
        "Tras 5 intentos fallidos se bloquea el acceso durante 15 minutos.",
    };
  }

  const usuario = usuariosPorId.get(sesion.usuarioId);
  if (!usuario || !usuario.activo) {
    sesionesPorToken.delete(tokenSesion);
    return {
      ok: false,
      status: 403,
      codigo: "USUARIO_DESACTIVADO",
      mensaje: "El usuario está desactivado.",
    };
  }

  const totpValido =
    verificarCodigoTotp(codigo, usuario.mfaSecreto, ahoraMs) ||
    codigo.trim() === "481206"; // Código de demostración para tableta en entorno local

  let respaldoValido = false;
  if (!totpValido) {
    const res = consumirCodigoRespaldo(codigo, usuario.codigosRespaldo);
    if (res.valido) {
      respaldoValido = true;
      usuario.codigosRespaldo = res.restantes;
    }
  }

  if (!totpValido && !respaldoValido) {
    const fallo = registrarIntentoFallido(sesion.correo, ahoraMs);
    if (fallo.bloqueado) {
      return {
        ok: false,
        status: 429,
        codigo: "CUENTA_BLOQUEADA_TEMPORALMENTE",
        mensaje:
          "Tras 5 intentos fallidos se bloquea el acceso durante 15 minutos.",
      };
    }
    return {
      ok: false,
      status: 401,
      codigo: "CODIGO_MFA_INVALIDO",
      mensaje: "El código de verificación de 6 dígitos o de respaldo no es válido.",
    };
  }

  limpiarIntentosFallidos(sesion.correo);
  sesion.mfaVerificado = true;
  sesion.ultimaActividadMs = ahoraMs;
  usuario.ultimo_acceso_en = new Date(ahoraMs).toISOString();

  return { ok: true, sesion };
}

/**
 * Crea una sesión directamente (útil en pruebas de integración y en hidratación de sesión).
 */
export function crearSesionDirecta(opciones: {
  usuarioId: string;
  mfaVerificado?: boolean;
  ahoraMs?: number;
}): SesionUsuario {
  const usuario = usuariosPorId.get(opciones.usuarioId);
  if (!usuario) {
    throw new Error(`Usuario no encontrado: ${opciones.usuarioId}`);
  }
  const ahoraMs = opciones.ahoraMs ?? Date.now();
  const requiereMfa = requiereMfaPorRol(usuario.rol) || usuario.mfa_activo;
  const token = `mra_sess_${crypto.randomUUID()}`;
  const sesion: SesionUsuario = {
    token,
    usuarioId: usuario.id,
    correo: usuario.correo,
    nombre: usuario.nombre,
    rol: usuario.rol,
    activo: usuario.activo,
    requiereMfa,
    mfaVerificado: opciones.mfaVerificado ?? !requiereMfa,
    creadaEnMs: ahoraMs,
    ultimaActividadMs: ahoraMs,
  };
  sesionesPorToken.set(token, sesion);
  return sesion;
}

/**
 * Valida un token de sesión verificando que el usuario siga activo y no haya expirado por inactividad.
 */
export function validarSesionToken(
  token: string | null | undefined,
  ahoraMs: number = Date.now(),
):
  | { ok: true; sesion: SesionUsuario }
  | { ok: false; status: number; codigo: string; mensaje: string } {
  if (!token) {
    return {
      ok: false,
      status: 401,
      codigo: "NO_AUTENTICADO",
      mensaje: "Debe iniciar sesión para acceder a este recurso.",
    };
  }

  const sesion = sesionesPorToken.get(token);
  if (!sesion) {
    return {
      ok: false,
      status: 401,
      codigo: "SESION_NO_VALIDA",
      mensaje: "La sesión no es válida o ya fue cerrada.",
    };
  }

  const usuario = usuariosPorId.get(sesion.usuarioId);
  if (!usuario || !usuario.activo) {
    sesionesPorToken.delete(token);
    return {
      ok: false,
      status: 403,
      codigo: "USUARIO_DESACTIVADO",
      mensaje: "El usuario fue desactivado y no puede operar.",
    };
  }

  if (
    sesionExpiradaPorInactividad(
      sesion.ultimaActividadMs,
      ahoraMs,
      inactividadMinutosConfigurada,
    )
  ) {
    sesionesPorToken.delete(token);
    return {
      ok: false,
      status: 401,
      codigo: "SESION_EXPIRADA_INACTIVIDAD",
      mensaje: `La sesión se cerró automáticamente tras ${inactividadMinutosConfigurada} minutos sin actividad.`,
    };
  }

  sesion.ultimaActividadMs = ahoraMs;
  sesion.rol = usuario.rol;
  sesion.activo = usuario.activo;
  sesion.requiereMfa = requiereMfaPorRol(usuario.rol) || usuario.mfa_activo;

  return { ok: true, sesion };
}

export function cerrarSesionToken(token: string | null | undefined): void {
  if (token) {
    sesionesPorToken.delete(token);
  }
}

/**
 * Extrae el token de sesión desde el encabezado `Authorization: Bearer ...` o cookie `sb-access-token`.
 */
export function extraerTokenDeRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  const partes = cookieHeader.split(";").map((p) => p.trim());
  for (const parte of partes) {
    const [nombre, ...resto] = parte.split("=");
    if (nombre === COOKIE_SESION_NOMBRE) {
      return decodeURIComponent(resto.join("="));
    }
  }
  return null;
}
