/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:14:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T11
 */

/**
 * Tokens visuales y tipográficos extraídos de `spec-kit/input/mockups/`
 * (Rojo marca #B5141B sobre papel crema #F6F2E8, Inter + Space Grotesk,
 * controles táctiles de al menos 44 px).
 */
export const MRA_TOKENS = {
  colors: {
    brandRed: "#B5141B",
    brandRedDark: "#8E1016",
    brandRedSoft: "#FBE9E7",
    paperCream: "#F6F2E8",
    paperSubtle: "#FBF9F3",
    ink: "#1E1A16",
    textSecondary: "#4A443B",
    textMuted: "#6B645A",
    borderCard: "#E3DCCB",
    borderInput: "#CFC8B8",
    borderDivider: "#EFE9DB",
    statusSuccessBg: "#E3F3EA",
    statusSuccessText: "#14583A",
    statusInfoBg: "#E8EEF7",
    statusInfoText: "#1F3A63",
    statusWarningBg: "#FFF1D6",
    statusWarningText: "#7A4A00",
    statusDangerBg: "#FBE9E7",
    statusDangerText: "#8E1016",
    statusNeutralBg: "#EFEAE0",
    statusNeutralText: "#4A443B",
  },
  fonts: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    display: "'Space Grotesk', system-ui, -apple-system, sans-serif",
  },
  touchTargetMinPx: 44,
} as const;

/**
 * Convierte centavos enteros (MXN) a formato legible en pesos (ej. 489900 -> "$4,899").
 * Nunca usa decimales salvo que existan centavos residuales.
 */
export function formatearMonedaCentavos(centavos: number): string {
  const pesos = Math.round(centavos / 100);
  return `$${pesos.toLocaleString("es-MX")}`;
}
