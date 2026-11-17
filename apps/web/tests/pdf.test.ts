/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:27:00Z
 * @agent_roles testing-reality-checker + testing-performance-benchmarker
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T07
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generarPDFContrato } from "../src/lib/pdf/generador";
import { generarMatrizQR, obtenerUrlVerificacion } from "../src/lib/pdf/qr";
import { type ContratoCaratulaDatos } from "../src/lib/pdf/contrato";
import { calcularHuellaSHA256 } from "../src/lib/pdf/guardar";
import { GET as pdfGetHandler } from "../src/app/api/contratos/[id]/pdf/route";
import { NextRequest } from "next/server";
import { crearBorrador, emitirContratoTransaccional, resetearEstadoContratos } from "../src/lib/contratos/emitir";
import { crearSesionDirecta } from "../src/lib/auth/session";

describe("Sprint 17: Motor Oficial de PDF Legal, QR y Sello SHA-256 (RF-37)", () => {
  const contrato08160Datos: ContratoCaratulaDatos = {
    folio: "08160",
    folioPapel: "08160",
    fechaEmision: "2026-11-17",
    cliente: {
      nombre: "Ricardo Medina Salazar",
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
      salida: "2026-11-17T10:00:00.000Z",
      entradaPrevista: "2026-11-20T10:00:00.000Z",
      destino: "Baja California / Sonora",
      lugarDevolucion: "Matriz Mexicali",
      salidaPaisAutorizada: false,
    },
    tarifas: {
      dias: 3,
      tarifaDia: 1633,
      anticipo: 4899,
      tarifaHoraExtra: 204,
      tarifaKmExtra: 3,
      kmIncluidos: 500,
      depositoGarantia: 5000,
    },
  };

  beforeEach(() => {
    resetearEstadoContratos();
  });

  // Q17-01: Generación de PDF y verificación de 2 páginas con contrato de referencia 08160 en < 2.5s
  it("Q17-01: genera el contrato 08160 en un PDF de 2 páginas estándar en menos de 2500 ms", async () => {
    const t0 = Date.now();
    const resultado = await generarPDFContrato(contrato08160Datos);
    const tTotal = Date.now() - t0;

    expect(resultado).toBeDefined();
    expect(resultado.paginas).toBe(2);
    expect(resultado.tamanoBytes).toBeGreaterThan(1000);
    expect(resultado.buffer).toBeInstanceOf(Buffer);

    // Debe comenzar con el encabezado estándar de PDF
    const magicNumber = resultado.buffer.subarray(0, 5).toString("utf-8");
    expect(magicNumber).toBe("%PDF-");

    // Tiempo de ejecución menor a 2.5 segundos (2500 ms)
    expect(tTotal).toBeLessThan(2500);
  });

  // Q17-02: Calidad de datos, tarifas y desglose en el PDF generado
  it("Q17-02: incluye datos del cliente, auto Kia Forte y anticipo $4,899 exactos", async () => {
    const resultado = await generarPDFContrato(contrato08160Datos);
    const contenidoPdfStr = resultado.buffer.toString("utf-8");

    // Verificar menciones de la carátula
    expect(contenidoPdfStr).toContain("08160");
    expect(contenidoPdfStr).toContain("Ricardo Medina Salazar");
    expect(contenidoPdfStr).toContain("Kia Forte");
    expect(contenidoPdfStr).toContain("ATU-703-A");
    expect(contenidoPdfStr).toContain("4,899.00");
  });

  // Q17-03: Generador dinámico de código QR y URL de validación pública
  it("Q17-03: genera la matriz QR y la URL de validación pública con folio", () => {
    const url = obtenerUrlVerificacion("D-00001");
    expect(url).toContain("/validar/D-00001");

    const qr = generarMatrizQR(url, 29);
    expect(qr.size).toBe(29);
    expect(qr.modules.length).toBe(29);
    expect(qr.svg).toContain("<svg");
    expect(qr.dataUrl).toContain("data:image/svg+xml");
  });

  // Q17-04: Sello criptográfico SHA-256 e inmutabilidad estricta
  it("Q17-04: la huella digital SHA-256 cambia radicalmente si se altera un solo byte", async () => {
    const resultado = await generarPDFContrato(contrato08160Datos);
    const hashOriginal = resultado.sha256;
    expect(hashOriginal).toHaveLength(64);

    // Clonar buffer y alterar 1 byte
    const bufferAlterado = Buffer.from(resultado.buffer);
    bufferAlterado[100] = bufferAlterado[100] ^ 0xff;

    const hashAlterado = calcularHuellaSHA256(bufferAlterado);
    expect(hashAlterado).not.toBe(hashOriginal);
  });

  // Endpoint API /api/contratos/[id]/pdf?download=true
  it("debe retornar el PDF binario con Content-Type application/pdf al solicitar descarga", async () => {
    const autorTest = { id: "usr-1", nombre: "Operador Mostrador" };

    // 1. Emitir un contrato de prueba
    const borrador = crearBorrador(
      {
        cliente_id: "12700000-0000-4000-8000-000000000127",
        vehiculo_id: "44444444-4444-4444-8444-444444444003",
        salida_en: "2026-11-17T10:00:00Z",
        entrada_prevista_en: "2026-11-20T10:00:00Z",
        cargos: [{ concepto: "Renta 3 días", monto: BigInt(489900), tipo: "renta", momento: "emision" }],
        anticipo: BigInt(489900),
      },
      autorTest
    );

    const sesion = crearSesionDirecta({
      usuarioId: "11111111-1111-4111-8111-111111111101",
    });

    const resEmision = await emitirContratoTransaccional(borrador.id, autorTest);
    const contratoId = resEmision.ok ? resEmision.contrato.id : borrador.id;

    const req = new NextRequest(`http://localhost:3000/api/contratos/${contratoId}/pdf?download=true`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sesion.token}`,
      },
    });

    const res = await pdfGetHandler(req, {
      params: Promise.resolve({ id: contratoId }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain("attachment; filename=");
    expect(res.headers.get("X-SHA256")).toBeDefined();
    expect(res.headers.get("X-Pages")).toBe("2");

    const bytes = await res.arrayBuffer();
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });
});
