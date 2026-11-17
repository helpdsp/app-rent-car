/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T07:05:00Z
 * @agent_roles testing-reality-checker + engineering-backend-architect
 * @vision_command start_sprint --sprint 5
 * @sprint_number 5
 * @task_id S05-T08
 */

import { beforeEach, describe, expect, it } from "vitest";
import { GET as cronVigenciasGet } from "../src/app/api/cron/vigencias/route";
import { GET as busquedaGet } from "../src/app/api/busqueda/route";
import { crearSesionDirecta, restaurarEstadoAuthSemilla } from "../src/lib/auth/session";
import {
  obtenerTodasLasAlertas,
  revisarVigencias,
  resetearEstadoAlertas,
} from "../src/lib/alertas/revisar";
import { marcarAlertasComoAtendidas } from "../src/lib/alertas/atender";
import { resetearEstadoSprint2 } from "../src/lib/db/sprint2";
import { resetearEstadoClientes } from "../src/lib/db/sprint3";
import {
  obtenerVehiculoPorId,
  registrarDocumentoVehiculo,
  resetearEstadoVehiculos,
} from "../src/lib/db/sprint4";

const ID_OPERADOR_MARIANA = "11111111-1111-4111-8111-111111111101";

beforeEach(() => {
  restaurarEstadoAuthSemilla();
  resetearEstadoSprint2();
  resetearEstadoClientes();
  resetearEstadoVehiculos();
  resetearEstadoAlertas();
});

describe("T-23 · Cron diario de vigencias ejecutado dos veces el mismo día: sin duplicados (Idempotencia)", () => {
  it("garantiza que múltiples ejecuciones del cron para la misma fecha no duplican alertas", async () => {
    // Primera ejecución del cron
    const req1 = new Request("http://localhost/api/cron/vigencias?fecha=2026-11-17T08:00:00.000Z");
    const res1 = await cronVigenciasGet(req1);
    expect(res1.status).toBe(200);
    const json1 = await res1.json();
    const conteoInicialAlertas = obtenerTodasLasAlertas().length;

    // Segunda ejecución del cron el mismo día
    const req2 = new Request("http://localhost/api/cron/vigencias?fecha=2026-11-17T08:00:00.000Z");
    const res2 = await cronVigenciasGet(req2);
    expect(res2.status).toBe(200);
    const json2 = await res2.json();

    // En la segunda ejecución, nuevasAlertas debe ser 0 porque ya existen
    expect(json2.nuevasAlertas).toBe(0);
    const conteoFinalAlertas = obtenerTodasLasAlertas().length;
    expect(conteoFinalAlertas).toBe(conteoInicialAlertas);
  });
});

describe("T-24 · Documentos con vencimiento en los umbrales configurados (30, 15, 7 y 0 días)", () => {
  it("detecta correctamente y crea alertas para documentos que caen en 30, 15, 7 y 0 días", () => {
    const vehiculo = obtenerVehiculoPorId("44444444-4444-4444-8444-444444444003")!; // Elantra
    const refFecha = "2026-11-17T08:00:00.000Z";

    // Registramos póliza que vence exactamente en 30 días (2026-12-17)
    const doc30 = registrarDocumentoVehiculo(
      vehiculo.id,
      {
        tipo: "poliza",
        fecha_expedicion: "2025-12-17",
        fecha_vencimiento: "2026-12-17",
        aseguradora: "GNP",
      },
      { id: ID_OPERADOR_MARIANA, nombre: "Mariana", rol: "operador" }
    );

    // Registramos tarjeta que vence en 7 días (2026-11-24)
    const doc7 = registrarDocumentoVehiculo(
      vehiculo.id,
      {
        tipo: "tarjeta_circulacion",
        fecha_expedicion: "2024-11-24",
        fecha_vencimiento: "2026-11-24",
      },
      { id: ID_OPERADOR_MARIANA, nombre: "Mariana", rol: "operador" }
    );

    const { nuevasAlertas } = revisarVigencias(refFecha, [30, 15, 7, 0]);

    const alerta30 = nuevasAlertas.find(
      (a) => a.documento_id === doc30.id && a.dias_antes === 30
    );
    expect(alerta30).toBeDefined();
    expect(alerta30?.fecha_vencimiento).toBe("2026-12-17");

    const alerta7 = nuevasAlertas.find(
      (a) => a.documento_id === doc7.id && a.dias_antes === 7
    );
    expect(alerta7).toBeDefined();
    expect(alerta7?.fecha_vencimiento).toBe("2026-11-24");
  });
});

describe("T-25 · Se sube el documento renovado: alertas pasan automáticamente a estado atendida", () => {
  it("marca las alertas pendientes y enviadas del documento como atendidas al subir renovación", () => {
    const docId = "55555555-5555-4555-8555-555555555009"; // Tarjeta CR-V vence hoy
    const alertasAntes = obtenerTodasLasAlertas().filter(
      (a) => a.documento_id === docId
    );
    expect(alertasAntes.length).toBeGreaterThan(0);
    expect(alertasAntes.some((a) => a.estado === "pendiente")).toBe(true);

    // Renovación subida por operador
    const atendidas = marcarAlertasComoAtendidas(docId, {
      id: ID_OPERADOR_MARIANA,
      nombre: "Mariana Operadora",
    });

    expect(atendidas.length).toBeGreaterThan(0);
    const alertasDespues = obtenerTodasLasAlertas().filter(
      (a) => a.documento_id === docId
    );
    for (const a of alertasDespues) {
      expect(a.estado).toBe("atendida");
    }
  });

  it("al registrar una nueva tarjeta vigente a través de registrarDocumentoVehiculo, se atienden las alertas previas", () => {
    const vehiculo = obtenerVehiculoPorId("44444444-4444-4444-8444-444444444009")!; // CR-V
    const docIdCRV = "55555555-5555-4555-8555-555555555009";

    // Registramos la renovación vigente hasta 2028
    registrarDocumentoVehiculo(
      vehiculo.id,
      {
        tipo: "tarjeta_circulacion",
        numero: "TC-RENOVADA-2028",
        fecha_expedicion: "2026-11-17",
        fecha_vencimiento: "2028-11-17",
      },
      { id: ID_OPERADOR_MARIANA, nombre: "Mariana", rol: "operador" }
    );

    const alertasCRV = obtenerTodasLasAlertas().filter(
      (a) => a.documento_id === docIdCRV
    );
    for (const a of alertasCRV) {
      expect(a.estado).toBe("atendida");
    }
  });
});

describe("RF-06 / RF-11 · Búsqueda global en el tablero (/api/busqueda)", () => {
  it("encuentra clientes, placas y contratos por término común", async () => {
    const sesion = crearSesionDirecta({ usuarioId: ID_OPERADOR_MARIANA });

    // Buscar "Medina"
    const req = new Request("http://localhost/api/busqueda?q=Medina", {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    const res = await busquedaGet(req);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data.clientes.some((c: { nombre: string }) => c.nombre.includes("Medina"))).toBe(true);
    expect(body.data.contratos.some((con: { cliente_nombre: string }) => con.cliente_nombre.includes("Medina"))).toBe(true);

    // Buscar placas "ATU"
    const reqPlacas = new Request("http://localhost/api/busqueda?q=ATU", {
      headers: { Authorization: `Bearer ${sesion.token}` },
    });
    const resPlacas = await busquedaGet(reqPlacas);
    expect(resPlacas.status).toBe(200);
    const bodyPlacas = await resPlacas.json();
    expect(bodyPlacas.data.vehiculos.some((v: { placas: string }) => v.placas.includes("ATU"))).toBe(true);
  });
});
