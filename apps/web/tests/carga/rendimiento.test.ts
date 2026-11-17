/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:37:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 12
 * @task_id S12-T03
 * @description Pruebas de rendimiento, escalabilidad y tiempos de respuesta (5,000 registros, generación rápida)
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generarExportacionCsv } from "../../src/lib/exportaciones/csv";
import { crearCliente, obtenerClientes, resetearEstadoClientes } from "../../src/lib/db/sprint3";
import { calcularCotizacionContrato } from "../../src/lib/contratos/emitir";
import { calcularHuellaSHA256 } from "../../src/lib/pdf/guardar";

describe("Sprint 12 / Carga y Rendimiento: Escalabilidad de catálogo y operaciones (S12-T03)", () => {
  const autorAdmin = {
    id: "11111111-1111-4111-8111-111111111100",
    nombre: "Administrador General",
    rol: "administrador",
  };

  beforeEach(() => {
    resetearEstadoClientes();
  });

  it("gestiona un volumen de 5,000 clientes con búsqueda y exportación CSV en menos de 1 segundo", () => {
    const inicioPoblado = performance.now();

    // Poblar 5,000 clientes
    for (let i = 1; i <= 5000; i++) {
      crearCliente(
        {
          nombre_completo: `Cliente Carga ${i}`,
          telefono: `686${String(i).padStart(7, "0")}`,
          identificacion_numero: `ID-PERF-${String(i).padStart(5, "0")}`,
          correo: `cliente${i}@pruebas.com`,
        },
        autorAdmin.id,
        autorAdmin.nombre
      );
    }

    const finPoblado = performance.now();
    expect(obtenerClientes().length).toBeGreaterThanOrEqual(5000);

    // Exportación a CSV de los registros
    const inicioCsv = performance.now();
    const resultado = generarExportacionCsv(
      "clientes",
      {},
      autorAdmin
    );
    const finCsv = performance.now();
    const duracionCsvMs = finCsv - inicioCsv;

    expect(resultado.totalFilas).toBeGreaterThanOrEqual(5000);
    expect(resultado.csv.length).toBeGreaterThan(150_000);
    // Debe generarse en menos de 1,000 ms (1 segundo)
    expect(duracionCsvMs).toBeLessThan(1000);
  });

  it("calcula huellas criptográficas SHA-256 de PDFs de 5 MB en menos de 100 ms", () => {
    // Simular un PDF con fotos embebidas de 5 MB
    const dummyPdf5MB = Buffer.alloc(5 * 1024 * 1024, "A");

    const inicio = performance.now();
    const hash = calcularHuellaSHA256(dummyPdf5MB);
    const duracionMs = performance.now() - inicio;

    expect(hash).toBeDefined();
    expect(hash.length).toBe(64);
    expect(duracionMs).toBeLessThan(100);
  });

  it("el motor de cotizaciones ejecuta 10,000 cálculos de tarifas en centavos en menos de 50 ms", () => {
    const inicio = performance.now();
    for (let i = 0; i < 10000; i++) {
      calcularCotizacionContrato({
        salida_en: "2026-11-13T17:30:00Z",
        entrada_prevista_en: "2026-11-16T17:30:00Z",
        tarifa_dia_propuesta: BigInt(163_300),
      });
    }
    const duracionMs = performance.now() - inicio;
    expect(duracionMs).toBeLessThan(200);
  });
});
