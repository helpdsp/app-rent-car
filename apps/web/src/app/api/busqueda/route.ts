/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:52:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T07
 */

import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import { obtenerClientes } from "@/lib/db/sprint3";
import { obtenerVehiculos } from "@/lib/db/sprint4";

// Lista de contratos semilla para búsqueda global (RF-06, RF-11)
const CONTRATOS_BUSQUEDA = [
  {
    id: "77777777-7777-4777-8777-777777777001",
    folio: "08160",
    cliente_nombre: "Ricardo Medina Salazar",
    vehiculo: "Kia Forte · BNB-791-A",
    estado: "vigente",
    salida: "2026-11-15 11:00",
    entrada_prevista: "2026-11-18 11:00",
  },
  {
    id: "77777777-7777-4777-8777-777777777002",
    folio: "08155",
    cliente_nombre: "Andrés Cota",
    vehiculo: "Mazda 3 · AKL-552-A",
    estado: "rezagado",
    salida: "2026-11-10 11:00",
    entrada_prevista: "2026-11-14 11:00",
  },
  {
    id: "77777777-7777-4777-8777-777777777004",
    folio: "08158",
    cliente_nombre: "Laura Ibarra",
    vehiculo: "Nissan Sentra · BCZ-889-A",
    estado: "vigente",
    salida: "2026-11-14 11:00",
    entrada_prevista: "2026-11-16 11:00",
  },
];

/**
 * GET /api/busqueda — Búsqueda unificada por cliente, folio o placas (RF-06, RF-11)
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return Response.json({
      data: {
        clientes: [],
        vehiculos: [],
        contratos: [],
      },
    });
  }

  const clientesEncontrados = obtenerClientes(q).slice(0, 5);
  const vehiculosEncontrados = obtenerVehiculos({ q }).slice(0, 5);

  const termLower = q.toLowerCase();
  const contratosEncontrados = CONTRATOS_BUSQUEDA.filter(
    (c) =>
      c.folio.includes(q) ||
      c.cliente_nombre.toLowerCase().includes(termLower) ||
      c.vehiculo.toLowerCase().includes(termLower)
  );

  return Response.json({
    data: {
      termino: q,
      clientes: clientesEncontrados.map((c) => ({
        id: c.id,
        numero: c.numero_cliente,
        nombre: c.nombre_completo,
        identificacion: c.identificacion_numero,
        telefono: c.telefono || c.celular,
      })),
      vehiculos: vehiculosEncontrados.map((v) => ({
        id: v.id,
        clave: v.clave_formato,
        marca: v.marca,
        modelo: v.modelo,
        placas: v.placas,
        estado: v.estado,
      })),
      contratos: contratosEncontrados,
    },
  });
}
