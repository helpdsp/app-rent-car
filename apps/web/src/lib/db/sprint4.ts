/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles engineering-backend-architect + engineering-database-optimizer
 * @vision_command start_sprint --sprint 4
 * @sprint_number 4
 * @task_id S04-T01, S04-T02, S04-T03, S04-T07
 */

import { registrarAuditoria } from "./sprint2";
import { marcarAlertasComoAtendidas } from "../alertas/atender";

export type EstadoVehiculo = "disponible" | "rentado" | "mantenimiento" | "baja";

export interface VehiculoRow {
  id: string;
  clave_auto: number;
  clave_formato: string;
  marca: string;
  modelo: string;
  tipo: string;
  color: string;
  placas: string;
  kilometraje_actual: number;
  valor_asegurado: bigint; // centavos enteros
  tarifa_dia: bigint; // centavos enteros
  seguro_nocturno: bigint; // centavos enteros
  estado: EstadoVehiculo;
  categoria_tarifa_id: string | null;
  observaciones: string | null;
  contrato_activo_folio?: string | null;
  es_rezagado?: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_at: string | null;
}

export interface BloqueoVehiculoRow {
  id: string;
  vehiculo_id: string;
  desde: string; // ISO string
  hasta: string; // ISO string
  motivo: string;
  created_at: string;
  created_by: string | null;
}

export interface DocumentoVehiculoRow {
  id: string;
  vehiculo_id: string;
  tipo: "tarjeta_circulacion" | "poliza";
  numero: string | null;
  expedido_en: string | null;
  fecha_expedicion: string | null;
  fecha_vencimiento: string | null;
  aseguradora?: string | null;
  agente?: string | null;
  agente_contacto?: string | null;
  archivos: Array<{ tipo: string; path: string }>;
  vigente: boolean;
  observaciones: string | null;
  created_at: string;
}

export interface HistorialKmItem {
  contrato_folio: string;
  cliente_nombre: string;
  fecha: string;
  dias: number;
  km_salida: number;
  km_entrada: number;
  recorridos: number;
  km_dia: number;
}

export interface ContratoRangoRow {
  id: string;
  folio: string;
  vehiculo_id: string;
  vehiculo2_id?: string | null;
  estado: "borrador" | "por_firmar" | "vigente" | "por_vencer" | "rezagado" | "recibido" | "concluido" | "cancelado" | "en_incidente";
  salida_en: string;
  entrada_prevista_en: string;
}

// Semilla de vehículos según Mockups 9 y 10
const VEHICULOS_SEMILLA: VehiculoRow[] = [
  {
    id: "44444444-4444-4444-8444-444444444003",
    clave_auto: 3,
    clave_formato: "0003",
    marca: "Hyundai",
    modelo: "Elantra",
    tipo: "Sedán",
    color: "Azul",
    placas: "ATU-703-A",
    kilometraje_actual: 47_215,
    valor_asegurado: BigInt(36_000_000), // $360,000.00
    tarifa_dia: BigInt(163_300), // $1,633.00
    seguro_nocturno: BigInt(40_000), // $400.00
    estado: "disponible",
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: "Unidad principal en óptimas condiciones",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444006",
    clave_auto: 6,
    clave_formato: "0006",
    marca: "Nissan",
    modelo: "Altima",
    tipo: "Sedán",
    color: "Blanco",
    placas: "BBA-451-B",
    kilometraje_actual: 139_102,
    valor_asegurado: BigInt(28_000_000), // $280,000.00
    tarifa_dia: BigInt(163_300),
    seguro_nocturno: BigInt(40_000),
    estado: "disponible",
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444008",
    clave_auto: 8,
    clave_formato: "0008",
    marca: "Kia",
    modelo: "Forte",
    tipo: "Sedán",
    color: "Negro",
    placas: "BAD-372-A",
    kilometraje_actual: 88_305,
    valor_asegurado: BigInt(32_000_000),
    tarifa_dia: BigInt(163_300),
    seguro_nocturno: BigInt(40_000),
    estado: "disponible",
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444002",
    clave_auto: 2,
    clave_formato: "0002",
    marca: "Kia",
    modelo: "Forte",
    tipo: "Sedán",
    color: "Gris",
    placas: "BNB-791-A",
    kilometraje_actual: 51_820,
    valor_asegurado: BigInt(32_000_000),
    tarifa_dia: BigInt(163_300),
    seguro_nocturno: BigInt(40_000),
    estado: "rentado",
    contrato_activo_folio: "08160",
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: "Asignado a contrato 08160 de referencia",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444009",
    clave_auto: 9,
    clave_formato: "0009",
    marca: "Honda",
    modelo: "CR-V",
    tipo: "SUV",
    color: "Negra",
    placas: "BKL-912-C",
    kilometraje_actual: 110_254,
    valor_asegurado: BigInt(45_000_000),
    tarifa_dia: BigInt(221_600), // $2,216.00
    seguro_nocturno: BigInt(40_000),
    estado: "disponible", // pero tarjeta vence hoy -> no rentable
    categoria_tarifa_id: null,
    observaciones: "Documento por vencer hoy",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444005",
    clave_auto: 5,
    clave_formato: "0005",
    marca: "Mazda",
    modelo: "3",
    tipo: "Sedán",
    color: "Rojo",
    placas: "AKL-552-A",
    kilometraje_actual: 33_120,
    valor_asegurado: BigInt(38_000_000),
    tarifa_dia: BigInt(163_300),
    seguro_nocturno: BigInt(40_000),
    estado: "rentado",
    contrato_activo_folio: "08155",
    es_rezagado: true,
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: "Rezagado",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444004",
    clave_auto: 4,
    clave_formato: "0004",
    marca: "Nissan",
    modelo: "Sentra",
    tipo: "Sedán",
    color: "Plata",
    placas: "BCZ-889-A",
    kilometraje_actual: 72_640,
    valor_asegurado: BigInt(29_000_000),
    tarifa_dia: BigInt(163_300),
    seguro_nocturno: BigInt(40_000),
    estado: "mantenimiento",
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: "En taller por cambio de balatas",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444001",
    clave_auto: 1,
    clave_formato: "0001",
    marca: "Chevrolet",
    modelo: "Aveo",
    tipo: "Sedán",
    color: "Blanco",
    placas: "AYP-112-A",
    kilometraje_actual: 95_400,
    valor_asegurado: BigInt(21_000_000),
    tarifa_dia: BigInt(120_000),
    seguro_nocturno: BigInt(40_000),
    estado: "disponible",
    categoria_tarifa_id: null,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444007",
    clave_auto: 7,
    clave_formato: "0007",
    marca: "Toyota",
    modelo: "Corolla",
    tipo: "Sedán",
    color: "Gris",
    placas: "BAK-301-A",
    kilometraje_actual: 64_100,
    valor_asegurado: BigInt(34_000_000),
    tarifa_dia: BigInt(163_300),
    seguro_nocturno: BigInt(40_000),
    estado: "rentado",
    contrato_activo_folio: "08890",
    categoria_tarifa_id: "22222222-2222-4222-8222-222222222201",
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "44444444-4444-4444-8444-444444444010",
    clave_auto: 10,
    clave_formato: "0010",
    marca: "Nissan",
    modelo: "Versa",
    tipo: "Sedán",
    color: "Tinto",
    placas: "ABZ-900-B",
    kilometraje_actual: 120_500,
    valor_asegurado: BigInt(23_000_000),
    tarifa_dia: BigInt(140_000),
    seguro_nocturno: BigInt(40_000),
    estado: "baja",
    categoria_tarifa_id: null,
    observaciones: "Baja definitiva por siniestro",
    created_at: "2026-01-15T08:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
];

// Documentos vigentes de vehículos
const DOCUMENTOS_VEHICULOS_SEMILLA: DocumentoVehiculoRow[] = [
  // Clave 0003 - Hyundai Elantra
  {
    id: "55555555-5555-4555-8555-555555555001",
    vehiculo_id: "44444444-4444-4444-8444-444444444003",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-998822",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2024-03-14",
    fecha_vencimiento: "2027-03-14",
    archivos: [{ tipo: "pdf", path: "documentos/vehiculos/0003/tarjeta_circulacion.pdf" }],
    vigente: true,
    observaciones: "Tarjeta de circulación vigente",
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555002",
    vehiculo_id: "44444444-4444-4444-8444-444444444003",
    tipo: "poliza",
    numero: "QUALITAS-778811",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2026-04-05",
    fecha_vencimiento: "2027-04-05",
    aseguradora: "Quálitas Compañía de Seguros",
    agente: "Seguros del Noroeste S.A.",
    agente_contacto: "Lic. Manuel Ortiz - 686-555-9090",
    archivos: [{ tipo: "pdf", path: "documentos/vehiculos/0003/poliza_seguro.pdf" }],
    vigente: true,
    observaciones: "Cobertura amplia comercial",
    created_at: "2026-01-15T08:00:00Z",
  },
  // Clave 0006 - Nissan Altima
  {
    id: "55555555-5555-4555-8555-555555555003",
    vehiculo_id: "44444444-4444-4444-8444-444444444006",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-123456",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2024-08-22",
    fecha_vencimiento: "2027-08-22",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555004",
    vehiculo_id: "44444444-4444-4444-8444-444444444006",
    tipo: "poliza",
    numero: "GNP-889922",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2026-01-19",
    fecha_vencimiento: "2027-01-19",
    aseguradora: "GNP Seguros",
    agente: "Agencia Mexicali",
    agente_contacto: "686-555-1122",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  // Clave 0008 - Kia Forte
  {
    id: "55555555-5555-4555-8555-555555555005",
    vehiculo_id: "44444444-4444-4444-8444-444444444008",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-334455",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2024-06-03",
    fecha_vencimiento: "2027-06-03",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555006",
    vehiculo_id: "44444444-4444-4444-8444-444444444008",
    tipo: "poliza",
    numero: "HDI-667788",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2026-02-11",
    fecha_vencimiento: "2027-02-11",
    aseguradora: "HDI Seguros",
    agente: "Asesores Frontera",
    agente_contacto: "686-555-4433",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  // Clave 0002 - Kia Forte (Rentado 08160)
  {
    id: "55555555-5555-4555-8555-555555555007",
    vehiculo_id: "44444444-4444-4444-8444-444444444002",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-992211",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2024-09-09",
    fecha_vencimiento: "2027-09-09",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555008",
    vehiculo_id: "44444444-4444-4444-8444-444444444002",
    tipo: "poliza",
    numero: "QUALITAS-554433",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2025-11-28",
    fecha_vencimiento: "2026-11-28", // Vence en 11 días
    aseguradora: "Quálitas Compañía de Seguros",
    agente: "Seguros del Noroeste S.A.",
    agente_contacto: "686-555-9090",
    archivos: [],
    vigente: true,
    observaciones: "Alerta de vencimiento en 15 días disparada",
    created_at: "2026-01-15T08:00:00Z",
  },
  // Clave 0009 - Honda CR-V (Tarjeta de circulación vence hoy -> no rentable)
  {
    id: "55555555-5555-4555-8555-555555555009",
    vehiculo_id: "44444444-4444-4444-8444-444444444009",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-000999",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2023-11-17",
    fecha_vencimiento: "2026-11-17", // Vence hoy!
    archivos: [],
    vigente: false,
    observaciones: "Tarjeta de circulación por vencer hoy",
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555010",
    vehiculo_id: "44444444-4444-4444-8444-444444444009",
    tipo: "poliza",
    numero: "GNP-991122",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2026-05-30",
    fecha_vencimiento: "2027-05-30",
    aseguradora: "GNP Seguros",
    agente: "Asesores Frontera",
    agente_contacto: "686-555-4433",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  // Clave 0005 - Mazda 3
  {
    id: "55555555-5555-4555-8555-555555555011",
    vehiculo_id: "44444444-4444-4444-8444-444444444005",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-551122",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2024-10-17",
    fecha_vencimiento: "2027-10-17",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555012",
    vehiculo_id: "44444444-4444-4444-8444-444444444005",
    tipo: "poliza",
    numero: "QUALITAS-331122",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2026-03-08",
    fecha_vencimiento: "2027-03-08",
    aseguradora: "Quálitas",
    agente: "Seguros Noroeste",
    agente_contacto: "686-555-9090",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  // Clave 0004 - Nissan Sentra
  {
    id: "55555555-5555-4555-8555-555555555013",
    vehiculo_id: "44444444-4444-4444-8444-444444444004",
    tipo: "tarjeta_circulacion",
    numero: "TC-BC-442233",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2024-02-02",
    fecha_vencimiento: "2027-02-02",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
  {
    id: "55555555-5555-4555-8555-555555555014",
    vehiculo_id: "44444444-4444-4444-8444-444444444004",
    tipo: "poliza",
    numero: "HDI-442233",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2026-06-14",
    fecha_vencimiento: "2027-06-14",
    aseguradora: "HDI",
    agente: "Asesores Frontera",
    agente_contacto: "686-555-4433",
    archivos: [],
    vigente: true,
    observaciones: null,
    created_at: "2026-01-15T08:00:00Z",
  },
];

// Bloqueos de mantenimiento
const BLOQUEOS_SEMILLA: BloqueoVehiculoRow[] = [
  {
    id: "66666666-6666-4666-8666-666666666001",
    vehiculo_id: "44444444-4444-4444-8444-444444444004", // Nissan Sentra
    desde: "2026-11-15T08:00:00Z",
    hasta: "2026-11-20T18:00:00Z",
    motivo: "Cambio de balatas y revisión de suspensión",
    created_at: "2026-11-15T08:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
  },
];

// Contratos activos y recientes para disponibilidad y exclusión (RF-09)
const CONTRATOS_RANGOS_SEMILLA: ContratoRangoRow[] = [
  {
    id: "77777777-7777-4777-8777-777777777001",
    folio: "08160",
    vehiculo_id: "44444444-4444-4444-8444-444444444002", // Kia Forte
    estado: "vigente",
    salida_en: "2026-11-15T11:00:00Z",
    entrada_prevista_en: "2026-11-18T11:00:00Z",
  },
  {
    id: "77777777-7777-4777-8777-777777777002",
    folio: "08155",
    vehiculo_id: "44444444-4444-4444-8444-444444444005", // Mazda 3
    estado: "rezagado",
    salida_en: "2026-11-10T11:00:00Z",
    entrada_prevista_en: "2026-11-14T11:00:00Z",
  },
  {
    id: "77777777-7777-4777-8777-777777777003",
    folio: "08890",
    vehiculo_id: "44444444-4444-4444-8444-444444444007", // Toyota Corolla
    estado: "vigente",
    salida_en: "2026-11-16T09:00:00Z",
    entrada_prevista_en: "2026-11-19T09:00:00Z",
  },
];

// Historial de kilómetros para la ficha del Hyundai Elantra (Mockup 10)
const HISTORIAL_KM_ELANTRA: HistorialKmItem[] = [
  {
    contrato_folio: "08871",
    cliente_nombre: "Laura Ibarra",
    fecha: "02/11/26",
    dias: 3,
    km_salida: 46_502,
    km_entrada: 47_215,
    recorridos: 713,
    km_dia: 238,
  },
  {
    contrato_folio: "08804",
    cliente_nombre: "Ricardo Medina",
    fecha: "21/10/26",
    dias: 2,
    km_salida: 45_780,
    km_entrada: 46_502,
    recorridos: 722,
    km_dia: 361,
  },
  {
    contrato_folio: "08755",
    cliente_nombre: "Andrés Cota",
    fecha: "09/10/26",
    dias: 3,
    km_salida: 45_102,
    km_entrada: 45_780,
    recorridos: 678,
    km_dia: 226,
  },
];

let listaVehiculos: VehiculoRow[] = [...VEHICULOS_SEMILLA];
let listaDocumentosVehiculos: DocumentoVehiculoRow[] = [...DOCUMENTOS_VEHICULOS_SEMILLA];
let listaBloqueos: BloqueoVehiculoRow[] = [...BLOQUEOS_SEMILLA];
let listaContratosRangos: ContratoRangoRow[] = [...CONTRATOS_RANGOS_SEMILLA];

export function resetearEstadoVehiculos(): void {
  listaVehiculos = [...VEHICULOS_SEMILLA];
  listaDocumentosVehiculos = [...DOCUMENTOS_VEHICULOS_SEMILLA];
  listaBloqueos = [...BLOQUEOS_SEMILLA];
  listaContratosRangos = [...CONTRATOS_RANGOS_SEMILLA];
}

/** Formatea la clave como entero de 4 dígitos: 0003 */
export function formatearClaveAuto(consecutivo: number): string {
  return String(consecutivo).padStart(4, "0");
}

/**
 * Consulta de vehículos con filtro de búsqueda y estado (Mockup 9)
 */
export function obtenerVehiculos(filtro?: {
  estado?: string;
  q?: string;
}): VehiculoRow[] {
  let resultado = listaVehiculos.filter((v) => !v.deleted_at);

  if (filtro?.estado && filtro.estado !== "todos") {
    if (filtro.estado === "documentos_por_vencer") {
      // Filtrar vehículos con documentos vencidos o que vencen en <= 30 días
      const vehiculosConDocAlerta = new Set<string>();
      const en30DiasStr = "2026-12-17";

      for (const doc of listaDocumentosVehiculos) {
        if (!doc.fecha_vencimiento || doc.fecha_vencimiento <= en30DiasStr) {
          vehiculosConDocAlerta.add(doc.vehiculo_id);
        }
      }
      resultado = resultado.filter((v) => vehiculosConDocAlerta.has(v.id));
    } else {
      resultado = resultado.filter((v) => v.estado === filtro.estado);
    }
  }

  if (filtro?.q && filtro.q.trim() !== "") {
    const term = filtro.q.trim().toLowerCase();
    resultado = resultado.filter((v) => {
      const matchModelo = v.modelo.toLowerCase().includes(term);
      const matchMarca = v.marca.toLowerCase().includes(term);
      const matchPlacas = v.placas.toLowerCase().includes(term);
      const matchClave = v.clave_formato.includes(term) || String(v.clave_auto).includes(term);
      return matchModelo || matchMarca || matchPlacas || matchClave;
    });
  }

  return resultado;
}

export function obtenerVehiculoPorId(id: string): VehiculoRow | undefined {
  return listaVehiculos.find((v) => v.id === id && !v.deleted_at);
}

export function obtenerDocumentosDeVehiculo(vehiculoId: string): DocumentoVehiculoRow[] {
  return listaDocumentosVehiculos.filter((d) => d.vehiculo_id === vehiculoId);
}

export function obtenerBloqueosDeVehiculo(vehiculoId: string): BloqueoVehiculoRow[] {
  return listaBloqueos.filter((b) => b.vehiculo_id === vehiculoId);
}

export function obtenerHistorialKm(vehiculoId: string): HistorialKmItem[] {
  if (vehiculoId === "44444444-4444-4444-8444-444444444003") {
    return HISTORIAL_KM_ELANTRA;
  }
  return [];
}

/**
 * Alta de un nuevo vehículo (RF-07)
 */
export function crearVehiculo(
  datos: {
    marca: string;
    modelo: string;
    tipo: string;
    color: string;
    placas: string;
    kilometraje_actual: number;
    valor_asegurado: bigint | number;
    tarifa_dia?: bigint | number;
    seguro_nocturno?: bigint | number;
    estado?: EstadoVehiculo;
    categoria_tarifa_id?: string | null;
    observaciones?: string | null;
  },
  autor: { id: string; nombre: string; rol: string }
): { ok: true; vehiculo: VehiculoRow } | { ok: false; error: string; codigo: string } {
  // Verificar placas únicas
  const placasUpper = datos.placas.trim().toUpperCase();
  const placasExiste = listaVehiculos.some(
    (v) => !v.deleted_at && v.placas.toUpperCase() === placasUpper
  );
  if (placasExiste) {
    return {
      ok: false,
      codigo: "PLACAS_DUPLICADAS",
      error: `Ya existe un vehículo registrado con las placas ${placasUpper}`,
    };
  }

  const maxClave = listaVehiculos.reduce((max, v) => Math.max(max, v.clave_auto), 0);
  const nuevaClave = maxClave + 1;
  const nuevoId = crypto.randomUUID();
  const ahora = new Date().toISOString();

  const nuevo: VehiculoRow = {
    id: nuevoId,
    clave_auto: nuevaClave,
    clave_formato: formatearClaveAuto(nuevaClave),
    marca: datos.marca.trim(),
    modelo: datos.modelo.trim(),
    tipo: datos.tipo.trim(),
    color: datos.color.trim(),
    placas: placasUpper,
    kilometraje_actual: Math.max(0, datos.kilometraje_actual),
    valor_asegurado: BigInt(datos.valor_asegurado),
    tarifa_dia: BigInt(datos.tarifa_dia ?? 163_300),
    seguro_nocturno: BigInt(datos.seguro_nocturno ?? 40_000),
    estado: datos.estado ?? "disponible",
    categoria_tarifa_id: datos.categoria_tarifa_id ?? null,
    observaciones: datos.observaciones?.trim() || null,
    created_at: ahora,
    updated_at: ahora,
    created_by: autor.id,
    deleted_at: null,
  };

  listaVehiculos.push(nuevo);

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "vehiculos",
    registro_id: nuevoId,
    registro_descripcion: `Alta de vehículo clave ${nuevo.clave_formato}: ${nuevo.marca} ${nuevo.modelo} (${nuevo.placas})`,
    valor_anterior: null,
    valor_nuevo: {
      ...nuevo,
      valor_asegurado: Number(nuevo.valor_asegurado),
      tarifa_dia: Number(nuevo.tarifa_dia),
      seguro_nocturno: Number(nuevo.seguro_nocturno),
    },
  });

  return { ok: true, vehiculo: nuevo };
}

/**
 * Edición de vehículo y validación de regla de kilometraje (RF-07, T-15)
 * El kilometraje no puede disminuir salvo corrección por un administrador auditada.
 */
export function actualizarVehiculo(
  id: string,
  datos: Partial<{
    marca: string;
    modelo: string;
    tipo: string;
    color: string;
    placas: string;
    kilometraje_actual: number;
    valor_asegurado: bigint | number;
    tarifa_dia: bigint | number;
    seguro_nocturno: bigint | number;
    estado: EstadoVehiculo;
    categoria_tarifa_id: string | null;
    observaciones: string | null;
    motivo_correccion_km?: string;
  }>,
  autor: { id: string; nombre: string; rol: string }
): { ok: true; vehiculo: VehiculoRow } | { ok: false; error: string; codigo: string } {
  const index = listaVehiculos.findIndex((v) => v.id === id && !v.deleted_at);
  if (index === -1) {
    return { ok: false, codigo: "VEHICULO_NO_ENCONTRADO", error: "Vehículo no encontrado" };
  }

  const anterior = listaVehiculos[index]!;
  const ahora = new Date().toISOString();

  // Validación de kilometraje
  if (
    datos.kilometraje_actual !== undefined &&
    datos.kilometraje_actual < anterior.kilometraje_actual
  ) {
    // Solo administrador con motivo justificado puede reducirlo
    if (autor.rol !== "administrador" && autor.rol !== "titular") {
      return {
        ok: false,
        codigo: "KILOMETRAJE_INVALIDO",
        error: `El kilometraje actual (${datos.kilometraje_actual} km) no puede ser menor al anterior (${anterior.kilometraje_actual} km) salvo corrección de administrador`,
      };
    }

    if (!datos.motivo_correccion_km || datos.motivo_correccion_km.trim() === "") {
      return {
        ok: false,
        codigo: "MOTIVO_REQUERIDO",
        error: "Se requiere un motivo obligatorio para corregir el kilometraje a un valor inferior",
      };
    }
  }

  const actualizado: VehiculoRow = {
    ...anterior,
    marca: datos.marca ?? anterior.marca,
    modelo: datos.modelo ?? anterior.modelo,
    tipo: datos.tipo ?? anterior.tipo,
    color: datos.color ?? anterior.color,
    placas: datos.placas ? datos.placas.trim().toUpperCase() : anterior.placas,
    kilometraje_actual:
      datos.kilometraje_actual !== undefined ? datos.kilometraje_actual : anterior.kilometraje_actual,
    valor_asegurado:
      datos.valor_asegurado !== undefined ? BigInt(datos.valor_asegurado) : anterior.valor_asegurado,
    tarifa_dia:
      datos.tarifa_dia !== undefined ? BigInt(datos.tarifa_dia) : anterior.tarifa_dia,
    seguro_nocturno:
      datos.seguro_nocturno !== undefined ? BigInt(datos.seguro_nocturno) : anterior.seguro_nocturno,
    estado: datos.estado ?? anterior.estado,
    categoria_tarifa_id:
      datos.categoria_tarifa_id !== undefined ? datos.categoria_tarifa_id : anterior.categoria_tarifa_id,
    observaciones:
      datos.observaciones !== undefined ? datos.observaciones : anterior.observaciones,
    updated_at: ahora,
  };

  listaVehiculos[index] = actualizado;

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "vehiculos",
    registro_id: id,
    registro_descripcion: `Edición de vehículo clave ${actualizado.clave_formato}${
      datos.motivo_correccion_km ? `. Motivo corrección km: ${datos.motivo_correccion_km}` : ""
    }`,
    valor_anterior: {
      ...anterior,
      valor_asegurado: Number(anterior.valor_asegurado),
      tarifa_dia: Number(anterior.tarifa_dia),
      seguro_nocturno: Number(anterior.seguro_nocturno),
    },
    valor_nuevo: {
      ...actualizado,
      valor_asegurado: Number(actualizado.valor_asegurado),
      tarifa_dia: Number(actualizado.tarifa_dia),
      seguro_nocturno: Number(actualizado.seguro_nocturno),
    },
  });

  return { ok: true, vehiculo: actualizado };
}

/**
 * Registro de bloqueo por mantenimiento (RF-09, T-22)
 * Rechazado con 409 si cruza con una renta activa en el periodo.
 */
export function registrarBloqueoMantenimiento(
  vehiculoId: string,
  datos: { desde: string; hasta: string; motivo: string },
  autor: { id: string; nombre: string; rol: string }
): { ok: true; bloqueo: BloqueoVehiculoRow } | { ok: false; error: string; codigo: string; contrato_folio?: string } {
  const vehiculo = obtenerVehiculoPorId(vehiculoId);
  if (!vehiculo) {
    return { ok: false, codigo: "VEHICULO_NO_ENCONTRADO", error: "Vehículo no encontrado" };
  }

  const inicioBloqueo = new Date(datos.desde).getTime();
  const finBloqueo = new Date(datos.hasta).getTime();

  if (isNaN(inicioBloqueo) || isNaN(finBloqueo) || finBloqueo <= inicioBloqueo) {
    return {
      ok: false,
      codigo: "RANGO_INVALIDO",
      error: "La fecha 'hasta' debe ser posterior a la fecha 'desde'",
    };
  }

  // Verificar si choca con algún contrato activo en el rango [desde, hasta)
  const contratoConflicto = listaContratosRangos.find((c) => {
    if (c.vehiculo_id !== vehiculoId && c.vehiculo2_id !== vehiculoId) return false;
    if (c.estado === "borrador" || c.estado === "cancelado" || c.estado === "concluido") {
      return false;
    }
    const contratoSalida = new Date(c.salida_en).getTime();
    const contratoEntrada = new Date(c.entrada_prevista_en).getTime();

    // Intersección de rangos semiabiertos [A, B) y [C, D) : max(A, C) < min(B, D)
    return Math.max(inicioBloqueo, contratoSalida) < Math.min(finBloqueo, contratoEntrada);
  });

  if (contratoConflicto) {
    return {
      ok: false,
      codigo: "CRUCE_CONTRATO_EXISTENTE",
      contrato_folio: contratoConflicto.folio,
      error: `No se puede bloquear el vehículo: existe el contrato activo ${contratoConflicto.folio} en ese periodo`,
    };
  }

  const nuevoBloqueo: BloqueoVehiculoRow = {
    id: crypto.randomUUID(),
    vehiculo_id: vehiculoId,
    desde: datos.desde,
    hasta: datos.hasta,
    motivo: datos.motivo.trim(),
    created_at: new Date().toISOString(),
    created_by: autor.id,
  };

  listaBloqueos.unshift(nuevoBloqueo);

  // Actualizar estado del vehículo si el bloqueo está activo hoy
  const hoyMs = Date.now();
  if (hoyMs >= inicioBloqueo && hoyMs <= finBloqueo && vehiculo.estado === "disponible") {
    vehiculo.estado = "mantenimiento";
  }

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "bloqueos_vehiculo",
    registro_id: nuevoBloqueo.id,
    registro_descripcion: `Bloqueo por mantenimiento para vehículo clave ${vehiculo.clave_formato}: ${datos.motivo}`,
    valor_anterior: null,
    valor_nuevo: { ...nuevoBloqueo },
  });

  return { ok: true, bloqueo: nuevoBloqueo };
}

/**
 * Registro de documento del vehículo (Tarjeta de circulación o Póliza) (RF-08)
 */
export function registrarDocumentoVehiculo(
  vehiculoId: string,
  datos: {
    tipo: "tarjeta_circulacion" | "poliza";
    numero?: string;
    expedido_en?: string;
    fecha_expedicion?: string;
    fecha_vencimiento?: string;
    aseguradora?: string;
    agente?: string;
    agente_contacto?: string;
    archivos?: Array<{ tipo: string; path: string }>;
    observaciones?: string;
  },
  autor: { id: string; nombre: string; rol: string }
): DocumentoVehiculoRow {
  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();
  const hoyStr = ahora.split("T")[0]!;
  const esVigente = datos.fecha_vencimiento ? datos.fecha_vencimiento >= hoyStr : true;

  const doc: DocumentoVehiculoRow = {
    id,
    vehiculo_id: vehiculoId,
    tipo: datos.tipo,
    numero: datos.numero ?? null,
    expedido_en: datos.expedido_en ?? null,
    fecha_expedicion: datos.fecha_expedicion ?? null,
    fecha_vencimiento: datos.fecha_vencimiento ?? null,
    aseguradora: datos.aseguradora ?? null,
    agente: datos.agente ?? null,
    agente_contacto: datos.agente_contacto ?? null,
    archivos: datos.archivos ?? [],
    vigente: esVigente,
    observaciones: datos.observaciones ?? null,
    created_at: ahora,
  };

  // Reemplazar o agregar el documento
  const index = listaDocumentosVehiculos.findIndex(
    (d) => d.vehiculo_id === vehiculoId && d.tipo === datos.tipo
  );
  if (index !== -1) {
    listaDocumentosVehiculos[index] = doc;
  } else {
    listaDocumentosVehiculos.unshift(doc);
  }

  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "INSERT",
    tabla: "documentos",
    registro_id: id,
    registro_descripcion: `Actualización de ${datos.tipo === "tarjeta_circulacion" ? "Tarjeta de Circulación" : "Póliza de Seguro"} para vehículo`,
    valor_anterior: null,
    valor_nuevo: { ...doc },
  });

  if (esVigente) {
    marcarAlertasComoAtendidas(doc.id, { id: autor.id, nombre: autor.nombre }, {
      entidadId: vehiculoId,
      tipoDocumento: datos.tipo,
    });
  }

  return doc;
}

/**
 * Calcula vehículos disponibles y no disponibles con motivo de exclusión en un rango [salida, entrada) (RF-09, S04-T07)
 */
export function calcularDisponibilidad(
  salidaIso: string,
  entradaIso: string
): {
  disponibles: VehiculoRow[];
  no_disponibles: Array<{
    vehiculo: VehiculoRow;
    motivo: "rentado" | "mantenimiento" | "documentos_vencidos" | "baja";
    detalle?: string;
  }>;
} {
  const inicioMs = new Date(salidaIso).getTime();
  const finMs = new Date(entradaIso).getTime();

  if (isNaN(inicioMs) || isNaN(finMs) || finMs <= inicioMs) {
    throw new Error("Rango de fechas inválido");
  }

  const salidaDateStr = salidaIso.split("T")[0]!;
  const entradaDateStr = entradaIso.split("T")[0]!;

  const disponibles: VehiculoRow[] = [];
  const no_disponibles: Array<{
    vehiculo: VehiculoRow;
    motivo: "rentado" | "mantenimiento" | "documentos_vencidos" | "baja";
    detalle?: string;
  }> = [];

  const vehiculosActivos = listaVehiculos.filter((v) => !v.deleted_at);

  for (const vehiculo of vehiculosActivos) {
    // 1. Si está dado de baja
    if (vehiculo.estado === "baja") {
      no_disponibles.push({
        vehiculo,
        motivo: "baja",
        detalle: "Unidad dada de baja definitiva",
      });
      continue;
    }

    // 2. Revisar si choca con contrato activo
    const contratoConflicto = listaContratosRangos.find((c) => {
      if (c.vehiculo_id !== vehiculo.id && c.vehiculo2_id !== vehiculo.id) return false;
      if (c.estado === "borrador" || c.estado === "cancelado" || c.estado === "concluido") {
        return false;
      }
      const cSalida = new Date(c.salida_en).getTime();
      const cEntrada = new Date(c.entrada_prevista_en).getTime();
      // Cruce en rangos semiabiertos [A, B) y [C, D)
      return Math.max(inicioMs, cSalida) < Math.min(finMs, cEntrada);
    });

    if (contratoConflicto) {
      no_disponibles.push({
        vehiculo,
        motivo: "rentado",
        detalle: `Rentado en contrato ${contratoConflicto.folio} (${contratoConflicto.salida_en.slice(0, 10)} al ${contratoConflicto.entrada_prevista_en.slice(0, 10)})`,
      });
      continue;
    }

    // 3. Revisar si choca con bloqueo de mantenimiento
    const bloqueoConflicto = listaBloqueos.find((b) => {
      if (b.vehiculo_id !== vehiculo.id) return false;
      const bDesde = new Date(b.desde).getTime();
      const bHasta = new Date(b.hasta).getTime();
      return Math.max(inicioMs, bDesde) < Math.min(finMs, bHasta);
    });

    if (bloqueoConflicto) {
      no_disponibles.push({
        vehiculo,
        motivo: "mantenimiento",
        detalle: `En mantenimiento: ${bloqueoConflicto.motivo}`,
      });
      continue;
    }

    // 4. Revisar si los documentos están vigentes DURANTE TODO el periodo solicitado
    const docs = listaDocumentosVehiculos.filter((d) => d.vehiculo_id === vehiculo.id);
    const tarjeta = docs.find((d) => d.tipo === "tarjeta_circulacion");
    const poliza = docs.find((d) => d.tipo === "poliza");

    let docVencidoMotivo: string | null = null;

    if (!tarjeta) {
      docVencidoMotivo = "Sin tarjeta de circulación registrada";
    } else if (!tarjeta.fecha_vencimiento || tarjeta.fecha_vencimiento < entradaDateStr) {
      docVencidoMotivo = `Tarjeta de circulación vencida o vence antes del término (${tarjeta.fecha_vencimiento ?? "s/f"})`;
    } else if (!poliza) {
      docVencidoMotivo = "Sin póliza de seguro registrada";
    } else if (!poliza.fecha_vencimiento || poliza.fecha_vencimiento < entradaDateStr) {
      docVencidoMotivo = `Póliza de seguro vencida o vence antes del término (${poliza.fecha_vencimiento ?? "s/f"})`;
    }

    if (docVencidoMotivo) {
      no_disponibles.push({
        vehiculo,
        motivo: "documentos_vencidos",
        detalle: docVencidoMotivo,
      });
      continue;
    }

    // Si pasa todas las validaciones, está disponible
    disponibles.push(vehiculo);
  }

  return { disponibles, no_disponibles };
}

/**
 * Operación atómica de reserva / emisión para prueba de concurrencia (RF-09, T-20, T-21)
 * Simula la restricción EXCLUDE USING gist (vehiculo_id WITH =, rango WITH &&)
 */
export async function intentarReservarVehiculo(
  vehiculoId: string,
  salidaIso: string,
  entradaIso: string,
  folio: string
): Promise<{ ok: true; contrato: ContratoRangoRow } | { ok: false; codigo: string; error: string }> {
  const inicioMs = new Date(salidaIso).getTime();
  const finMs = new Date(entradaIso).getTime();

  if (isNaN(inicioMs) || isNaN(finMs) || finMs <= inicioMs) {
    return { ok: false, codigo: "FECHAS_INVALIDAS", error: "Rango de fechas inválido" };
  }

  // Verificación atómica contra contratos existentes
  const conflicto = listaContratosRangos.find((c) => {
    if (c.vehiculo_id !== vehiculoId && c.vehiculo2_id !== vehiculoId) return false;
    if (c.estado === "borrador" || c.estado === "cancelado" || c.estado === "concluido") {
      return false;
    }
    const cSalida = new Date(c.salida_en).getTime();
    const cEntrada = new Date(c.entrada_prevista_en).getTime();
    // En exclusión gist con [), [11:00, 14:00) y [14:00, 17:00) no chocan (cierre tocante permitido T-21)
    return Math.max(inicioMs, cSalida) < Math.min(finMs, cEntrada);
  });

  if (conflicto) {
    return {
      ok: false,
      codigo: "VEHICULO_NO_DISPONIBLE",
      error: `Conflicto de exclusión GiST: El vehículo ya cuenta con una reserva activa (${conflicto.folio}) que se cruza con las fechas seleccionadas`,
    };
  }

  const nuevoContrato: ContratoRangoRow = {
    id: crypto.randomUUID(),
    folio,
    vehiculo_id: vehiculoId,
    estado: "vigente",
    salida_en: salidaIso,
    entrada_prevista_en: entradaIso,
  };

  listaContratosRangos.push(nuevoContrato);

  return { ok: true, contrato: nuevoContrato };
}
