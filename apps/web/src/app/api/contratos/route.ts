/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:26:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T05
 */

import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  guardarBorradorContrato,
  obtenerContratos,
  type ContratoCompletoRow,
} from "@/lib/contratos/emitir";

const borradorContratoSchema = z.object({
  id: z.string().uuid().optional(),
  cliente_id: z.string().uuid("Debe seleccionar un cliente válido."),
  cliente_nombre: z.string().trim().optional(),
  vehiculo_id: z.string().uuid("Debe seleccionar un vehículo válido."),
  vehiculo2_id: z.string().uuid().nullable().optional(),
  destino: z.string().trim().min(2, "El destino es obligatorio."),
  salida_en: z.string().datetime({ message: "Fecha de salida inválida." }),
  entrada_prevista_en: z.string().datetime({ message: "Fecha de entrada inválida." }),
  lugar_devolucion: z.string().trim().optional(),
  salida_pais_autorizada: z.boolean().optional(),
  permiso_salida_pais_path: z.string().nullable().optional(),
  referencia_nombre: z.string().trim().nullable().optional(),
  referencia_telefono: z.string().trim().nullable().optional(),
  referencia_celular: z.string().trim().nullable().optional(),
  facturar_a_nombre: z.string().trim().nullable().optional(),
  facturar_a_rfc: z.string().trim().nullable().optional(),
  tarifa_dia: z.number().int().positive("La tarifa por día debe ser en centavos enteros."),
  tarifa_km_sobrescrita: z.number().int().nullable().optional(),
  tarifa_km_nota: z.string().trim().nullable().optional(),
  tarifa_motivo: z.string().trim().nullable().optional(),
  observaciones: z.string().trim().nullable().optional(),
  conductores: z
    .array(
      z.object({
        nombre: z.string().trim().min(1),
        licencia_numero: z.string().trim().min(1),
        licencia_vencimiento: z.string().trim(),
        es_arrendatario: z.boolean().optional(),
      })
    )
    .optional(),
});

function serializarContrato(c: ContratoCompletoRow) {
  return {
    ...c,
    tarifa_dia: Number(c.tarifa_dia),
    tarifa_hora_extra: Number(c.tarifa_hora_extra),
    tarifa_km_extra: Number(c.tarifa_km_extra),
    seguro_nocturno: Number(c.seguro_nocturno),
    tarifa_km_sobrescrita: c.tarifa_km_sobrescrita ? Number(c.tarifa_km_sobrescrita) : null,
    tarifa_catalogo_dia: Number(c.tarifa_catalogo_dia),
    anticipo: Number(c.anticipo),
    valor_auto_asegurado: c.valor_auto_asegurado ? Number(c.valor_auto_asegurado) : null,
    cargos: c.cargos.map((cargo) => ({
      ...cargo,
      monto: Number(cargo.monto),
    })),
  };
}

/**
 * GET /api/contratos — Listar contratos con filtros de estado o búsqueda (RF-13, Mockup 11)
 */
export async function GET(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "ver_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const url = new URL(request.url);
  const estado = url.searchParams.get("estado") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const lista = obtenerContratos({ estado, q });
  const serializados = lista.map(serializarContrato);

  return Response.json({
    data: serializados,
    total: serializados.length,
  });
}

/**
 * POST /api/contratos — Crear o actualizar un borrador de contrato (RF-12)
 */
export async function POST(request: Request) {
  const auth = autorizarRequest(request, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { codigo: "CUERPO_INVALIDO", error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const parseado = borradorContratoSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      {
        codigo: "VALIDACION",
        error: parseado.error.issues.map((i) => i.message).join(" "),
      },
      { status: 422 }
    );
  }

  const contrato = guardarBorradorContrato(
    {
      ...parseado.data,
      tarifa_dia: parseado.data.tarifa_dia,
    },
    { id: auth.sesion.usuarioId, nombre: auth.sesion.correo }
  );

  return Response.json(
    { data: serializarContrato(contrato) },
    { status: 201 }
  );
}
