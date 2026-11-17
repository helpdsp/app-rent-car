/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:10:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T03
 */

import {
  registrarPago,
  obtenerPagosPorContrato,
  type FormaPagoTipo,
  type PagoRow,
} from "./anticipo";
import { obtenerContratoPorId } from "../contratos/emitir";

export interface ReciboDeposito {
  folio: string;
  razon_social: string;
  rfc_emisor: string;
  sucursal: string;
  fecha: string;
  contrato_folio: string;
  cliente_nombre: string;
  vehiculo_descripcion: string;
  vehiculo_placas: string;
  monto: bigint;
  monto_formateado: string;
  forma: FormaPagoTipo;
  tarjeta_ultimos_4?: string | null;
  tarjeta_tipo?: string | null;
  recibido_por_nombre: string;
  leyenda_legal: string;
}

let consecutivoRecibo = 1;

export function formatearFolioRecibo(n: number): string {
  return `REC-${String(n).padStart(5, "0")}`;
}

/**
 * Registra un depósito en garantía y genera un recibo imprimible (RF-16, S07-T03).
 */
export function registrarDepositoGarantia(
  contratoId: string,
  datos: {
    forma: FormaPagoTipo;
    monto: bigint | number;
    tarjeta_ultimos_4?: string | null;
    tarjeta_tipo?: string | null;
    referencia?: string | null;
    notas?: string | null;
  },
  autor: { id: string; nombre: string }
):
  | { ok: true; pago: PagoRow; recibo: ReciboDeposito }
  | { ok: false; codigo: string; error: string } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado",
    };
  }

  // Registrar el pago de tipo deposito_garantia
  const resPago = registrarPago(
    contratoId,
    {
      tipo: "deposito_garantia",
      forma: datos.forma,
      monto: datos.monto,
      tarjeta_ultimos_4: datos.tarjeta_ultimos_4,
      tarjeta_tipo: datos.tarjeta_tipo,
      referencia: datos.referencia,
      notas: datos.notas,
    },
    autor
  );

  if (!resPago.ok) {
    return resPago;
  }

  const folioRecibo = formatearFolioRecibo(consecutivoRecibo++);
  resPago.pago.recibo_folio = folioRecibo;

  const montoCentavos = BigInt(datos.monto);
  const recibo: ReciboDeposito = {
    folio: folioRecibo,
    razon_social: "México Renta de Autos, S.A. de C.V.",
    rfc_emisor: "MRA101010ABC",
    sucursal: "Sucursal Mexicali Centro",
    fecha: new Date().toISOString(),
    contrato_folio: contrato.folio ?? contrato.folio_papel ?? "BORRADOR",
    cliente_nombre: contrato.cliente_nombre,
    vehiculo_descripcion: contrato.vehiculo_descripcion,
    vehiculo_placas: "ATU-703-A",
    monto: montoCentavos,
    monto_formateado: `$${Number(montoCentavos / BigInt(100)).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
    forma: datos.forma,
    tarjeta_ultimos_4: datos.tarjeta_ultimos_4 ?? null,
    tarjeta_tipo: datos.tarjeta_tipo ?? null,
    recibido_por_nombre: autor.nombre,
    leyenda_legal:
      "Recibimos la cantidad señalada como depósito en garantía para asegurar el cumplimiento de las obligaciones contractuales (cláusula 8.ª del contrato de arrendamiento). Dicho importe se aplicará a cualquier saldo insoluto o penalización al término del servicio, o bien se reembolsará si no existen daños ni retrasos imputables al arrendatario.",
  };

  return { ok: true, pago: resPago.pago, recibo };
}

/**
 * Obtiene el resumen financiero de pagos para un contrato.
 */
export function obtenerResumenPagosContrato(contratoId: string) {
  const contrato = obtenerContratoPorId(contratoId);
  const pagos = obtenerPagosPorContrato(contratoId);

  const anticipos = pagos.filter((p) => p.tipo === "anticipo");
  const totalAnticipos = anticipos.reduce((acc, p) => acc + p.monto, BigInt(0));

  const depositos = pagos.filter((p) => p.tipo === "deposito_garantia");
  const totalDepositos = depositos.reduce((acc, p) => acc + p.monto, BigInt(0));

  const rentaRequerida = contrato ? contrato.anticipo : BigInt(0);
  const anticipoCubierto = totalAnticipos >= rentaRequerida;
  const faltanteAnticipo = anticipoCubierto ? BigInt(0) : rentaRequerida - totalAnticipos;

  return {
    contrato_id: contratoId,
    renta_requerida: rentaRequerida,
    total_anticipos: totalAnticipos,
    total_depositos: totalDepositos,
    total_recibido: totalAnticipos + totalDepositos,
    anticipo_cubierto: anticipoCubierto,
    faltante_anticipo: faltanteAnticipo,
    pagos,
  };
}
