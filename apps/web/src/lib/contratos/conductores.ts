/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:20:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T05
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId } from "./emitir";

export interface ConductorDetalle {
  id: string;
  contrato_id: string;
  nombre: string;
  domicilio?: string | null;
  ciudad_estado?: string | null;
  telefono?: string | null;
  licencia_numero: string;
  licencia_vencimiento: string; // YYYY-MM-DD
  licencia_foto_path?: string | null;
  firma_path?: string | null;
  es_arrendatario: boolean;
  created_at: string;
}

export interface ConductorInputDto {
  nombre: string;
  domicilio?: string | null;
  ciudad_estado?: string | null;
  telefono?: string | null;
  licencia_numero: string;
  licencia_vencimiento: string; // YYYY-MM-DD
  licencia_foto_path?: string | null;
  es_arrendatario?: boolean;
}

// In-memory store de conductores adicionales
const LISTA_CONDUCTORES: ConductorDetalle[] = [
  {
    id: "88888888-8888-4888-8888-888888888001",
    contrato_id: "77777777-7777-4777-8777-777777777000",
    nombre: "Ricardo Medina Salazar",
    domicilio: "Av. Reforma 123, Nueva",
    ciudad_estado: "Mexicali, B.C.",
    telefono: "686 555 9988",
    licencia_numero: "B2302042880",
    licencia_vencimiento: "2028-05-27",
    licencia_foto_path: null,
    firma_path: null,
    es_arrendatario: true,
    created_at: "2026-11-16T10:00:00Z",
  },
  {
    id: "88888888-8888-4888-8888-888888888002",
    contrato_id: "77777777-7777-4777-8777-777777777000",
    nombre: "Mario Esquivel Ruiz",
    domicilio: "Calle Sexta 340, Centro",
    ciudad_estado: "Mexicali, B.C.",
    telefono: "686 555 0177",
    licencia_numero: "B2201880432",
    licencia_vencimiento: "2027-05-24",
    licencia_foto_path: null,
    firma_path: null,
    es_arrendatario: false,
    created_at: "2026-11-16T10:15:00Z",
  },
];

/**
 * Valida la vigencia de la licencia de un conductor contra el periodo de renta.
 */
export function validarLicenciaConductor(
  licenciaVencimiento: string,
  fechaFinRenta: string
): boolean {
  const finRenta = new Date(fechaFinRenta);
  const finRentaStr = finRenta.toISOString().slice(0, 10);
  return licenciaVencimiento >= finRentaStr;
}

/**
 * Agrega un conductor a un contrato verificando que el contrato exista y su licencia sea válida (T-40).
 */
export function agregarConductorAContrato(
  contratoId: string,
  datos: ConductorInputDto,
  autor: { id: string; nombre: string }
):
  | { ok: true; conductor: ConductorDetalle }
  | { ok: false; codigo: string; error: string } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado",
    };
  }

  // T-40: Si es conductor adicional, validar que su licencia cubra todo el periodo
  if (!validarLicenciaConductor(datos.licencia_vencimiento, contrato.entrada_prevista_en)) {
    return {
      ok: false,
      codigo: "LICENCIA_VENCIDA",
      error: `LICENCIA_VENCIDA: La licencia del conductor ${datos.nombre} vence el ${datos.licencia_vencimiento} y no cubre el periodo hasta ${contrato.entrada_prevista_en.slice(0, 10)}.`,
    };
  }

  const id = crypto.randomUUID();
  const nuevoConductor: ConductorDetalle = {
    id,
    contrato_id: contratoId,
    nombre: datos.nombre,
    domicilio: datos.domicilio ?? null,
    ciudad_estado: datos.ciudad_estado ?? null,
    telefono: datos.telefono ?? null,
    licencia_numero: datos.licencia_numero,
    licencia_vencimiento: datos.licencia_vencimiento,
    licencia_foto_path: datos.licencia_foto_path ?? null,
    firma_path: null,
    es_arrendatario: datos.es_arrendatario ?? false,
    created_at: new Date().toISOString(),
  };

  LISTA_CONDUCTORES.push(nuevoConductor);

  // Mantener sincronizado el arreglo de conductores en el contrato
  if (!contrato.conductores.some((c) => c.licencia_numero === datos.licencia_numero)) {
    contrato.conductores.push({
      nombre: datos.nombre,
      licencia_numero: datos.licencia_numero,
      licencia_vencimiento: datos.licencia_vencimiento,
      es_arrendatario: datos.es_arrendatario ?? false,
    });
  }

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "conductores",
    registro_id: id,
    registro_descripcion: `Conductor adicional ${nuevoConductor.nombre} agregado al contrato ${contrato.folio ?? contratoId}`,
    valor_anterior: null,
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      nombre: nuevoConductor.nombre,
      licencia_numero: nuevoConductor.licencia_numero,
      licencia_vencimiento: nuevoConductor.licencia_vencimiento,
    },
  });

  return { ok: true, conductor: nuevoConductor };
}

/**
 * Obtiene los conductores de un contrato.
 */
export function obtenerConductoresPorContrato(contratoId: string): ConductorDetalle[] {
  return LISTA_CONDUCTORES.filter((c) => c.contrato_id === contratoId);
}

/**
 * Valida la regla de negocio para emisión (RF-12, RF-15, T-43, T-44):
 * Al menos UN conductor debe tener licencia vigente durante todo el periodo.
 * El arrendatario puede no tenerla si un conductor adicional la tiene (caso 08590).
 */
export function validarConductoresParaEmision(
  conductores: ConductorInputDto[],
  fechaFinRenta: string
): { valido: boolean; codigo?: string; error?: string } {
  if (!conductores || conductores.length === 0) {
    return {
      valido: false,
      codigo: "CONDUCTOR_REQUERIDO",
      error: "Se requiere al menos un conductor registrado en el contrato.",
    };
  }

  const hayConductorVigente = conductores.some((c) =>
    validarLicenciaConductor(c.licencia_vencimiento, fechaFinRenta)
  );

  if (!hayConductorVigente) {
    return {
      valido: false,
      codigo: "LICENCIA_VENCIDA",
      error:
        "LICENCIA_VENCIDA: Ningún conductor (arrendatario ni adicional) cuenta con licencia vigente durante todo el periodo de renta.",
    };
  }

  return { valido: true };
}

/**
 * Resetea los conductores para pruebas unitarias.
 */
export function resetearEstadoConductores(): void {
  LISTA_CONDUCTORES.length = 0;
}
