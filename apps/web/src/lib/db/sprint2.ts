/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:26:00Z
 * @agent_roles engineering-backend-architect + engineering-database-optimizer
 * @vision_command start_sprint --sprint 2
 * @sprint_number 2
 * @task_id S02-T01, S02-T04
 */

export interface TarifaRow {
  id: string;
  nombre: string;
  tarifa_dia: number; // Centavos enteros
  seguro_nocturno: number; // Centavos
  cuota_proteccion: number; // Centavos
  vigente_desde: string;
  created_at: string;
  created_by: string | null;
}

export interface ParametrosGlobales {
  km_por_dia: number;
  divisor_hora_extra: number;
  hora_desde_la_que_se_cobra_dia: number;
  tolerancia_minutos: number;
  redondeo_hora_extra: "redondear" | "truncar";
  deducible_pct: number;
  deducible_cristales_pct: number;
  cancelacion_pct: number;
  cancelacion_horas_total: number;
  dias_alerta_vigencia: number[];
  inactividad_sesion_min: number;
  profeco_registro_numero: string;
  profeco_registro_fecha: string;
  jurisdiccion_ciudad: string;
  telefono_fallas: string;
}

export interface EntradaAuditoriaRow {
  id: number;
  ocurrido_en: string;
  usuario_id: string | null;
  usuario_nombre: string;
  accion: "INSERT" | "UPDATE" | "DELETE" | "SELECT_SENSIBLE" | "EXPORT";
  tabla: string;
  registro_id: string | null;
  registro_descripcion?: string;
  valor_anterior: Record<string, unknown> | null;
  valor_nuevo: Record<string, unknown> | null;
}

const TARIFAS_SEMILLA: TarifaRow[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    nombre: "Hyundai Elantra",
    tarifa_dia: 163_300,
    seguro_nocturno: 40_000,
    cuota_proteccion: 25_000,
    vigente_desde: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    nombre: "Kia Forte",
    tarifa_dia: 163_300,
    seguro_nocturno: 40_000,
    cuota_proteccion: 25_000,
    vigente_desde: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    nombre: "Nissan Altima",
    tarifa_dia: 163_300,
    seguro_nocturno: 45_000,
    cuota_proteccion: 25_000,
    vigente_desde: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
  },
  {
    id: "22222222-2222-4222-8222-222222222204",
    nombre: "Mazda 3",
    tarifa_dia: 163_300,
    seguro_nocturno: 40_000,
    cuota_proteccion: 25_000,
    vigente_desde: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
  },
  {
    id: "22222222-2222-4222-8222-222222222205",
    nombre: "Honda CR-V",
    tarifa_dia: 221_600,
    seguro_nocturno: 70_000,
    cuota_proteccion: 40_000,
    vigente_desde: "2026-05-01T00:00:00Z",
    created_at: "2026-05-01T00:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
  },
];

const PARAMETROS_SEMILLA: ParametrosGlobales = {
  km_por_dia: 500,
  divisor_hora_extra: 8,
  hora_desde_la_que_se_cobra_dia: 5,
  tolerancia_minutos: 0,
  redondeo_hora_extra: "redondear",
  deducible_pct: 30,
  deducible_cristales_pct: 20,
  cancelacion_pct: 20,
  cancelacion_horas_total: 24,
  dias_alerta_vigencia: [30, 15, 7, 0],
  inactividad_sesion_min: 30,
  profeco_registro_numero: "",
  profeco_registro_fecha: "",
  jurisdiccion_ciudad: "Mexicali, Baja California",
  telefono_fallas: "",
};

const BITACORA_INICIAL: EntradaAuditoriaRow[] = [
  {
    id: 1,
    ocurrido_en: "2026-11-16T13:20:00Z",
    usuario_id: null,
    usuario_nombre: "Sistema",
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: "00000000-0000-4000-8000-000000008155",
    registro_descripcion: "Contrato 08155 (estado: vigente → rezagado)",
    valor_anterior: { estado: "vigente" },
    valor_nuevo: { estado: "rezagado" },
  },
  {
    id: 2,
    ocurrido_en: "2026-11-16T12:41:00Z",
    usuario_id: "11111111-1111-4111-8111-111111111102",
    usuario_nombre: "Haaron G.",
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: "00000000-0000-4000-8000-000000000002",
    registro_descripcion: "Contrato D-00002 (tarifa pactada: $1,633 → $1,500 · motivo: cliente frecuente)",
    valor_anterior: { tarifa_dia: 163300 },
    valor_nuevo: { tarifa_dia: 150000, tarifa_motivo: "cliente frecuente" },
  },
  {
    id: 3,
    ocurrido_en: "2026-11-16T11:05:00Z",
    usuario_id: "11111111-1111-4111-8111-111111111101",
    usuario_nombre: "Mariana R.",
    accion: "SELECT_SENSIBLE",
    tabla: "documentos",
    registro_id: "33333333-3333-4333-8333-333333333301",
    registro_descripcion: "Licencia de Ricardo Medina (consultó el archivo del documento - dato sensible)",
    valor_anterior: null,
    valor_nuevo: { documento_tipo: "licencia", cliente: "Ricardo Medina" },
  },
  {
    id: 4,
    ocurrido_en: "2026-11-16T10:58:00Z",
    usuario_id: "11111111-1111-4111-8111-111111111101",
    usuario_nombre: "Mariana R.",
    accion: "INSERT",
    tabla: "evidencias",
    registro_id: "44444444-4444-4444-8444-444444444401",
    registro_descripcion: "Fotos de entrega · 08158 (6 fotos y 1 video · kilometraje 72,640 km)",
    valor_anterior: null,
    valor_nuevo: { contrato_folio: "08158", fotos: 6, video: 1, km: 72640 },
  },
  {
    id: 5,
    ocurrido_en: "2026-11-16T09:12:00Z",
    usuario_id: "11111111-1111-4111-8111-111111111102",
    usuario_nombre: "Haaron G.",
    accion: "EXPORT",
    tabla: "clientes",
    registro_id: null,
    registro_descripcion: "Clientes · CSV (127 filas · filtro: todos)",
    valor_anterior: null,
    valor_nuevo: { entidad: "clientes", filas: 127 },
  },
  {
    id: 6,
    ocurrido_en: "2026-11-13T17:41:00Z",
    usuario_id: "11111111-1111-4111-8111-111111111101",
    usuario_nombre: "Mariana R.",
    accion: "UPDATE",
    tabla: "vehiculos",
    registro_id: "55555555-5555-4555-8555-555555555501",
    registro_descripcion: "Vehículo Mazda 3 (kilometraje: 31,480 → 33,120 en recepción)",
    valor_anterior: { kilometraje: 31480 },
    valor_nuevo: { kilometraje: 33120 },
  },
];

let listaTarifas = [...TARIFAS_SEMILLA];
let parametrosEstado: ParametrosGlobales = { ...PARAMETROS_SEMILLA };
const bitacoraInmutable: EntradaAuditoriaRow[] = [...BITACORA_INICIAL];

export function resetearEstadoSprint2(): void {
  listaTarifas = [...TARIFAS_SEMILLA];
  parametrosEstado = { ...PARAMETROS_SEMILLA };
  bitacoraInmutable.length = 0;
  for (const b of BITACORA_INICIAL) {
    bitacoraInmutable.push({ ...b });
  }
}

export function obtenerTarifas(): TarifaRow[] {
  return [...listaTarifas];
}

/**
 * Crea una versión de tarifa nueva.
 * Los contratos ya emitidos conservan la tarifa con la que se crearon (RF-03, T-02).
 */
export function crearVersionTarifa(
  datos: {
    nombre: string;
    tarifa_dia: number;
    seguro_nocturno?: number;
    cuota_proteccion?: number;
  },
  autorId: string,
  autorNombre: string,
): TarifaRow {
  const nueva: TarifaRow = {
    id: crypto.randomUUID(),
    nombre: datos.nombre,
    tarifa_dia: datos.tarifa_dia,
    seguro_nocturno: datos.seguro_nocturno ?? 40_000,
    cuota_proteccion: datos.cuota_proteccion ?? 25_000,
    vigente_desde: new Date().toISOString(),
    created_at: new Date().toISOString(),
    created_by: autorId,
  };

  listaTarifas.unshift(nueva);

  // Registro en bitácora inmutable
  registrarAuditoria({
    usuario_id: autorId,
    usuario_nombre: autorNombre,
    accion: "INSERT",
    tabla: "tarifas",
    registro_id: nueva.id,
    registro_descripcion: `Nueva versión de tarifa para ${nueva.nombre} ($${Math.round(nueva.tarifa_dia / 100)}/día)`,
    valor_anterior: null,
    valor_nuevo: { ...nueva },
  });

  return nueva;
}

export function obtenerParametros(): ParametrosGlobales {
  return { ...parametrosEstado };
}

export function actualizarParametros(
  cambios: Partial<ParametrosGlobales>,
  autorId: string,
  autorNombre: string,
): ParametrosGlobales {
  const valorAnterior = { ...parametrosEstado };
  parametrosEstado = { ...parametrosEstado, ...cambios };

  registrarAuditoria({
    usuario_id: autorId,
    usuario_nombre: autorNombre,
    accion: "UPDATE",
    tabla: "parametros",
    registro_id: null,
    registro_descripcion: `Actualización de parámetros del sistema (${Object.keys(cambios).join(", ")})`,
    valor_anterior: valorAnterior as unknown as Record<string, unknown>,
    valor_nuevo: { ...parametrosEstado } as unknown as Record<string, unknown>,
  });

  return { ...parametrosEstado };
}

export function registrarAuditoria(entrada: {
  usuario_id: string | null;
  usuario_nombre: string;
  accion: "INSERT" | "UPDATE" | "DELETE" | "SELECT_SENSIBLE" | "EXPORT";
  tabla: string;
  registro_id: string | null;
  registro_descripcion?: string;
  valor_anterior?: Record<string, unknown> | null;
  valor_nuevo?: Record<string, unknown> | null;
}): EntradaAuditoriaRow {
  const item: EntradaAuditoriaRow = {
    id: bitacoraInmutable.length + 1,
    ocurrido_en: new Date().toISOString(),
    usuario_id: entrada.usuario_id,
    usuario_nombre: entrada.usuario_nombre,
    accion: entrada.accion,
    tabla: entrada.tabla,
    registro_id: entrada.registro_id,
    registro_descripcion: entrada.registro_descripcion,
    valor_anterior: entrada.valor_anterior ?? null,
    valor_nuevo: entrada.valor_nuevo ?? null,
  };

  bitacoraInmutable.unshift(item);
  return item;
}

export function consultarBitacora(filtros?: {
  tabla?: string;
  usuario_id?: string;
  desde?: string;
  hasta?: string;
  q?: string;
}): EntradaAuditoriaRow[] {
  let res = [...bitacoraInmutable];

  if (filtros?.tabla) {
    res = res.filter((e) => e.tabla.toLowerCase() === filtros.tabla!.toLowerCase());
  }
  if (filtros?.usuario_id) {
    res = res.filter((e) => e.usuario_id === filtros.usuario_id);
  }
  if (filtros?.desde) {
    const tDesde = new Date(filtros.desde).getTime();
    res = res.filter((e) => new Date(e.ocurrido_en).getTime() >= tDesde);
  }
  if (filtros?.hasta) {
    const tHasta = new Date(filtros.hasta).getTime();
    res = res.filter((e) => new Date(e.ocurrido_en).getTime() <= tHasta);
  }
  if (filtros?.q && filtros.q.trim().length > 0 && filtros.q !== "Todos") {
    const term = filtros.q.toLowerCase();
    res = res.filter(
      (e) =>
        e.tabla.toLowerCase().includes(term) ||
        (e.registro_descripcion && e.registro_descripcion.toLowerCase().includes(term)) ||
        e.usuario_nombre.toLowerCase().includes(term),
    );
  }

  return res;
}

/**
 * T-03: Rechazo tajante de UPDATE o DELETE sobre la tabla auditoria para cualquier rol.
 */
export function intentarModificarAuditoria(): never {
  throw new Error("ACCION_PROHIBIDA: La tabla auditoria es inmutable (solo agregado). No se permite UPDATE ni DELETE para ningún rol.");
}
