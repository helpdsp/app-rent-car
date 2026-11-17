/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:15:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T11
 */

import React from "react";
import Link from "next/link";
import { MRA_TOKENS } from "./tokens";

export type SeccionNavegacion =
  | "tablero"
  | "contratos"
  | "clientes"
  | "vehiculos"
  | "alertas"
  | "admin";

export interface SidebarNavProps {
  seccionActiva: SeccionNavegacion;
}

const ITEMS_NAVEGACION: Array<{
  id: SeccionNavegacion;
  etiqueta: string;
  href: string;
  icono: React.ReactNode;
}> = [
  {
    id: "tablero",
    etiqueta: "Tablero",
    href: "/",
    icono: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    id: "contratos",
    etiqueta: "Contratos",
    href: "/contratos",
    icono: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4" />
      </svg>
    ),
  },
  {
    id: "clientes",
    etiqueta: "Clientes",
    href: "/clientes",
    icono: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <path d="M16 5a3.5 3.5 0 010 6" />
        <path d="M18 14c2.2.7 3.5 2.6 3.5 6" />
      </svg>
    ),
  },
  {
    id: "vehiculos",
    etiqueta: "Vehículos",
    href: "/vehiculos",
    icono: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 16v-4l2-5h12l2 5v4" />
        <path d="M3 16h18" />
        <circle cx="7.5" cy="17.5" r="1.8" />
        <circle cx="16.5" cy="17.5" r="1.8" />
      </svg>
    ),
  },
  {
    id: "alertas",
    etiqueta: "Alertas",
    href: "/alertas",
    icono: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 17v-6a6 6 0 0112 0v6l1.5 2h-15z" />
        <path d="M10 21h4" />
      </svg>
    ),
  },
  {
    id: "admin",
    etiqueta: "Admin",
    href: "/admin/usuarios",
    icono: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </svg>
    ),
  },
];

export function SidebarNav({ seccionActiva }: SidebarNavProps) {
  return (
    <nav
      aria-label="Principal"
      style={{
        width: 112,
        flex: "none",
        background: MRA_TOKENS.colors.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "20px 0",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: MRA_TOKENS.colors.brandRed,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MRA_TOKENS.fonts.display,
          fontWeight: 700,
          fontSize: 20,
          marginBottom: 12,
        }}
      >
        MRA
      </div>

      {ITEMS_NAVEGACION.map((item) => {
        const activo = item.id === seccionActiva;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={activo ? "page" : undefined}
            style={{
              width: 92,
              height: 72,
              borderRadius: 14,
              background: activo ? MRA_TOKENS.colors.brandRed : "transparent",
              color: activo ? "#ffffff" : MRA_TOKENS.colors.borderInput,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: activo ? 600 : 500,
            }}
          >
            {item.icono}
            {item.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
