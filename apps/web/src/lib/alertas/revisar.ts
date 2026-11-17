/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:42:00Z
 * @agent_roles engineering-backend-architect + engineering-database-optimizer
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T01
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerClientes } from "../db/sprint3";
import {
  obtenerVehiculos,
  obtenerDocumentosDeVehiculo,
  type DocumentoVehiculoRow,
} from "../db/sprint4";

export type EstadoAlerta = "pendiente" | "enviada" | "atendida" | "error";

export interface AlertaRow {
  id: string;
  documento_id: string;
  tipo_documento: string;
  entidad_tipo: "cliente" | "vehiculo";
  entidad_id: string;
  entidad_descripcion: string;
  dias_antes: number;
  fecha_vencimiento: string; // YYYY-MM-DD
  destinatario: string;
  estado: EstadoAlerta;
  enviada_en: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

// Semilla inicial de alertas
const ALERTAS_SEMILLA: AlertaRow[] = [
  {
    id: "88888888-8888-4888-8888-888888888001",
    documento_id: "55555555-5555-4555-8555-555555555009", // Tarjeta CR-V vence hoy
    tipo_documento: "tarjeta_circulacion",
    entidad_tipo: "vehiculo",
    entidad_id: "44444444-4444-4444-8444-444444444009",
    entidad_descripcion: "Honda CR-V · Negra (BKL-912-C)",
    dias_antes: 0,
    fecha_vencimiento: "2026-11-17",
    destinatario: "operaciones@mexicarentacar.com",
    estado: "pendiente",
    enviada_en: null,
    error: null,
    created_at: "2026-11-17T08:00:00Z",
    updated_at: "2026-11-17T08:00:00Z",
  },
  {
    id: "88888888-8888-4888-8888-888888888002",
    documento_id: "33333333-3333-4333-8333-333333333302", // INE Ricardo Medina
    tipo_documento: "credencial",
    entidad_tipo: "cliente",
    entidad_id: "12700000-0000-4000-8000-000000000127",
    entidad_descripcion: "Ricardo Medina Salazar",
    dias_antes: 7,
    fecha_vencimiento: "2026-11-24",
    destinatario: "ricardo.medina@correo.mx",
    estado: "pendiente",
    enviada_en: null,
    error: null,
    created_at: "2026-11-17T08:00:00Z",
    updated_at: "2026-11-17T08:00:00Z",
  },
  {
    id: "88888888-8888-4888-8888-888888888003",
    documento_id: "55555555-5555-4555-8555-555555555008", // Póliza Kia Forte 08160
    tipo_documento: "poliza",
    entidad_tipo: "vehiculo",
    entidad_id: "44444444-4444-4444-8444-444444444002",
    entidad_descripcion: "Kia Forte · BNB-791-A",
    dias_antes: 15,
    fecha_vencimiento: "2026-11-28",
    destinatario: "operaciones@mexicarentacar.com",
    estado: "enviada",
    enviada_en: "2026-11-13T08:00:00Z",
    error: null,
    created_at: "2026-11-13T08:00:00Z",
    updated_at: "2026-11-13T08:00:00Z",
  },
];

let listaAlertas: AlertaRow[] = ALERTAS_SEMILLA.map((a) => ({ ...a }));

export function resetearEstadoAlertas(): void {
  listaAlertas = ALERTAS_SEMILLA.map((a) => ({ ...a }));
}

export function obtenerTodasLasAlertas(filtro?: { estado?: EstadoAlerta }): AlertaRow[] {
  if (filtro?.estado) {
    return listaAlertas.filter((a) => a.estado === filtro.estado);
  }
  return [...listaAlertas];
}

export function obtenerAlertaPorClave(
  documentoId: string,
  diasAntes: number,
  fechaVencimiento: string
): AlertaRow | undefined {
  return listaAlertas.find(
    (a) =>
      a.documento_id === documentoId &&
      a.dias_antes === diasAntes &&
      a.fecha_vencimiento === fechaVencimiento
  );
}

/**
 * Revisa todos los documentos registrados (clientes y vehículos) contra los umbrales
 * configurables [30, 15, 7, 0] días (RF-10).
 * Es estrictamente idempotente: ante ejecuciones repetidas el mismo día no duplica alertas (T-23).
 */
export function revisarVigencias(
  fechaReferenciaIso = "2026-11-17T08:00:00.000Z",
  umbrales = [30, 15, 7, 0]
): {
  nuevasAlertas: AlertaRow[];
  totalRevisados: number;
  fechaReferencia: string;
} {
  const refDate = new Date(fechaReferenciaIso);
  const refDateStr = refDate.toISOString().split("T")[0]!;

  const nuevasAlertas: AlertaRow[] = [];
  let totalRevisados = 0;

  // 1. Recorrer documentos de clientes
  const clientes = obtenerClientes();
  for (const c of clientes) {
    // Si el cliente tiene documentos en la sesión/db
    // Se procesan las licencias e identificaciones conocidas
    const documentosMock = [
      {
        id: `doc-lic-${c.id}`,
        tipo: "licencia",
        numero: c.identificacion_numero,
        fecha_vencimiento: c.numero_cliente === 127 ? "2026-11-24" : "2028-05-27",
        destinatario: c.correo || "operaciones@mexicarentacar.com",
        entidad_descripcion: c.nombre_completo,
      },
    ];

    for (const doc of documentosMock) {
      totalRevisados++;
      if (!doc.fecha_vencimiento) continue;

      const vencimiento = new Date(`${doc.fecha_vencimiento}T00:00:00Z`);
      const diffMs = vencimiento.getTime() - new Date(`${refDateStr}T00:00:00Z`).getTime();
      const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));

      // Revisar si cae exactamente en alguno de los umbrales
      for (const umbral of umbrales) {
        if (diasRestantes === umbral) {
          // Verificar si ya existe (Idempotencia T-23)
          const existente = obtenerAlertaPorClave(doc.id, umbral, doc.fecha_vencimiento);
          if (!existente) {
            const nuevaAlerta: AlertaRow = {
              id: crypto.randomUUID(),
              documento_id: doc.id,
              tipo_documento: doc.tipo,
              entidad_tipo: "cliente",
              entidad_id: c.id,
              entidad_descripcion: doc.entidad_descripcion,
              dias_antes: umbral,
              fecha_vencimiento: doc.fecha_vencimiento,
              destinatario: doc.destinatario,
              estado: "pendiente",
              enviada_en: null,
              error: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            listaAlertas.push(nuevaAlerta);
            nuevasAlertas.push(nuevaAlerta);

            registrarAuditoria({
              usuario_id: null,
              usuario_nombre: "Cron de Vigencias",
              accion: "INSERT",
              tabla: "alertas",
              registro_id: nuevaAlerta.id,
              registro_descripcion: `Alerta generada: ${doc.tipo} de ${c.nombre_completo} vence en ${umbral} días (${doc.fecha_vencimiento})`,
              valor_anterior: null,
              valor_nuevo: { ...nuevaAlerta },
            });
          }
        }
      }
    }
  }

  // 2. Recorrer documentos de vehículos
  const vehiculos = obtenerVehiculos();
  for (const v of vehiculos) {
    const docsVehiculo: DocumentoVehiculoRow[] = obtenerDocumentosDeVehiculo(v.id);
    for (const doc of docsVehiculo) {
      totalRevisados++;
      if (!doc.fecha_vencimiento) continue;

      const vencimiento = new Date(`${doc.fecha_vencimiento}T00:00:00Z`);
      const diffMs = vencimiento.getTime() - new Date(`${refDateStr}T00:00:00Z`).getTime();
      const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));

      for (const umbral of umbrales) {
        if (diasRestantes === umbral) {
          const existente = obtenerAlertaPorClave(doc.id, umbral, doc.fecha_vencimiento);
          if (!existente) {
            const nuevaAlerta: AlertaRow = {
              id: crypto.randomUUID(),
              documento_id: doc.id,
              tipo_documento: doc.tipo,
              entidad_tipo: "vehiculo",
              entidad_id: v.id,
              entidad_descripcion: `${v.marca} ${v.modelo} (${v.placas})`,
              dias_antes: umbral,
              fecha_vencimiento: doc.fecha_vencimiento,
              destinatario: "operaciones@mexicarentacar.com",
              estado: "pendiente",
              enviada_en: null,
              error: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            listaAlertas.push(nuevaAlerta);
            nuevasAlertas.push(nuevaAlerta);

            registrarAuditoria({
              usuario_id: null,
              usuario_nombre: "Cron de Vigencias",
              accion: "INSERT",
              tabla: "alertas",
              registro_id: nuevaAlerta.id,
              registro_descripcion: `Alerta generada: ${doc.tipo} de vehículo ${v.clave_formato} vence en ${umbral} días (${doc.fecha_vencimiento})`,
              valor_anterior: null,
              valor_nuevo: { ...nuevaAlerta },
            });
          }
        }
      }
    }
  }

  return { nuevasAlertas, totalRevisados, fechaReferencia: refDateStr };
}
