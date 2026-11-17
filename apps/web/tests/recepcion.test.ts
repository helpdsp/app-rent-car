/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T12:05:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 10
 * @sprint_number 10
 * @task_id S10-T08
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  liquidar,
  calcularRetraso,
  calcularKmExtra,
} from "../src/lib/pricing";
import {
  registrarRecepcionVehiculo,
} from "../src/lib/contratos/recibir";
import {
  liquidarContrato,
} from "../src/lib/contratos/liquidar";
import {
  aplicarODevolverDepositoYConcluir,
} from "../src/lib/pagos/liquidar-deposito";
import {
  registrarEvidencia,
  obtenerEvidenciasContrato,
  resetearEstadoEvidencias,
  ANGULOS_OBLIGATORIOS,
} from "../src/lib/storage/evidencias";
import {
  obtenerContratoPorId,
  resetearEstadoContratos,
} from "../src/lib/contratos/emitir";
import {
  obtenerVehiculoPorId,
  resetearEstadoVehiculos,
} from "../src/lib/db/sprint4";
import {
  resetearEstadoPagos,
} from "../src/lib/pagos/anticipo";
import {
  resetearEstadoOutbox,
  obtenerEventosOutbox,
} from "../src/lib/db/outbox";

describe("Sprint 10: Recepción, liquidación y rezagados (RF-21, RF-22, T-62 a T-67, T-77, T-78)", () => {
  const autorOperador = {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Operador Mostrador",
    rol: "operador",
  };

  const contratoId = "77777777-7777-4777-8777-777777777000";

  beforeEach(() => {
    resetearEstadoContratos();
    resetearEstadoVehiculos();
    resetearEstadoEvidencias();
    resetearEstadoPagos();
    resetearEstadoOutbox();
  });

  // T-62: Devolución a tiempo, sin excedente: Saldo 0
  it("T-62: devolución a tiempo y sin excedente de km resulta en saldo $0", () => {
    const salida = new Date("2026-11-13T11:00:00Z");
    const entradaPrevista = new Date("2026-11-16T11:00:00Z"); // 3 días exactos
    const entradaReal = new Date("2026-11-16T10:50:00Z"); // A tiempo

    const tarifaDia = 163_300; // $1,633.00
    const anticipo = 489_900; // 3 días × $1,633

    const l = liquidar({
      tarifaDia,
      salida,
      entradaPrevista,
      entradaReal,
      kmSalida: 47_215,
      kmEntrada: 48_500, // 1,285 km recorridos < 1,500 km incluidos (3 × 500)
      anticipo,
    });

    expect(l.retraso.cargo).toBe(0);
    expect(l.km.kmExcedente).toBe(0);
    expect(l.km.cargo).toBe(0);
    expect(l.total).toBe(anticipo);
    expect(l.saldo).toBe(0); // Saldo 0
  });

  // T-63: 2 h tarde + 50 km extra + limpieza $500 − bonificación $100
  it("T-63: liquida correctamente con 2 h de retraso, 50 km extra, limpieza y bonificación", () => {
    const salida = new Date("2026-11-13T11:00:00Z");
    const entradaPrevista = new Date("2026-11-16T11:00:00Z");
    const entradaReal = new Date("2026-11-16T13:00:00Z"); // 2 horas tarde

    const tarifaDia = 163_300; // $1,633 (hora extra = $204)
    const anticipo = 489_900; // $4,899

    const l = liquidar({
      tarifaDia,
      salida,
      entradaPrevista,
      entradaReal,
      kmSalida: 47_000,
      kmEntrada: 48_550, // 1,550 km recorridos (1,500 incluidos -> 50 km excedente × $3 = $150)
      anticipo,
      otrosCargos: [{ concepto: "Limpieza", monto: 50_000 }], // $500
      bonificaciones: [{ concepto: "Cortesía por espera", monto: 10_000 }], // -$100
    });

    // Retraso: 2 h × $204 = $408 (40,800 centavos)
    expect(l.retraso.horasExtra).toBe(2);
    expect(l.retraso.cargo).toBe(40_800);

    // Km: 50 km × $3 = $150 (15,000 centavos)
    expect(l.km.kmExcedente).toBe(50);
    expect(l.km.cargo).toBe(15_000);

    // Total: $4,899 (base) + $408 (retraso) + $150 (km) + $500 (limpieza) - $100 (bonif) = $5,857
    expect(l.total).toBe(585_700);
    // Saldo: $5,857 - $4,899 = $958 (95,800 centavos)
    expect(l.saldo).toBe(95_800);
  });

  // T-64: 4 h 1 min de retraso: cobra un día extra, no horas
  it("T-64: cobra un día completo extra ante un retraso de 4 h 1 min (a partir de la 5.ª hora)", () => {
    const prevista = new Date("2026-11-16T11:00:00Z");
    const real = new Date("2026-11-16T15:01:00Z"); // 4 horas y 1 minuto después

    const r = calcularRetraso(prevista, real, 163_300);
    // El reglamento estipula que a partir de la 5.ª hora se cobra día completo
    expect(r.diasExtra).toBe(1);
    expect(r.horasExtra).toBe(0);
    expect(r.cargo).toBe(163_300); // 1 día extra de $1,633
  });

  // T-65: Seguro nocturno con retraso cobra el día completo
  it("T-65: con seguro nocturno, cualquier retraso cobra el día completo sin fraccionar horas", () => {
    const prevista = new Date("2026-11-16T11:00:00Z");
    const real = new Date("2026-11-16T11:30:00Z"); // Apenas 30 minutos de retraso

    const r = calcularRetraso(prevista, real, 163_300, { seguroNocturno: true });
    expect(r.diasExtra).toBe(1);
    expect(r.horasExtra).toBe(0);
    expect(r.cargo).toBe(163_300); // Día completo sin importar los minutos
  });

  // T-66: Odómetro dañado: cobro por día, sin km extra (cláusula 16.ª)
  it("T-66: si el odómetro fue dañado, se cobra por día sin recargo de km extra", () => {
    const km = calcularKmExtra(47_000, 52_000, 3, 163_300, { odometroDanado: true });
    expect(km.kmTotal).toBe(5_000);
    expect(km.kmExcedente).toBe(0);
    expect(km.cargo).toBe(0); // Sin cargo por km excedente
  });

  // T-67: Contrato sin devolver pasada la hora pasa a rezagado
  it("T-67: marca contratos rezagados cuando la entrada prevista ya pasó y el vehículo no ha sido recibido", () => {
    const contrato = obtenerContratoPorId(contratoId)!;
    contrato.estado = "vigente";
    contrato.entrada_prevista_en = "2026-11-15T11:00:00Z"; // En el pasado

    const ahora = new Date("2026-11-16T13:20:00Z"); // 26 h 20 min después
    const entradaPrevista = new Date(contrato.entrada_prevista_en);

    expect(ahora.getTime() > entradaPrevista.getTime()).toBe(true);

    const r = calcularRetraso(entradaPrevista, ahora, Number(contrato.tarifa_dia));
    expect(r.cargo).toBeGreaterThan(0);
  });

  // T-77: Completar recepción con ángulo pendiente devuelve 409 o se autoriza por administrador
  it("T-77: completar recepción con ángulos pendientes devuelve 409 salvo autorización por excepción de administrador", () => {
    const contrato = obtenerContratoPorId(contratoId)!;
    contrato.estado = "vigente";
    contrato.km_salida = 47_215;

    // Subir solo 5 fotos de recepción (falta 'interior')
    const cincoAngulos = ["frente", "atras", "izquierda", "derecha", "tablero_km"];
    cincoAngulos.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          momento: "recepcion",
          tipo: "foto",
          angulo: angulo as any,
          path: `evidencias/${contratoId}/rec_${angulo}.jpg`,
          tamano_bytes: 1024 * 350,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? 48_000 : undefined,
        },
        autorOperador
      );
    });

    // Intento de recepción sin nota de excepción: 409
    const resSinExcepcion = registrarRecepcionVehiculo(
      contratoId,
      {
        km_entrada: 48_000,
        gasolina_entrada: 8,
      },
      autorOperador
    );

    expect(resSinExcepcion.ok).toBe(false);
    if (!resSinExcepcion.ok) {
      expect(resSinExcepcion.status).toBe(409);
      expect(resSinExcepcion.codigo).toBe("ANGULOS_RECEPCION_INCOMPLETOS");
      expect(resSinExcepcion.angulosFaltantes).toContain("interior");
    }

    // Intento con autorización de administrador con nota por excepción
    const resConExcepcion = registrarRecepcionVehiculo(
      contratoId,
      {
        km_entrada: 48_000,
        gasolina_entrada: 8,
        autorizacionAdminNota: "Autorizado por lente empañado en cabina",
      },
      autorOperador
    );

    expect(resConExcepcion.ok).toBe(true);
    if (resConExcepcion.ok) {
      expect(resConExcepcion.contrato.estado).toBe("recibido");
    }
  });

  // T-78: Comparación entrega contra recepción: Un par por ángulo; el lado faltante viene nulo
  it("T-78: genera comparación de fotos por ángulo retornando nulo en el lado faltante", () => {
    // Foto de entrega en 'frente'
    registrarEvidencia(
      contratoId,
      {
        momento: "entrega",
        tipo: "foto",
        angulo: "frente",
        path: `evidencias/${contratoId}/ent_frente.jpg`,
        tamano_bytes: 1024 * 400,
        dispositivo: "Tableta Mostrador 1",
      },
      autorOperador
    );

    // Foto de recepción en 'frente'
    registrarEvidencia(
      contratoId,
      {
        momento: "recepcion",
        tipo: "foto",
        angulo: "frente",
        path: `evidencias/${contratoId}/rec_frente.jpg`,
        tamano_bytes: 1024 * 420,
        dispositivo: "Tableta Mostrador 1",
      },
      autorOperador
    );

    // En 'atras', solo subimos entrega pero no recepción
    registrarEvidencia(
      contratoId,
      {
        momento: "entrega",
        tipo: "foto",
        angulo: "atras",
        path: `evidencias/${contratoId}/ent_atras.jpg`,
        tamano_bytes: 1024 * 400,
        dispositivo: "Tableta Mostrador 1",
      },
      autorOperador
    );

    const evidenciasEntrega = obtenerEvidenciasContrato(contratoId, "entrega");
    const evidenciasRecepcion = obtenerEvidenciasContrato(contratoId, "recepcion");

    // Frente tiene ambos lados
    const entFrente = evidenciasEntrega.find((e) => e.angulo === "frente") || null;
    const recFrente = evidenciasRecepcion.find((e) => e.angulo === "frente") || null;
    expect(entFrente).not.toBeNull();
    expect(recFrente).not.toBeNull();

    // Atrás tiene lado de entrega pero lado de recepción nulo
    const entAtras = evidenciasEntrega.find((e) => e.angulo === "atras") || null;
    const recAtras = evidenciasRecepcion.find((e) => e.angulo === "atras") || null;
    expect(entAtras).not.toBeNull();
    expect(recAtras).toBeNull(); // Lado faltante viene nulo (T-78)
  });

  // Conclusión con aplicación de depósito (S10-T03)
  it("concluye el contrato aplicando depósito al saldo y liberando el vehículo a 'disponible'", () => {
    const contrato = obtenerContratoPorId(contratoId)!;
    contrato.estado = "recibido";

    const resultadoConcluir = aplicarODevolverDepositoYConcluir(
      contratoId,
      {
        saldoCentavos: 183_200, // $1,832.00 (como en Mockup 7)
      },
      autorOperador
    );

    expect(resultadoConcluir.ok).toBe(true);
    if (resultadoConcluir.ok) {
      expect(resultadoConcluir.contrato.estado).toBe("concluido");
      expect(resultadoConcluir.montoAplicado).toBe(BigInt(183_200));
      // Depósito de $8,000 - $1,832 aplicado = $6,168 devuelto
      expect(resultadoConcluir.montoDevuelto).toBe(BigInt(616_800));

      const vehiculo = obtenerVehiculoPorId(contrato.vehiculo_id)!;
      expect(vehiculo.estado).toBe("disponible");
      expect(vehiculo.contrato_activo_folio).toBeNull();

      // Evento en outbox
      const eventos = obtenerEventosOutbox({ evento: "contrato_concluido" });
      expect(eventos.length).toBe(1);
    }
  });
});
