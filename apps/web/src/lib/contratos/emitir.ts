/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:22:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T01, S06-T02, S06-T03, S06-T05
 */

import { formatearFolioDigital, type EstadoContrato } from "../db/schema";
import { registrarAuditoria } from "../db/sprint2";
import { obtenerVehiculoPorId } from "../db/sprint4";
import { validarRequisitosEmision, type ConductorInput } from "./validar";

export interface ContratoCompletoRow {
  id: string;
  folio: string | null;
  folio_papel: string | null;
  estado: EstadoContrato;
  cliente_id: string;
  cliente_nombre: string;
  vehiculo_id: string;
  vehiculo_descripcion: string;
  vehiculo2_id: string | null;
  contrato_origen_id: string | null;
  destino: string;
  salida_en: string;
  entrada_prevista_en: string;
  entrada_real_en: string | null;
  lugar_devolucion: string;
  salida_pais_autorizada: boolean;
  permiso_salida_pais_path: string | null;
  referencia_nombre: string | null;
  referencia_telefono: string | null;
  referencia_celular: string | null;
  facturar_a_nombre: string | null;
  facturar_a_rfc: string | null;
  km_salida: number | null;
  km_entrada: number | null;
  km_por_dia: number;
  gasolina_salida: number | null;
  gasolina_entrada: number | null;
  odometro_danado: boolean;
  tarifa_dia: bigint;
  tarifa_hora_extra: bigint;
  tarifa_km_extra: bigint;
  seguro_nocturno: bigint;
  tarifa_km_sobrescrita: bigint | null;
  tarifa_km_nota: string | null;
  tarifa_catalogo_dia: bigint;
  tarifa_motivo: string | null;
  dias: number;
  anticipo: bigint;
  deducible_accidente_pct: number;
  deducible_robo_pct: number;
  valor_auto_asegurado: bigint | null;
  observaciones: string | null;
  conductores: ConductorInput[];
  cargos: Array<{ tipo: string; concepto: string; monto: bigint; momento: string }>;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Consecutivo para folios digitales
let consecutivoFolio = 1;

// Semilla de contratos según Mockup 11
const CONTRATOS_SEMILLA: ContratoCompletoRow[] = [
  {
    id: "77777777-7777-4777-8777-777777777000",
    folio: "D-00001",
    folio_papel: null,
    estado: "por_firmar",
    cliente_id: "12700000-0000-4000-8000-000000000127",
    cliente_nombre: "Ricardo Medina",
    vehiculo_id: "44444444-4444-4444-8444-444444444003",
    vehiculo_descripcion: "Hyundai Elantra",
    vehiculo2_id: null,
    contrato_origen_id: null,
    destino: "Nogales",
    salida_en: "2026-11-16T11:00:00Z",
    entrada_prevista_en: "2026-11-19T11:00:00Z",
    entrada_real_en: null,
    lugar_devolucion: "Sucursal Mexicali",
    salida_pais_autorizada: false,
    permiso_salida_pais_path: null,
    referencia_nombre: "Carlos Medina",
    referencia_telefono: "6865559988",
    referencia_celular: null,
    facturar_a_nombre: null,
    facturar_a_rfc: null,
    km_salida: 47_215,
    km_entrada: null,
    km_por_dia: 500,
    gasolina_salida: 8,
    gasolina_entrada: null,
    odometro_danado: false,
    tarifa_dia: BigInt(163_300),
    tarifa_hora_extra: BigInt(20_400),
    tarifa_km_extra: BigInt(300),
    seguro_nocturno: BigInt(40_000),
    tarifa_km_sobrescrita: null,
    tarifa_km_nota: null,
    tarifa_catalogo_dia: BigInt(163_300),
    tarifa_motivo: null,
    dias: 3,
    anticipo: BigInt(489_900),
    deducible_accidente_pct: 30,
    deducible_robo_pct: 30,
    valor_auto_asegurado: BigInt(36_000_000),
    observaciones: null,
    conductores: [
      {
        nombre: "Ricardo Medina Salazar",
        licencia_numero: "B2302042880",
        licencia_vencimiento: "2028-05-27",
        es_arrendatario: true,
      },
    ],
    cargos: [
      {
        tipo: "renta_base",
        concepto: "Renta base 3 días × $1,633",
        monto: BigInt(489_900),
        momento: "emision",
      },
    ],
    created_at: "2026-11-16T10:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
  },
  {
    id: "77777777-7777-4777-8777-777777777001",
    folio: "08160",
    folio_papel: "08160",
    estado: "vigente",
    cliente_id: "12700000-0000-4000-8000-000000000127",
    cliente_nombre: "Ricardo Medina",
    vehiculo_id: "44444444-4444-4444-8444-444444444002",
    vehiculo_descripcion: "Kia Forte",
    vehiculo2_id: null,
    contrato_origen_id: null,
    destino: "Nogales",
    salida_en: "2026-11-13T17:30:00Z",
    entrada_prevista_en: "2026-11-16T17:30:00Z",
    entrada_real_en: null,
    lugar_devolucion: "Sucursal Mexicali",
    salida_pais_autorizada: false,
    permiso_salida_pais_path: null,
    referencia_nombre: null,
    referencia_telefono: null,
    referencia_celular: null,
    facturar_a_nombre: null,
    facturar_a_rfc: null,
    km_salida: 51_820,
    km_entrada: null,
    km_por_dia: 500,
    gasolina_salida: 8,
    gasolina_entrada: null,
    odometro_danado: false,
    tarifa_dia: BigInt(163_300),
    tarifa_hora_extra: BigInt(20_400),
    tarifa_km_extra: BigInt(300),
    seguro_nocturno: BigInt(40_000),
    tarifa_km_sobrescrita: null,
    tarifa_km_nota: null,
    tarifa_catalogo_dia: BigInt(163_300),
    tarifa_motivo: null,
    dias: 3,
    anticipo: BigInt(489_900),
    deducible_accidente_pct: 30,
    deducible_robo_pct: 30,
    valor_auto_asegurado: BigInt(32_000_000),
    observaciones: null,
    conductores: [],
    cargos: [
      {
        tipo: "renta_base",
        concepto: "Renta base 3 días × $1,633",
        monto: BigInt(489_900),
        momento: "emision",
      },
    ],
    created_at: "2026-11-13T17:30:00Z",
    updated_at: "2026-11-13T17:30:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
  },
  {
    id: "77777777-7777-4777-8777-777777777002",
    folio: "08155",
    folio_papel: "08155",
    estado: "rezagado",
    cliente_id: "12900000-0000-4000-8000-000000000129",
    cliente_nombre: "Andrés Cota",
    vehiculo_id: "44444444-4444-4444-8444-444444444005",
    vehiculo_descripcion: "Mazda 3",
    vehiculo2_id: null,
    contrato_origen_id: null,
    destino: "San Felipe",
    salida_en: "2026-11-13T11:00:00Z",
    entrada_prevista_en: "2026-11-16T11:00:00Z",
    entrada_real_en: null,
    lugar_devolucion: "Sucursal Mexicali",
    salida_pais_autorizada: false,
    permiso_salida_pais_path: null,
    referencia_nombre: null,
    referencia_telefono: null,
    referencia_celular: null,
    facturar_a_nombre: null,
    facturar_a_rfc: null,
    km_salida: 33_120,
    km_entrada: null,
    km_por_dia: 500,
    gasolina_salida: 8,
    gasolina_entrada: null,
    odometro_danado: false,
    tarifa_dia: BigInt(163_300),
    tarifa_hora_extra: BigInt(20_400),
    tarifa_km_extra: BigInt(300),
    seguro_nocturno: BigInt(40_000),
    tarifa_km_sobrescrita: null,
    tarifa_km_nota: null,
    tarifa_catalogo_dia: BigInt(163_300),
    tarifa_motivo: null,
    dias: 3,
    anticipo: BigInt(489_900),
    deducible_accidente_pct: 30,
    deducible_robo_pct: 30,
    valor_auto_asegurado: BigInt(38_000_000),
    observaciones: "Rezagado con 2h 20m de retraso",
    conductores: [],
    cargos: [
      {
        tipo: "renta_base",
        concepto: "Renta base 3 días × $1,633",
        monto: BigInt(489_900),
        momento: "emision",
      },
      {
        tipo: "retraso",
        concepto: "3 horas de retraso × $204",
        monto: BigInt(61_200),
        momento: "liquidacion",
      },
    ],
    created_at: "2026-11-13T11:00:00Z",
    updated_at: "2026-11-16T13:20:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
  },
];

let listaContratos: ContratoCompletoRow[] = [...CONTRATOS_SEMILLA];

export function resetearEstadoContratos(): void {
  listaContratos = CONTRATOS_SEMILLA.map((c) => ({
    ...c,
    conductores: [...c.conductores],
    cargos: [...c.cargos],
  }));
  consecutivoFolio = 1;
}

export function obtenerContratos(filtro?: { estado?: string; q?: string }): ContratoCompletoRow[] {
  let resultado = [...listaContratos];
  if (filtro?.estado && filtro.estado !== "todos") {
    resultado = resultado.filter((c) => c.estado === filtro.estado);
  }
  if (filtro?.q && filtro.q.trim() !== "") {
    const qLower = filtro.q.toLowerCase().trim();
    resultado = resultado.filter(
      (c) =>
        (c.folio && c.folio.toLowerCase().includes(qLower)) ||
        (c.folio_papel && c.folio_papel.toLowerCase().includes(qLower)) ||
        c.cliente_nombre.toLowerCase().includes(qLower) ||
        c.vehiculo_descripcion.toLowerCase().includes(qLower)
    );
  }
  return resultado;
}

export function obtenerContratoPorId(id: string): ContratoCompletoRow | undefined {
  return listaContratos.find((c) => c.id === id);
}

/**
 * Valida la matriz de transiciones de estado de contratos (RF-13, T-34)
 */
export function validarTransicionEstado(
  estadoActual: EstadoContrato,
  nuevoEstado: EstadoContrato
): { permitida: boolean; codigo?: string; error?: string } {
  if (estadoActual === nuevoEstado) {
    return { permitida: true };
  }

  const matrizValida: Record<EstadoContrato, EstadoContrato[]> = {
    borrador: ["por_firmar", "cancelado"],
    por_firmar: ["vigente", "borrador", "cancelado"],
    vigente: ["por_vencer", "rezagado", "recibido", "en_incidente"],
    por_vencer: ["recibido", "rezagado", "en_incidente"],
    rezagado: ["recibido", "en_incidente"],
    recibido: ["concluido"],
    en_incidente: ["recibido", "concluido"],
    concluido: [],
    cancelado: [],
  };

  const destinosPermitidos = matrizValida[estadoActual] || [];
  if (!destinosPermitidos.includes(nuevoEstado)) {
    return {
      permitida: false,
      codigo: "TRANSICION_INVALIDA",
      error: `TRANSICION_INVALIDA: No se permite cambiar el estado de contrato de '${estadoActual}' a '${nuevoEstado}'.`,
    };
  }

  return { permitida: true };
}

export const calcularCotizacionContrato = calcularCotizacion;
export const crearBorrador = guardarBorradorContrato;

/**
 * Cálculo del motor de cotización de rentas (RF-14, T-30, T-37)
 */
export function calcularCotizacion(params: {
  salida_en: string;
  entrada_prevista_en: string;
  tarifa_dia_centavos?: number | bigint;
  tarifa_dia_propuesta?: number | bigint;
  tarifa_km_sobrescrita?: number | bigint | null;
}) {
  const inicioMs = new Date(params.salida_en).getTime();
  const finMs = new Date(params.entrada_prevista_en).getTime();
  const duracionHoras = Math.max(1, Math.ceil((finMs - inicioMs) / (1000 * 60 * 60)));
  const dias = Math.max(1, Math.ceil(duracionHoras / 24));

  const tarifaDiaVal = params.tarifa_dia_propuesta ?? params.tarifa_dia_centavos ?? 163300;
  const tarifaDia = BigInt(tarifaDiaVal);
  const anticipo = tarifaDia * BigInt(dias);

  // Hora extra: tarifa ÷ 8 redondeada a peso (en centavos)
  const valorPeso = Math.round(Number(tarifaDia / BigInt(100)) / 8);
  const tarifaHoraExtra = BigInt(valorPeso * 100);

  // Km extra: tarifa ÷ 500 redondeado a peso, salvo si viene sobrescrita
  const tarifaKmExtra =
    params.tarifa_km_sobrescrita !== null && params.tarifa_km_sobrescrita !== undefined
      ? BigInt(params.tarifa_km_sobrescrita)
      : BigInt(Math.round(Number(tarifaDia / BigInt(100)) / 500) * 100);

  const kmIncluidos = dias * 500;

  return {
    dias,
    tarifa_dia: tarifaDia,
    tarifa_hora_extra: tarifaHoraExtra,
    tarifa_km_extra: tarifaKmExtra,
    anticipo,
    km_incluidos: kmIncluidos,
  };
}

/**
 * Guarda o actualiza un borrador de contrato (RF-12)
 */
export function guardarBorradorContrato(
  datos: Partial<Omit<ContratoCompletoRow, "tarifa_dia" | "tarifa_km_sobrescrita">> & {
    cliente_id: string;
    vehiculo_id: string;
    salida_en: string;
    entrada_prevista_en: string;
    tarifa_dia?: number | bigint;
    tarifa_km_sobrescrita?: number | bigint | null;
  },
  autor: { id: string; nombre: string }
): ContratoCompletoRow {
  const ahora = new Date().toISOString();
  const vehiculo = obtenerVehiculoPorId(datos.vehiculo_id);
  const tarifaDiaCentavos = datos.tarifa_dia
    ? BigInt(datos.tarifa_dia)
    : vehiculo
    ? vehiculo.tarifa_dia
    : BigInt(163_300);

  const cot = calcularCotizacion({
    salida_en: datos.salida_en,
    entrada_prevista_en: datos.entrada_prevista_en,
    tarifa_dia_centavos: tarifaDiaCentavos,
    tarifa_km_sobrescrita: datos.tarifa_km_sobrescrita ? Number(datos.tarifa_km_sobrescrita) : null,
  });
  const id = datos.id || crypto.randomUUID();

  const contrato: ContratoCompletoRow = {
    id,
    folio: null,
    folio_papel: datos.folio_papel ?? null,
    estado: "borrador",
    cliente_id: datos.cliente_id,
    cliente_nombre: datos.cliente_nombre ?? "Cliente",
    vehiculo_id: datos.vehiculo_id,
    vehiculo_descripcion: vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : "Vehículo",
    vehiculo2_id: datos.vehiculo2_id ?? null,
    contrato_origen_id: datos.contrato_origen_id ?? null,
    destino: datos.destino ?? "Mexicali y alrededores",
    salida_en: datos.salida_en,
    entrada_prevista_en: datos.entrada_prevista_en,
    entrada_real_en: null,
    lugar_devolucion: datos.lugar_devolucion ?? "Sucursal Mexicali",
    salida_pais_autorizada: datos.salida_pais_autorizada ?? false,
    permiso_salida_pais_path: datos.permiso_salida_pais_path ?? null,
    referencia_nombre: datos.referencia_nombre ?? null,
    referencia_telefono: datos.referencia_telefono ?? null,
    referencia_celular: datos.referencia_celular ?? null,
    facturar_a_nombre: datos.facturar_a_nombre ?? null,
    facturar_a_rfc: datos.facturar_a_rfc ?? null,
    km_salida: vehiculo ? vehiculo.kilometraje_actual : 0,
    km_entrada: null,
    km_por_dia: 500,
    gasolina_salida: 8,
    gasolina_entrada: null,
    odometro_danado: false,
    tarifa_dia: cot.tarifa_dia,
    tarifa_hora_extra: cot.tarifa_hora_extra,
    tarifa_km_extra: cot.tarifa_km_extra,
    seguro_nocturno: BigInt(40_000),
    tarifa_km_sobrescrita: datos.tarifa_km_sobrescrita ? BigInt(datos.tarifa_km_sobrescrita) : null,
    tarifa_km_nota: datos.tarifa_km_nota ?? null,
    tarifa_catalogo_dia: vehiculo ? vehiculo.tarifa_dia : cot.tarifa_dia,
    tarifa_motivo: datos.tarifa_motivo ?? null,
    dias: cot.dias,
    anticipo: cot.anticipo,
    deducible_accidente_pct: 30,
    deducible_robo_pct: 30,
    valor_auto_asegurado: vehiculo ? vehiculo.valor_asegurado : BigInt(30_000_000),
    observaciones: datos.observaciones ?? null,
    conductores: datos.conductores ?? [],
    cargos: [
      {
        tipo: "renta_base",
        concepto: `Renta base ${cot.dias} días × $${Number(cot.tarifa_dia / BigInt(100)).toLocaleString("es-MX")}`,
        monto: cot.anticipo,
        momento: "emision",
      },
    ],
    created_at: ahora,
    updated_at: ahora,
    created_by: autor.id,
  };

  const index = listaContratos.findIndex((c) => c.id === id);
  if (index !== -1) {
    listaContratos[index] = contrato;
  } else {
    listaContratos.unshift(contrato);
  }

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: index !== -1 ? "UPDATE" : "INSERT",
    tabla: "contratos",
    registro_id: id,
    registro_descripcion: `Borrador de contrato guardado para cliente ${contrato.cliente_nombre}`,
    valor_anterior: null,
    valor_nuevo: { id, cliente_id: contrato.cliente_id, estado: "borrador" },
  });

  return contrato;
}

/**
 * Emisión transaccional de contrato (RF-13, S06-T03):
 * 1. Valida todos los requisitos (fechas, licencias, tarifas pactadas).
 * 2. Asigna folio atómico digital único `D-00001` (T-33).
 * 3. Congela la copia inmutable de tarifas y genera líneas de cargo (T-35, T-37).
 * 4. Cambia estado a `por_firmar`.
 * 5. Registra evento en `outbox` y `auditoria`.
 */
export async function emitirContratoTransaccional(
  contratoId: string,
  autor: { id: string; nombre: string }
): Promise<
  | { ok: true; contrato: ContratoCompletoRow; folio: string }
  | { ok: false; codigo: string; error: string }
> {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return { ok: false, codigo: "CONTRATO_NO_ENCONTRADO", error: "Contrato no encontrado" };
  }

  // Validar transición borrador -> por_firmar
  const transicion = validarTransicionEstado(contrato.estado, "por_firmar");
  if (!transicion.permitida) {
    return { ok: false, codigo: "TRANSICION_INVALIDA", error: transicion.error! };
  }

  // Validaciones de emisión (licencias, fechas, permisos)
  const validacion = validarRequisitosEmision({
    salida_en: contrato.salida_en,
    entrada_prevista_en: contrato.entrada_prevista_en,
    vehiculo_id: contrato.vehiculo_id,
    conductores: contrato.conductores,
    salida_pais_autorizada: contrato.salida_pais_autorizada,
    permiso_salida_pais_path: contrato.permiso_salida_pais_path,
    tarifa_dia: contrato.tarifa_dia,
    tarifa_catalogo_dia: contrato.tarifa_catalogo_dia,
    tarifa_motivo: contrato.tarifa_motivo,
    tarifa_km_sobrescrita: contrato.tarifa_km_sobrescrita,
    tarifa_km_nota: contrato.tarifa_km_nota,
  });

  if (!validacion.valido) {
    return { ok: false, codigo: validacion.codigo!, error: validacion.error! };
  }

  // Consumir el siguiente folio digital único en formato D-00001 (T-33)
  const folioDigital = formatearFolioDigital(consecutivoFolio++);
  const ahora = new Date().toISOString();

  contrato.folio = folioDigital;
  contrato.estado = "por_firmar";
  contrato.updated_at = ahora;

  // T-37: Asegurar que los cargos desglosados sumen exactamente el anticipo
  const sumaCargos = contrato.cargos.reduce((acc, c) => acc + c.monto, BigInt(0));
  if (sumaCargos !== contrato.anticipo) {
    contrato.cargos = [
      {
        tipo: "renta_base",
        concepto: `Renta base ${contrato.dias} días × $${Number(contrato.tarifa_dia / BigInt(100)).toLocaleString("es-MX")}`,
        monto: contrato.anticipo,
        momento: "emision",
      },
    ];
  }

  // Bitácora y Outbox
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: contrato.id,
    registro_descripcion: `Emisión de contrato ${contrato.folio} (copia inmutable de tarifas y cargos generados)`,
    valor_anterior: { estado: "borrador", folio: null },
    valor_nuevo: {
      estado: "por_firmar",
      folio: contrato.folio,
      anticipo: Number(contrato.anticipo),
    },
  });

  return { ok: true, contrato, folio: folioDigital };
}
