/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:15:00Z
 * @agent_roles testing-reality-checker + testing-api-tester
 * @vision_command start_sprint --sprint 14
 * @sprint_number 14
 * @task_id S14-T08
 */

import { describe, it, expect } from "vitest";
import {
  obtenerReservaciones,
  crearReservacion,
  cancelarReservacion,
  convertirReservacionEnContrato,
} from "../src/lib/db/reservaciones";

describe("Sprint 14 — Flujo de Reservaciones, DatePicker y Conversión a Contrato", () => {
  const clienteId = "22222222-2222-4222-8222-222222222001";
  const vehiculoId = "44444444-4444-4444-8444-444444444003";

  describe("Q14-01: Listado de reservaciones y búsqueda", () => {
    it("debe listar las reservaciones existentes con folios R-00001 y R-00002", () => {
      const reservas = obtenerReservaciones();
      expect(reservas.length).toBeGreaterThanOrEqual(2);
      expect(reservas.some((r) => r.folio.startsWith("R-"))).toBe(true);
    });

    it("debe filtrar reservaciones por estado", () => {
      const confirmadas = obtenerReservaciones({ estado: "confirmada" });
      expect(confirmadas.every((r) => r.estado === "confirmada")).toBe(true);

      const pendientes = obtenerReservaciones({ estado: "pendiente" });
      expect(pendientes.every((r) => r.estado === "pendiente")).toBe(true);
    });
  });

  describe("Q14-02: Generación atómica de nueva reservación con serie R-xxxxx", () => {
    it("debe crear una reservación con folio secuencial y cálculo de anticipo", () => {
      const fechaInicio = new Date(Date.now() + 86400000 * 10).toISOString();
      const fechaFin = new Date(Date.now() + 86400000 * 13).toISOString(); // 3 días

      const res = crearReservacion({
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        lugar_entrega: "Sucursal Mexicali",
        observaciones: "Prueba unitaria reservación",
      });

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.reservacion.folio).toMatch(/^R-\d{5}$/);
        expect(res.reservacion.dias_renta).toBe(3);
        expect(res.reservacion.anticipo_requerido).toBe(BigInt(163300 * 3));
        expect(res.reservacion.estado).toBe("pendiente");
      }
    });

    it("debe rechazar una reservación si fecha_fin es anterior a fecha_inicio", () => {
      const res = crearReservacion({
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_inicio: new Date(Date.now() + 86400000 * 5).toISOString(),
        fecha_fin: new Date(Date.now() + 86400000 * 2).toISOString(),
      });

      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.codigo).toBe("RANGO_INVALIDO");
      }
    });
  });

  describe("Q14-03: Validación de no solapamiento temporal de flota", () => {
    it("debe rechazar una reserva si el auto ya está reservado en ese mismo rango de fechas", () => {
      const fechaInicio = new Date(Date.now() + 86400000 * 20).toISOString();
      const fechaFin = new Date(Date.now() + 86400000 * 25).toISOString();

      // Primera reserva exitosa
      const res1 = crearReservacion({
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      expect(res1.ok).toBe(true);

      // Segunda reserva para el mismo auto en fechas que se traslapan
      const res2 = crearReservacion({
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_inicio: new Date(Date.now() + 86400000 * 22).toISOString(),
        fecha_fin: new Date(Date.now() + 86400000 * 24).toISOString(),
      });

      expect(res2.ok).toBe(false);
      if (!res2.ok) {
        expect(res2.codigo).toBe("VEHICULO_NO_DISPONIBLE");
      }
    });
  });

  describe("Q14-04: Conversión de reservación a contrato y cancelación", () => {
    it("debe convertir una reservación activa a contrato generando folio D-xxxxx", () => {
      const fechaInicio = new Date(Date.now() + 86400000 * 30).toISOString();
      const fechaFin = new Date(Date.now() + 86400000 * 32).toISOString();

      const res = crearReservacion({
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      expect(res.ok).toBe(true);

      if (res.ok) {
        const conversion = convertirReservacionEnContrato(res.reservacion.id);
        expect(conversion.ok).toBe(true);
        if (conversion.ok) {
          expect(conversion.reservacion.estado).toBe("convertida");
          expect(conversion.contratoFolio).toMatch(/^D-\d{5}$/);
          expect(conversion.reservacion.contrato_id).toBeDefined();
        }
      }
    });

    it("debe permitir cancelar una reservación pendiente registrando motivo", () => {
      const fechaInicio = new Date(Date.now() + 86400000 * 40).toISOString();
      const fechaFin = new Date(Date.now() + 86400000 * 42).toISOString();

      const res = crearReservacion({
        cliente_id: clienteId,
        vehiculo_id: vehiculoId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      expect(res.ok).toBe(true);

      if (res.ok) {
        const cancelacion = cancelarReservacion(res.reservacion.id, "Cliente cambió de fecha");
        expect(cancelacion.ok).toBe(true);
        if (cancelacion.ok) {
          expect(cancelacion.reservacion.estado).toBe("cancelada");
          expect(cancelacion.reservacion.motivo_cancelacion).toBe("Cliente cambió de fecha");
        }
      }
    });
  });
});
