/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:11:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T07
 */

import type { RolUsuario } from "../db/schema";
import { requiereMfaPorRol } from "./mfa";
import {
  extraerTokenDeRequest,
  type SesionUsuario,
  validarSesionToken,
} from "./session";

/**
 * Matriz de permisos por rol en el servidor (Mockup 17 / RF-01).
 * Nota: `pactar_tarifa_contrato` está sujeto a confirmación del cliente
 * (`TODO(cliente): confirmar si el operador puede pactar tarifa con motivo`).
 */
export type AccionSistema =
  | "crear_clientes_vehiculos_contratos"
  | "ver_clientes_vehiculos_contratos"
  | "entregar_recibir_vehiculos"
  | "pactar_tarifa_contrato"
  | "cambiar_catalogo_parametros"
  | "eliminar_contrato_borrador"
  | "ver_bitacora"
  | "exportar_csv"
  | "gestionar_usuarios";

export const MATRIZ_PERMISOS_POR_ROL: Record<
  AccionSistema,
  readonly RolUsuario[]
> = {
  crear_clientes_vehiculos_contratos: ["operador", "administrador"],
  ver_clientes_vehiculos_contratos: ["operador", "administrador", "titular"],
  entregar_recibir_vehiculos: ["operador", "administrador"],
  // TODO(cliente): Confirmar si el operador puede pactar la tarifa de un contrato con motivo obligatorio
  pactar_tarifa_contrato: ["administrador"],
  cambiar_catalogo_parametros: ["administrador"],
  eliminar_contrato_borrador: ["administrador"],
  ver_bitacora: ["administrador", "titular"],
  exportar_csv: ["administrador", "titular"],
  gestionar_usuarios: ["administrador"],
};

export interface ErrorAutorizacion {
  status: number;
  body: {
    codigo: string;
    mensaje: string;
    detalle?: Record<string, unknown>;
  };
}

/**
 * Guarda de servidor para Route Handlers (`/api/*`).
 * Verifica:
 * 1. Sesión existente, activa y no expirada por inactividad (30 min).
 * 2. Usuario activo (`activo = true`; si está desactivado responde 403 `USUARIO_DESACTIVADO` — T-05).
 * 3. Segundo factor MFA verificado cuando el rol es `administrador` o `titular` (`T-06`).
 * 4. Rol permitido para la ruta o acción (`T-01`).
 */
export function autorizarRequest(
  request: Request,
  opciones: {
    rolesPermitidos?: readonly RolUsuario[];
    accion?: AccionSistema;
    ahoraMs?: number;
  } = {},
):
  | { ok: true; sesion: SesionUsuario }
  | { ok: false; error: ErrorAutorizacion } {
  const token = extraerTokenDeRequest(request);
  const validacion = validarSesionToken(token, opciones.ahoraMs);

  if (!validacion.ok) {
    return {
      ok: false,
      error: {
        status: validacion.status,
        body: {
          codigo: validacion.codigo,
          mensaje: validacion.mensaje,
        },
      },
    };
  }

  const { sesion } = validacion;

  // T-06: Administrador y titular deben haber completado MFA antes de acceder a rutas protegidas
  if (requiereMfaPorRol(sesion.rol) && !sesion.mfaVerificado) {
    return {
      ok: false,
      error: {
        status: 403,
        body: {
          codigo: "MFA_REQUERIDO",
          mensaje:
            "La verificación en dos pasos (MFA) es obligatoria para el rol de administrador y titular.",
        },
      },
    };
  }

  const rolesRequeridos =
    opciones.rolesPermitidos ??
    (opciones.accion ? MATRIZ_PERMISOS_POR_ROL[opciones.accion] : undefined);

  if (rolesRequeridos && !rolesRequeridos.includes(sesion.rol)) {
    return {
      ok: false,
      error: {
        status: 403,
        body: {
          codigo: "PERMISO_DENEGADO",
          mensaje: `El rol '${sesion.rol}' no tiene permiso para ejecutar esta acción.`,
          detalle: {
            rol_actual: sesion.rol,
            roles_permitidos: rolesRequeridos,
          },
        },
      },
    };
  }

  return { ok: true, sesion };
}

/** Convierte un `ErrorAutorizacion` en un `Response` JSON estándar de la API. */
export function respuestaErrorAutorizacion(error: ErrorAutorizacion): Response {
  return Response.json(error.body, { status: error.status });
}
