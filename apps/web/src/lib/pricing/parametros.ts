/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:27:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T06
 */

import {
  type Centavos,
  type ParametrosTarifa,
  tarifaHoraExtra,
  redondearAPeso,
} from "./index";

export interface ParametrosMotorTarifas extends ParametrosTarifa {
  toleranciaMinutos: number;
  redondeoHoraExtra: "redondear" | "truncar";
}

export const PARAMETROS_MOTOR_POR_DEFECTO: ParametrosMotorTarifas = {
  kmPorDia: 500,
  divisorHoraExtra: 8,
  horaDesdeLaQueSeCobraDia: 5,
  toleranciaMinutos: 0,
  redondeoHoraExtra: "redondear",
};

/**
 * Calcula la hora extra considerando la opción configurable de redondear a peso o truncar.
 * Contrato 08160: $1,633 ÷ 8 = $204.125
 * - Modo redondear: 20400 centavos ($204.00)
 * - Modo truncar: Math.floor(204.125) * 100 = 20400 centavos ($204.00)
 */
export function calcularTarifaHoraExtraConfigurable(
  tarifaDia: Centavos,
  parametros: ParametrosMotorTarifas = PARAMETROS_MOTOR_POR_DEFECTO,
): Centavos {
  const brutoCentavos = tarifaDia / parametros.divisorHoraExtra;
  if (parametros.redondeoHoraExtra === "truncar") {
    // Trunca a pesos enteros (quita centavos)
    return Math.floor(brutoCentavos / 100) * 100;
  }
  return redondearAPeso(brutoCentavos);
}

/**
 * Evalúa el retraso de entrega tomando en cuenta la tolerancia configurable en minutos.
 */
export function calcularRetrasoConTolerancia(
  entradaPrevista: Date,
  entradaReal: Date,
  tarifaDia: Centavos,
  opciones: {
    seguroNocturno?: boolean;
    parametros?: ParametrosMotorTarifas;
  } = {},
): { diasExtra: number; horasExtra: number; cargo: Centavos } {
  const p = opciones.parametros ?? PARAMETROS_MOTOR_POR_DEFECTO;
  const ms = entradaReal.getTime() - entradaPrevista.getTime();
  const msTolerancia = p.toleranciaMinutos * 60 * 1000;

  if (ms <= msTolerancia) {
    return { diasExtra: 0, horasExtra: 0, cargo: 0 };
  }

  if (opciones.seguroNocturno) {
    return { diasExtra: 1, horasExtra: 0, cargo: tarifaDia };
  }

  const msEfectivos = ms; // El reglamento cobra el tiempo transcurrido si se supera la tolerancia
  const MS_HORA = 60 * 60 * 1000;
  const MS_DIA = 24 * MS_HORA;

  let diasExtra = Math.floor(msEfectivos / MS_DIA);
  const horasResto = Math.ceil((msEfectivos % MS_DIA) / MS_HORA);
  let horasExtra = 0;

  if (horasResto >= p.horaDesdeLaQueSeCobraDia) {
    diasExtra += 1;
  } else {
    horasExtra = horasResto;
  }

  const horaExtraCosto = calcularTarifaHoraExtraConfigurable(tarifaDia, p);
  const cargo = diasExtra * tarifaDia + horasExtra * horaExtraCosto;

  return { diasExtra, horasExtra, cargo };
}
