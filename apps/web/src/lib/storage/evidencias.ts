/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:05:00Z
 * @agent_roles engineering-backend-architect + engineering-software-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T03
 */

import crypto from "crypto";
import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId } from "../contratos/emitir";

export type AnguloObligatorio =
  | "frente"
  | "atras"
  | "izquierda"
  | "derecha"
  | "tablero_km"
  | "interior";

export type AnguloEvidencia = AnguloObligatorio | "video" | "otro";

export type MomentoEvidencia = "entrega" | "recepcion" | "incidente";

export const ANGULOS_OBLIGATORIOS: readonly AnguloObligatorio[] = [
  "frente",
  "atras",
  "izquierda",
  "derecha",
  "tablero_km",
  "interior",
] as const;

export const LIMITES_STORAGE = {
  FOTO_MAX_BYTES: 10 * 1024 * 1024, // 10 MB límite
  VIDEO_MAX_BYTES: 50 * 1024 * 1024, // 50 MB límite
  FOTO_MIMES_PERMITIDOS: ["image/jpeg", "image/png", "image/webp"],
  VIDEO_MIMES_PERMITIDOS: ["video/mp4", "video/webm", "video/quicktime"],
} as const;

export interface EvidenciaRow {
  id: string;
  contrato_id: string;
  momento: MomentoEvidencia;
  tipo: "foto" | "video";
  angulo: AnguloEvidencia;
  path: string;
  tamano_bytes: number;
  sha256: string;
  dispositivo: string;
  nota: string | null;
  tomada_en: string;
  subida_por: string;
  km_capturado: number | null;
  created_at: string;
}

// Almacén en memoria de evidencias (sigue la regla de oro: solo agregado, append-only)
const ALMACEN_EVIDENCIAS: EvidenciaRow[] = [];

/**
 * Calcula la huella digital SHA-256 de los datos de una foto o archivo.
 */
export function calcularHashEvidencia(contenido: Buffer | Uint8Array | string): string {
  return crypto.createHash("sha256").update(contenido).digest("hex");
}

/**
 * Valida los límites y restricciones para la carga de evidencia (T-75, S09-T03).
 */
export function validarParametrosEvidencia(input: {
  tipo: "foto" | "video";
  angulo: string;
  tamano_bytes: number;
  mime_type?: string;
  km_capturado?: number | null;
}): { valido: boolean; codigo?: string; error?: string } {
  if (input.tipo === "foto") {
    if (input.tamano_bytes > LIMITES_STORAGE.FOTO_MAX_BYTES) {
      return {
        valido: false,
        codigo: "TAMANO_EXCEDIDO",
        error: `El tamaño de la foto (${Math.round(input.tamano_bytes / 1024 / 1024)}MB) excede el máximo permitido de 10MB.`,
      };
    }
    if (
      input.mime_type &&
      !LIMITES_STORAGE.FOTO_MIMES_PERMITIDOS.includes(input.mime_type as any)
    ) {
      return {
        valido: false,
        codigo: "TIPO_ARCHIVO_INVALIDO",
        error: `Tipo de imagen no permitido: '${input.mime_type}'. Tipos soportados: JPG, PNG, WEBP.`,
      };
    }
  } else if (input.tipo === "video") {
    if (input.tamano_bytes > LIMITES_STORAGE.VIDEO_MAX_BYTES) {
      return {
        valido: false,
        codigo: "TAMANO_EXCEDIDO",
        error: `El tamaño del video (${Math.round(input.tamano_bytes / 1024 / 1024)}MB) excede el máximo permitido de 50MB.`,
      };
    }
  }

  // T-75: La foto del ángulo tablero_km exige el kilometraje capturado
  if (input.angulo === "tablero_km") {
    if (
      input.km_capturado === undefined ||
      input.km_capturado === null ||
      isNaN(input.km_capturado) ||
      input.km_capturado < 0
    ) {
      return {
        valido: false,
        codigo: "ODOMETRO_FOTO_REQUERIDA",
        error: "La foto del tablero requiere el kilometraje numérico capturado de forma obligatoria (T-75).",
      };
    }
  }

  return { valido: true };
}

/**
 * Registra una evidencia en el sistema.
 * REGLA CRÍTICA T-76: Las evidencias son inmutables. Una repetición de foto se agrega como fila nueva,
 * preservando todas las versiones y su historial auditable.
 */
export function registrarEvidencia(
  contratoId: string,
  datos: {
    momento?: MomentoEvidencia;
    tipo: "foto" | "video";
    angulo: AnguloEvidencia;
    path: string;
    tamano_bytes: number;
    sha256?: string;
    contenido?: Buffer | Uint8Array | string;
    dispositivo: string;
    nota?: string | null;
    km_capturado?: number | null;
  },
  autor: { id: string; nombre: string }
): { ok: true; evidencia: EvidenciaRow } | { ok: false; codigo: string; error: string } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado." };
  }

  const momento = datos.momento || "entrega";

  // Validación de límites y reglas de negocio
  const validacion = validarParametrosEvidencia({
    tipo: datos.tipo,
    angulo: datos.angulo,
    tamano_bytes: datos.tamano_bytes,
    km_capturado: datos.km_capturado,
  });

  if (!validacion.valido) {
    return { ok: false, codigo: validacion.codigo!, error: validacion.error! };
  }

  // Calcular o asegurar el hash SHA-256 (T-83)
  const sha256 =
    datos.sha256 ||
    (datos.contenido ? calcularHashEvidencia(datos.contenido) : calcularHashEvidencia(datos.path));

  const ahora = new Date().toISOString();
  const id = crypto.randomUUID();

  const nuevaEvidencia: EvidenciaRow = {
    id,
    contrato_id: contratoId,
    momento,
    tipo: datos.tipo,
    angulo: datos.angulo,
    path: datos.path,
    tamano_bytes: datos.tamano_bytes,
    sha256,
    dispositivo: datos.dispositivo,
    nota: datos.nota || null,
    tomada_en: ahora,
    subida_por: autor.id,
    km_capturado: datos.angulo === "tablero_km" ? (datos.km_capturado ?? null) : null,
    created_at: ahora,
  };

  // Solo agregado (T-76)
  ALMACEN_EVIDENCIAS.push(nuevaEvidencia);

  // Registrar en bitácora de auditoría inmutable
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "evidencias",
    registro_id: id,
    registro_descripcion: `Evidencia ${datos.tipo} registrada para ángulo '${datos.angulo}' en contrato ${contrato.folio ?? contratoId} (SHA-256: ${sha256.substring(0, 10)}...)`,
    valor_anterior: null,
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      momento,
      tipo: datos.tipo,
      angulo: datos.angulo,
      sha256,
      km_capturado: nuevaEvidencia.km_capturado,
      dispositivo: datos.dispositivo,
    },
  });

  return { ok: true, evidencia: nuevaEvidencia };
}

/**
 * Intento de modificar o eliminar una evidencia (T-76).
 * Siempre rechazado para garantizar la inmutabilidad de la bitácora probatoria.
 */
export function rechazarModificacionEvidencia(): { ok: false; codigo: string; error: string } {
  return {
    ok: false,
    codigo: "EVIDENCIA_INMUTABLE",
    error: "Las evidencias fotográficas son de solo agregado. No se permite reemplazar ni borrar fotos (T-76).",
  };
}

/**
 * Obtiene todas las evidencias asociadas a un contrato y momento dado.
 */
export function obtenerEvidenciasContrato(
  contratoId: string,
  momento: MomentoEvidencia = "entrega"
): EvidenciaRow[] {
  return ALMACEN_EVIDENCIAS.filter(
    (e) => e.contrato_id === contratoId && e.momento === momento
  );
}

/**
 * Valida si se encuentran los 6 ángulos obligatorios (RF-19, T-74).
 * Si falta alguno y no cuenta con nota de autorización administrativa por excepción, falla con 409.
 */
export function validarEvidenciasCompletas(
  contratoId: string,
  momento: MomentoEvidencia = "entrega",
  autorizacionAdminNota?: string | null
): {
  completo: boolean;
  angulosPresentes: AnguloObligatorio[];
  angulosFaltantes: AnguloObligatorio[];
  autorizadoPorExcepcion: boolean;
  evidencias: EvidenciaRow[];
} {
  const evidencias = obtenerEvidenciasContrato(contratoId, momento);
  const fotos = evidencias.filter((e) => e.tipo === "foto");

  const angulosPresentesSet = new Set<AnguloObligatorio>();
  fotos.forEach((f) => {
    if (ANGULOS_OBLIGATORIOS.includes(f.angulo as AnguloObligatorio)) {
      angulosPresentesSet.add(f.angulo as AnguloObligatorio);
    }
  });

  const angulosPresentes = Array.from(angulosPresentesSet);
  const angulosFaltantes = ANGULOS_OBLIGATORIOS.filter(
    (req) => !angulosPresentesSet.has(req)
  );

  const faltantesCantidad = angulosFaltantes.length;

  if (faltantesCantidad === 0) {
    return {
      completo: true,
      angulosPresentes,
      angulosFaltantes: [],
      autorizadoPorExcepcion: false,
      evidencias,
    };
  }

  // Verificar si hay autorización de administrador por excepción
  if (autorizacionAdminNota && autorizacionAdminNota.trim().length > 0) {
    return {
      completo: true,
      angulosPresentes,
      angulosFaltantes,
      autorizadoPorExcepcion: true,
      evidencias,
    };
  }

  return {
    completo: false,
    angulosPresentes,
    angulosFaltantes,
    autorizadoPorExcepcion: false,
    evidencias,
  };
}

/**
 * Resetea el almacén de evidencias para pruebas unitarias.
 */
export function resetearEstadoEvidencias(): void {
  ALMACEN_EVIDENCIAS.length = 0;
}
