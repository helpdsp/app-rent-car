/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:08:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T04
 */

import { describe, expect, it } from "vitest";
import {
  calcularDias,
  calcularKmExtra,
  calcularRetraso,
  liquidar,
  penalizacionCancelacion,
  redondearAPeso,
  tarifaHoraExtra,
  tarifaKmExtra,
} from "./index";

// Contrato real No. 08160 (refdocs/contrato-arrendamiento-anverso.md)
const TARIFA = 163_300; // $1,633 en centavos
const SALIDA = new Date("2024-06-28T11:00:00Z");
const ENTRADA = new Date("2024-07-01T11:00:00Z");

describe("contrato 08160 (caso de referencia)", () => {
  it("3 días y anticipo = tarifa × días = $4,899", () => {
    const dias = calcularDias(SALIDA, ENTRADA);
    expect(dias).toBe(3);
    expect(dias * TARIFA).toBe(489_900);
  });

  it("hora extra = $204 (tarifa ÷ 8 redondeada a peso)", () => {
    expect(tarifaHoraExtra(TARIFA)).toBe(20_400);
  });

  it("km extra = $3 (tarifa ÷ 500 redondeada a peso)", () => {
    expect(tarifaKmExtra(TARIFA)).toBe(300);
  });

  it("incluye 1,500 km (3 × 500)", () => {
    const r = calcularKmExtra(3931, 3931 + 1500, 3, TARIFA);
    expect(r.kmIncluidos).toBe(1500);
    expect(r.kmExcedente).toBe(0);
    expect(r.cargo).toBe(0);
  });
});

describe("calcularDias", () => {
  it("mínimo 1 día aunque sea menos de 24 h", () => {
    expect(calcularDias(SALIDA, new Date("2024-06-28T20:00:00Z"))).toBe(1);
  });
  it("cuenta solo períodos completos de 24 h", () => {
    expect(calcularDias(SALIDA, new Date("2024-06-30T20:00:00Z"))).toBe(2);
  });
  it("rechaza entrada anterior o igual a la salida", () => {
    expect(() => calcularDias(SALIDA, SALIDA)).toThrow(RangeError);
  });
});

describe("retraso", () => {
  const prev = ENTRADA;
  const tarde = (h: number, m = 0) => new Date(prev.getTime() + (h * 60 + m) * 60_000);

  it("a tiempo: sin cargo", () => {
    expect(calcularRetraso(prev, prev, TARIFA).cargo).toBe(0);
    expect(calcularRetraso(prev, tarde(-1), TARIFA).cargo).toBe(0);
  });
  it("1 minuto tarde = 1 hora (fracción) = $204", () => {
    const r = calcularRetraso(prev, tarde(0, 1), TARIFA);
    expect(r.horasExtra).toBe(1);
    expect(r.cargo).toBe(20_400);
  });
  it("4 horas = 4 × $204", () => {
    const r = calcularRetraso(prev, tarde(4), TARIFA);
    expect(r.horasExtra).toBe(4);
    expect(r.cargo).toBe(4 * 20_400);
  });
  it("desde la 5.ª hora se cobra un día extra, no horas", () => {
    const r = calcularRetraso(prev, tarde(4, 1), TARIFA);
    expect(r.diasExtra).toBe(1);
    expect(r.horasExtra).toBe(0);
    expect(r.cargo).toBe(TARIFA);
  });
  it("seguro nocturno: cualquier retraso cobra el día completo", () => {
    const r = calcularRetraso(prev, tarde(0, 1), TARIFA, { seguroNocturno: true });
    expect(r.cargo).toBe(TARIFA);
  });
  it("26 h tarde = 1 día + 2 horas", () => {
    const r = calcularRetraso(prev, tarde(26), TARIFA);
    expect(r.diasExtra).toBe(1);
    expect(r.horasExtra).toBe(2);
    expect(r.cargo).toBe(TARIFA + 2 * 20_400);
  });
});

describe("km excedente", () => {
  it("cobra el excedente a la tarifa calculada", () => {
    const r = calcularKmExtra(1000, 1000 + 1600, 3, TARIFA); // 100 km de más
    expect(r.kmExcedente).toBe(100);
    expect(r.cargo).toBe(100 * 300);
  });
  it("usa la tarifa pactada si viene informada", () => {
    const r = calcularKmExtra(0, 1600, 3, TARIFA, { tarifaKmPactada: 400 });
    expect(r.cargo).toBe(100 * 400);
  });
  it("odómetro dañado: no cobra km extra", () => {
    const r = calcularKmExtra(0, 9999, 3, TARIFA, { odometroDanado: true });
    expect(r.cargo).toBe(0);
  });
  it("rechaza km de entrada menor al de salida", () => {
    expect(() => calcularKmExtra(5000, 4000, 3, TARIFA)).toThrow(RangeError);
  });
});

describe("cancelación", () => {
  it("más de 24 h de anticipación: 20 %", () => {
    expect(penalizacionCancelacion(489_900, 48)).toBe(97_980);
  });
  it("24 h o menos: el total del contrato", () => {
    expect(penalizacionCancelacion(489_900, 24)).toBe(489_900);
  });
});

describe("liquidar", () => {
  it("devolución a tiempo sin excedente: total = anticipo, saldo 0", () => {
    const l = liquidar({
      tarifaDia: TARIFA, salida: SALIDA, entradaPrevista: ENTRADA, entradaReal: ENTRADA,
      kmSalida: 3931, kmEntrada: 3931 + 1200, anticipo: 489_900,
    });
    expect(l.total).toBe(489_900);
    expect(l.saldo).toBe(0);
  });

  it("2 h tarde + 50 km extra + limpieza $500 − bonificación $100", () => {
    const l = liquidar({
      tarifaDia: TARIFA, salida: SALIDA, entradaPrevista: ENTRADA,
      entradaReal: new Date(ENTRADA.getTime() + 2 * 3_600_000),
      kmSalida: 0, kmEntrada: 1550, anticipo: 489_900,
      otrosCargos: [{ concepto: "Limpieza", monto: 50_000 }],
      bonificaciones: [{ concepto: "Falla mecánica", monto: 10_000 }],
    });
    // 489,900 + 2×20,400 + 50×300 + 50,000 − 10,000
    expect(l.total).toBe(489_900 + 40_800 + 15_000 + 50_000 - 10_000);
    expect(l.saldo).toBe(l.total - 489_900);
  });

  it("la suma de líneas es siempre el total", () => {
    const l = liquidar({
      tarifaDia: TARIFA, salida: SALIDA, entradaPrevista: ENTRADA,
      entradaReal: new Date(ENTRADA.getTime() + 6 * 3_600_000),
      kmSalida: 0, kmEntrada: 2000, anticipo: 489_900,
    });
    expect(l.lineas.reduce((s, x) => s + x.monto, 0)).toBe(l.total);
  });
});

describe("redondearAPeso", () => {
  it("redondea a 100 centavos", () => {
    expect(redondearAPeso(20_412.5)).toBe(20_400);
    expect(redondearAPeso(20_450)).toBe(20_500);
  });
});
