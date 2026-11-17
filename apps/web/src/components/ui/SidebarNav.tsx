/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles engineering-frontend-developer + design-ui-designer + design-ux-architect
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T02
 */

import React from "react";
import Link from "next/link";
import { MRA_TOKENS } from "./tokens";
import { Icons } from "./icons";

export type SeccionNavegacion =
  | "tablero"
  | "contratos"
  | "reservaciones"
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
  icono: (activo: boolean) => React.ReactNode;
}> = [
  {
    id: "tablero",
    etiqueta: "Tablero",
    href: "/",
    icono: (activo) => <Icons.Tablero size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
  {
    id: "contratos",
    etiqueta: "Contratos",
    href: "/contratos",
    icono: (activo) => <Icons.Contratos size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
  {
    id: "reservaciones",
    etiqueta: "Reservas",
    href: "/reservaciones",
    icono: (activo) => <Icons.Reservaciones size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
  {
    id: "clientes",
    etiqueta: "Clientes",
    href: "/clientes",
    icono: (activo) => <Icons.Clientes size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
  {
    id: "vehiculos",
    etiqueta: "Vehículos",
    href: "/vehiculos",
    icono: (activo) => <Icons.Vehiculos size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
  {
    id: "alertas",
    etiqueta: "Alertas",
    href: "/alertas",
    icono: (activo) => <Icons.Alertas size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
  {
    id: "admin",
    etiqueta: "Admin",
    href: "/admin/usuarios",
    icono: (activo) => <Icons.Admin size={22} color={activo ? "#ffffff" : "#CFC8B8"} />,
  },
];

export function SidebarNav({ seccionActiva }: SidebarNavProps) {
  return (
    <>
      {/* 1. Barra Lateral para Escritorio y Tabletas (md y superior) */}
      <nav
        aria-label="Principal escritorio"
        className="hidden md:flex flex-col items-center gap-1.5 py-5 shrink-0 min-h-screen bg-[#1E1A16] border-r border-[#2C2723]"
        style={{ width: 112 }}
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
            boxShadow: "0 4px 12px rgba(181, 20, 27, 0.3)",
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
              className={`w-[96px] h-[72px] rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-all duration-200 ${
                activo
                  ? "bg-[#B5141B] text-white shadow-md font-semibold scale-102"
                  : "text-[#CFC8B8] hover:bg-[#2C2723] hover:text-white"
              }`}
            >
              {item.icono(activo)}
              <span>{item.etiqueta}</span>
            </Link>
          );
        })}
      </nav>

      {/* 2. Barra de Navegación Inferior Móvil (Bottom Navigation Bar para <md) */}
      <nav
        aria-label="Principal móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1E1A16] border-t border-[#332C25] shadow-2xl flex items-center justify-around px-2 py-1.5 backdrop-blur-md bg-opacity-95"
      >
        {ITEMS_NAVEGACION.slice(0, 5).map((item) => {
          const activo = item.id === seccionActiva;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={activo ? "page" : undefined}
              className={`min-w-[48px] min-h-[48px] px-2 py-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                activo
                  ? "text-[#B5141B] font-bold"
                  : "text-[#CFC8B8] hover:text-white"
              }`}
            >
              {item.icono(activo)}
              <span>{item.etiqueta}</span>
            </Link>
          );
        })}
        {/* Enlace a más / alertas en móvil */}
        <Link
          href="/alertas"
          aria-current={seccionActiva === "alertas" ? "page" : undefined}
          className={`min-w-[48px] min-h-[48px] px-2 py-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
            seccionActiva === "alertas"
              ? "text-[#B5141B] font-bold"
              : "text-[#CFC8B8] hover:text-white"
          }`}
        >
          <Icons.Alertas size={22} color={seccionActiva === "alertas" ? "#B5141B" : "#CFC8B8"} />
          <span>Alertas</span>
        </Link>
      </nav>
    </>
  );
}
