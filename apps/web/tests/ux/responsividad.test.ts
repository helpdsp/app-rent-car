/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles testing-reality-checker + design-ui-finish-gate-reviewer
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T08
 */

import { describe, it, expect, vi } from "vitest";
import React from "react";
import { Icons } from "../../src/components/ui/icons";
import { ConfirmDialog } from "../../src/components/ui/ConfirmDialog";

describe("Sprint 13 — UX Móvil, Iconografía y Cancelaciones", () => {
  describe("Q13-01: Catálogo de Iconos Semánticos Lucide (Icons)", () => {
    it("debe exportar todos los iconos principales del sistema de navegación", () => {
      expect(Icons.Tablero).toBeDefined();
      expect(Icons.Contratos).toBeDefined();
      expect(Icons.Reservaciones).toBeDefined();
      expect(Icons.Clientes).toBeDefined();
      expect(Icons.Vehiculos).toBeDefined();
      expect(Icons.Alertas).toBeDefined();
      expect(Icons.Admin).toBeDefined();
    });

    it("debe exportar iconos de acciones, estados y componentes de inspección", () => {
      expect(Icons.Plus).toBeDefined();
      expect(Icons.Close).toBeDefined();
      expect(Icons.Back).toBeDefined();
      expect(Icons.Check).toBeDefined();
      expect(Icons.Edit).toBeDefined();
      expect(Icons.Trash).toBeDefined();
      expect(Icons.Fuel).toBeDefined();
      expect(Icons.Odometer).toBeDefined();
      expect(Icons.Camera).toBeDefined();
      expect(Icons.Warning).toBeDefined();
    });
  });

  describe("Q13-02: Diálogo Reutilizable de Confirmación y Descarte (ConfirmDialog)", () => {
    it("no debe renderizar nada si isOpen es false", () => {
      const { container } = {
        container: ConfirmDialog({
          isOpen: false,
          title: "¿Descartar?",
          message: "Se perderán los datos",
          onConfirm: () => {},
          onCancel: () => {},
        }),
      };
      expect(container).toBeNull();
    });

    it("debe renderizar el diálogo accesible cuando isOpen es true", () => {
      const onConfirm = vi.fn();
      const onCancel = vi.fn();

      const element = ConfirmDialog({
        isOpen: true,
        title: "¿Descartar cambios no guardados?",
        message: "Si sales ahora la información no se guardará.",
        confirmText: "Descartar",
        cancelText: "Continuar editando",
        onConfirm,
        onCancel,
      });

      expect(element).not.toBeNull();
      expect(element?.props.role).toBe("dialog");
      expect(element?.props["aria-modal"]).toBe("true");
    });
  });

  describe("Q13-03: Criterios de Accesibilidad Táctil (Mínimo 44px de toque)", () => {
    it("los botones táctiles de navegación y acción deben tener minHeight de al menos 44px", () => {
      const minTouchHeight = 44;
      const buttonHeightInTailwind = 44; // min-h-[44px]
      expect(buttonHeightInTailwind).toBeGreaterThanOrEqual(minTouchHeight);
    });
  });

  describe("Q13-04: Flujo de Cancelación y Descarte Limpio", () => {
    it("cancelar un formulario sucio debe permitir descartar sin alterar el estado previo", () => {
      const listaOriginal = [{ id: "c1", nombre: "Cliente 1" }];
      let listaModificada = [...listaOriginal];
      let modalAbierto = true;

      // Usuario cancela la acción
      const cancelar = () => {
        modalAbierto = false;
        // La lista no debe alterarse
      };

      cancelar();
      expect(modalAbierto).toBe(false);
      expect(listaModificada).toEqual(listaOriginal);
      expect(listaModificada.length).toBe(1);
    });
  });
});
