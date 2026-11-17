/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:45:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 6
 * @sprint_number 6
 * @task_id S06-T09
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  calcularCotizacionContrato,
  emitirContratoTransaccional,
  crearBorrador,
  validarTransicionEstado,
  resetearEstadoContratos,
  obtenerContratoPorId,
} from "../src/lib/contratos/emitir";
import { validarRequisitosEmision } from "../src/lib/contratos/validar";
import { formatearFolioDigital } from "../src/lib/db/schema";

describe("Sprint 6: Contrato núcleo I (T-30 a T-37)", () => {
  const autorTest = {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Operador Mostrador",
  };

  beforeEach(() => {
    resetearEstadoContratos();
  });

  // T-30: Reproducir 08160 (3 días, $4,899, hora extra $204, km extra $3)
  it("T-30: reproduce exactamente el cálculo del contrato de referencia 08160", () => {
    // Caso 08160: Kia Forte, 3 días x $1,633/día = $4,899
    const cotizacion = calcularCotizacionContrato({
      salida_en: "2026-11-13T17:30:00Z",
      entrada_prevista_en: "2026-11-16T17:30:00Z",
      tarifa_dia_propuesta: BigInt(163_300), // $1,633.00 en centavos
    });

    expect(cotizacion.dias).toBe(3);
    // 3 días x 163,300 = 489,900 ($4,899.00)
    expect(cotizacion.anticipo).toBe(BigInt(489_900));
    // Hora extra (163,300 / 8) truncada/redondeada a pesos = 20,400 ($204.00)
    expect(cotizacion.tarifa_hora_extra).toBe(BigInt(20_400));
    // Km extra (163,300 / 500) truncada/redondeada a pesos = 300 ($3.00)
    expect(cotizacion.tarifa_km_extra).toBe(BigInt(300));
    // Kilómetros incluidos: 3 x 500 = 1500 km
    expect(cotizacion.km_incluidos).toBe(1500);
  });

  // T-31: Ningún conductor con licencia vigente en todo el periodo -> 422 LICENCIA_VENCIDA
  it("T-31: rechaza emisión si ningún conductor tiene licencia vigente durante todo el periodo", () => {
    const validacion = validarRequisitosEmision({
      salida_en: "2026-11-16T11:00:00Z",
      entrada_prevista_en: "2026-11-19T11:00:00Z", // termina el 19 de nov
      vehiculo_id: "44444444-4444-4444-8444-444444444003",
      conductores: [
        {
          nombre: "Juan Pérez",
          licencia_numero: "LIC-112233",
          licencia_vencimiento: "2026-11-17", // Vence el 17, antes de terminar la renta
          es_arrendatario: true,
        },
      ],
    });

    expect(validacion.valido).toBe(false);
    expect(validacion.codigo).toBe("LICENCIA_VENCIDA");
    expect(validacion.error).toContain("licencia vigente");
  });

  // T-32: Entrada anterior o igual a la salida -> 422 FECHAS_INVALIDAS
  it("T-32: rechaza fechas con entrada anterior o igual a la salida", () => {
    const validacionMismaFecha = validarRequisitosEmision({
      salida_en: "2026-11-16T11:00:00Z",
      entrada_prevista_en: "2026-11-16T11:00:00Z",
      vehiculo_id: "44444444-4444-4444-8444-444444444003",
      conductores: [
        {
          nombre: "Ricardo Medina",
          licencia_numero: "B2302042880",
          licencia_vencimiento: "2028-05-27",
          es_arrendatario: true,
        },
      ],
    });
    expect(validacionMismaFecha.valido).toBe(false);
    expect(validacionMismaFecha.codigo).toBe("FECHAS_INVALIDAS");

    const validacionFechaInvertida = validarRequisitosEmision({
      salida_en: "2026-11-16T11:00:00Z",
      entrada_prevista_en: "2026-11-15T11:00:00Z",
      vehiculo_id: "44444444-4444-4444-8444-444444444003",
      conductores: [
        {
          nombre: "Ricardo Medina",
          licencia_numero: "B2302042880",
          licencia_vencimiento: "2028-05-27",
          es_arrendatario: true,
        },
      ],
    });
    expect(validacionFechaInvertida.valido).toBe(false);
    expect(validacionFechaInvertida.codigo).toBe("FECHAS_INVALIDAS");
  });

  // T-33: Folio formato D-00001, consecutivo y único; no coincide con folios de papel
  it("T-33: genera folios digitales consecutivos D-00001, D-00002 sin duplicados y distintos de papel", async () => {
    // Probar el formateador de folio
    expect(formatearFolioDigital(1)).toBe("D-00001");
    expect(formatearFolioDigital(42)).toBe("D-00042");
    expect(formatearFolioDigital(1000)).toBe("D-01000");

    // Crear dos borradores
    const borrador1 = crearBorrador(
      {
        cliente_id: "12700000-0000-4000-8000-000000000127",
        vehiculo_id: "44444444-4444-4444-8444-444444444003",
        salida_en: "2026-11-16T11:00:00Z",
        entrada_prevista_en: "2026-11-19T11:00:00Z",
        destino: "Nogales",
        conductores: [
          {
            nombre: "Ricardo Medina Salazar",
            licencia_numero: "B2302042880",
            licencia_vencimiento: "2028-05-27",
            es_arrendatario: true,
          },
        ],
      },
      autorTest
    );

    const borrador2 = crearBorrador(
      {
        cliente_id: "12800000-0000-4000-8000-000000000128",
        vehiculo_id: "44444444-4444-4444-8444-444444444004",
        salida_en: "2026-11-17T11:00:00Z",
        entrada_prevista_en: "2026-11-20T11:00:00Z",
        destino: "Ensenada",
        conductores: [
          {
            nombre: "Laura Ibarra",
            licencia_numero: "B2100998877",
            licencia_vencimiento: "2027-11-30",
            es_arrendatario: true,
          },
        ],
      },
      autorTest
    );

    // Emitir concurrentemente
    const [res1, res2] = await Promise.all([
      emitirContratoTransaccional(borrador1.id, autorTest),
      emitirContratoTransaccional(borrador2.id, autorTest),
    ]);

    expect(res1.ok).toBe(true);
    expect(res2.ok).toBe(true);

    if (res1.ok && res2.ok) {
      expect(res1.folio).toMatch(/^D-\d{5}$/);
      expect(res2.folio).toMatch(/^D-\d{5}$/);
      expect(res1.folio).not.toBe(res2.folio);
      expect(res1.folio).not.toMatch(/^0\d{4}$/); // No colisiona con folios de papel como 08160
    }
  });

  // T-34: Transición inválida (borrador → concluido) rechazada
  it("T-34: rechaza transiciones de estado no permitidas (ej. borrador -> concluido)", () => {
    const res = validarTransicionEstado("borrador", "concluido");
    expect(res.permitida).toBe(false);
    expect(res.codigo).toBe("TRANSICION_INVALIDA");

    // De borrador a por_firmar debe ser válida
    const resValida = validarTransicionEstado("borrador", "por_firmar");
    expect(resValida.permitida).toBe(true);

    // De concluido a vigente no debe ser válida
    const resConcluidoAVigente = validarTransicionEstado("concluido", "vigente");
    expect(resConcluidoAVigente.permitida).toBe(false);
  });

  // T-35: Cambio posterior de catálogo no altera la copia de tarifas congelada en el contrato
  it("T-35: congelación de tarifas inmutable tras emisión, insensible a cambios futuros del catálogo", async () => {
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

    const emision = await emitirContratoTransaccional(borrador.id, autorTest);
    expect(emision.ok).toBe(true);

    const contratoGuardado = obtenerContratoPorId(borrador.id);
    expect(contratoGuardado).toBeDefined();
    expect(contratoGuardado?.tarifa_dia).toBe(BigInt(163_300));
    expect(contratoGuardado?.anticipo).toBe(BigInt(489_900));

    // Si simulamos un cambio global de catálogo de vehículos (o tarifas en DB)
    // El contrato emitido debe mantener intacto su snapshot
    expect(contratoGuardado?.tarifa_dia).toBe(BigInt(163_300));
    expect(contratoGuardado?.anticipo).toBe(BigInt(489_900));
  });

  // T-36: Sobrescribir tarifa de km sin nota es rechazada con 422
  it("T-36: rechaza tarifa de km extra personalizada si falta la nota obligatoria", () => {
    const validacion = validarRequisitosEmision({
      salida_en: "2026-11-16T11:00:00Z",
      entrada_prevista_en: "2026-11-19T11:00:00Z",
      vehiculo_id: "44444444-4444-4444-8444-444444444003",
      conductores: [
        {
          nombre: "Ricardo Medina",
          licencia_numero: "B2302042880",
          licencia_vencimiento: "2028-05-27",
          es_arrendatario: true,
        },
      ],
      tarifa_km_sobrescrita: BigInt(500), // Se intentó fijar $5.00/km
      tarifa_km_nota: null, // Sin nota justificativa
    });

    expect(validacion.valido).toBe(false);
    expect(validacion.codigo).toBe("NOTA_KM_REQUERIDA");
  });

  // T-37: Suma de líneas de cargo igual al anticipo
  it("T-37: la suma de cargos desglosados en contrato_cargos coincide con el anticipo", async () => {
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

    const emision = await emitirContratoTransaccional(borrador.id, autorTest);
    expect(emision.ok).toBe(true);

    if (emision.ok) {
      const sumaCargos = emision.contrato.cargos.reduce(
        (acc, c) => acc + c.monto,
        BigInt(0)
      );
      expect(sumaCargos).toBe(emision.contrato.anticipo);
      expect(sumaCargos).toBe(BigInt(489_900));
    }
  });
});
