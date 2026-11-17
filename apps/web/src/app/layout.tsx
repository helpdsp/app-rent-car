/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:16:00Z
 * @agent_roles engineering-frontend-developer
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T11
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "México Renta de Autos — Contratos digitales",
  description:
    "Sistema auditable de contratos digitales, flota, clientes y vigencias de México Renta de Autos (Mexicali, B.C.).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
