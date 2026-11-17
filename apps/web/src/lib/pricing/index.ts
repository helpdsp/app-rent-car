/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:08:00Z
 * @agent_roles engineering-backend-architect + testing-reality-checker
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T04
 *
 * Motor de tarifas — México Renta de Autos.
 * Funciones puras, sin I/O. Todo el dinero es en CENTAVOS enteros.
 * Reglas: refdocs/reglamento-mexico-renta-de-autos.md y
 * refdocs/requisitos-negocio-digitalizacion-contratos.md §20.
 *
 * Las reglas marcadas [SUPUESTO] están ambiguas en el reglamento y deben
 * confirmarse con el cliente; viven aquí como parámetros para no esconderlas.
 */

export type Centavos = number;

const MS_HORA = 60 * 60 * 1000;
const MS_DIA = 24 * MS_HORA;

/** Redondea a pesos completos (100 centavos). 20412.5 -> 20400. */
export function redondearAPeso(c: Centavos): Centavos {
  return Math.round(c / 100) * 100;
}

export interface ParametrosTarifa {
  /** Km incluidos por día. Reglamento: 500. */
  kmPorDia: number;
  /** Cuántas horas de retraso equivalen a un día extra. Reglamento: "a partir de la 5ta hora". */
  horaDesdeLaQueSeCobraDia: number;
  /** Divisor de la tarifa para la hora extra. Reglamento: precio del auto ÷ 8. */
  divisorHoraExtra: number;
}

export const PARAMETROS_POR_DEFECTO: ParametrosTarifa = {
  kmPorDia: 500,
  horaDesdeLaQueSeCobraDia: 5,
  divisorHoraExtra: 8,
};

/** Días de renta = períodos completos de 24 h entre salida y entrada, mínimo 1. */
export function calcularDias(salida: Date, entradaPrevista: Date): number {
  const ms = entradaPrevista.getTime() - salida.getTime();
  if (ms <= 0) throw new RangeError("La entrada debe ser posterior a la salida");
  return Math.max(1, Math.floor(ms / MS_DIA));
}

/** Renta base = tarifa 24 h × días. También es el anticipo (se paga por adelantado). */
export function calcularRentaBase(tarifaDia: Centavos, dias: number): Centavos {
  return tarifaDia * dias;
}

/** Hora extra = tarifa ÷ 8, redondeada a peso. Contrato 08160: $1,633 -> $204. */
export function tarifaHoraExtra(
  tarifaDia: Centavos,
  p: ParametrosTarifa = PARAMETROS_POR_DEFECTO,
): Centavos {
  return redondearAPeso(tarifaDia / p.divisorHoraExtra);
}

/**
 * Tarifa por km excedente = tarifa ÷ km incluidos por día, redondeada a peso.
 * Contrato 08160: $1,633 ÷ 500 = $3.27 -> $3. [SUPUESTO] el operador puede
 * sobrescribirla por contrato (ver `tarifaKmPactada`).
 */
export function tarifaKmExtra(
  tarifaDia: Centavos,
  p: ParametrosTarifa = PARAMETROS_POR_DEFECTO,
): Centavos {
  return redondearAPeso(tarifaDia / p.kmPorDia);
}

export interface RetrasoResultado {
  diasExtra: number;
  horasExtra: number;
  cargo: Centavos;
}

/**
 * Retraso al devolver.
 * - Cada hora o fracción = tarifa ÷ 8; desde la 5.ª hora se cobra un día extra.
 * - Seguro nocturno: no aplica la hora extra; cualquier retraso cobra el día completo.
 * [SUPUESTO] sin tolerancia (el reglamento no la menciona).
 * [SUPUESTO] retrasos de más de 24 h: cada 24 h completas = 1 día extra, y el
 * resto aplica la regla de horas.
 */
export function calcularRetraso(
  entradaPrevista: Date,
  entradaReal: Date,
  tarifaDia: Centavos,
  opciones: { seguroNocturno?: boolean; parametros?: ParametrosTarifa } = {},
): RetrasoResultado {
  const p = opciones.parametros ?? PARAMETROS_POR_DEFECTO;
  const ms = entradaReal.getTime() - entradaPrevista.getTime();
  if (ms <= 0) return { diasExtra: 0, horasExtra: 0, cargo: 0 };

  if (opciones.seguroNocturno) {
    return { diasExtra: 1, horasExtra: 0, cargo: tarifaDia };
  }

  let diasExtra = Math.floor(ms / MS_DIA);
  const horasResto = Math.ceil((ms % MS_DIA) / MS_HORA);
  let horasExtra = 0;
  if (horasResto >= p.horaDesdeLaQueSeCobraDia) diasExtra += 1;
  else horasExtra = horasResto;

  const cargo =
    diasExtra * tarifaDia + horasExtra * tarifaHoraExtra(tarifaDia, p);
  return { diasExtra, horasExtra, cargo };
}

export interface KmResultado {
  kmTotal: number;
  kmIncluidos: number;
  kmExcedente: number;
  cargo: Centavos;
}

/**
 * Km excedente = (entrada − salida) − (kmPorDia × días). Si `tarifaKmPactada`
 * viene informada (p. ej. $3 en el formato impreso) se usa en lugar de la fórmula.
 * Odómetro dañado por culpa del cliente (cláusula 16.ª): se cobra por día, sin km extra.
 */
export function calcularKmExtra(
  kmSalida: number,
  kmEntrada: number,
  dias: number,
  tarifaDia: Centavos,
  opciones: {
    tarifaKmPactada?: Centavos;
    odometroDanado?: boolean;
    parametros?: ParametrosTarifa;
  } = {},
): KmResultado {
  const p = opciones.parametros ?? PARAMETROS_POR_DEFECTO;
  if (kmEntrada < kmSalida)
    throw new RangeError("El km de entrada no puede ser menor al de salida");
  const kmTotal = kmEntrada - kmSalida;
  const kmIncluidos = p.kmPorDia * dias;
  if (opciones.odometroDanado) {
    return { kmTotal, kmIncluidos, kmExcedente: 0, cargo: 0 };
  }
  const kmExcedente = Math.max(0, kmTotal - kmIncluidos);
  const tarifaKm = opciones.tarifaKmPactada ?? tarifaKmExtra(tarifaDia, p);
  return { kmTotal, kmIncluidos, kmExcedente, cargo: kmExcedente * tarifaKm };
}

/**
 * Penalización por cancelación: 20 % del total; si se cancela con 24 h o
 * menos de anticipación, el total. [SUPUESTO] el reglamento está ambiguo; esta
 * es la lectura más probable (ver requisitos §21.2).
 */
export function penalizacionCancelacion(
  totalContrato: Centavos,
  horasDeAnticipacion: number,
): Centavos {
  return horasDeAnticipacion <= 24
    ? totalContrato
    : Math.round(totalContrato * 0.2);
}

export interface CargoLinea {
  concepto: string;
  monto: Centavos;
}

export interface LiquidacionEntrada {
  tarifaDia: Centavos;
  salida: Date;
  entradaPrevista: Date;
  entradaReal: Date;
  kmSalida: number;
  kmEntrada: number;
  anticipo: Centavos;
  seguroNocturno?: boolean;
  odometroDanado?: boolean;
  tarifaKmPactada?: Centavos;
  /** Limpieza, multas, traslado, faltantes... capturados por el operador. */
  otrosCargos?: CargoLinea[];
  /** Bonificaciones (p. ej. falla mecánica no imputable). Montos positivos. */
  bonificaciones?: CargoLinea[];
  parametros?: ParametrosTarifa;
}

export interface Liquidacion {
  dias: number;
  rentaBase: Centavos;
  retraso: RetrasoResultado;
  km: KmResultado;
  lineas: CargoLinea[];
  total: Centavos;
  /** total − anticipo. Positivo: el cliente debe. Negativo: se le debe. */
  saldo: Centavos;
}

/** Liquidación al recibir el vehículo. Total = renta + extras − bonificaciones. */
export function liquidar(e: LiquidacionEntrada): Liquidacion {
  const dias = calcularDias(e.salida, e.entradaPrevista);
  const rentaBase = calcularRentaBase(e.tarifaDia, dias);
  const retraso = calcularRetraso(e.entradaPrevista, e.entradaReal, e.tarifaDia, {
    seguroNocturno: e.seguroNocturno,
    parametros: e.parametros,
  });
  const km = calcularKmExtra(e.kmSalida, e.kmEntrada, dias, e.tarifaDia, {
    tarifaKmPactada: e.tarifaKmPactada,
    odometroDanado: e.odometroDanado,
    parametros: e.parametros,
  });

  const lineas: CargoLinea[] = [{ concepto: "Renta base", monto: rentaBase }];
  if (retraso.cargo > 0) lineas.push({ concepto: "Retraso en devolución", monto: retraso.cargo });
  if (km.cargo > 0) lineas.push({ concepto: "Kilometraje excedente", monto: km.cargo });
  if (e.odometroDanado) {
    // Cláusula 16.ª: cobro por día; la renta base ya está calculada por día.
    lineas.push({ concepto: "Odómetro dañado: cobro por día", monto: 0 });
  }
  for (const c of e.otrosCargos ?? []) lineas.push(c);
  for (const b of e.bonificaciones ?? [])
    lineas.push({ concepto: `Bonificación: ${b.concepto}`, monto: -Math.abs(b.monto) });

  const total = lineas.reduce((s, l) => s + l.monto, 0);
  return { dias, rentaBase, retraso, km, lineas, total, saldo: total - e.anticipo };
}
