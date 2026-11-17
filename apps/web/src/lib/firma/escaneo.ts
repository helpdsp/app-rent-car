/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:35:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T07
 */

import { registrarAuditoria } from "../db/sprint2";
import { calcularHuellaSHA256 } from "../pdf/guardar";
import { obtenerContratoPorId } from "../contratos/emitir";

export interface ContratoEscaneado {
  id: string;
  contrato_id: string;
  archivo_path: string;
  sha256: string;
  firmado_por_manuscrito: string;
  notas?: string | null;
  subido_por: string;
  created_at: string;
}

const ALMACEN_ESCANEOS: ContratoEscaneado[] = [];

/**
 * Registra un contrato firmado en papel de forma manuscrita y escaneado (RF-18, S08-T07).
 */
export function registrarContratoEscaneado(
  contratoId: string,
  datos: {
    archivo_path: string;
    contenido_bytes: Buffer | string;
    firmado_por_manuscrito: string;
    notas?: string | null;
  },
  autor: { id: string; nombre: string }
): { ok: true; escaneo: ContratoEscaneado } | { ok: false; codigo: string; error: string } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado." };
  }

  const sha256 = calcularHuellaSHA256(datos.contenido_bytes);
  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();

  const escaneo: ContratoEscaneado = {
    id,
    contrato_id: contratoId,
    archivo_path: datos.archivo_path,
    sha256,
    firmado_por_manuscrito: datos.firmado_por_manuscrito,
    notas: datos.notas ?? null,
    subido_por: autor.id,
    created_at: ahora,
  };

  ALMACEN_ESCANEOS.push(escaneo);

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "contratos_escaneados",
    registro_id: id,
    registro_descripcion: `Contrato impreso con firma manuscrita escaneado y adjuntado al expediente (SHA-256: ${sha256.slice(0, 16)}...)`,
    valor_anterior: null,
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      archivo_path: datos.archivo_path,
      sha256,
    },
  });

  return { ok: true, escaneo };
}

export function obtenerEscaneosPorContrato(contratoId: string): ContratoEscaneado[] {
  return ALMACEN_ESCANEOS.filter((e) => e.contrato_id === contratoId);
}
