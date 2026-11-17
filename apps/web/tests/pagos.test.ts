/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:50:00Z
 * @agent_roles testing-reality-checker
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T09
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  registrarPago,
  validarAnticipoCompleto,
  validarRequisitosPasoAVigente,
  resetearEstadoPagos,
  detectarNumeroTarjetaCompleto,
  type PagoRow,
} from "../src/lib/pagos/anticipo";
import { registrarDepositoGarantia } from "../src/lib/pagos/deposito";
import {
  agregarConductorAContrato,
  validarConductoresParaEmision,
  resetearEstadoConductores,
} from "../src/lib/contratos/conductores";
import { validarRequisitosEmision } from "../src/lib/contratos/validar";
import {
  crearBorrador,
  obtenerContratoPorId,
  resetearEstadoContratos,
} from "../src/lib/contratos/emitir";

describe("Sprint 7: Contrato núcleo II: pagos, conductores, garantía y facturación (T-38 a T-47)", () => {
  const autorTest = {
    id: "11111111-1111-4111-8111-111111111101",
    nombre: "Operador Mostrador",
  };

  const contratoId = "77777777-7777-4777-8777-777777777000";

  beforeEach(() => {
    resetearEstadoPagos();
    resetearEstadoConductores();
    resetearEstadoContratos();
  });

  // T-38: Registrar garantía con tarjeta: solo se guardan tipo y últimos 4; un número completo se rechaza
  it("T-38: registrar garantía con tarjeta guarda solo tipo y últimos 4; rechaza número completo", () => {
    // 1. Registro correcto con solo los últimos 4 dígitos
    const resValido = registrarDepositoGarantia(
      contratoId,
      {
        forma: "tarjeta_credito",
        monto: 800_000, // $8,000.00
        tarjeta_ultimos_4: "4242",
        tarjeta_tipo: "Visa",
      },
      autorTest
    );
    expect(resValido.ok).toBe(true);
    if (resValido.ok) {
      expect(resValido.pago.tarjeta_ultimos_4).toBe("4242");
      expect(resValido.recibo.folio).toMatch(/^REC-\d{5}$/);
      expect(resValido.recibo.monto).toBe(BigInt(800_000));
    }

    // 2. Intento de enviar número completo de 16 dígitos -> rechazo inmediato
    const resRechazado = registrarPago(
      contratoId,
      {
        tipo: "deposito_garantia",
        forma: "tarjeta_credito",
        monto: 800_000,
        tarjeta_numero: "4111111111114242", // 16 dígitos PAN
      },
      autorTest
    );
    expect(resRechazado.ok).toBe(false);
    if (!resRechazado.ok) {
      expect(resRechazado.codigo).toBe("NUMERO_TARJETA_PROHIBIDO");
    }
  });

  // T-39: Pasar a vigente sin anticipo o depósito: 409
  it("T-39: no permite pasar a vigente si falta el anticipo o el depósito en garantía", () => {
    const rentaBase = BigInt(489_900); // $4,899.00
    const sinPagos: PagoRow[] = [];

    // Faltan ambos
    const resSinPagos = validarRequisitosPasoAVigente(rentaBase, sinPagos);
    expect(resSinPagos.permitido).toBe(false);
    expect(resSinPagos.codigo).toBe("ANTICIPO_INSUFICIENTE");

    // Con anticipo cubierto pero sin depósito en garantía
    const soloAnticipo: PagoRow[] = [
      {
        id: "p-1",
        contrato_id: contratoId,
        tipo: "anticipo",
        forma: "efectivo",
        monto: rentaBase,
        recibido_por: autorTest.id,
        created_at: new Date().toISOString(),
      },
    ];
    const resSinDeposito = validarRequisitosPasoAVigente(rentaBase, soloAnticipo);
    expect(resSinDeposito.permitido).toBe(false);
    expect(resSinDeposito.codigo).toBe("DEPOSITO_GARANTIA_REQUERIDO");
  });

  // T-40: Conductor adicional con licencia vencida es rechazado
  it("T-40: rechaza registrar conductor adicional con licencia vencida durante el periodo de renta", () => {
    // El contrato vence el 2026-11-19
    const res = agregarConductorAContrato(
      contratoId,
      {
        nombre: "Conductor Con Licencia Vencida",
        licencia_numero: "LIC-VENCIDA-99",
        licencia_vencimiento: "2026-11-17", // Vence antes del 19
        es_arrendatario: false,
      },
      autorTest
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.codigo).toBe("LICENCIA_VENCIDA");
      expect(res.error).toContain("licencia");
    }
  });

  // T-41: Anticipo pagado en dos formas ($4,399 efectivo y $500 transferencia para $4,899)
  it("T-41: permite pagos mixtos ($4,399 efectivo + $500 transferencia) y habilita paso a vigente al cubrir la renta", () => {
    const rentaBase = BigInt(489_900);

    const pago1 = registrarPago(
      contratoId,
      {
        tipo: "anticipo",
        forma: "efectivo",
        monto: 439_900,
      },
      autorTest
    );

    const pago2 = registrarPago(
      contratoId,
      {
        tipo: "anticipo",
        forma: "transferencia",
        monto: 50_000,
        referencia: "SPEI 998877",
      },
      autorTest
    );

    const deposito = registrarDepositoGarantia(
      contratoId,
      {
        forma: "efectivo",
        monto: 800_000,
      },
      autorTest
    );

    expect(pago1.ok).toBe(true);
    expect(pago2.ok).toBe(true);
    expect(deposito.ok).toBe(true);

    if (pago1.ok && pago2.ok && deposito.ok) {
      const pagos = [pago1.pago, pago2.pago, deposito.pago];
      const resAnticipo = validarAnticipoCompleto(pagos, rentaBase);
      expect(resAnticipo.completo).toBe(true);
      expect(resAnticipo.totalPagado).toBe(BigInt(489_900));

      const transicion = validarRequisitosPasoAVigente(rentaBase, pagos);
      expect(transicion.permitido).toBe(true);
    }
  });

  // T-42: Anticipo cuyos pagos suman menos que la renta base: no pasa a vigente
  it("T-42: pagos de anticipo que suman menos que la renta base no permiten pasar a vigente", () => {
    const rentaBase = BigInt(489_900);
    const pagosIncompletos: PagoRow[] = [
      {
        id: "p-parcial",
        contrato_id: contratoId,
        tipo: "anticipo",
        forma: "efectivo",
        monto: BigInt(400_000), // Solo $4,000 de $4,899
        recibido_por: autorTest.id,
        created_at: new Date().toISOString(),
      },
      {
        id: "p-dep",
        contrato_id: contratoId,
        tipo: "deposito_garantia",
        forma: "efectivo",
        monto: BigInt(800_000),
        recibido_por: autorTest.id,
        created_at: new Date().toISOString(),
      },
    ];

    const estado = validarAnticipoCompleto(pagosIncompletos, rentaBase);
    expect(estado.completo).toBe(false);
    expect(estado.faltante).toBe(BigInt(89_900)); // Faltan $899

    const transicion = validarRequisitosPasoAVigente(rentaBase, pagosIncompletos);
    expect(transicion.permitido).toBe(false);
    expect(transicion.codigo).toBe("ANTICIPO_INSUFICIENTE");
  });

  // T-43: Arrendatario sin licencia y conductor adicional con licencia vigente (caso 08590) -> se puede emitir
  it("T-43: caso 08590: arrendatario sin licencia puede emitir si un conductor adicional tiene licencia vigente", () => {
    const conductores = [
      {
        nombre: "Arrendatario Sin Licencia",
        licencia_numero: "SIN-LICENCIA",
        licencia_vencimiento: "2020-01-01", // Vencida hace años
        es_arrendatario: true,
      },
      {
        nombre: "Conductor Designado",
        licencia_numero: "B2201880432",
        licencia_vencimiento: "2028-05-27", // Vigente durante todo el periodo
        es_arrendatario: false,
      },
    ];

    const res = validarConductoresParaEmision(conductores, "2026-11-19T11:00:00Z");
    expect(res.valido).toBe(true);

    const validacionGeneral = validarRequisitosEmision({
      salida_en: "2026-11-16T11:00:00Z",
      entrada_prevista_en: "2026-11-19T11:00:00Z",
      vehiculo_id: "44444444-4444-4444-8444-444444444003",
      conductores,
    });
    expect(validacionGeneral.valido).toBe(true);
  });

  // T-44: Arrendatario y conductor adicional sin licencia vigente -> 422 LICENCIA_VENCIDA
  it("T-44: rechaza emisión si ni el arrendatario ni ningún conductor adicional tienen licencia vigente", () => {
    const conductores = [
      {
        nombre: "Arrendatario Sin Licencia",
        licencia_numero: "SIN-LICENCIA-1",
        licencia_vencimiento: "2022-01-01",
        es_arrendatario: true,
      },
      {
        nombre: "Conductor Adicional Con Licencia Vencida",
        licencia_numero: "SIN-LICENCIA-2",
        licencia_vencimiento: "2026-10-15", // Venció un mes antes
        es_arrendatario: false,
      },
    ];

    const res = validarConductoresParaEmision(conductores, "2026-11-19T11:00:00Z");
    expect(res.valido).toBe(false);
    expect(res.codigo).toBe("LICENCIA_VENCIDA");
  });

  // T-45: Tarifa pactada distinta del catálogo sin motivo -> 422 MOTIVO_TARIFA_REQUERIDO
  it("T-45: tarifa diaria pactada distinta del catálogo sin motivo es rechazada con 422", () => {
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
      tarifa_catalogo_dia: BigInt(163_300), // Catálogo: $1,633.00
      tarifa_dia: BigInt(140_000), // Pactada: $1,400.00
      tarifa_motivo: null, // Sin motivo especificado
    });

    expect(validacion.valido).toBe(false);
    expect(validacion.codigo).toBe("MOTIVO_TARIFA_REQUERIDO");

    // Con motivo debe ser válida
    const validacionConMotivo = validarRequisitosEmision({
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
      tarifa_catalogo_dia: BigInt(163_300),
      tarifa_dia: BigInt(140_000),
      tarifa_motivo: "Convenio cliente frecuente autorizado por gerencia",
    });
    expect(validacionConMotivo.valido).toBe(true);
  });

  // T-46: «Facturar a» con nombre y RFC distintos del arrendatario (caso 08357)
  it("T-46: caso 08357: guarda 'facturar a' con nombre y RFC propios en el contrato sin alterar el cliente", () => {
    const borrador = crearBorrador(
      {
        cliente_id: "12700000-0000-4000-8000-000000000127",
        cliente_nombre: "Ricardo Medina Salazar",
        vehiculo_id: "44444444-4444-4444-8444-444444444003",
        salida_en: "2026-11-16T11:00:00Z",
        entrada_prevista_en: "2026-11-19T11:00:00Z",
        facturar_a_nombre: "Empresa Constructora Frontera S.A. de C.V.",
        facturar_a_rfc: "ECF180512AB3",
      },
      autorTest
    );

    expect(borrador.cliente_nombre).toBe("Ricardo Medina Salazar");
    expect(borrador.facturar_a_nombre).toBe("Empresa Constructora Frontera S.A. de C.V.");
    expect(borrador.facturar_a_rfc).toBe("ECF180512AB3");

    const obtenido = obtenerContratoPorId(borrador.id);
    expect(obtenido?.facturar_a_nombre).toBe("Empresa Constructora Frontera S.A. de C.V.");
    expect(obtenido?.facturar_a_rfc).toBe("ECF180512AB3");
  });

  // T-47: Pago con tarjeta: solo se guardan forma y últimos 4 dígitos; un número completo se rechaza
  it("T-47: pago con tarjeta almacena únicamente la forma y últimos 4 dígitos; número completo se rechaza", () => {
    // 1. Detección de PAN en cadenas
    expect(detectarNumeroTarjetaCompleto("4111 2222 3333 4444")).toBe(true);
    expect(detectarNumeroTarjetaCompleto("4111-2222-3333-4444")).toBe(true);
    expect(detectarNumeroTarjetaCompleto("4111222233334444")).toBe(true);
    expect(detectarNumeroTarjetaCompleto("Autorización 123456")).toBe(false);

    // 2. Registro válido con 4 dígitos
    const pagoOk = registrarPago(
      contratoId,
      {
        tipo: "anticipo",
        forma: "tarjeta_credito",
        monto: 489_900,
        tarjeta_ultimos_4: "1234",
        tarjeta_tipo: "Mastercard",
      },
      autorTest
    );
    expect(pagoOk.ok).toBe(true);
    if (pagoOk.ok) {
      expect(pagoOk.pago.tarjeta_ultimos_4).toBe("1234");
      expect(pagoOk.pago.tarjeta_tipo).toBe("Mastercard");
    }

    // 3. Intento de enviar tarjeta completa en referencia
    const pagoReferenciaInvalida = registrarPago(
      contratoId,
      {
        tipo: "anticipo",
        forma: "tarjeta_credito",
        monto: 489_900,
        referencia: "Cobro a tarjeta 4532 0150 9988 1234",
      },
      autorTest
    );
    expect(pagoReferenciaInvalida.ok).toBe(false);
    if (!pagoReferenciaInvalida.ok) {
      expect(pagoReferenciaInvalida.codigo).toBe("NUMERO_TARJETA_PROHIBIDO");
    }
  });
});
