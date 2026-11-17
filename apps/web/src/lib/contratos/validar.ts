/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:18:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T04
 */

export interface ConductorInput {
  nombre: string;
  licencia_numero: string;
  licencia_vencimiento: string; // YYYY-MM-DD
  es_arrendatario?: boolean;
}

export interface ValidacionEmisionInput {
  salida_en: string; // ISO 8601
  entrada_prevista_en: string; // ISO 8601
  vehiculo_id: string;
  conductores: ConductorInput[];
  salida_pais_autorizada?: boolean;
  permiso_salida_pais_path?: string | null;
  tarifa_dia?: bigint | number;
  tarifa_catalogo_dia?: bigint | number;
  tarifa_motivo?: string | null;
  tarifa_km_sobrescrita?: bigint | number | null;
  tarifa_km_nota?: string | null;
}

export interface ResultadoValidacion {
  valido: boolean;
  codigo?: string;
  error?: string;
}

/**
 * Valida todas las reglas de emisión de contratos (RF-12, RF-14, T-31, T-32, T-36)
 */
export function validarRequisitosEmision(
  input: ValidacionEmisionInput
): ResultadoValidacion {
  const salidaMs = new Date(input.salida_en).getTime();
  const entradaMs = new Date(input.entrada_prevista_en).getTime();

  // T-32: La fecha y hora de entrada prevista debe ser posterior a la salida
  if (isNaN(salidaMs) || isNaN(entradaMs) || entradaMs <= salidaMs) {
    return {
      valido: false,
      codigo: "FECHAS_INVALIDAS",
      error: "La fecha y hora de entrada prevista debe ser posterior a la fecha de salida.",
    };
  }

  // T-31: Al menos un conductor debe tener licencia vigente en todo el periodo
  const entradaDateStr = input.entrada_prevista_en.split("T")[0]!;
  if (!input.conductores || input.conductores.length === 0) {
    return {
      valido: false,
      codigo: "LICENCIA_VENCIDA",
      error: "Debe registrar al menos un conductor con licencia de conducir vigente para el periodo de la renta.",
    };
  }

  const tieneConductorConLicenciaVigente = input.conductores.some(
    (c) => c.licencia_vencimiento && c.licencia_vencimiento >= entradaDateStr
  );

  if (!tieneConductorConLicenciaVigente) {
    return {
      valido: false,
      codigo: "LICENCIA_VENCIDA",
      error: "Ningún conductor cuenta con licencia vigente durante todo el periodo de renta solicitado.",
    };
  }

  // Permiso de salida del país (cláusula 9.ª)
  if (input.salida_pais_autorizada && !input.permiso_salida_pais_path) {
    return {
      valido: false,
      codigo: "PERMISO_REQUERIDO",
      error: "La salida del país requiere adjuntar el documento de permiso por escrito autorizado.",
    };
  }

  // T-36: Si se sobrescribe la tarifa de km, la nota es obligatoria
  if (
    input.tarifa_km_sobrescrita !== null &&
    input.tarifa_km_sobrescrita !== undefined &&
    (!input.tarifa_km_nota || input.tarifa_km_nota.trim() === "")
  ) {
    return {
      valido: false,
      codigo: "NOTA_KM_REQUERIDA",
      error: "Sobrescribir la tarifa de kilómetro extra requiere una nota obligatoria que justifique el cambio.",
    };
  }

  // Tarifa diaria pactada distinta del catálogo exige motivo
  const tarifaDiaVal = input.tarifa_dia !== undefined ? BigInt(input.tarifa_dia) : BigInt(163_300);
  const tarifaCatVal = input.tarifa_catalogo_dia !== undefined ? BigInt(input.tarifa_catalogo_dia) : BigInt(163_300);
  if (
    tarifaDiaVal !== tarifaCatVal &&
    (!input.tarifa_motivo || input.tarifa_motivo.trim() === "")
  ) {
    return {
      valido: false,
      codigo: "MOTIVO_TARIFA_REQUERIDO",
      error: "Pactar una tarifa diaria distinta a la del catálogo exige especificar el motivo obligatorio.",
    };
  }

  return { valido: true };
}
