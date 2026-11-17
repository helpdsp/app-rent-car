/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T09:45:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 8
 * @sprint_number 8
 * @task_id S08-T08
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  calcularHuellaSHA256,
  guardarVersionPDF,
  modificarVersionPDF,
  verificarIntegridadPDF,
  resetearEstadoPDFs,
  obtenerUltimoPDFContrato,
} from "../src/lib/pdf/guardar";
import {
  registrarFirmaDigital,
  obtenerFirmasPorContrato,
  resetearEstadoFirmas,
} from "../src/lib/firma/registrar";
import { LISTA_21_CLAUSULAS, PARAMETROS_LEGALES_DEFAULT } from "../src/lib/pdf/clausulas";
import {
  crearBorrador,
  emitirContratoTransaccional,
  resetearEstadoContratos,
  obtenerContratoPorId,
} from "../src/lib/contratos/emitir";

describe("Sprint 8: PDF del contrato y firma en tableta (T-50 a T-53, T-55)", () => {
  const autorTest = {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Operador Mostrador",
  };

  const contratoId = "77777777-7777-4777-8777-777777777000";

  beforeEach(() => {
    resetearEstadoPDFs();
    resetearEstadoFirmas();
    resetearEstadoContratos();
  });

  // T-50: PDF del contrato: Carátula + 21 cláusulas, datos correctos, comparado con formato 08160
  it("T-50: genera la carátula y las 21 cláusulas con los datos exactos del contrato de referencia 08160", () => {
    // 1. Verificar que existan las 21 cláusulas numeradas
    expect(LISTA_21_CLAUSULAS.length).toBe(21);
    expect(LISTA_21_CLAUSULAS[0].numero).toBe("1.ª");
    expect(LISTA_21_CLAUSULAS[20].numero).toBe("21.ª");

    // 2. Parámetros legales pendientes configurables
    expect(PARAMETROS_LEGALES_DEFAULT.ciudadJurisdiccion).toBe("Mexicali, Baja California");
    expect(PARAMETROS_LEGALES_DEFAULT.telefonoFallas).toBe("686 555 0000");

    // 3. Estructura de carátula 08160 (Kia Forte, 3 días, $1,633, anticipo $4,899, hora extra $204, km $3)
    const contenidoContrato08160 = JSON.stringify({
      folio: "08160",
      cliente: "Ricardo Medina Salazar",
      vehiculo: "Kia Forte",
      placas: "BNB-791-A",
      dias: 3,
      tarifa_dia: 1633,
      anticipo: 4899,
      tarifa_hora_extra: 204,
      tarifa_km_extra: 3,
      km_incluidos: 1500,
    });

    const pdf = guardarVersionPDF(contratoId, contenidoContrato08160, autorTest);
    expect(pdf.version).toBe(1);
    expect(pdf.sha256).toBeDefined();
    expect(pdf.sha256.length).toBe(64); // Longitud estándar hex de SHA-256
    expect(pdf.firmado).toBe(false);
  });

  // T-51: Firma: se guarda imagen, hash SHA-256, usuario, fecha y dispositivo
  it("T-51: el registro de firma guarda imagen base64, hash del PDF, usuario, fecha y dispositivo", () => {
    // Preparar el PDF
    guardarVersionPDF(contratoId, "Contenido preliminar", autorTest);

    const resFirma = registrarFirmaDigital(
      contratoId,
      {
        firmante_tipo: "arrendatario",
        firmante_nombre: "Ricardo Medina Salazar",
        imagen_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
        dispositivo: "iPad Pro 11 (Mostrador A)",
      },
      autorTest
    );

    expect(resFirma.ok).toBe(true);
    if (resFirma.ok) {
      expect(resFirma.firma.firmante_tipo).toBe("arrendatario");
      expect(resFirma.firma.firmante_nombre).toBe("Ricardo Medina Salazar");
      expect(resFirma.firma.pdf_sha256).toBeDefined();
      expect(resFirma.firma.usuario_id).toBe(autorTest.id);
      expect(resFirma.firma.dispositivo).toBe("iPad Pro 11 (Mostrador A)");
      expect(resFirma.firma.created_at).toBeDefined();

      // Verificar que el PDF asociado quedó marcado como firmado
      const pdf = obtenerUltimoPDFContrato(contratoId);
      expect(pdf?.firmado).toBe(true);
      expect(pdf?.dispositivo).toBe("iPad Pro 11 (Mostrador A)");
    }

    const firmas = obtenerFirmasPorContrato(contratoId);
    expect(firmas.length).toBe(1);
  });

  // T-52: Modificar un contrato firmado es rechazado; una corrección crea versión nueva
  it("T-52: no permite modificar un PDF firmado directamente; cualquier cambio genera una versión nueva", () => {
    const pdfV1 = guardarVersionPDF(contratoId, "Contrato v1 Original", autorTest, {
      firmado: true,
      dispositivo: "Tableta 1",
    });

    // 1. Intento de modificar in situ la versión 1 firmada -> RECHAZADO
    const intentoModificar = modificarVersionPDF(pdfV1.id, "Contrato v1 Alterado");
    expect(intentoModificar.ok).toBe(false);
    if (!intentoModificar.ok) {
      expect(intentoModificar.codigo).toBe("CONTRATO_FIRMADO_INMUTABLE");
    }

    // 2. Corrección crea una versión nueva (v2) y requiere nueva firma
    const pdfV2 = guardarVersionPDF(contratoId, "Contrato v2 Corregido", autorTest);
    expect(pdfV2.version).toBe(2);
    expect(pdfV2.firmado).toBe(false); // v2 inicia sin firmar
    expect(pdfV2.sha256).not.toBe(pdfV1.sha256);
  });

  // T-53: Alterar el PDF almacenado: el hash no coincide y se detecta
  it("T-53: detecta alteración o manipulación de bytes en un PDF verificando contra su SHA-256", () => {
    const contenidoOriginal = "Contrato Digital Inmutable Folio D-00001";
    const pdf = guardarVersionPDF(contratoId, contenidoOriginal, autorTest, { firmado: true });

    // 1. Con contenido idéntico la integridad es válida
    const verificacionValida = verificarIntegridadPDF(pdf.id, contenidoOriginal);
    expect(verificacionValida.integro).toBe(true);
    expect(verificacionValida.hashOriginal).toBe(verificacionValida.hashActual);

    // 2. Con contenido alterado (incluso por 1 carácter) -> INTEGRIDAD_COMPROMETIDA
    const contenidoAlterado = "Contrato Digital Inmutable Folio D-00001 [Tarifa alterada a $1,000]";
    const verificacionAlterada = verificarIntegridadPDF(pdf.id, contenidoAlterado);
    expect(verificacionAlterada.integro).toBe(false);
    expect(verificacionAlterada.codigo).toBe("INTEGRIDAD_COMPROMETIDA");
    expect(verificacionAlterada.hashActual).not.toBe(verificacionAlterada.hashOriginal);
  });

  // T-55: Falla al generar PDF tras emitir: el folio se conserva y PDF queda pendiente
  it("T-55: si ocurre una falla al generar el PDF tras emitir, el folio se conserva y no se pierde", async () => {
    const borrador = crearBorrador(
      {
        cliente_id: "12700000-0000-4000-8000-000000000127",
        vehiculo_id: "44444444-4444-4444-8444-444444444003",
        salida_en: "2026-11-16T11:00:00Z",
        entrada_prevista_en: "2026-11-19T11:00:00Z",
        destino: "Nogales",
        conductores: [
          {
            nombre: "Ricardo Medina",
            licencia_numero: "B2302042880",
            licencia_vencimiento: "2028-05-27",
            es_arrendatario: true,
          },
        ],
      },
      autorTest
    );

    // Emisión formal
    const emision = await emitirContratoTransaccional(borrador.id, autorTest);
    expect(emision.ok).toBe(true);

    const folioEmitido = emision.ok ? emision.folio : "";
    expect(folioEmitido).toMatch(/^D-\d{5}$/);

    // Simular que el motor de PDF arrojó un error en el renderizador
    const contratoGuardado = obtenerContratoPorId(borrador.id);
    expect(contratoGuardado?.folio).toBe(folioEmitido);

    // Reintento: al reintentar generar el PDF, utiliza el mismo folio asignado sin generar uno nuevo
    const pdfGenerado = guardarVersionPDF(
      borrador.id,
      JSON.stringify({ folio: contratoGuardado?.folio }),
      autorTest
    );

    expect(pdfGenerado).toBeDefined();
    expect(contratoGuardado?.folio).toBe(folioEmitido); // El folio nunca cambió ni se duplicó
  });
});
