/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:15:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T11
 */

import React from "react";
import { MRA_TOKENS } from "./tokens";

export const PASOS_CONTRATO = [
  { numero: 1, etiqueta: "Cliente" },
  { numero: 2, etiqueta: "Vehículo y fechas" },
  { numero: 3, etiqueta: "Cobro y garantía" },
  { numero: 4, etiqueta: "Firma" },
  { numero: 5, etiqueta: "Entrega" },
] as const;

export interface ContractStepperProps {
  /** Paso activo (1 a 5). Los anteriores aparecen completados (✓). */
  pasoActual: 1 | 2 | 3 | 4 | 5;
}

export function ContractStepper({ pasoActual }: ContractStepperProps) {
  return (
    <ol
      aria-label="Pasos del contrato"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {PASOS_CONTRATO.map((paso, index) => {
        const completado = paso.numero < pasoActual;
        const activo = paso.numero === pasoActual;
        const colorTexto = completado
          ? MRA_TOKENS.colors.statusSuccessText
          : activo
            ? MRA_TOKENS.colors.brandRed
            : MRA_TOKENS.colors.textMuted;

        return (
          <React.Fragment key={paso.numero}>
            {index > 0 && (
              <li
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: 2,
                  background: completado
                    ? MRA_TOKENS.colors.statusSuccessText
                    : MRA_TOKENS.colors.borderInput,
                }}
              />
            )}
            <li
              aria-current={activo ? "step" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: colorTexto,
              }}
            >
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: completado
                    ? MRA_TOKENS.colors.statusSuccessText
                    : activo
                      ? MRA_TOKENS.colors.brandRed
                      : "transparent",
                  color: completado || activo ? "#ffffff" : colorTexto,
                  border:
                    completado || activo
                      ? "none"
                      : `2px solid ${MRA_TOKENS.colors.borderInput}`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                {completado ? "✓" : paso.numero}
              </span>
              {paso.etiqueta}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
}
