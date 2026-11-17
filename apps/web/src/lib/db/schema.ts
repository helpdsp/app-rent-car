/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:06:00Z
 * @agent_roles engineering-backend-architect + engineering-database-optimizer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T02
 */

/**
 * Esquema base de base de datos (Drizzle / Postgres) — Sprint 1 (RF-01).
 * Define las extensiones requeridas, los 12 enums del modelo de datos,
 * las secuencias de folios/consecutivos y la tabla `usuarios`.
 */

export const PG_EXTENSIONS = [
  "pgcrypto",
  "citext",
  "pg_trgm",
  "btree_gist",
] as const;

export const PG_SEQUENCES = {
  seq_folio_contrato: {
    name: "seq_folio_contrato",
    startWith: 1,
    incrementBy: 1,
    prefix: "D-",
    padLength: 5,
  },
  seq_numero_cliente: {
    name: "seq_numero_cliente",
    startWith: 1,
    incrementBy: 1,
  },
  seq_clave_auto: {
    name: "seq_clave_auto",
    startWith: 1,
    incrementBy: 1,
  },
  seq_recibo: {
    name: "seq_recibo",
    startWith: 1,
    incrementBy: 1,
  },
} as const;

export const ROL_USUARIO_VALUES = [
  "operador",
  "administrador",
  "titular",
] as const;
export type RolUsuario = (typeof ROL_USUARIO_VALUES)[number];

export const ESTADO_CONTRATO_VALUES = [
  "borrador",
  "por_firmar",
  "vigente",
  "por_vencer",
  "rezagado",
  "recibido",
  "concluido",
  "cancelado",
  "en_incidente",
] as const;
export type EstadoContrato = (typeof ESTADO_CONTRATO_VALUES)[number];

export const TIPO_DOCUMENTO_VALUES = [
  "credencial",
  "licencia",
  "tarjeta_circulacion",
  "poliza",
  "constancia_fiscal",
  "permiso_salida_pais",
  "otro",
] as const;
export type TipoDocumento = (typeof TIPO_DOCUMENTO_VALUES)[number];

export const ESTADO_VEHICULO_VALUES = [
  "disponible",
  "rentado",
  "mantenimiento",
  "baja",
] as const;
export type EstadoVehiculo = (typeof ESTADO_VEHICULO_VALUES)[number];

export const TIPO_GARANTIA_VALUES = [
  "efectivo",
  "tarjeta_credito",
  "visa_laser",
] as const;
export type TipoGarantia = (typeof TIPO_GARANTIA_VALUES)[number];

export const FORMA_PAGO_VALUES = [
  "efectivo",
  "tarjeta_debito",
  "tarjeta_credito",
  "transferencia_deposito",
] as const;
export type FormaPago = (typeof FORMA_PAGO_VALUES)[number];

export const ANGULO_EVIDENCIA_VALUES = [
  "frente",
  "atras",
  "izquierda",
  "derecha",
  "tablero_km",
  "interior",
  "video",
  "otro",
] as const;
export type AnguloEvidencia = (typeof ANGULO_EVIDENCIA_VALUES)[number];

export const TIPO_PAGO_VALUES = [
  "anticipo",
  "deposito_garantia",
  "pago_saldo",
  "devolucion_deposito",
  "aplicacion_deposito",
] as const;
export type TipoPago = (typeof TIPO_PAGO_VALUES)[number];

export const MOMENTO_EVIDENCIA_VALUES = [
  "entrega",
  "recepcion",
  "incidente",
] as const;
export type MomentoEvidencia = (typeof MOMENTO_EVIDENCIA_VALUES)[number];

export const TIPO_INCIDENTE_VALUES = [
  "accidente",
  "robo",
  "falla_mecanica",
  "perdida_llaves",
  "retencion_indebida",
  "otro",
] as const;
export type TipoIncidente = (typeof TIPO_INCIDENTE_VALUES)[number];

export const ESTADO_ALERTA_VALUES = [
  "pendiente",
  "enviada",
  "atendida",
  "error",
] as const;
export type EstadoAlerta = (typeof ESTADO_ALERTA_VALUES)[number];

export const TIPO_CARGO_VALUES = [
  "renta_base",
  "retraso",
  "km_excedente",
  "seguro_nocturno",
  "gasolina",
  "limpieza",
  "quemaduras",
  "multa",
  "traslado",
  "penalizacion",
  "pena_convencional",
  "cuota_proteccion",
  "faltante",
  "otro",
  "bonificacion",
] as const;
export type TipoCargo = (typeof TIPO_CARGO_VALUES)[number];

export const DB_ENUMS = {
  rol_usuario: ROL_USUARIO_VALUES,
  estado_contrato: ESTADO_CONTRATO_VALUES,
  tipo_documento: TIPO_DOCUMENTO_VALUES,
  estado_vehiculo: ESTADO_VEHICULO_VALUES,
  tipo_garantia: TIPO_GARANTIA_VALUES,
  forma_pago: FORMA_PAGO_VALUES,
  angulo_evidencia: ANGULO_EVIDENCIA_VALUES,
  tipo_pago: TIPO_PAGO_VALUES,
  momento_evidencia: MOMENTO_EVIDENCIA_VALUES,
  tipo_incidente: TIPO_INCIDENTE_VALUES,
  estado_alerta: ESTADO_ALERTA_VALUES,
  tipo_cargo: TIPO_CARGO_VALUES,
} as const;

export interface UsuarioRow {
  id: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo: boolean;
  mfa_activo: boolean;
  ultimo_acceso_en: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface NuevoUsuarioRow {
  id?: string;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo?: boolean;
  mfa_activo?: boolean;
  created_by?: string | null;
}

/**
 * Metadatos de la tabla `usuarios` para Drizzle / consultas SQL parametrizadas.
 * Nota: Un usuario desactivado (`activo = false`) NO se elimina nunca;
 * conserva su fila y su autoría en `auditoria` y registros históricos (RF-01).
 */
export const usuariosTable = {
  tableName: "usuarios" as const,
  columns: {
    id: { name: "id", type: "uuid", primaryKey: true, references: "auth.users(id)" },
    nombre: { name: "nombre", type: "text", notNull: true },
    correo: { name: "correo", type: "citext", notNull: true, unique: true },
    rol: { name: "rol", type: "rol_usuario", notNull: true },
    activo: { name: "activo", type: "boolean", notNull: true, default: true },
    mfa_activo: { name: "mfa_activo", type: "boolean", notNull: true, default: false },
    ultimo_acceso_en: { name: "ultimo_acceso_en", type: "timestamptz", notNull: false },
    created_at: { name: "created_at", type: "timestamptz", notNull: true, default: "now()" },
    updated_at: { name: "updated_at", type: "timestamptz", notNull: true, default: "now()" },
    created_by: { name: "created_by", type: "uuid", notNull: false },
  },
} as const;

/** Formatea un número entero de la secuencia `seq_folio_contrato` como `D-00001`. */
export function formatearFolioDigital(consecutivo: number): string {
  if (!Number.isInteger(consecutivo) || consecutivo < 1) {
    throw new RangeError("El consecutivo de folio debe ser un entero positivo");
  }
  return `D-${String(consecutivo).padStart(5, "0")}`;
}
