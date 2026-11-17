/**
 * @generated_by_model gemini-3.8-flash
 * @generated_at 2026-11-17T05:36:00Z
 * @agent_roles engineering-backend-architect + engineering-database-optimizer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id S03-T01, S03-T02, S03-T04, S03-T07
 */

import { registrarAuditoria } from "./sprint2";

export interface ClienteRow {
  id: string;
  numero_cliente: number;
  nombre_completo: string;
  identificacion_numero: string;
  domicilio: string | null;
  ciudad: string | null;
  estado: string | null;
  telefono: string | null;
  celular: string | null;
  correo: string | null;
  requiere_factura: boolean;
  razon_social: string | null;
  rfc: string | null;
  domicilio_fiscal: string | null;
  regimen_fiscal: string | null;
  aviso_privacidad_version: string | null;
  aviso_privacidad_aceptado_en: string | null;
  ghl_contact_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  deleted_at: string | null;
}

export interface DocumentoRow {
  id: string;
  tipo: "credencial" | "licencia" | "tarjeta_circulacion" | "poliza" | "constancia_fiscal" | "permiso_salida_pais" | "otro";
  cliente_id: string | null;
  vehiculo_id: string | null;
  contrato_id: string | null;
  numero: string | null;
  tipo_licencia: string | null;
  expedido_en: string | null;
  fecha_expedicion: string | null;
  fecha_vencimiento: string | null;
  archivos: Array<{ tipo: string; path: string }>;
  vigente: boolean;
  observaciones: string | null;
  created_at: string;
}

export interface HistorialRentaCliente {
  contrato_folio: string;
  vehiculo_modelo: string;
  dias: number;
  kilometros: string;
  estado: string;
  total: number;
}

const CLIENTES_SEMILLA: ClienteRow[] = [
  {
    id: "12700000-0000-4000-8000-000000000127",
    numero_cliente: 127,
    nombre_completo: "Ricardo Medina Salazar",
    identificacion_numero: "B2302042880",
    domicilio: "Av. Reforma 1125, Col. Nueva, C.P. 21100",
    ciudad: "Mexicali",
    estado: "B.C.",
    telefono: "6865550100",
    celular: "6865550142",
    correo: "ricardo.medina@correo.mx",
    requiere_factura: false,
    razon_social: null,
    rfc: null,
    domicilio_fiscal: null,
    regimen_fiscal: null,
    aviso_privacidad_version: "2026.1",
    aviso_privacidad_aceptado_en: "2026-11-16T10:00:00Z",
    ghl_contact_id: null,
    created_at: "2026-11-16T10:00:00Z",
    updated_at: "2026-11-16T10:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111101",
    deleted_at: null,
  },
  {
    id: "12800000-0000-4000-8000-000000000128",
    numero_cliente: 128,
    nombre_completo: "Ana Sofía Gastélum",
    identificacion_numero: "IFE-99882211",
    domicilio: "Calzada Justo Sierra 450",
    ciudad: "Mexicali",
    estado: "B.C.",
    telefono: "6865559898",
    celular: "6865553344",
    correo: "ana.gastelum@correo.mx",
    requiere_factura: true,
    razon_social: "Gastelum Soluciones SC",
    rfc: "GAS900101XYZ",
    domicilio_fiscal: "Calzada Justo Sierra 450",
    regimen_fiscal: "Personas Morales",
    aviso_privacidad_version: "2026.1",
    aviso_privacidad_aceptado_en: "2026-11-10T12:00:00Z",
    ghl_contact_id: null,
    created_at: "2026-11-10T12:00:00Z",
    updated_at: "2026-11-10T12:00:00Z",
    created_by: "11111111-1111-4111-8111-111111111102",
    deleted_at: null,
  },
];

const DOCUMENTOS_SEMILLA: DocumentoRow[] = [
  {
    id: "33333333-3333-4333-8333-333333333301",
    tipo: "licencia",
    cliente_id: "12700000-0000-4000-8000-000000000127",
    vehiculo_id: null,
    contrato_id: null,
    numero: "B2302042880",
    tipo_licencia: "A",
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2023-05-27",
    fecha_vencimiento: "2028-05-27",
    archivos: [
      { tipo: "frente", path: "documentos/clientes/127/licencia_frente.jpg" },
      { tipo: "reverso", path: "documentos/clientes/127/licencia_reverso.jpg" },
    ],
    vigente: true,
    observaciones: "Licencia de chofer particular vigente",
    created_at: "2026-11-16T10:05:00Z",
  },
  {
    id: "33333333-3333-4333-8333-333333333302",
    tipo: "credencial",
    cliente_id: "12700000-0000-4000-8000-000000000127",
    vehiculo_id: null,
    contrato_id: null,
    numero: "INE-88231023",
    tipo_licencia: null,
    expedido_en: "Mexicali, B.C.",
    fecha_expedicion: "2016-11-20",
    fecha_vencimiento: "2026-11-23", // vence en 7 días
    archivos: [
      { tipo: "frente", path: "documentos/clientes/127/ine_frente.jpg" },
      { tipo: "reverso", path: "documentos/clientes/127/ine_reverso.jpg" },
    ],
    vigente: true,
    observaciones: null,
    created_at: "2026-11-16T10:05:00Z",
  },
];

const HISTORIAL_RENTAS_MEDINA: HistorialRentaCliente[] = [
  {
    contrato_folio: "08160",
    vehiculo_modelo: "Kia Forte",
    dias: 3,
    kilometros: "En curso",
    estado: "En renta",
    total: 489_900,
  },
  {
    contrato_folio: "08102",
    vehiculo_modelo: "Nissan Altima",
    dias: 2,
    kilometros: "412 km",
    estado: "Concluido",
    total: 326_600,
  },
];

let listaClientes: ClienteRow[] = [...CLIENTES_SEMILLA];
let listaDocumentos: DocumentoRow[] = [...DOCUMENTOS_SEMILLA];

export function resetearEstadoClientes(): void {
  listaClientes = [...CLIENTES_SEMILLA];
  listaDocumentos = [...DOCUMENTOS_SEMILLA];
}

export function guardarClienteDirecto(cliente: ClienteRow): void {
  const idx = listaClientes.findIndex((c) => c.id === cliente.id);
  if (idx >= 0) {
    listaClientes[idx] = { ...listaClientes[idx], ...cliente };
  } else {
    listaClientes.unshift(cliente);
  }
}

export function obtenerClientes(q?: string): ClienteRow[] {
  if (!q || q.trim() === "" || q === "Todos") {
    return listaClientes.filter((c) => !c.deleted_at);
  }
  const term = q.trim().toLowerCase();
  return listaClientes.filter((c) => {
    if (c.deleted_at) return false;
    return (
      c.nombre_completo.toLowerCase().includes(term) ||
      c.identificacion_numero.toLowerCase().includes(term) ||
      String(c.numero_cliente).includes(term) ||
      (c.telefono && c.telefono.includes(term)) ||
      (c.celular && c.celular.includes(term)) ||
      (c.rfc && c.rfc.toLowerCase().includes(term))
    );
  });
}

export function obtenerClientePorId(id: string): ClienteRow | undefined {
  return listaClientes.find((c) => c.id === id && !c.deleted_at);
}

export function obtenerDocumentosPorCliente(clienteId: string): DocumentoRow[] {
  return listaDocumentos.filter((d) => d.cliente_id === clienteId);
}

export function obtenerHistorialPorCliente(clienteId: string): HistorialRentaCliente[] {
  if (clienteId === "12700000-0000-4000-8000-000000000127") {
    return [...HISTORIAL_RENTAS_MEDINA];
  }
  return [];
}

/**
 * T-10: Detección de duplicados por número de identificación (409)
 */
export function crearCliente(
  datos: {
    nombre_completo: string;
    identificacion_numero: string;
    domicilio?: string;
    ciudad?: string;
    estado?: string;
    telefono?: string;
    celular?: string;
    correo?: string;
    requiere_factura?: boolean;
    razon_social?: string;
    rfc?: string;
    aviso_privacidad_aceptado?: boolean;
  },
  autorId: string,
  autorNombre: string,
): { ok: true; cliente: ClienteRow } | { ok: false; status: number; codigo: string; mensaje: string } {
  // Verificación de duplicado por identificación
  const identificacionLimpia = datos.identificacion_numero.trim().toLowerCase();
  const existente = listaClientes.find(
    (c) =>
      !c.deleted_at &&
      c.identificacion_numero.trim().toLowerCase() === identificacionLimpia,
  );

  if (existente) {
    return {
      ok: false,
      status: 409,
      codigo: "CLIENTE_DUPLICADO",
      mensaje: `Ya existe un cliente registrado con la identificación ${datos.identificacion_numero} (Cliente No. ${existente.numero_cliente}: ${existente.nombre_completo}).`,
    };
  }

  const maxNum = listaClientes.reduce((max, c) => Math.max(max, c.numero_cliente), 100);
  const nuevoNumero = maxNum + 1;
  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();

  const nuevo: ClienteRow = {
    id,
    numero_cliente: nuevoNumero,
    nombre_completo: datos.nombre_completo.trim(),
    identificacion_numero: datos.identificacion_numero.trim(),
    domicilio: datos.domicilio ?? null,
    ciudad: datos.ciudad ?? null,
    estado: datos.estado ?? null,
    telefono: datos.telefono ?? null,
    celular: datos.celular ?? null,
    correo: datos.correo ?? null,
    requiere_factura: Boolean(datos.requiere_factura),
    razon_social: datos.razon_social ?? null,
    rfc: datos.rfc ?? null,
    domicilio_fiscal: datos.domicilio ?? null,
    regimen_fiscal: null,
    aviso_privacidad_version: "2026.1",
    aviso_privacidad_aceptado_en: datos.aviso_privacidad_aceptado ? ahora : null,
    ghl_contact_id: null,
    created_at: ahora,
    updated_at: ahora,
    created_by: autorId,
    deleted_at: null,
  };

  listaClientes.unshift(nuevo);

  registrarAuditoria({
    usuario_id: autorId,
    usuario_nombre: autorNombre,
    accion: "INSERT",
    tabla: "clientes",
    registro_id: id,
    registro_descripcion: `Alta de cliente No. ${nuevo.numero_cliente}: ${nuevo.nombre_completo}`,
    valor_anterior: null,
    valor_nuevo: { ...nuevo },
  });

  return { ok: true, cliente: nuevo };
}

/**
 * Registra un documento oficial y sus rutas en Storage privado (RF-05)
 */
export function registrarDocumentoCliente(
  clienteId: string,
  datos: {
    tipo: DocumentoRow["tipo"];
    numero?: string;
    tipo_licencia?: string;
    expedido_en?: string;
    fecha_expedicion?: string;
    fecha_vencimiento?: string;
    archivos?: Array<{ tipo: string; path: string }>;
    observaciones?: string;
  },
  autorId: string,
  autorNombre: string,
): DocumentoRow {
  const id = crypto.randomUUID();
  const ahora = new Date().toISOString();
  const hoyStr = ahora.split("T")[0]!;
  const esVigente = datos.fecha_vencimiento ? datos.fecha_vencimiento >= hoyStr : true;

  const doc: DocumentoRow = {
    id,
    tipo: datos.tipo,
    cliente_id: clienteId,
    vehiculo_id: null,
    contrato_id: null,
    numero: datos.numero ?? null,
    tipo_licencia: datos.tipo_licencia ?? null,
    expedido_en: datos.expedido_en ?? null,
    fecha_expedicion: datos.fecha_expedicion ?? null,
    fecha_vencimiento: datos.fecha_vencimiento ?? null,
    archivos: datos.archivos ?? [],
    vigente: esVigente,
    observaciones: datos.observaciones ?? null,
    created_at: ahora,
  };

  listaDocumentos.unshift(doc);

  registrarAuditoria({
    usuario_id: autorId,
    usuario_nombre: autorNombre,
    accion: "INSERT",
    tabla: "documentos",
    registro_id: id,
    registro_descripcion: `Alta de documento ${doc.tipo} para cliente (${doc.numero ?? "sin número"})`,
    valor_anterior: null,
    valor_nuevo: { ...doc },
  });

  return doc;
}
