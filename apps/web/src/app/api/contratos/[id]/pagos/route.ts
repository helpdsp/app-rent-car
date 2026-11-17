/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:15:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T03
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  registrarPago,
  obtenerPagosPorContrato,
  validarAnticipoCompleto,
  type FormaPagoTipo,
  type TipoPagoContrato,
} from "@/lib/pagos/anticipo";
import {
  registrarDepositoGarantia,
  obtenerResumenPagosContrato,
} from "@/lib/pagos/deposito";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";

const PagoSchema = z.object({
  tipo: z.enum(["anticipo", "deposito_garantia", "liquidacion", "reembolso"]),
  forma: z.enum([
    "efectivo",
    "tarjeta_credito",
    "tarjeta_debito",
    "transferencia",
    "deposito_bancario",
    "visa_laser",
  ]),
  monto: z.number().int().positive("El monto debe ser un entero positivo en centavos"),
  tarjeta_ultimos_4: z.string().regex(/^\d{4}$/, "Deben ser exactamente 4 dígitos").optional().nullable(),
  tarjeta_tipo: z.string().optional().nullable(),
  tarjeta_numero: z.string().optional().nullable(),
  referencia: z.string().optional().nullable(),
  notas: z.string().optional().nullable(),
});

function serializarPago(pago: any) {
  return {
    ...pago,
    monto: Number(pago.monto),
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(req, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await params;
  const contrato = obtenerContratoPorId(id);
  if (!contrato) {
    return Response.json(
      { error: "Contrato no encontrado", codigo: "CONTRATO_NO_ENCONTRADO" },
      { status: 404 }
    );
  }

  const resumen = obtenerResumenPagosContrato(id);

  return Response.json({
    data: {
      contrato_id: resumen.contrato_id,
      renta_requerida: Number(resumen.renta_requerida),
      total_anticipos: Number(resumen.total_anticipos),
      total_depositos: Number(resumen.total_depositos),
      total_recibido: Number(resumen.total_recibido),
      anticipo_cubierto: resumen.anticipo_cubierto,
      faltante_anticipo: Number(resumen.faltante_anticipo),
      pagos: resumen.pagos.map(serializarPago),
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = autorizarRequest(req, {
    accion: "crear_clientes_vehiculos_contratos",
  });
  if (!auth.ok) {
    return respuestaErrorAutorizacion(auth.error);
  }

  const { id } = await params;
  const contrato = obtenerContratoPorId(id);
  if (!contrato) {
    return Response.json(
      { error: "Contrato no encontrado", codigo: "CONTRATO_NO_ENCONTRADO" },
      { status: 404 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parseado = PagoSchema.safeParse(body);
  if (!parseado.success) {
    return Response.json(
      {
        error: parseado.error.issues.map((i) => i.message).join(" "),
        codigo: "DATOS_INVALIDOS",
      },
      { status: 422 }
    );
  }

  const datos = parseado.data;
  const autor = { id: auth.sesion.usuarioId, nombre: auth.sesion.correo };

  // Si es un depósito en garantía, generar también el recibo
  if (datos.tipo === "deposito_garantia") {
    const res = registrarDepositoGarantia(
      id,
      {
        forma: datos.forma as FormaPagoTipo,
        monto: datos.monto,
        tarjeta_ultimos_4: datos.tarjeta_ultimos_4,
        tarjeta_tipo: datos.tarjeta_tipo,
        referencia: datos.referencia,
        notas: datos.notas,
      },
      autor
    );

    if (!res.ok) {
      return Response.json({ error: res.error, codigo: res.codigo }, { status: 422 });
    }

    return Response.json({
      data: {
        pago: serializarPago(res.pago),
        recibo: {
          ...res.recibo,
          monto: Number(res.recibo.monto),
        },
      },
    });
  }

  // Si es anticipo o liquidación
  const res = registrarPago(
    id,
    {
      tipo: datos.tipo as TipoPagoContrato,
      forma: datos.forma as FormaPagoTipo,
      monto: datos.monto,
      tarjeta_ultimos_4: datos.tarjeta_ultimos_4,
      tarjeta_tipo: datos.tarjeta_tipo,
      tarjeta_numero: datos.tarjeta_numero,
      referencia: datos.referencia,
      notas: datos.notas,
    },
    autor
  );

  if (!res.ok) {
    return Response.json({ error: res.error, codigo: res.codigo }, { status: 422 });
  }

  return Response.json({
    data: {
      pago: serializarPago(res.pago),
    },
  });
}
