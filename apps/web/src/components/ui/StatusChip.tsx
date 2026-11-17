/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:14:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T11
 */

import React from "react";
import { MRA_TOKENS } from "./tokens";

export type StatusChipVariant =
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "neutral";

const VARIANT_STYLES: Record<
  StatusChipVariant,
  { background: string; color: string }
> = {
  success: {
    background: MRA_TOKENS.colors.statusSuccessBg,
    color: MRA_TOKENS.colors.statusSuccessText,
  },
  info: {
    background: MRA_TOKENS.colors.statusInfoBg,
    color: MRA_TOKENS.colors.statusInfoText,
  },
  warning: {
    background: MRA_TOKENS.colors.statusWarningBg,
    color: MRA_TOKENS.colors.statusWarningText,
  },
  danger: {
    background: MRA_TOKENS.colors.statusDangerBg,
    color: MRA_TOKENS.colors.statusDangerText,
  },
  neutral: {
    background: MRA_TOKENS.colors.statusNeutralBg,
    color: MRA_TOKENS.colors.statusNeutralText,
  },
};

export interface StatusChipProps {
  children: React.ReactNode;
  variant?: StatusChipVariant;
  style?: React.CSSProperties;
}

export function StatusChip({
  children,
  variant = "neutral",
  style,
}: StatusChipProps) {
  const palette = VARIANT_STYLES[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 12,
        background: palette.background,
        color: palette.color,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
