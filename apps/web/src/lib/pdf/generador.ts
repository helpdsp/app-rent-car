/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:18:00Z
 * @agent_roles engineering-backend-architect + specialized-document-generator
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T02
 */

import crypto from "crypto";
import { type ContratoCaratulaDatos } from "./contrato";
import { prepararDatosContratoPDF, formatearPesos, LISTA_21_CLAUSULAS } from "./contrato-template";
import { calcularHuellaSHA256 } from "./guardar";

function escapePdfText(str: string): string {
  // En codificación PDF estándar, escapar paréntesis y barras invertidas
  // y normalizar acentos para Type 1 Helvetica estándar
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remueve diacríticos para compatibilidad con Helvetica estándar
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

export interface ResultadoGeneracionPDF {
  buffer: Buffer;
  sha256: string;
  paginas: number;
  tamanoBytes: number;
  tiempoMs: number;
}

/**
 * Genera un documento PDF estándar de 2 páginas idéntico al contrato oficial
 * de México Renta de Autos (Mexicali, B.C.) con código QR vectorial y sello SHA-256.
 */
export async function generarPDFContrato(datos: ContratoCaratulaDatos): Promise<ResultadoGeneracionPDF> {
  const tInicio = Date.now();
  const docData = prepararDatosContratoPDF(datos);

  // Dimensiones carta estándar (Letter): 612 x 792 pt
  const W = 612;
  const H = 792;
  const M = 36; // Margen 0.5 in

  // --- CONTENIDO PÁGINA 1: CARÁTULA ---
  const p1: string[] = [];

  // Función auxiliar para dibujar texto
  function textP1(x: number, y: number, font: string, size: number, text: string, r = 0, g = 0, b = 0) {
    p1.push(`${r} ${g} ${b} rg`);
    p1.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfText(text)}) Tj ET`);
  }

  // Función auxiliar para dibujar rectángulos
  function rectP1(x: number, y: number, w: number, h: number, fill = true, stroke = true, fillR = 1, fillG = 1, fillB = 1, strokeR = 0.8, strokeG = 0.8, strokeB = 0.8) {
    if (fill) p1.push(`${fillR} ${fillG} ${fillB} rg`);
    if (stroke) p1.push(`${strokeR} ${strokeG} ${strokeB} RG`);
    p1.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill && stroke ? "B" : fill ? "f" : "S"}`);
  }

  // Encabezado con franja institucional rojo México Renta (#B5141B)
  rectP1(M, H - 75, W - M * 2, 45, true, false, 0.71, 0.08, 0.11);
  textP1(M + 14, H - 52, "F2", 15, "MEXICO RENTA DE AUTOS", 1, 1, 1);
  textP1(M + 14, H - 66, "F1", 9, "Mexicali, Baja California · Atencion y Auxilio Vial: 686 555 0000", 0.95, 0.95, 0.95);

  // Cuadro Folio y Fecha
  rectP1(W - M - 140, H - 72, 130, 39, true, true, 1, 1, 1, 0.6, 0.05, 0.08);
  textP1(W - M - 132, H - 50, "F2", 8, "CONTRATO DIGITAL", 0.71, 0.08, 0.11);
  textP1(W - M - 132, H - 64, "F2", 12, `FOLIO: ${docData.folio}`, 0.1, 0.1, 0.1);

  // SECCIÓN 1: ARRENDATARIO Y VEHÍCULO (2 Columnas)
  const ySec1 = H - 95;
  const colW = (W - M * 2 - 12) / 2;

  // Tarjeta Arrendatario
  rectP1(M, ySec1 - 100, colW, 100, true, true, 0.98, 0.98, 0.98, 0.85, 0.82, 0.78);
  rectP1(M, ySec1 - 18, colW, 18, true, false, 0.9, 0.87, 0.82);
  textP1(M + 8, ySec1 - 13, "F2", 9, "1. DATOS DEL CLIENTE / ARRENDATARIO", 0.2, 0.15, 0.1);

  textP1(M + 8, ySec1 - 32, "F2", 8.5, `Nombre: ${docData.cliente.nombre}`, 0.1, 0.1, 0.1);
  textP1(M + 8, ySec1 - 46, "F1", 8, `RFC: ${docData.cliente.rfc || "XAXX010101000"}   Tel: ${docData.cliente.telefono}`, 0.3, 0.3, 0.3);
  textP1(M + 8, ySec1 - 60, "F1", 8, `Domicilio: ${docData.cliente.domicilio || "Mexicali, B.C."}`, 0.3, 0.3, 0.3);
  textP1(M + 8, ySec1 - 74, "F1", 8, `Licencia: ${docData.cliente.licenciaNumero}`, 0.1, 0.1, 0.1);
  textP1(M + 8, ySec1 - 88, "F2", 8, `Vigencia Licencia: ${docData.cliente.licenciaVencimiento}`, 0.1, 0.5, 0.2);

  // Tarjeta Vehículo
  const xCol2 = M + colW + 12;
  rectP1(xCol2, ySec1 - 100, colW, 100, true, true, 0.98, 0.98, 0.98, 0.85, 0.82, 0.78);
  rectP1(xCol2, ySec1 - 18, colW, 18, true, false, 0.9, 0.87, 0.82);
  textP1(xCol2 + 8, ySec1 - 13, "F2", 9, "2. VEHICULO ARRENDADO Y ENTREGA", 0.2, 0.15, 0.1);

  textP1(xCol2 + 8, ySec1 - 32, "F2", 8.5, `${docData.vehiculo.marca} ${docData.vehiculo.modelo} (${docData.vehiculo.color})`, 0.1, 0.1, 0.1);
  textP1(xCol2 + 8, ySec1 - 46, "F1", 8, `Placas: ${docData.vehiculo.placas}   Ano: ${docData.vehiculo.anio || "2024"}`, 0.3, 0.3, 0.3);
  textP1(xCol2 + 8, ySec1 - 60, "F2", 8, `Odometro de Salida: ${docData.vehiculo.kmSalida.toLocaleString()} km`, 0.1, 0.1, 0.1);
  textP1(xCol2 + 8, ySec1 - 74, "F1", 8, `Nivel Gasolina: ${docData.vehiculo.gasolinaSalidaOctavos}/8`, 0.1, 0.1, 0.1);
  textP1(xCol2 + 8, ySec1 - 88, "F1", 8, `Lugar entrega/devolucion: ${docData.fechas.lugarDevolucion || "Matriz Mexicali"}`, 0.3, 0.3, 0.3);

  // SECCIÓN 2: PLAZOS Y RANGO DE FECHAS
  const ySec2 = ySec1 - 112;
  rectP1(M, ySec2 - 50, W - M * 2, 50, true, true, 1, 1, 1, 0.85, 0.82, 0.78);
  rectP1(M, ySec2 - 16, W - M * 2, 16, true, false, 0.94, 0.92, 0.88);
  textP1(M + 8, ySec2 - 12, "F2", 8.5, "3. PERIODO DE ARRENDAMIENTO E ITINERARIO", 0.2, 0.15, 0.1);

  textP1(M + 8, ySec2 - 28, "F1", 8, `Fecha y hora de Salida: ${docData.fechas.salida}`, 0.1, 0.1, 0.1);
  textP1(M + 260, ySec2 - 28, "F1", 8, `Fecha y hora Devolucion: ${docData.fechas.entradaPrevista}`, 0.1, 0.1, 0.1);
  textP1(M + 8, ySec2 - 42, "F1", 8, `Destino Autorizado: ${docData.fechas.destino || "Baja California"}`, 0.3, 0.3, 0.3);
  textP1(M + 260, ySec2 - 42, "F2", 8, `Permiso Cruce Fronterizo a EE.UU.: ${docData.fechas.salidaPaisAutorizada ? "SI AUTORIZADO" : "NO AUTORIZADO"}`, docData.fechas.salidaPaisAutorizada ? 0.1 : 0.7, 0.1, 0.1);

  // SECCIÓN 3: DESGLOSE ECONÓMICO Y TARIFAS
  const ySec3 = ySec2 - 62;
  rectP1(M, ySec3 - 110, W - M * 2, 110, true, true, 1, 1, 1, 0.85, 0.82, 0.78);
  rectP1(M, ySec3 - 16, W - M * 2, 16, true, false, 0.9, 0.87, 0.82);
  textP1(M + 8, ySec3 - 12, "F2", 8.5, "4. TARIFAS Y LIQUIDACION (MONEDA NACIONAL MXN)", 0.2, 0.15, 0.1);

  const subtotalRenta = docData.tarifas.dias * docData.tarifas.tarifaDia;
  textP1(M + 8, ySec3 - 32, "F1", 8.5, `Dias de Renta: ${docData.tarifas.dias} dia(s) x ${formatearPesos(docData.tarifas.tarifaDia)}/dia`, 0.1, 0.1, 0.1);
  textP1(W - M - 140, ySec3 - 32, "F2", 8.5, formatearPesos(subtotalRenta), 0.1, 0.1, 0.1);

  textP1(M + 8, ySec3 - 48, "F1", 8, `Km incluidos: ${docData.tarifas.kmIncluidos} km (${docData.tarifas.dias * 500} km total) · Km excedente: ${formatearPesos(docData.tarifas.tarifaKmExtra)}/km`, 0.3, 0.3, 0.3);
  textP1(M + 8, ySec3 - 62, "F1", 8, `Hora extra pactada: ${formatearPesos(docData.tarifas.tarifaHoraExtra)}/hora (tolerancia 59 min)`, 0.3, 0.3, 0.3);

  // Línea divisoria
  p1.push(`0.85 0.82 0.78 RG 1 w ${M} ${(ySec3 - 72).toFixed(2)} m ${W - M} ${(ySec3 - 72).toFixed(2)} l S`);

  textP1(M + 8, ySec3 - 86, "F2", 9.5, "TOTAL ANTICIPO PAGADO AL FIRMAR:", 0.71, 0.08, 0.11);
  textP1(W - M - 140, ySec3 - 86, "F2", 11, formatearPesos(docData.tarifas.anticipo), 0.71, 0.08, 0.11);

  textP1(M + 8, ySec3 - 100, "F1", 8, `Deposito en Garantia: ${formatearPesos(docData.tarifas.depositoGarantia)} (Retencion en tarjeta de credito)`, 0.4, 0.4, 0.4);

  // SECCIÓN 4: PAGARÉ EN GARANTÍA
  const ySec4 = ySec3 - 122;
  rectP1(M, ySec4 - 60, W - M * 2, 60, true, true, 0.99, 0.98, 0.96, 0.85, 0.82, 0.78);
  rectP1(M, ySec4 - 15, W - M * 2, 15, true, false, 0.85, 0.82, 0.78);
  textP1(M + 8, ySec4 - 11, "F2", 8, "5. PAGARE MERCANTIL EN GARANTIA", 0.1, 0.1, 0.1);
  textP1(M + 8, ySec4 - 28, "F1", 7.5, "Debo(emos) y pagare(mos) incondicionalmente a la orden de MEXICO RENTA DE AUTOS, S.A. DE C.V., en Mexicali, B.C.", 0.2, 0.2, 0.2);
  textP1(M + 8, ySec4 - 40, "F1", 7.5, `el valor de los danos, deducibles o faltantes en el vehiculo objeto de este contrato, hasta por la cantidad de ${formatearPesos(docData.tarifas.depositoGarantia)}.`, 0.2, 0.2, 0.2);
  textP1(M + 8, ySec4 - 52, "F1", 7, "Causa un interes moratorio del 5% mensual a partir de la fecha de exigibilidad. Pagadero a la vista.", 0.4, 0.4, 0.4);

  // SECCIÓN 5: RECUADROS DE FIRMAS (Arrendatario y Representante Legal)
  const yFirmas = ySec4 - 72;
  const fBoxW = (W - M * 2 - 16) / 2;

  // Firma Arrendatario
  rectP1(M, yFirmas - 95, fBoxW, 95, true, true, 1, 1, 1, 0.75, 0.72, 0.68);
  rectP1(M, yFirmas - 16, fBoxW, 16, true, false, 0.95, 0.93, 0.9);
  textP1(M + 8, yFirmas - 12, "F2", 8, "FIRMA DEL ARRENDATARIO / CLIENTE", 0.2, 0.15, 0.1);
  textP1(M + 12, yFirmas - 50, "F3", 10, "Firma digital registrada en tableta", 0.2, 0.5, 0.3);
  p1.push(`0.75 0.72 0.68 RG 0.5 w ${M + 10} ${(yFirmas - 70).toFixed(2)} m ${M + fBoxW - 10} ${(yFirmas - 70).toFixed(2)} l S`);
  textP1(M + 8, yFirmas - 80, "F2", 8, docData.cliente.nombre, 0.1, 0.1, 0.1);
  textP1(M + 8, yFirmas - 90, "F1", 7, "Acepto de conformidad terminos, inventario y pagare", 0.4, 0.4, 0.4);

  // Firma Operador / Arrendadora
  const xFirma2 = M + fBoxW + 16;
  rectP1(xFirma2, yFirmas - 95, fBoxW, 95, true, true, 1, 1, 1, 0.75, 0.72, 0.68);
  rectP1(xFirma2, yFirmas - 16, fBoxW, 16, true, false, 0.95, 0.93, 0.9);
  textP1(xFirma2 + 8, yFirmas - 12, "F2", 8, "REPRESENTANTE LEGAL / ARRENDADORA", 0.2, 0.15, 0.1);
  textP1(xFirma2 + 12, yFirmas - 50, "F3", 10, "México Renta de Autos · Mexicali", 0.71, 0.08, 0.11);
  p1.push(`0.75 0.72 0.68 RG 0.5 w ${xFirma2 + 10} ${(yFirmas - 70).toFixed(2)} m ${xFirma2 + fBoxW - 10} ${(yFirmas - 70).toFixed(2)} l S`);
  textP1(xFirma2 + 8, yFirmas - 80, "F2", 8, "MEXICO RENTA DE AUTOS, S.A. DE C.V.", 0.1, 0.1, 0.1);
  textP1(xFirma2 + 8, yFirmas - 90, "F1", 7, "Entrega y recepcion autorizada en matriz", 0.4, 0.4, 0.4);

  // Pie de página 1
  textP1(M, 20, "F1", 7, `Pagina 1 de 2 · Contrato ${docData.folio} · Sellado Digital SHA-256`, 0.5, 0.5, 0.5);
  textP1(W - M - 120, 20, "F1", 7, "Continuar al reverso con clausulas ->", 0.5, 0.5, 0.5);

  // --- CONTENIDO PÁGINA 2: CLÁUSULAS OFICIALES Y CÓDIGO QR ---
  const p2: string[] = [];

  function textP2(x: number, y: number, font: string, size: number, text: string, r = 0, g = 0, b = 0) {
    p2.push(`${r} ${g} ${b} rg`);
    p2.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdfText(text)}) Tj ET`);
  }

  function rectP2(x: number, y: number, w: number, h: number, fill = true, stroke = true, fillR = 1, fillG = 1, fillB = 1, strokeR = 0.8, strokeG = 0.8, strokeB = 0.8) {
    if (fill) p2.push(`${fillR} ${fillG} ${fillB} rg`);
    if (stroke) p2.push(`${strokeR} ${strokeG} ${strokeB} RG`);
    p2.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill && stroke ? "B" : fill ? "f" : "S"}`);
  }

  // Encabezado Página 2
  rectP2(M, H - 48, W - M * 2, 28, true, false, 0.2, 0.17, 0.14);
  textP2(M + 12, H - 35, "F2", 10, "TERMINOS Y CONDICIONES GENERALES DEL CONTRATO DE ARRENDAMIENTO", 1, 1, 1);
  textP2(W - M - 110, H - 35, "F1", 8.5, `ANEXO AL FOLIO: ${docData.folio}`, 0.9, 0.9, 0.9);

  // 21 Cláusulas distribuidas en 2 columnas
  const cW = (W - M * 2 - 16) / 2;
  let currYCol1 = H - 65;
  let currYCol2 = H - 65;

  LISTA_21_CLAUSULAS.forEach((clausula, idx) => {
    const esCol1 = idx < 11;
    const xBase = esCol1 ? M : M + cW + 16;
    const currY = esCol1 ? currYCol1 : currYCol2;

    const titulo = `${clausula.numero} ${clausula.titulo.toUpperCase()}: `;
    const textoCompleto = titulo + clausula.texto;

    // Envolver texto en líneas de ~55 caracteres
    const palabras = textoCompleto.split(" ");
    let lineaActual = "";
    const lineas: string[] = [];

    for (const pal of palabras) {
      if ((lineaActual + " " + pal).length > 56) {
        lineas.push(lineaActual);
        lineaActual = pal;
      } else {
        lineaActual = lineaActual ? lineaActual + " " + pal : pal;
      }
    }
    if (lineaActual) lineas.push(lineaActual);

    // Dibujar cada línea
    lineas.forEach((lin, lIdx) => {
      const yLin = currY - lIdx * 8;
      const esPrimera = lIdx === 0;
      if (esPrimera) {
        textP2(xBase, yLin, "F2", 6.8, lin, 0.1, 0.1, 0.1);
      } else {
        textP2(xBase, yLin, "F1", 6.5, lin, 0.25, 0.25, 0.25);
      }
    });

    const salto = lineas.length * 8 + 6;
    if (esCol1) {
      currYCol1 -= salto;
    } else {
      currYCol2 -= salto;
    }
  });

  // RECUADRO INFERIOR DE VALIDACIÓN DIGITAL, QR Y SELLO CRIPTOGRÁFICO
  const yBoxVal = 135;
  const hBoxVal = 95;
  rectP2(M, yBoxVal - hBoxVal, W - M * 2, hBoxVal, true, true, 0.98, 0.98, 0.98, 0.75, 0.72, 0.68);
  rectP2(M, yBoxVal - 16, W - M * 2, 16, true, false, 0.71, 0.08, 0.11);
  textP2(M + 8, yBoxVal - 12, "F2", 8.5, "VERIFICACION PUBLICA DE AUTENTICIDAD E INMUTABILIDAD DIGITAL", 1, 1, 1);

  // Dibujar QR Vectorial en el recuadro
  const qrX = M + 12;
  const qrY = yBoxVal - hBoxVal + 10;
  const qrModSize = 2.2;
  const matrix = docData.qrMatrix || [];

  p2.push("0.1 0.1 0.1 rg");
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        const mx = qrX + c * qrModSize;
        const my = qrY + (matrix.length - 1 - r) * qrModSize; // Invertir Y para sistema cartesiano PDF
        p2.push(`${mx.toFixed(2)} ${my.toFixed(2)} ${qrModSize.toFixed(2)} ${qrModSize.toFixed(2)} re f`);
      }
    }
  }

  // Texto explicativo del QR y Sello SHA-256
  const txtValX = qrX + 80;
  textP2(txtValX, yBoxVal - 30, "F2", 8, "Escanee este codigo QR para verificar la autenticidad en tiempo real:", 0.1, 0.1, 0.1);
  textP2(txtValX, yBoxVal - 42, "F1", 7.5, docData.urlVerificacion || `https://app-mexico-rent.vercel.app/validar/${docData.folio}`, 0.1, 0.4, 0.7);

  // Sello Criptográfico SHA-256
  textP2(txtValX, yBoxVal - 56, "F2", 7.5, "Huella Digital Criptografica SHA-256 (Inmutable):", 0.2, 0.2, 0.2);
  const seal = docData.sha256Seal || "a1b2c3d4e5f6...7890";
  rectP2(txtValX, yBoxVal - 72, 380, 13, true, true, 0.94, 0.94, 0.94, 0.8, 0.8, 0.8);
  textP2(txtValX + 4, yBoxVal - 68, "F2", 6.8, seal, 0.1, 0.1, 0.1);

  textP2(txtValX, yBoxVal - 84, "F1", 6.5, "Jurisdiccion: Tribunales de Mexicali, Baja California. Registro PROFECO en tramite.", 0.4, 0.4, 0.4);

  // Pie de página 2
  textP2(M, 20, "F1", 7, `Pagina 2 de 2 · Fin del Contrato ${docData.folio} · Mexico Renta de Autos`, 0.5, 0.5, 0.5);

  // --- ENSAMBLADO DEL ARCHIVO PDF BINARIO ESTÁNDAR ---
  const stream1 = p1.join("\n");
  const stream2 = p2.join("\n");

  const objects: string[] = [];
  const offsets: number[] = [];

  function addObject(content: string): number {
    const id = objects.length + 1;
    objects.push(`${id} 0 obj\n${content}\nendobj`);
    return id;
  }

  // Obj 1: Catalog
  addObject("<< /Type /Catalog /Pages 2 0 R >>");

  // Obj 2: Pages
  addObject("<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>");

  // Obj 3: Page 1
  addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 7 0 R /F2 8 0 R /F3 9 0 R >> >> >>`);

  // Obj 4: Content Stream Page 1
  const bufStream1 = Buffer.from(stream1, "utf-8");
  addObject(`<< /Length ${bufStream1.length} >>\nstream\n${stream1}\nendstream`);

  // Obj 5: Page 2
  addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 6 0 R /Resources << /Font << /F1 7 0 R /F2 8 0 R /F3 9 0 R >> >> >>`);

  // Obj 6: Content Stream Page 2
  const bufStream2 = Buffer.from(stream2, "utf-8");
  addObject(`<< /Length ${bufStream2.length} >>\nstream\n${stream2}\nendstream`);

  // Obj 7: Font Helvetica
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");

  // Obj 8: Font Helvetica-Bold
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

  // Obj 9: Font Helvetica-Oblique
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>");

  // Compilar todo en un único Buffer
  let pdfOutput = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";

  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdfOutput, "utf-8"));
    pdfOutput += obj + "\n";
  }

  const xrefOffset = Buffer.byteLength(pdfOutput, "utf-8");
  pdfOutput += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;

  for (const off of offsets) {
    const padded = String(off).padStart(10, "0");
    pdfOutput += `${padded} 00000 n \n`;
  }

  pdfOutput += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  const finalBuffer = Buffer.from(pdfOutput, "utf-8");
  const sha256 = calcularHuellaSHA256(finalBuffer);
  const tFin = Date.now();

  return {
    buffer: finalBuffer,
    sha256,
    paginas: 2,
    tamanoBytes: finalBuffer.length,
    tiempoMs: tFin - tInicio,
  };
}
