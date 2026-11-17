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

export interface SurfaceCardProps {
  children: React.ReactNode;
  as?: "div" | "section" | "aside";
  ariaLabel?: string;
  padding?: string;
  borderRadius?: number;
  style?: React.CSSProperties;
}

export function SurfaceCard({
  children,
  as: Component = "div",
  ariaLabel,
  padding = "16px 20px",
  borderRadius = 16,
  style,
}: SurfaceCardProps) {
  return (
    <Component
      aria-label={ariaLabel}
      style={{
        background: "#ffffff",
        border: `1px solid ${MRA_TOKENS.colors.borderCard}`,
        borderRadius,
        padding,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
