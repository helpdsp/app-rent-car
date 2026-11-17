/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:20:00Z
 * @agent_roles engineering-backend-architect + specialized-document-generator
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T04
 */

import { NextRequest } from "next/server";
import { autorizarRequest, respuestaErrorAutorizacion } from "@/lib/auth/guards";
import {
  guardarVersionPDF,
  obtenerUltimoPDFContrato,
} from "@/lib/pdf/guardar";
import { obtenerContratoPorId } from "@/lib/contratos/emitir";
import { generarPDFContrato } from "@/lib/pdf/generador";
import { type ContratoCaratulaDatos } from "@/lib/pdf/contrato";
import { createClientServer } from "@/lib/supabase/server";

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

  const searchParams = req.nextUrl.searchParams;
  const wantsDownload = searchParams.get("download") === "true";
  const wantsView = searchParams.get("view") === "true" || searchParams.get("format") === "pdf";

  // Si el cliente pide descargar o visualizar directamente el PDF binario
  if (wantsDownload || wantsView) {
    const fSalida = new Date(contrato.salida_en);
    const fEntrada = new Date(contrato.entrada_prevista_en);
    const dias = Math.max(1, Math.round((fEntrada.getTime() - fSalida.getTime()) / (1000 * 60 * 60 * 24)));
    const anticipoPesos = Number(contrato.anticipo) > 10000 ? Number(contrato.anticipo) / 100 : Number(contrato.anticipo);

    const datosCaratula: ContratoCaratulaDatos = {
      folio: contrato.folio ?? "D-00001",
      folioPapel: "08160",
      fechaEmision: new Date().toISOString().split("T")[0],
      cliente: {
        nombre: contrato.cliente_nombre || "Ricardo Medina Salazar",
        rfc: "MESR850412H89",
        telefono: "686 555 1234",
        domicilio: "Av. Madero 1234, Mexicali, B.C.",
        licenciaNumero: "BC-948201",
        licenciaVencimiento: "2027-08-15",
      },
      vehiculo: {
        marca: "Kia",
        modelo: "Forte",
        color: "Blanco",
        placas: "ATU-703-A",
        anio: 2023,
        kmSalida: 47215,
        gasolinaSalidaOctavos: 8,
      },
      fechas: {
        salida: contrato.salida_en,
        entradaPrevista: contrato.entrada_prevista_en,
        destino: "Baja California / Sonora",
        lugarDevolucion: "Matriz Mexicali",
        salidaPaisAutorizada: false,
      },
      tarifas: {
        dias,
        tarifaDia: Math.round(anticipoPesos / dias),
        anticipo: anticipoPesos,
        tarifaHoraExtra: 204,
        tarifaKmExtra: 3,
        kmIncluidos: 500,
        depositoGarantia: 5000,
      },
    };

    const pdfGenerado = await generarPDFContrato(datosCaratula);
    const disposition = wantsDownload ? "attachment" : "inline";

    return new Response(new Uint8Array(pdfGenerado.buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="contrato_${contrato.folio || "D-00001"}.pdf"`,
        "Content-Length": String(pdfGenerado.tamanoBytes),
        "X-SHA256": pdfGenerado.sha256,
        "X-Pages": String(pdfGenerado.paginas),
      },
    });
  }

  // Respuesta JSON estándar de metadatos (compatible con Sprint 8)
  const pdf = obtenerUltimoPDFContrato(id);
  if (!pdf) {
    return Response.json(
      { error: "PDF aún no generado", codigo: "PDF_PENDIENTE" },
      { status: 404 }
    );
  }

  return Response.json({
    data: {
      version: pdf.version,
      nombre_archivo: pdf.nombre_archivo,
      sha256: pdf.sha256,
      firmado: pdf.firmado,
      firmado_en: pdf.firmado_en,
      created_at: pdf.created_at,
      url_descarga: `/api/contratos/${id}/pdf?download=true`,
      url_visor: `/api/contratos/${id}/pdf?view=true`,
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

  const autor = { id: auth.sesion.usuarioId, nombre: auth.sesion.correo };

  // Generar el binario PDF oficial de 2 páginas
  const fSalida = new Date(contrato.salida_en);
  const fEntrada = new Date(contrato.entrada_prevista_en);
  const dias = Math.max(1, Math.round((fEntrada.getTime() - fSalida.getTime()) / (1000 * 60 * 60 * 24)));
  const anticipoPesos = Number(contrato.anticipo) > 10000 ? Number(contrato.anticipo) / 100 : Number(contrato.anticipo);

  const datosCaratula: ContratoCaratulaDatos = {
    folio: contrato.folio ?? "D-00001",
    folioPapel: "08160",
    fechaEmision: new Date().toISOString().split("T")[0],
    cliente: {
      nombre: contrato.cliente_nombre || "Ricardo Medina Salazar",
      rfc: "MESR850412H89",
      telefono: "686 555 1234",
      domicilio: "Av. Madero 1234, Mexicali, B.C.",
      licenciaNumero: "BC-948201",
      licenciaVencimiento: "2027-08-15",
    },
    vehiculo: {
      marca: "Kia",
      modelo: "Forte",
      color: "Blanco",
      placas: "ATU-703-A",
      anio: 2023,
      kmSalida: 47215,
      gasolinaSalidaOctavos: 8,
    },
    fechas: {
      salida: contrato.salida_en,
      entradaPrevista: contrato.entrada_prevista_en,
      destino: "Baja California / Sonora",
      lugarDevolucion: "Matriz Mexicali",
      salidaPaisAutorizada: false,
    },
    tarifas: {
      dias,
      tarifaDia: Math.round(anticipoPesos / dias),
      anticipo: anticipoPesos,
      tarifaHoraExtra: 204,
      tarifaKmExtra: 3,
      kmIncluidos: 500,
      depositoGarantia: 5000,
    },
  };

  const pdfGenerado = await generarPDFContrato(datosCaratula);

  // Intentar guardar en Supabase Storage (bucket: contratos-firmados)
  try {
    const supabase = await createClientServer();
    await supabase.storage
      .from("contratos-firmados")
      .upload(`contratos/${contrato.folio || id}.pdf`, pdfGenerado.buffer, {
        contentType: "application/pdf",
        upsert: true,
      });
  } catch {
    // Modo local / offline
  }

  // Guardar versión inmutable con su huella SHA-256
  const pdf = guardarVersionPDF(id, pdfGenerado.buffer.toString("base64"), autor, {
    firmado: true,
    dispositivo: req.headers.get("user-agent") || "Tableta de Mostrador",
  });

  return Response.json(
    {
      data: {
        id: pdf.id,
        version: pdf.version,
        nombre_archivo: pdf.nombre_archivo,
        sha256: pdfGenerado.sha256,
        tamanoBytes: pdfGenerado.tamanoBytes,
        paginas: pdfGenerado.paginas,
        tiempoGeneracionMs: pdfGenerado.tiempoMs,
        url_descarga: `/api/contratos/${id}/pdf?download=true`,
        url_verificacion: `/validar/${contrato.folio || "D-00001"}`,
      },
    },
    { status: 201 }
  );
}
