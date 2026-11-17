/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:09:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T08
 */

/**
 * Control de cierre de sesión por inactividad (por defecto 30 min, parámetro `inactividad_sesion_min`)
 * y bloqueo temporal de 15 minutos tras 5 intentos fallidos de inicio de sesión o MFA (RF-01).
 */

export const INACTIVIDAD_MINUTOS_POR_DEFECTO = 30;
export const MAX_INTENTOS_FALLIDOS = 5;
export const BLOQUEO_MINUTOS = 15;

export interface EstadoIntentosAcceso {
  intentosFallidos: number;
  ultimoIntentoEn: number;
  bloqueadoHasta: number | null;
}

const registroIntentos = new Map<string, EstadoIntentosAcceso>();

function normalizarClave(correoOId: string): string {
  return correoOId.trim().toLowerCase();
}

/**
 * Verifica si una cuenta está bloqueada temporalmente por exceso de intentos fallidos.
 */
export function verificarBloqueoAcceso(
  correoOId: string,
  ahoraMs: number = Date.now(),
): { bloqueado: boolean; minutosRestantes: number; intentosFallidos: number } {
  const clave = normalizarClave(correoOId);
  const estado = registroIntentos.get(clave);
  if (!estado) {
    return { bloqueado: false, minutosRestantes: 0, intentosFallidos: 0 };
  }

  if (estado.bloqueadoHasta !== null) {
    if (ahoraMs < estado.bloqueadoHasta) {
      const msRestantes = estado.bloqueadoHasta - ahoraMs;
      const minutosRestantes = Math.max(1, Math.ceil(msRestantes / 60_000));
      return {
        bloqueado: true,
        minutosRestantes,
        intentosFallidos: estado.intentosFallidos,
      };
    }
    // El periodo de bloqueo de 15 minutos ya concluyó
    registroIntentos.delete(clave);
    return { bloqueado: false, minutosRestantes: 0, intentosFallidos: 0 };
  }

  return {
    bloqueado: false,
    minutosRestantes: 0,
    intentosFallidos: estado.intentosFallidos,
  };
}

/**
 * Registra un intento fallido de contraseña o código MFA.
 * Al llegar a 5 intentos fallidos, bloquea el acceso durante 15 minutos.
 */
export function registrarIntentoFallido(
  correoOId: string,
  ahoraMs: number = Date.now(),
): { bloqueado: boolean; intentosRestantes: number; bloqueadoHasta: number | null } {
  const clave = normalizarClave(correoOId);
  const verificacion = verificarBloqueoAcceso(clave, ahoraMs);
  if (verificacion.bloqueado) {
    const actual = registroIntentos.get(clave)!;
    return {
      bloqueado: true,
      intentosRestantes: 0,
      bloqueadoHasta: actual.bloqueadoHasta,
    };
  }

  const previo = registroIntentos.get(clave);
  const nuevosIntentos = (previo?.intentosFallidos ?? 0) + 1;
  const bloqueado = nuevosIntentos >= MAX_INTENTOS_FALLIDOS;
  const bloqueadoHasta = bloqueado ? ahoraMs + BLOQUEO_MINUTOS * 60_000 : null;

  registroIntentos.set(clave, {
    intentosFallidos: nuevosIntentos,
    ultimoIntentoEn: ahoraMs,
    bloqueadoHasta,
  });

  return {
    bloqueado,
    intentosRestantes: Math.max(0, MAX_INTENTOS_FALLIDOS - nuevosIntentos),
    bloqueadoHasta,
  };
}

/**
 * Limpia el contador de intentos fallidos tras un acceso exitoso.
 */
export function limpiarIntentosFallidos(correoOId: string): void {
  registroIntentos.delete(normalizarClave(correoOId));
}

/**
 * Reinicia todo el registro de intentos (para pruebas automatizadas).
 */
export function resetearRegistroIntentos(): void {
  registroIntentos.clear();
}

/**
 * Evalúa si una sesión ha superado el tiempo máximo de inactividad permitido.
 * @param ultimaActividadMs Timestamp en ms de la última acción del usuario
 * @param ahoraMs Timestamp actual en ms
 * @param limiteMinutos Parámetro `inactividad_sesion_min` (por defecto 30 minutos)
 */
export function sesionExpiradaPorInactividad(
  ultimaActividadMs: number,
  ahoraMs: number = Date.now(),
  limiteMinutos: number = INACTIVIDAD_MINUTOS_POR_DEFECTO,
): boolean {
  if (limiteMinutos <= 0) return false;
  const limiteMs = limiteMinutos * 60_000;
  return ahoraMs - ultimaActividadMs >= limiteMs;
}
