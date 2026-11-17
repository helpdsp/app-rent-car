/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T11:20:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T02
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerContratoPorId, type ContratoCompletoRow } from "./emitir";
import {
  liquidar,
  type Liquidacion,
  type CargoLinea,
  type Centavos,
} from "../pricing";

export interface CargoEntradaDetalle {
  tipo?: string;
  concepto: string;
  monto: number; // en centavos
}

export interface LiquidarContratoInput {
  entradaReal?: string | Date;
  kmEntrada?: number;
  gasolinaEntrada?: number; // 0 a 8 octavos
  cargoGasolinaFaltante?: number; // en centavos
  otrosCargos?: CargoEntradaDetalle[];
  bonificaciones?: CargoEntradaDetalle[];
}

export interface ResultadoLiquidacionCompleta {
  ok: true;
  contrato: ContratoCompletoRow;
  liquidacion: Liquidacion;
  totalCentavos: number;
  saldoCentavos: number;
  cargosGuardados: Array<{ tipo: string; concepto: string; monto: bigint; momento: string }>;
}

/**
 * Calcula y formaliza la liquidación final del contrato al recibir el vehículo (RF-21, T-62 a T-66).
 * Persiste las líneas desglosadas en `contrato_cargos` con momento 'liquidacion'.
 */
export function liquidarContrato(
  contratoId: string,
  datos: LiquidarContratoInput,
  autor: { id: string; nombre: string; rol?: string }
):
  | ResultadoLiquidacionCompleta
  | { ok: false; codigo: string; error: string; status: number } {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado.",
      status: 404,
    };
  }

  const salida = new Date(contrato.salida_en);
  const entradaPrevista = new Date(contrato.entrada_prevista_en);
  const entradaReal = new Date(
    datos.entradaReal || contrato.entrada_real_en || new Date().toISOString()
  );

  const kmSalida = contrato.km_salida ?? 0;
  const kmEntrada = datos.kmEntrada ?? contrato.km_entrada ?? kmSalida;

  const tarifaDia = Number(contrato.tarifa_dia);
  const anticipo = Number(contrato.anticipo);
  const seguroNocturno = Number(contrato.seguro_nocturno) > 0;
  const odometroDanado = contrato.odometro_danado;

  const tarifaKmPactada = contrato.tarifa_km_sobrescrita
    ? Number(contrato.tarifa_km_sobrescrita)
    : Number(contrato.tarifa_km_extra);

  // 1. Cargo por gasolina faltante si corresponde
  const gasolinaSalida = contrato.gasolina_salida ?? 8;
  const gasolinaEntrada = datos.gasolinaEntrada ?? contrato.gasolina_entrada ?? 8;
  const otrosCargosCalculados: CargoLinea[] = [];

  if (gasolinaEntrada < gasolinaSalida) {
    const faltanteOctavos = gasolinaSalida - gasolinaEntrada;
    // Si no se especifica monto directo, se estima $100 por octavo ($10,000 centavos)
    const montoGasolina =
      datos.cargoGasolinaFaltante !== undefined
        ? datos.cargoGasolinaFaltante
        : faltanteOctavos * 10_000;

    if (montoGasolina > 0) {
      otrosCargosCalculados.push({
        concepto: `Gasolina faltante (${faltanteOctavos}/8 de tanque)`,
        monto: montoGasolina,
      });
    }
  }

  // Agregar otros cargos manuales (limpieza, daños, quemaduras, etc.)
  if (datos.otrosCargos && datos.otrosCargos.length > 0) {
    for (const c of datos.otrosCargos) {
      otrosCargosCalculados.push({
        concepto: c.concepto,
        monto: c.monto,
      });
    }
  }

  // Bonificaciones
  const bonificacionesCalculadas: CargoLinea[] = (datos.bonificaciones || []).map(
    (b) => ({
      concepto: b.concepto,
      monto: Math.abs(b.monto),
    })
  );

  // 2. Ejecutar motor de liquidación matemática pura
  const resultado = liquidar({
    tarifaDia,
    salida,
    entradaPrevista,
    entradaReal,
    kmSalida,
    kmEntrada,
    anticipo,
    seguroNocturno,
    odometroDanado,
    tarifaKmPactada,
    otrosCargos: otrosCargosCalculados,
    bonificaciones: bonificacionesCalculadas,
  });

  // 3. Persistir líneas desglosadas en contrato.cargos
  const cargosEmision = contrato.cargos.filter((c) => c.momento === "emision");
  const cargosLiquidacion: Array<{
    tipo: string;
    concepto: string;
    monto: bigint;
    momento: string;
  }> = [];

  // Mapear cada línea que no sea la renta base de emisión a cargos de liquidación
  for (const l of resultado.lineas) {
    if (l.concepto === "Renta base") continue; // Ya existe en emision

    let tipo = "otro";
    if (l.concepto.startsWith("Retraso")) tipo = "retraso";
    else if (l.concepto.startsWith("Kilometraje")) tipo = "km_excedente";
    else if (l.concepto.startsWith("Gasolina")) tipo = "gasolina";
    else if (l.concepto.toLowerCase().includes("limpieza")) tipo = "limpieza";
    else if (l.concepto.startsWith("Bonificación")) tipo = "bonificacion";
    else if (l.concepto.startsWith("Odómetro")) tipo = "otro";

    cargosLiquidacion.push({
      tipo,
      concepto: l.concepto,
      monto: BigInt(l.monto),
      momento: "liquidacion",
    });
  }

  contrato.cargos = [...cargosEmision, ...cargosLiquidacion];

  // 4. Actualizar datos en contrato
  contrato.km_entrada = kmEntrada;
  contrato.gasolina_entrada = gasolinaEntrada;
  contrato.entrada_real_en = entradaReal.toISOString();
  contrato.updated_at = new Date().toISOString();

  // 5. Auditoría
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: contrato.id,
    registro_descripcion: `Liquidación calculada para contrato ${contrato.folio ?? contratoId}. Total: $${(resultado.total / 100).toLocaleString("es-MX")}, Anticipo: $${(resultado.rentaBase / 100).toLocaleString("es-MX")}, Saldo: $${(resultado.saldo / 100).toLocaleString("es-MX")}.`,
    valor_anterior: null,
    valor_nuevo: {
      total: resultado.total,
      saldo: resultado.saldo,
      lineas: resultado.lineas,
    },
  });

  return {
    ok: true,
    contrato,
    liquidacion: resultado,
    totalCentavos: resultado.total,
    saldoCentavos: resultado.saldo,
    cargosGuardados: contrato.cargos,
  };
}
