/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:25:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T07
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId } from "./emitir";

export type TipoCargoContrato =
  | "renta_base"
  | "retraso"
  | "km_excedente"
  | "seguro_nocturno"
  | "gasolina"
  | "limpieza"
  | "quemaduras"
  | "multa"
  | "traslado"
  | "penalizacion"
  | "pena_convencional"
  | "cuota_proteccion"
  | "faltante"
  | "otro"
  | "bonificacion";

export interface CargoItemRow {
  id?: string;
  tipo: TipoCargoContrato;
  concepto: string;
  monto: bigint; // En centavos. Negativo para bonificaciones.
  momento: "emision" | "liquidacion";
}

/**
 * Agrega un cargo adicional o bonificación a un contrato (RF-21, S11-T07).
 */
export function agregarCargoContrato(
  contratoId: string,
  datos: {
    tipo: TipoCargoContrato;
    concepto: string;
    monto: bigint | number;
    momento?: "emision" | "liquidacion";
  },
  autor: { id: string; nombre: string }
): { ok: true; cargo: CargoItemRow } | { ok: false; codigo: string; error: string } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado." };
  }

  const momento = datos.momento || "liquidacion";
  let montoFinal = BigInt(datos.monto);

  // Las bonificaciones son siempre de monto negativo
  if (datos.tipo === "bonificacion" && montoFinal > BigInt(0)) {
    montoFinal = -montoFinal;
  }

  const nuevoCargo: CargoItemRow = {
    tipo: datos.tipo,
    concepto: datos.concepto.trim(),
    monto: montoFinal,
    momento,
  };

  contrato.cargos.push(nuevoCargo);
  contrato.updated_at = new Date().toISOString();

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "contrato_cargos",
    registro_id: contrato.id,
    registro_descripcion: `Cargo adicional '${datos.tipo}' agregado al contrato ${contrato.folio ?? contratoId}: ${datos.concepto} ($${(Number(montoFinal) / 100).toLocaleString("es-MX")})`,
    valor_anterior: null,
    valor_nuevo: {
      contrato_id: contratoId,
      tipo: datos.tipo,
      concepto: datos.concepto,
      monto: Number(montoFinal),
      momento,
    },
  });

  return { ok: true, cargo: nuevoCargo };
}

/**
 * Obtiene todos los cargos desglosados de un contrato.
 */
export function obtenerCargosDeContrato(contratoId: string): CargoItemRow[] {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) return [];
  return (contrato.cargos as CargoItemRow[]) || [];
}
