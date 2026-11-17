/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:09:00Z
 * @agent_roles engineering-backend-architect + engineering-security-engineer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T06
 */

import crypto from "node:crypto";
import type { RolUsuario } from "../db/schema";

/**
 * Verificación en dos pasos (MFA / TOTP) y códigos de respaldo (RF-01).
 * Obligatoria para los roles `administrador` y `titular`.
 */

const ROLES_CON_MFA_OBLIGATORIO: ReadonlySet<RolUsuario> = new Set([
  "administrador",
  "titular",
]);

/** Indica si el rol exige verificación en dos pasos para operar. */
export function requiereMfaPorRol(rol: RolUsuario): boolean {
  return ROLES_CON_MFA_OBLIGATORIO.has(rol);
}

/** Genera un código TOTP de 6 dígitos (HMAC-SHA1, ventana de 30 s) a partir de un secreto. */
export function generarCodigoTotp(
  secreto: string,
  timestampMs: number = Date.now(),
): string {
  const contador = Math.floor(timestampMs / 30_000);
  const bufferContador = Buffer.alloc(8);
  bufferContador.writeBigInt64BE(BigInt(contador));

  const hmac = crypto
    .createHmac("sha1", Buffer.from(secreto, "utf8"))
    .update(bufferContador)
    .digest();

  const offset = hmac[hmac.length - 1]! & 0x0f;
  const binario =
    ((hmac[offset]! & 0x7f) << 24) |
    ((hmac[offset + 1]! & 0xff) << 16) |
    ((hmac[offset + 2]! & 0xff) << 8) |
    (hmac[offset + 3]! & 0xff);

  const otp = binario % 1_000_000;
  return String(otp).padStart(6, "0");
}

/** Verifica un código de 6 dígitos contra el secreto TOTP (con tolerancia de ±1 ventana). */
export function verificarCodigoTotp(
  codigo: string,
  secreto: string,
  timestampMs: number = Date.now(),
): boolean {
  const limpio = codigo.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(limpio)) {
    return false;
  }

  for (const delta of [-30_000, 0, 30_000]) {
    if (generarCodigoTotp(secreto, timestampMs + delta) === limpio) {
      return true;
    }
  }
  return false;
}

/** Genera un conjunto de códigos de respaldo de un solo uso con formato XXXX-XXXX. */
export function generarCodigosRespaldo(cantidad = 8): string[] {
  const codigos: string[] = [];
  for (let i = 0; i < cantidad; i++) {
    const bytes = crypto.randomBytes(4).toString("hex").toUpperCase();
    codigos.push(`${bytes.slice(0, 4)}-${bytes.slice(4, 8)}`);
  }
  return codigos;
}

/**
 * Consume un código de respaldo si está presente en la lista del usuario.
 * Devuelve si fue válido y la lista restante sin el código usado.
 */
export function consumirCodigoRespaldo(
  codigoIngresado: string,
  codigosDisponibles: readonly string[],
): { valido: boolean; restantes: string[] } {
  const normalizado = codigoIngresado.trim().toUpperCase();
  const indice = codigosDisponibles.findIndex(
    (c) => c.toUpperCase() === normalizado,
  );
  if (indice === -1) {
    return { valido: false, restantes: [...codigosDisponibles] };
  }
  const restantes = [
    ...codigosDisponibles.slice(0, indice),
    ...codigosDisponibles.slice(indice + 1),
  ];
  return { valido: true, restantes };
}
