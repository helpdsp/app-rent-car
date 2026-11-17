/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:35:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 12
 * @task_id S12-T08
 * @description Prueba de ciclo completo de punta a punta del contrato de referencia 08160 (T-30, RF-14, S12-T08)
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  calcularCotizacionContrato,
  emitirContratoTransaccional,
  crearBorrador,
  obtenerContratoPorId,
  resetearEstadoContratos,
} from "../../src/lib/contratos/emitir";
import {
  registrarPago,
  obtenerPagosPorContrato,
  resetearEstadoPagos,
} from "../../src/lib/pagos/anticipo";
import {
  guardarVersionPDF,
  resetearEstadoPDFs,
} from "../../src/lib/pdf/guardar";
import {
  registrarFirmaDigital,
  resetearEstadoFirmas,
} from "../../src/lib/firma/registrar";
import {
  registrarEvidencia,
  resetearEstadoEvidencias,
  ANGULOS_OBLIGATORIOS,
} from "../../src/lib/storage/evidencias";
import {
  completarEntregaVehiculo,
  resetearEstadoInventarios,
} from "../../src/lib/contratos/entregar";
import {
  registrarRecepcionVehiculo,
} from "../../src/lib/contratos/recibir";
import {
  liquidarContrato,
} from "../../src/lib/contratos/liquidar";
import {
  aplicarODevolverDepositoYConcluir,
} from "../../src/lib/pagos/liquidar-deposito";
import {
  obtenerVehiculoPorId,
  resetearEstadoVehiculos,
} from "../../src/lib/db/sprint4";
import {
  consultarBitacora,
  resetearEstadoSprint2,
} from "../../src/lib/db/sprint2";
import {
  obtenerEventosOutbox,
  resetearEstadoOutbox,
} from "../../src/lib/db/outbox";

describe("Sprint 12 / E2E: Ciclo completo del contrato de referencia 08160 (S12-T08)", () => {
  const autorOperador = {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Mariana Rivera",
    rol: "operador",
  };

  beforeEach(() => {
    resetearEstadoSprint2();
    resetearEstadoContratos();
    resetearEstadoVehiculos();
    resetearEstadoPagos();
    resetearEstadoPDFs();
    resetearEstadoFirmas();
    resetearEstadoEvidencias();
    resetearEstadoInventarios();
    resetearEstadoOutbox();
  });

  it("reproduce el flujo integral de punta a punta: cotización 08160 -> anticipo -> firma -> entrega fotos -> devolución a tiempo -> conclusión", async () => {
    // -----------------------------------------------------------------------
    // PASO 1: Cotización exacta del contrato de referencia 08160
    // 3 días x $1,633/día = $4,899 de anticipo, hora extra $204, km extra $3
    // -----------------------------------------------------------------------
    const cotizacion = calcularCotizacionContrato({
      salida_en: "2026-11-13T17:30:00Z",
      entrada_prevista_en: "2026-11-16T17:30:00Z",
      tarifa_dia_propuesta: BigInt(163_300), // $1,633.00
    });

    expect(cotizacion.dias).toBe(3);
    expect(cotizacion.anticipo).toBe(BigInt(489_900)); // $4,899.00
    expect(cotizacion.tarifa_hora_extra).toBe(BigInt(20_400)); // $204.00
    expect(cotizacion.tarifa_km_extra).toBe(BigInt(300)); // $3.00
    expect(cotizacion.km_incluidos).toBe(1500);

    // -----------------------------------------------------------------------
    // PASO 2: Creación de borrador y Emisión transaccional con folio atómico
    // -----------------------------------------------------------------------
    const borrador = crearBorrador(
      {
        cliente_id: "12700000-0000-4000-8000-000000000127",
        cliente_nombre: "Ricardo Medina Salazar",
        vehiculo_id: "44444444-4444-4444-8444-444444444003",
        salida_en: "2026-11-13T17:30:00Z",
        entrada_prevista_en: "2026-11-16T17:30:00Z",
        destino: "Mexicali",
        conductores: [
          {
            nombre: "Ricardo Medina Salazar",
            licencia_numero: "B2302042880",
            licencia_vencimiento: "2028-05-27",
            es_arrendatario: true,
          },
        ],
        tarifa_dia: 163_300,
      },
      autorOperador
    );

    const resEmision = await emitirContratoTransaccional(borrador.id, autorOperador);

    expect(resEmision.ok).toBe(true);
    if (resEmision.ok) {
      expect(resEmision.contrato.estado).toBe("por_firmar");
      expect(resEmision.contrato.folio).toMatch(/^D-\d{5}$/);
    }

    const contratoId = borrador.id;

    // -----------------------------------------------------------------------
    // PASO 3: Registro de pago de anticipo de $4,899 y depósito de $8,000
    // (Cumpliendo regla: nunca guardar número de tarjeta completo)
    // -----------------------------------------------------------------------
    const pagoAnticipo = registrarPago(
      contratoId,
      {
        tipo: "anticipo",
        forma_pago: "tarjeta_credito",
        monto: BigInt(489_900),
        tarjeta_ultimos_4: "4242",
        tarjeta_tipo: "visa",
        referencia: "AUT-9921",
      } as any,
      autorOperador
    );
    expect(pagoAnticipo.ok).toBe(true);

    const pagoDeposito = registrarPago(
      contratoId,
      {
        tipo: "deposito_garantia",
        forma_pago: "tarjeta_credito",
        monto: BigInt(800_000), // $8,000.00 garantía
        tarjeta_ultimos_4: "4242",
        tarjeta_tipo: "visa",
        referencia: "AUT-9922",
      } as any,
      autorOperador
    );
    expect(pagoDeposito.ok).toBe(true);

    // -----------------------------------------------------------------------
    // PASO 4: Generación de PDF y firma táctil en tableta (inmutabilidad SHA-256)
    // -----------------------------------------------------------------------
    const pdfContenidoDummy = "%PDF-1.4 Mock Contract 08160 PDF binary stream...";
    const resPdf = guardarVersionPDF(
      contratoId,
      pdfContenidoDummy,
      autorOperador,
      { firmado: false }
    );
    expect(resPdf.sha256).toBeDefined();

    const trazoFirma = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
    const resFirma = registrarFirmaDigital(
      contratoId,
      {
        firmante_tipo: "arrendatario",
        firmante_nombre: "Ricardo Medina Salazar",
        imagen_base64: trazoFirma,
        ip: "192.168.1.105",
        dispositivo: "Tableta Mostrador 01",
      },
      autorOperador
    );

    expect(resFirma.ok).toBe(true);

    // -----------------------------------------------------------------------
    // PASO 5: Inspección de entrega y toma de 6 fotos obligatorias
    // -----------------------------------------------------------------------
    ANGULOS_OBLIGATORIOS.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          momento: "entrega",
          tipo: "foto",
          angulo,
          path: `evidencias/${contratoId}/ent_${angulo}.jpg`,
          tamano_bytes: 1024 * 350,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? 51_820 : undefined,
        },
        autorOperador
      );
    });

    const resEntrega = completarEntregaVehiculo(
      contratoId,
      {
        km_salida: 51_820,
        gasolina_salida: 8,
      },
      autorOperador
    );

    expect(resEntrega.ok).toBe(true);
    if (resEntrega.ok) {
      expect(resEntrega.contrato.estado).toBe("vigente");
      const veh = obtenerVehiculoPorId(borrador.vehiculo_id)!;
      expect(veh.estado).toBe("rentado");
    }

    // -----------------------------------------------------------------------
    // PASO 6: Recepción y devolución a tiempo (sin km extra, gasolina 8/8)
    // -----------------------------------------------------------------------
    ANGULOS_OBLIGATORIOS.forEach((angulo) => {
      registrarEvidencia(
        contratoId,
        {
          momento: "recepcion",
          tipo: "foto",
          angulo,
          path: `evidencias/${contratoId}/rec_${angulo}.jpg`,
          tamano_bytes: 1024 * 360,
          dispositivo: "Tableta Mostrador 1",
          km_capturado: angulo === "tablero_km" ? 52_820 : undefined, // 1000 km recorridos (< 1500 incluidos)
        },
        autorOperador
      );
    });

    const resRecepcion = registrarRecepcionVehiculo(
      contratoId,
      {
        km_entrada: 52_820,
        gasolina_entrada: 8,
        entrada_real_en: "2026-11-16T17:15:00Z", // 15 minutos antes de la fecha límite (a tiempo)
      },
      autorOperador
    );

    expect(resRecepcion.ok).toBe(true);
    if (resRecepcion.ok) {
      expect(resRecepcion.contrato.estado).toBe("recibido");
    }

    // -----------------------------------------------------------------------
    // PASO 7: Liquidación financiera -> Saldo $0
    // -----------------------------------------------------------------------
    const resLiquidacion = liquidarContrato(
      contratoId,
      {},
      autorOperador
    );
    expect(resLiquidacion.ok).toBe(true);
    if (resLiquidacion.ok) {
      expect(resLiquidacion.liquidacion.retraso.cargo).toBe(0);
      expect(resLiquidacion.liquidacion.km.cargo).toBe(0);
      expect(resLiquidacion.saldoCentavos).toBe(0); // Sin adeudo
    }

    // -----------------------------------------------------------------------
    // PASO 8: Liberación de depósito y conclusión definitiva
    // -----------------------------------------------------------------------
    const resConclusion = aplicarODevolverDepositoYConcluir(
      contratoId,
      {
        saldoCentavos: 0,
      },
      autorOperador
    );

    expect(resConclusion.ok).toBe(true);
    if (resConclusion.ok) {
      expect(resConclusion.contrato.estado).toBe("concluido");
      // Depósito de $8,000 devuelto íntegro al cliente
      expect(resConclusion.montoDevuelto).toBe(BigInt(800_000));
      expect(resConclusion.montoAplicado).toBe(BigInt(0));

      const vehFinal = obtenerVehiculoPorId(borrador.vehiculo_id)!;
      expect(vehFinal.estado).toBe("disponible");
      expect(vehFinal.contrato_activo_folio).toBeNull();
    }

    // -----------------------------------------------------------------------
    // PASO 9: Verificación de auditoría inmutable y outbox
    // -----------------------------------------------------------------------
    const bitacora = consultarBitacora();
    expect(bitacora.length).toBeGreaterThan(5);

    const eventosOutbox = obtenerEventosOutbox();
    const concluidos = eventosOutbox.filter((e) => e.evento === "contrato_concluido");
    expect(concluidos.length).toBe(1);
  });
});
