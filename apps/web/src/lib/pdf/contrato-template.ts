/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:16:00Z
 * @agent_roles specialized-document-generator + engineering-backend-architect
 * @vision_command start_sprint --sprint 17
 * @sprint_number 17
 * @task_id S17-T01
 */

import { LISTA_21_CLAUSULAS, PARAMETROS_LEGALES_DEFAULT } from "./clausulas";
import { type ContratoCaratulaDatos } from "./contrato";
import { obtenerUrlVerificacion, generarMatrizQR } from "./qr";

export interface ContratoPDFDocumentData extends ContratoCaratulaDatos {
  urlVerificacion?: string;
  sha256Seal?: string;
  qrMatrix?: boolean[][];
}

export function prepararDatosContratoPDF(datos: ContratoCaratulaDatos, sha256?: string): ContratoPDFDocumentData {
  const urlVerificacion = obtenerUrlVerificacion(datos.folio);
  const qr = generarMatrizQR(urlVerificacion, 29);

  return {
    ...datos,
    urlVerificacion,
    sha256Seal: sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    qrMatrix: qr.modules,
    parametrosLegales: {
      ...PARAMETROS_LEGALES_DEFAULT,
      ...datos.parametrosLegales,
    },
  };
}

export function formatearPesos(centavosOPesos: number, esCentavos: boolean = false): string {
  const pesos = esCentavos ? centavosOPesos / 100 : centavosOPesos;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(pesos);
}

export { LISTA_21_CLAUSULAS };
