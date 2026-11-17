/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T10:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 9
 * @sprint_number 9
 * @task_id S09-T04, S09-T06
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerVehiculoPorId, actualizarVehiculo } from "../db/sprint4";
import { obtenerContratoPorId, type ContratoCompletoRow } from "./emitir";
import { validarEvidenciasCompletas, obtenerEvidenciasContrato } from "../storage/evidencias";
import { insertarEventoOutbox, type OutboxRow } from "../db/outbox";

export interface DanoDiagrama {
  id: number;
  vista: "frente" | "izquierda" | "derecha" | "atras";
  x: number;
  y: number;
  nota: string;
}

export interface InventarioContratoRow {
  id: string;
  contrato_id: string;
  momento: "entrega" | "recepcion";
  refacciones: boolean;
  gato: boolean;
  herramienta: boolean;
  reflejantes: boolean;
  tapetes: boolean;
  radio: boolean;
  bocinas: boolean;
  cinturones: boolean;
  placas: boolean;
  antena: boolean;
  danos: DanoDiagrama[];
  notas: string | null;
  registrado_por: string;
  created_at: string;
}

// Almacén en memoria de inventario de contratos
const ALMACEN_INVENTARIOS: InventarioContratoRow[] = [];

/**
 * Guarda o actualiza la ficha de inventario y diagrama de daños para un contrato.
 */
export function guardarInventarioContrato(
  contratoId: string,
  momento: "entrega" | "recepcion",
  datos: {
    refacciones?: boolean;
    gato?: boolean;
    herramienta?: boolean;
    reflejantes?: boolean;
    tapetes?: boolean;
    radio?: boolean;
    bocinas?: boolean;
    cinturones?: boolean;
    placas?: boolean;
    antena?: boolean;
    danos?: DanoDiagrama[];
    notas?: string | null;
  },
  autor: { id: string; nombre: string }
): InventarioContratoRow {
  const index = ALMACEN_INVENTARIOS.findIndex(
    (inv) => inv.contrato_id === contratoId && inv.momento === momento
  );

  const ahora = new Date().toISOString();
  if (index !== -1) {
    const actual = ALMACEN_INVENTARIOS[index]!;
    const actualizado: InventarioContratoRow = {
      ...actual,
      refacciones: datos.refacciones ?? actual.refacciones,
      gato: datos.gato ?? actual.gato,
      herramienta: datos.herramienta ?? actual.herramienta,
      reflejantes: datos.reflejantes ?? actual.reflejantes,
      tapetes: datos.tapetes ?? actual.tapetes,
      radio: datos.radio ?? actual.radio,
      bocinas: datos.bocinas ?? actual.bocinas,
      cinturones: datos.cinturones ?? actual.cinturones,
      placas: datos.placas ?? actual.placas,
      antena: datos.antena ?? actual.antena,
      danos: datos.danos ?? actual.danos,
      notas: datos.notas !== undefined ? datos.notas : actual.notas,
    };
    ALMACEN_INVENTARIOS[index] = actualizado;
    return actualizado;
  }

  const nuevo: InventarioContratoRow = {
    id: crypto.randomUUID(),
    contrato_id: contratoId,
    momento,
    refacciones: datos.refacciones ?? true,
    gato: datos.gato ?? true,
    herramienta: datos.herramienta ?? true,
    reflejantes: datos.reflejantes ?? true,
    tapetes: datos.tapetes ?? true,
    radio: datos.radio ?? true,
    bocinas: datos.bocinas ?? true,
    cinturones: datos.cinturones ?? true,
    placas: datos.placas ?? true,
    antena: datos.antena ?? true,
    danos: datos.danos ?? [],
    notas: datos.notas || null,
    registrado_por: autor.id,
    created_at: ahora,
  };

  ALMACEN_INVENTARIOS.push(nuevo);
  return nuevo;
}

/**
 * Obtiene el inventario y daños de un contrato para entrega o recepción.
 */
export function obtenerInventarioContrato(
  contratoId: string,
  momento: "entrega" | "recepcion" = "entrega"
): InventarioContratoRow | undefined {
  return ALMACEN_INVENTARIOS.find(
    (inv) => inv.contrato_id === contratoId && inv.momento === momento
  );
}

export interface CompletarEntregaInput {
  km_salida: number;
  gasolina_salida: number; // 0 a 8 octavos
  inventario?: {
    refacciones?: boolean;
    gato?: boolean;
    herramienta?: boolean;
    reflejantes?: boolean;
    tapetes?: boolean;
    radio?: boolean;
    bocinas?: boolean;
    cinturones?: boolean;
    placas?: boolean;
    antena?: boolean;
    danos?: DanoDiagrama[];
    notas?: string | null;
  };
  autorizacionAdminNota?: string | null;
}

export type CompletarEntregaResultado =
  | {
      ok: true;
      contrato: ContratoCompletoRow;
      inventario: InventarioContratoRow;
      outbox_event: OutboxRow;
    }
  | {
      ok: false;
      codigo: string;
      error: string;
      status: number;
      angulosFaltantes?: string[];
    };

/**
 * Completa el proceso formal de entrega del vehículo (RF-19, T-60, T-61, T-74, T-75, T-82).
 * 1. Verifica los 6 ángulos obligatorios de foto (o excepción de administrador).
 * 2. Valida que el km_salida sea >= kilometraje actual del vehículo.
 * 3. Valida que exista foto de tablero_km y que su km_capturado coincida con km_salida.
 * 4. Guarda inventario de 10 conceptos y diagrama de daños en 4 vistas.
 * 5. Pasa el contrato a 'vigente' y el vehículo a 'rentado'.
 * 6. Registra evento en `outbox` ('vehiculo_entregado') y en `auditoria`.
 */
export function completarEntregaVehiculo(
  contratoId: string,
  datos: CompletarEntregaInput,
  autor: { id: string; nombre: string; rol: string }
): CompletarEntregaResultado {
  const contrato = obtenerContratoPorId(contratoId);
  if (!contrato) {
    return {
      ok: false,
      codigo: "CONTRATO_NO_ENCONTRADO",
      error: "Contrato no encontrado.",
      status: 404,
    };
  }

  // 1. Validación de los 6 ángulos de foto obligatorios (T-74)
  const validacionEvidencias = validarEvidenciasCompletas(
    contratoId,
    "entrega",
    datos.autorizacionAdminNota
  );

  if (!validacionEvidencias.completo) {
    const nombresAmigables: Record<string, string> = {
      frente: "Frente",
      atras: "Atrás",
      izquierda: "Izquierda",
      derecha: "Derecha",
      tablero_km: "Tablero y km",
      interior: "Interior",
    };
    const listaFaltantes = validacionEvidencias.angulosFaltantes.map(
      (a) => nombresAmigables[a] ?? a
    );

    return {
      ok: false,
      codigo: "ANGULOS_EVIDENCIA_INCOMPLETOS",
      error: `Se requieren los 6 ángulos de foto obligatorios para completar la entrega. Faltan: ${listaFaltantes.join(", ")} (T-74).`,
      angulosFaltantes: validacionEvidencias.angulosFaltantes,
      status: 409,
    };
  }

  // 2. Validación del vehículo y kilometraje de salida (T-60)
  const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id);
  if (!vehiculo) {
    return {
      ok: false,
      codigo: "VEHICULO_NO_ENCONTRADO",
      error: "El vehículo asignado al contrato no fue encontrado.",
      status: 404,
    };
  }

  if (datos.km_salida < vehiculo.kilometraje_actual) {
    return {
      ok: false,
      codigo: "KILOMETRAJE_SALIDA_INVALIDO",
      error: `El kilometraje de salida (${datos.km_salida.toLocaleString()} km) no puede ser menor al kilometraje actual del vehículo (${vehiculo.kilometraje_actual.toLocaleString()} km) (T-60).`,
      status: 422,
    };
  }

  // 3. Validación de foto del tablero y kilometraje capturado ligado (T-75)
  // Si no está exento por autorización de administrador
  if (!validacionEvidencias.autorizadoPorExcepcion) {
    const evidencias = obtenerEvidenciasContrato(contratoId, "entrega");
    const fotosTablero = evidencias.filter(
      (e) => e.tipo === "foto" && e.angulo === "tablero_km"
    );

    if (fotosTablero.length === 0) {
      return {
        ok: false,
        codigo: "ODOMETRO_FOTO_REQUERIDA",
        error: "La foto del tablero con el kilometraje capturado es obligatoria para registrar la salida (T-75).",
        status: 422,
      };
    }

    // Tomamos la última foto de tablero tomada (append-only)
    const ultimaFotoTablero = fotosTablero[fotosTablero.length - 1]!;
    if (
      ultimaFotoTablero.km_capturado === null ||
      ultimaFotoTablero.km_capturado === undefined
    ) {
      return {
        ok: false,
        codigo: "ODOMETRO_FOTO_REQUERIDA",
        error: "La foto del tablero no tiene registrado el kilometraje capturado (T-75).",
        status: 422,
      };
    }

    if (ultimaFotoTablero.km_capturado !== datos.km_salida) {
      return {
        ok: false,
        codigo: "KILOMETRAJE_NO_COINCIDE",
        error: `El kilometraje capturado en la foto del tablero (${ultimaFotoTablero.km_capturado.toLocaleString()} km) no coincide con el kilometraje de salida ingresado (${datos.km_salida.toLocaleString()} km) (T-75).`,
        status: 422,
      };
    }
  }

  // 4. Guardar inventario y diagrama de daños
  const inventario = guardarInventarioContrato(
    contratoId,
    "entrega",
    datos.inventario || {},
    autor
  );

  // 5. Transición del contrato a 'vigente' (T-61)
  const estadoAnteriorContrato = contrato.estado;
  contrato.estado = "vigente";
  contrato.km_salida = datos.km_salida;
  contrato.gasolina_salida = datos.gasolina_salida;
  contrato.updated_at = new Date().toISOString();

  // 6. Transición del vehículo a 'rentado' y actualización de odómetro
  actualizarVehiculo(
    vehiculo.id,
    {
      estado: "rentado",
      kilometraje_actual: datos.km_salida,
    },
    autor
  );
  vehiculo.contrato_activo_folio = contrato.folio;

  // 7. Evento en outbox para integraciones desacopladas (T-82, RF-29)
  const outboxEvent = insertarEventoOutbox("vehiculo_entregado", {
    contrato_id: contrato.id,
    folio: contrato.folio,
    vehiculo_id: vehiculo.id,
    cliente_id: contrato.cliente_id,
    km_salida: datos.km_salida,
    gasolina_salida: datos.gasolina_salida,
    autorizado_por_excepcion: validacionEvidencias.autorizadoPorExcepcion,
    entregado_por: autor.id,
    entregado_en: contrato.updated_at,
  });

  // 8. Registro en auditoría
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "UPDATE",
    tabla: "contratos",
    registro_id: contrato.id,
    registro_descripcion: `Entrega formal de vehículo completada para contrato ${contrato.folio}. Estado cambió a 'vigente'. Km salida: ${datos.km_salida}, Gasolina: ${datos.gasolina_salida}/8.`,
    valor_anterior: {
      estado: estadoAnteriorContrato,
      km_salida: null,
      gasolina_salida: null,
    },
    valor_nuevo: {
      estado: "vigente",
      km_salida: datos.km_salida,
      gasolina_salida: datos.gasolina_salida,
      vehiculo_estado: "rentado",
    },
  });

  return {
    ok: true,
    contrato,
    inventario,
    outbox_event: outboxEvent,
  };
}

/**
 * Resetea el almacén de inventarios para pruebas unitarias.
 */
export function resetearEstadoInventarios(): void {
  ALMACEN_INVENTARIOS.length = 0;
}
