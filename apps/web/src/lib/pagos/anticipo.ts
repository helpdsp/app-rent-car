/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:05:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T02
 */

import { registrarAuditoria } from "../db/sprint2";

export type TipoPagoContrato =
  | "anticipo"
  | "deposito_garantia"
  | "pago_saldo"
  | "devolucion_deposito"
  | "aplicacion_deposito"
  | "liquidacion"
  | "reembolso";

export type FormaPagoTipo =
  | "efectivo"
  | "tarjeta_credito"
  | "tarjeta_debito"
  | "transferencia"
  | "deposito_bancario"
  | "visa_laser";

export interface PagoRow {
  id: string;
  contrato_id: string;
  tipo: TipoPagoContrato;
  forma: FormaPagoTipo;
  monto: bigint; // En centavos
  tarjeta_ultimos_4?: string | null;
  tarjeta_tipo?: string | null;
  referencia?: string | null;
  recibo_folio?: string | null;
  notas?: string | null;
  recibido_por: string;
  created_at: string;
}

export interface PagoInput {
  tipo: TipoPagoContrato;
  forma: FormaPagoTipo;
  monto: bigint | number;
  tarjeta_ultimos_4?: string | null;
  tarjeta_tipo?: string | null;
  tarjeta_numero?: string | null; // Para detectar y rechazar números completos
  referencia?: string | null;
  notas?: string | null;
}

// In-memory store de pagos para la sesión activa
const LISTA_PAGOS: PagoRow[] = [
  // Semilla del caso 08160 / contrato inicial
  {
    id: "99999999-9999-4999-8999-999999999001",
    contrato_id: "77777777-7777-4777-8777-777777777000",
    tipo: "anticipo",
    forma: "efectivo",
    monto: BigInt(439_900), // $4,399.00
    tarjeta_ultimos_4: null,
    tarjeta_tipo: null,
    referencia: "Caja principal",
    recibo_folio: null,
    notas: null,
    recibido_por: "11111111-1111-4111-8111-111111111101",
    created_at: "2026-11-16T10:30:00Z",
  },
  {
    id: "99999999-9999-4999-8999-999999999002",
    contrato_id: "77777777-7777-4777-8777-777777777000",
    tipo: "anticipo",
    forma: "transferencia",
    monto: BigInt(50_000), // $500.00
    tarjeta_ultimos_4: null,
    tarjeta_tipo: null,
    referencia: "SPEI 84729103",
    recibo_folio: null,
    notas: null,
    recibido_por: "11111111-1111-4111-8111-111111111101",
    created_at: "2026-11-16T10:35:00Z",
  },
  {
    id: "99999999-9999-4999-8999-999999999003",
    contrato_id: "77777777-7777-4777-8777-777777777000",
    tipo: "deposito_garantia",
    forma: "efectivo",
    monto: BigInt(800_000), // $8,000.00
    tarjeta_ultimos_4: null,
    tarjeta_tipo: null,
    referencia: "Efectivo mostrador",
    recibo_folio: "REC-00001",
    notas: "Depósito en garantía estándar",
    recibido_por: "11111111-1111-4111-8111-111111111101",
    created_at: "2026-11-16T10:40:00Z",
  },
];

/**
 * Valida si un texto o campo contiene un número de tarjeta de crédito/débito completo (PAN).
 * Regla inquebrantable de seguridad: NUNCA guardar números de tarjeta (T-38, T-47).
 */
export function detectarNumeroTarjetaCompleto(texto?: string | null): boolean {
  if (!texto) return false;
  // Buscar cualquier secuencia que contenga entre 13 y 19 dígitos
  const matches = texto.match(/(?:\d[\s-]*){13,19}/g);
  if (!matches) return false;
  return matches.some((m) => {
    const digitos = m.replace(/\D/g, "");
    return digitos.length >= 13 && digitos.length <= 19;
  });
}

/**
 * Valida los datos de entrada de un pago antes de procesarlo.
 */
export function validarDatosPago(pago: PagoInput): {
  valido: boolean;
  codigo?: string;
  error?: string;
} {
  // Rechazo terminante de número de tarjeta completo
  if (
    pago.tarjeta_numero ||
    detectarNumeroTarjetaCompleto(pago.referencia) ||
    detectarNumeroTarjetaCompleto(pago.notas)
  ) {
    return {
      valido: false,
      codigo: "NUMERO_TARJETA_PROHIBIDO",
      error:
        "NUMERO_TARJETA_PROHIBIDO: Nunca se permite almacenar un número de tarjeta completo. Solo la forma de pago y los últimos 4 dígitos.",
    };
  }

  // Si es tarjeta, validar que los últimos 4 sean exactamente 4 dígitos
  if (
    (pago.forma === "tarjeta_credito" || pago.forma === "tarjeta_debito") &&
    pago.tarjeta_ultimos_4
  ) {
    if (!/^\d{4}$/.test(pago.tarjeta_ultimos_4)) {
      return {
        valido: false,
        codigo: "FORMATO_TARJETA_INVALIDO",
        error: "Los últimos 4 dígitos de la tarjeta deben contener exactamente 4 dígitos numéricos.",
      };
    }
  }

  if (BigInt(pago.monto) <= BigInt(0)) {
    return {
      valido: false,
      codigo: "MONTO_INVALIDO",
      error: "El monto del pago debe ser mayor a cero.",
    };
  }

  return { valido: true };
}

/**
 * Registra un nuevo pago para un contrato.
 */
export function registrarPago(
  contratoId: string,
  input: PagoInput,
  autor: { id: string; nombre: string }
): { ok: true; pago: PagoRow } | { ok: false; codigo: string; error: string } {
  const validacion = validarDatosPago(input);
  if (!validacion.valido) {
    return { ok: false, codigo: validacion.codigo!, error: validacion.error! };
  }

  const id = crypto.randomUUID();
  const nuevoPago: PagoRow = {
    id,
    contrato_id: contratoId,
    tipo: input.tipo,
    forma: input.forma,
    monto: BigInt(input.monto),
    tarjeta_ultimos_4: input.tarjeta_ultimos_4 ?? null,
    tarjeta_tipo: input.tarjeta_tipo ?? null,
    referencia: input.referencia ?? null,
    recibo_folio: null,
    notas: input.notas ?? null,
    recibido_por: autor.id,
    created_at: new Date().toISOString(),
  };

  LISTA_PAGOS.push(nuevoPago);

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "pagos",
    registro_id: id,
    registro_descripcion: `Pago de $${Number(nuevoPago.monto / BigInt(100)).toLocaleString("es-MX")} registrado para contrato ${contratoId} (${nuevoPago.tipo} vía ${nuevoPago.forma})`,
    valor_anterior: null,
    valor_nuevo: {
      id,
      contrato_id: contratoId,
      tipo: nuevoPago.tipo,
      forma: nuevoPago.forma,
      monto: Number(nuevoPago.monto),
      tarjeta_ultimos_4: nuevoPago.tarjeta_ultimos_4,
    },
  });

  return { ok: true, pago: nuevoPago };
}

/**
 * Obtiene los pagos registrados para un contrato.
 */
export function obtenerPagosPorContrato(contratoId: string): PagoRow[] {
  return LISTA_PAGOS.filter((p) => p.contrato_id === contratoId);
}

/**
 * Valida si los pagos tipo 'anticipo' cubren la renta base total del contrato (RF-16, T-41, T-42).
 */
export function validarAnticipoCompleto(
  pagos: PagoRow[],
  rentaBase: bigint
): {
  completo: boolean;
  totalPagado: bigint;
  faltante: bigint;
} {
  const anticipos = pagos.filter((p) => p.tipo === "anticipo");
  const totalPagado = anticipos.reduce((acc, p) => acc + p.monto, BigInt(0));
  const faltante = totalPagado >= rentaBase ? BigInt(0) : rentaBase - totalPagado;

  return {
    completo: totalPagado >= rentaBase,
    totalPagado,
    faltante,
  };
}

/**
 * Valida que un contrato cumpla con los requisitos financieros para pasar a estado 'vigente' (T-39, T-41, T-42):
 * 1. La suma de anticipos cubre o iguala la renta base.
 * 2. Se ha registrado al menos un depósito en garantía con monto > 0.
 */
export function validarRequisitosPasoAVigente(
  anticipoRequerido: bigint,
  pagos: PagoRow[]
): {
  permitido: boolean;
  codigo?: string;
  error?: string;
} {
  // 1. Validar anticipo
  const estadoAnticipo = validarAnticipoCompleto(pagos, anticipoRequerido);
  if (!estadoAnticipo.completo) {
    return {
      permitido: false,
      codigo: "ANTICIPO_INSUFICIENTE",
      error: `ANTICIPO_INSUFICIENTE: Se han cubierto $${Number(estadoAnticipo.totalPagado / BigInt(100)).toLocaleString("es-MX")} de los $${Number(anticipoRequerido / BigInt(100)).toLocaleString("es-MX")} requeridos. Faltan $${Number(estadoAnticipo.faltante / BigInt(100)).toLocaleString("es-MX")}.`,
    };
  }

  // 2. Validar depósito en garantía
  const depositos = pagos.filter((p) => p.tipo === "deposito_garantia");
  const totalDeposito = depositos.reduce((acc, p) => acc + p.monto, BigInt(0));
  if (depositos.length === 0 || totalDeposito <= BigInt(0)) {
    return {
      permitido: false,
      codigo: "DEPOSITO_GARANTIA_REQUERIDO",
      error: "DEPOSITO_GARANTIA_REQUERIDO: El contrato no puede pasar a vigente sin registrar el depósito en garantía.",
    };
  }

  return { permitido: true };
}

/**
 * Resetea el almacén de pagos para aislar pruebas unitarias.
 */
export function resetearEstadoPagos(): void {
  LISTA_PAGOS.length = 0;
}
