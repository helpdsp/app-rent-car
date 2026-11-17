/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:30:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 12
 * @sprint_number 12
 * @task_id S12-T01
 * @description Motor de generación de CSV para clientes, vehículos, contratos y documentos con auditoría (RF-27)
 */

import { registrarAuditoria } from "../db/sprint2";
import { obtenerClientes, obtenerDocumentosPorCliente } from "../db/sprint3";
import { obtenerVehiculos } from "../db/sprint4";
import { obtenerContratos } from "../contratos/emitir";

export type EntidadExportable = "clientes" | "vehiculos" | "contratos" | "documentos";

export interface FiltrosExportacion {
  desde?: string; // YYYY-MM-DD
  hasta?: string; // YYYY-MM-DD
  estado?: string;
  termino?: string;
}

export interface ResultadoExportacionCsv {
  entidad: EntidadExportable;
  totalFilas: number;
  csv: string;
  filename: string;
}

/**
 * Escapa valores para formato CSV RFC 4180
 */
function escaparCsv(valor: unknown): string {
  if (valor === null || valor === undefined) return "";
  let str = typeof valor === "object" ? JSON.stringify(valor) : String(valor);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Genera el archivo CSV para una entidad con sus filtros aplicados y registra la auditoría (RF-27).
 */
export function generarExportacionCsv(
  entidad: EntidadExportable,
  filtros: FiltrosExportacion,
  autor: { id: string; nombre: string; rol?: string }
): ResultadoExportacionCsv {
  const ahora = new Date();
  const fechaStr = ahora.toISOString().split("T")[0]!;
  let cabeceras: string[] = [];
  let filas: string[][] = [];

  switch (entidad) {
    case "clientes": {
      cabeceras = [
        "ID",
        "Nombre Completo",
        "Teléfono",
        "Correo",
        "Identificación Número",
        "GHL Contact ID",
        "Fecha Registro",
      ];
      let items = obtenerClientes();
      if (filtros.termino) {
        const t = filtros.termino.toLowerCase();
        items = items.filter(
          (c) =>
            c.nombre_completo.toLowerCase().includes(t) ||
            (c.telefono && c.telefono.includes(t)) ||
            c.identificacion_numero.toLowerCase().includes(t)
        );
      }
      filas = items.map((c) => [
        c.id,
        c.nombre_completo,
        c.telefono || "",
        c.correo || "",
        c.identificacion_numero,
        c.ghl_contact_id || "",
        c.created_at,
      ]);
      break;
    }

    case "vehiculos": {
      cabeceras = [
        "Clave",
        "Clave Formato",
        "Marca",
        "Modelo",
        "Tipo",
        "Color",
        "Placas",
        "Estado",
        "Kilometraje Actual",
        "Valor Asegurado (centavos)",
        "Tarifa Día (centavos)",
        "Seguro Nocturno (centavos)",
        "Contrato Activo Folio",
        "Es Rezagado",
      ];
      let items = obtenerVehiculos();
      if (filtros.estado && filtros.estado !== "Todos") {
        items = items.filter((v) => v.estado === filtros.estado);
      }
      filas = items.map((v) => [
        String(v.clave_auto),
        v.clave_formato,
        v.marca,
        v.modelo,
        v.tipo,
        v.color,
        v.placas,
        v.estado,
        String(v.kilometraje_actual),
        String(v.valor_asegurado),
        String(v.tarifa_dia),
        String(v.seguro_nocturno),
        v.contrato_activo_folio || "",
        v.es_rezagado ? "SÍ" : "NO",
      ]);
      break;
    }

    case "contratos": {
      cabeceras = [
        "ID",
        "Folio Digital",
        "Folio Papel",
        "Estado",
        "Cliente ID",
        "Cliente Nombre",
        "Vehículo ID",
        "Vehículo Descripción",
        "Destino",
        "Salida En",
        "Entrada Prevista En",
        "Entrada Real En",
        "Días",
        "Tarifa Día (centavos)",
        "Anticipo (centavos)",
        "Contrato Origen ID",
        "GHL Opportunity ID",
        "Fecha Creación",
      ];
      let items = obtenerContratos();
      if (filtros.estado && filtros.estado !== "Todos") {
        items = items.filter((c) => c.estado === filtros.estado);
      }
      if (filtros.desde) {
        items = items.filter((c) => c.salida_en.split("T")[0]! >= filtros.desde!);
      }
      if (filtros.hasta) {
        items = items.filter((c) => c.salida_en.split("T")[0]! <= filtros.hasta!);
      }
      filas = items.map((c) => [
        c.id,
        c.folio || "",
        c.folio_papel || "",
        c.estado,
        c.cliente_id,
        c.cliente_nombre,
        c.vehiculo_id,
        c.vehiculo_descripcion,
        c.destino,
        c.salida_en,
        c.entrada_prevista_en,
        c.entrada_real_en || "",
        String(c.dias),
        String(c.tarifa_dia),
        String(c.anticipo),
        c.contrato_origen_id || "",
        (c as any).ghl_opportunity_id || "",
        c.created_at,
      ]);
      break;
    }

    case "documentos": {
      cabeceras = [
        "ID",
        "Cliente ID",
        "Tipo Documento",
        "Número",
        "Fecha Expedición",
        "Fecha Vencimiento",
        "Vigente",
        "Fecha Registro",
      ];
      const clientes = obtenerClientes();
      const docs: any[] = [];
      for (const cl of clientes) {
        const d = obtenerDocumentosPorCliente(cl.id);
        docs.push(...d);
      }
      filas = docs.map((d) => [
        d.id,
        d.cliente_id || "",
        d.tipo,
        d.numero || "",
        d.fecha_expedicion || "",
        d.fecha_vencimiento || "",
        d.vigente ? "SÍ" : "NO",
        d.created_at,
      ]);
      break;
    }
  }

  // Generar CSV RFC 4180
  const lineas = [
    cabeceras.map(escaparCsv).join(","),
    ...filas.map((row) => row.map(escaparCsv).join(",")),
  ];
  const csvContenido = "\uFEFF" + lineas.join("\r\n"); // Con BOM UTF-8 para Excel
  const filename = `mra_${entidad}_${fechaStr}.csv`;

  // Registrar auditoría inmutable (RF-27: Solo administrador y titular; cada exportación queda en la bitácora)
  registrarAuditoria({
    usuario_id: autor.id,
    usuario_nombre: autor.nombre,
    accion: "EXPORT",
    tabla: entidad,
    registro_id: filename,
    registro_descripcion: `Exportación a CSV de ${entidad} generada por ${autor.nombre}. Filas: ${filas.length}. Filtros: ${JSON.stringify(filtros)}`,
    valor_anterior: null,
    valor_nuevo: {
      entidad,
      filas: filas.length,
      filtros,
      fecha: ahora.toISOString(),
    },
  });

  return {
    entidad,
    totalFilas: filas.length,
    csv: csvContenido,
    filename,
  };
}
