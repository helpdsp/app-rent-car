/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 11
 * @sprint_number 11
 * @task_id S11-T01
 */

import crypto from "crypto";
import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId, type ContratoCompletoRow } from "./emitir";
import { obtenerVehiculoPorId, actualizarVehiculo } from "../db/sprint4";

export type TipoIncidente =
  | "accidente"
  | "robo"
  | "falla_mecanica"
  | "perdida_llaves"
  | "retencion_indebida"
  | "otro";

export interface IncidenteRow {
  id: string;
  contrato_id: string;
  vehiculo_id: string;
  tipo: TipoIncidente;
  ocurrido_en: string;
  avisado_en: string;
  aviso_tardio: boolean; // T-68: avisado_en::date > ocurrido_en::date
  descripcion: string;
  avaluo: bigint;
  cargo_cliente: bigint;
  aseguradora_referencia: string | null;
  unidad_sustituta_id: string | null;
  bonificacion: bigint;
  cerrado_en: string | null;
  registrado_por: string;
  created_at: string;
}

const ALMACEN_INCIDENTES: IncidenteRow[] = [];

/**
 * Registra un incidente asociado a un contrato de renta (RF-23, T-68, T-69).
 */
export function registrarIncidente(
  contratoId: string,
  datos: {
    tipo: TipoIncidente;
    ocurrido_en: string;
    avisado_en?: string;
    descripcion: string;
    avaluo?: bigint | number;
    cargo_cliente?: bigint | number;
    aseguradora_referencia?: string | null;
    unidad_sustituta_id?: string | null;
    bonificacion?: bigint | number;
    cerrado_en?: string | null;
  },
  autor: { id: string; nombre: string; rol?: string }
): { ok: true; incidente: IncidenteRow; contrato: ContratoCompletoRow } | { ok: false; codigo: string; error: string; status: number } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado.",
      status: 404,
    };
  }

  const avisadoEn = datos.avisado_en || new Date().toISOString();
  const ocurridoEn = datos.ocurrido_en;

  // T-68: Se marca como tardío si el aviso se da después del mismo día del hecho (cláusula 12.ª)
  const fechaOcurrido = ocurridoEn.split("T")[0]!;
  const fechaAvisado = avisadoEn.split("T")[0]!;
  const avisoTardio = fechaAvisado > fechaOcurrido;

  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();

  const nuevoIncidente: IncidenteRow = {
    id,
    contrato_id: contratoId,
    vehiculo_id: contrato.vehiculo_id,
    tipo: datos.tipo,
    ocurrido_en: ocurridoEn,
    avisado_en: avisadoEn,
    aviso_tardio: avisoTardio,
    descripcion: datos.descripcion.trim(),
    avaluo: BigInt(datos.avaluo ?? 0),
    cargo_cliente: BigInt(datos.cargo_cliente ?? 0),
    aseguradora_referencia: datos.aseguradora_referencia || null,
    unidad_sustituta_id: datos.unidad_sustituta_id || null,
    bonificacion: BigInt(datos.bonificacion ?? 0),
    cerrado_en: datos.cerrado_en || null,
    registrado_por: autor.id,
    created_at: ahora,
  };

  ALMACEN_INCIDENTES.push(nuevoIncidente);

  // T-69: Si el incidente queda abierto, el contrato pasa a 'en_incidente'
  const estadoAnterior = contrato.estado;
  if (!nuevoIncidente.cerrado_en) {
    contrato.estado = "en_incidente";
    contrato.updated_at = ahora;
  }

  // Manejo de unidad sustituta en fallas mecánicas
  if (datos.unidad_sustituta_id) {
    const sustituto = obtenerVehiculoPorId(datos.unidad_sustituta_id);
    if (sustituto) {
      actualizarVehiculo(
        sustituto.id,
        {
          estado: "rentado",
        },
        { id: autor.id, nombre: autor.nombre, rol: autor.rol || "operador" }
      );
      sustituto.contrato_activo_folio = contrato.folio;
      contrato.vehiculo2_id = sustituto.id;
    }
  }

  // Bitácora de auditoría
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "incidentes",
    registro_id: id,
    registro_descripcion: `Incidente de tipo '${datos.tipo}' registrado en contrato ${contrato.folio ?? contratoId}.${
      avisoTardio ? " AVISO TARDÍO (cláusula 12.ª)." : ""
    }`,
    valor_anterior: { estado: estadoAnterior },
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      tipo: datos.tipo,
      aviso_tardio: avisoTardio,
      cargo_cliente: Number(nuevoIncidente.cargo_cliente),
      estado_contrato: contrato.estado,
    },
  });

  return { ok: true, incidente: nuevoIncidente, contrato };
}

/**
 * Cierra un incidente formalmente (T-69).
 */
export function cerrarIncidente(
  incidenteId: string,
  autor: { id: string; nombre: string }
): { ok: true; incidente: IncidenteRow } | { ok: false; codigo: string; error: string; status: number } {
  const inc = ALMACEN_INCIDENTES.find((i) => i.id === incidenteId);
  if (!inc) {
    return { ok: false, codigo: "INCIDENTE_NO_ENCONTRADO", error: "Incidente no encontrado.", status: 404 };
  }

  const ahora = new Date().toISOString();
  inc.cerrado_en = ahora;

  const contrato = obtenerContratoPorId(inc.contrato_id);
  if (contrato) {
    // Si ya no quedan incidentes abiertos en el contrato, regresa a recibido o vigente
    const hayMasAbiertos = ALMACEN_INCIDENTES.some(
      (i) => i.contrato_id === contrato.id && i.cerrado_en === null
    );
    if (!hayMasAbiertos && contrato.estado === "en_incidente") {
      contrato.estado = contrato.entrada_real_en ? "recibido" : "vigente";
      contrato.updated_at = ahora;
    }
  }

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "incidentes",
    registro_id: inc.id,
    registro_descripcion: `Incidente ${inc.id} cerrado formalmente.`,
    valor_anterior: { cerrado_en: null },
    valor_nuevo: { cerrado_en: ahora },
  });

  return { ok: true, incidente: inc };
}

/**
 * Verifica si un contrato tiene incidentes abiertos (T-69).
 */
export function tieneIncidentesAbiertos(contratoId: string): boolean {
  return ALMACEN_INCIDENTES.some(
    (i) => i.contrato_id === contratoId && i.cerrado_en === null
  );
}

/**
 * Obtiene los incidentes registrados para un contrato.
 */
export function obtenerIncidentesContrato(contratoId: string): IncidenteRow[] {
  return ALMACEN_INCIDENTES.filter((i) => i.contrato_id === contratoId);
}

/**
 * Resetea el almacén de incidentes para pruebas.
 */
export function resetearEstadoIncidentes(): void {
  ALMACEN_INCIDENTES.length = 0;
}
