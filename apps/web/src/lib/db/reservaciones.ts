/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles engineering-backend-architect + engineering-database-optimizer
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T01, S14-T04
 */

import { registrarAuditoria } from "./sprint2";
import { obtenerVehiculos, type VehiculoRow } from "./sprint4";
import { obtenerClientes, type ClienteRow } from "./sprint3";

export type EstadoReservacion = "pendiente" | "confirmada" | "convertida" | "cancelada";

export interface ReservacionRow {
  id: string;
  folio: string; // ej. R-00001
  cliente_id: string;
  cliente_nombre?: string;
  cliente_telefono?: string;
  vehiculo_id: string;
  vehiculo_descripcion?: string;
  vehiculo_placas?: string;
  fecha_inicio: string; // ISO string
  fecha_fin: string; // ISO string
  lugar_entrega: string;
  lugar_devolucion: string;
  tarifa_dia: bigint; // en centavos
  dias_renta: number;
  anticipo_requerido: bigint; // centavos
  anticipo_pagado: bigint; // centavos
  deposito_garantia: bigint; // centavos ($8,000 MXN)
  estado: EstadoReservacion;
  contrato_id: string | null;
  motivo_cancelacion: string | null;
  observaciones: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

// Semillado inicial en memoria para desarrollo y pruebas
let secuenciaFolio = 3;

const RESERVACIONES_MEMORIA: ReservacionRow[] = [
  {
    id: "res-00000000-0000-0000-0000-000000000001",
    folio: "R-00001",
    cliente_id: "22222222-2222-4222-8222-222222222001",
    cliente_nombre: "Héctor García Murillo",
    cliente_telefono: "(686) 244-1189",
    vehiculo_id: "44444444-4444-4444-8444-444444444003",
    vehiculo_descripcion: "Hyundai Elantra (Azul)",
    vehiculo_placas: "ATU-703-A",
    fecha_inicio: new Date(Date.now() + 86400000 * 2).toISOString(), // En 2 días
    fecha_fin: new Date(Date.now() + 86400000 * 5).toISOString(), // Por 3 días
    lugar_entrega: "Sucursal Mexicali",
    lugar_devolucion: "Sucursal Mexicali",
    tarifa_dia: BigInt(163300),
    dias_renta: 3,
    anticipo_requerido: BigInt(489900),
    anticipo_pagado: BigInt(489900),
    deposito_garantia: BigInt(800000),
    estado: "confirmada",
    contrato_id: null,
    motivo_cancelacion: null,
    observaciones: "Cliente solicita entrega limpia para viaje a San Felipe.",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    created_by: "operador-1",
  },
  {
    id: "res-00000000-0000-0000-0000-000000000002",
    folio: "R-00002",
    cliente_id: "22222222-2222-4222-8222-222222222002",
    cliente_nombre: "María Elena Castro",
    cliente_telefono: "(686) 555-8912",
    vehiculo_id: "44444444-4444-4444-8444-444444444004",
    vehiculo_descripcion: "Nissan Altima (Blanco)",
    vehiculo_placas: "BNB-112-B",
    fecha_inicio: new Date(Date.now() + 86400000 * 4).toISOString(),
    fecha_fin: new Date(Date.now() + 86400000 * 6).toISOString(),
    lugar_entrega: "Sucursal Mexicali",
    lugar_devolucion: "Sucursal Mexicali",
    tarifa_dia: BigInt(163300),
    dias_renta: 2,
    anticipo_requerido: BigInt(326600),
    anticipo_pagado: BigInt(0),
    deposito_garantia: BigInt(800000),
    estado: "pendiente",
    contrato_id: null,
    motivo_cancelacion: null,
    observaciones: "Pendiente confirmar comprobante de anticipo.",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    created_by: "operador-1",
  },
];

export function obtenerReservaciones(filtro?: { estado?: string; q?: string }): ReservacionRow[] {
  let resultado = [...RESERVACIONES_MEMORIA];

  if (filtro?.estado && filtro.estado !== "todos") {
    resultado = resultado.filter((r) => r.estado === filtro.estado);
  }

  if (filtro?.q && filtro.q.trim()) {
    const busqueda = filtro.q.toLowerCase().trim();
    resultado = resultado.filter(
      (r) =>
        r.folio.toLowerCase().includes(busqueda) ||
        (r.cliente_nombre && r.cliente_nombre.toLowerCase().includes(busqueda)) ||
        (r.vehiculo_descripcion && r.vehiculo_descripcion.toLowerCase().includes(busqueda)) ||
        (r.vehiculo_placas && r.vehiculo_placas.toLowerCase().includes(busqueda))
    );
  }

  return resultado.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function obtenerReservacionPorId(id: string): ReservacionRow | null {
  return RESERVACIONES_MEMORIA.find((r) => r.id === id) || null;
}

export interface NuevaReservacionInput {
  cliente_id: string;
  vehiculo_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  lugar_entrega?: string;
  lugar_devolucion?: string;
  anticipo_pagado?: bigint;
  observaciones?: string;
}

export function crearReservacion(
  datos: NuevaReservacionInput,
  usuario?: { id: string; nombre: string; rol: string }
): { ok: true; reservacion: ReservacionRow } | { ok: false; error: string; codigo: string } {
  // Validaciones
  const fInicio = new Date(datos.fecha_inicio);
  const fFin = new Date(datos.fecha_fin);

  if (isNaN(fInicio.getTime()) || isNaN(fFin.getTime())) {
    return { ok: false, error: "Fechas no válidas.", codigo: "FECHA_INVALIDA" };
  }

  if (fFin <= fInicio) {
    return { ok: false, error: "La fecha de devolución debe ser posterior a la fecha de inicio.", codigo: "RANGO_INVALIDO" };
  }

  // Comprobar cliente
  const clientes = obtenerClientes();
  const cliente = clientes.find((c) => c.id === datos.cliente_id) || {
    id: datos.cliente_id,
    nombre_completo: "Cliente Mostrador",
    telefono: "(686) 000-0000",
  };

  // Comprobar vehículo
  const vehiculos = obtenerVehiculos();
  const vehiculo = vehiculos.find((v) => v.id === datos.vehiculo_id);
  if (!vehiculo) {
    return { ok: false, error: "El vehículo no existe en el catálogo.", codigo: "VEHICULO_NO_ENCONTRADO" };
  }

  // Verificar solapamiento con otras reservas activas para el mismo auto
  const solapamiento = RESERVACIONES_MEMORIA.some((r) => {
    if (r.vehiculo_id !== vehiculo.id || r.estado === "cancelada") return false;
    const rIni = new Date(r.fecha_inicio).getTime();
    const rFin = new Date(r.fecha_fin).getTime();
    return fInicio.getTime() < rFin && fFin.getTime() > rIni;
  });

  if (solapamiento) {
    return {
      ok: false,
      error: `El vehículo ${vehiculo.marca} ${vehiculo.modelo} ya cuenta con una reservación en ese periodo.`,
      codigo: "VEHICULO_NO_DISPONIBLE",
    };
  }

  // Cálculo de días y anticipo (redondeo de horas para evitar jitter decimal)
  const diffHoras = Math.round((fFin.getTime() - fInicio.getTime()) / (1000 * 60 * 60));
  const diasRenta = Math.max(1, Math.ceil(diffHoras / 24));
  const tarifaDia = vehiculo.tarifa_dia;
  const anticipoRequerido = tarifaDia * BigInt(diasRenta);
  const anticipoPagado = datos.anticipo_pagado || BigInt(0);

  const folioNum = secuenciaFolio++;
  const folio = `R-${String(folioNum).padStart(5, "0")}`;

  const nueva: ReservacionRow = {
    id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    folio,
    cliente_id: cliente.id,
    cliente_nombre: cliente.nombre_completo,
    cliente_telefono: cliente.telefono || undefined,
    vehiculo_id: vehiculo.id,
    vehiculo_descripcion: `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.color})`,
    vehiculo_placas: vehiculo.placas,
    fecha_inicio: datos.fecha_inicio,
    fecha_fin: datos.fecha_fin,
    lugar_entrega: datos.lugar_entrega || "Sucursal Mexicali",
    lugar_devolucion: datos.lugar_devolucion || "Sucursal Mexicali",
    tarifa_dia: tarifaDia,
    dias_renta: diasRenta,
    anticipo_requerido: anticipoRequerido,
    anticipo_pagado: anticipoPagado,
    deposito_garantia: BigInt(800000),
    estado: anticipoPagado >= anticipoRequerido ? "confirmada" : "pendiente",
    contrato_id: null,
    motivo_cancelacion: null,
    observaciones: datos.observaciones || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: usuario?.id || "operador",
  };

  RESERVACIONES_MEMORIA.unshift(nueva);

  registrarAuditoria({
    usuario_id: usuario?.id || "operador-1",
    usuario_nombre: usuario?.nombre || "Operador de Mostrador",
    accion: "INSERT",
    tabla: "reservaciones",
    registro_id: nueva.id,
    registro_descripcion: `Folio ${nueva.folio}`,
    valor_anterior: null,
    valor_nuevo: { operacion: "CREAR_RESERVACION", folio: nueva.folio, cliente: nueva.cliente_nombre, vehiculo: nueva.vehiculo_descripcion },
  });

  return { ok: true, reservacion: nueva };
}

export function cancelarReservacion(
  id: string,
  motivo: string,
  usuario?: { id: string; nombre: string; rol: string }
): { ok: true; reservacion: ReservacionRow } | { ok: false; error: string } {
  const index = RESERVACIONES_MEMORIA.findIndex((r) => r.id === id);
  if (index === -1) return { ok: false, error: "Reservación no encontrada." };

  const r = RESERVACIONES_MEMORIA[index];
  if (r.estado === "convertida") {
    return { ok: false, error: "No se puede cancelar una reservación que ya fue convertida en contrato." };
  }

  r.estado = "cancelada";
  r.motivo_cancelacion = motivo;
  r.updated_at = new Date().toISOString();

  registrarAuditoria({
    usuario_id: usuario?.id || "operador-1",
    usuario_nombre: usuario?.nombre || "Operador de Mostrador",
    accion: "UPDATE",
    tabla: "reservaciones",
    registro_id: r.id,
    registro_descripcion: `Cancelación de ${r.folio}`,
    valor_anterior: { estado: "pendiente" },
    valor_nuevo: { operacion: "CANCELAR_RESERVACION", motivo },
  });

  return { ok: true, reservacion: r };
}

export function convertirReservacionEnContrato(
  id: string,
  usuario?: { id: string; nombre: string; rol: string }
): { ok: true; reservacion: ReservacionRow; contratoId: string; contratoFolio: string } | { ok: false; error: string } {
  const r = obtenerReservacionPorId(id);
  if (!r) return { ok: false, error: "Reservación no encontrada." };

  if (r.estado === "cancelada") {
    return { ok: false, error: "Una reservación cancelada no puede convertirse en contrato." };
  }
  if (r.estado === "convertida") {
    return { ok: false, error: "Esta reservación ya fue convertida a contrato previamente." };
  }

  const contratoFolio = `D-${Date.now().toString().slice(-5)}`;
  const contratoId = `ctr-${Date.now()}`;

  r.estado = "convertida";
  r.contrato_id = contratoId;
  r.updated_at = new Date().toISOString();

  registrarAuditoria({
    usuario_id: usuario?.id || "operador-1",
    usuario_nombre: usuario?.nombre || "Operador de Mostrador",
    accion: "UPDATE",
    tabla: "reservaciones",
    registro_id: r.id,
    registro_descripcion: `Conversión a contrato ${contratoFolio}`,
    valor_anterior: { estado: r.estado },
    valor_nuevo: { operacion: "CONVERTIR_RESERVACION_A_CONTRATO", contratoFolio, contratoId },
  });

  return { ok: true, reservacion: r, contratoId, contratoFolio };
}
