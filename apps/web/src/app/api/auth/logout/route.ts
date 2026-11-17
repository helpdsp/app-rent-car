/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:23:00Z
 * @agent_roles engineering-identity-access-engineer + engineering-backend-architect
 * @vision_command start_sprint --sprint 15
 * @sprint_number 15
 * @task_id S15-T06
 */

import { NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClientServer();
    await supabase.auth.signOut();
  } catch {
    // Si falla Supabase en local desconectado, continuamos limpiando cookies
  }

  const response = NextResponse.json({ ok: true, mensaje: "Sesión cerrada correctamente." });

  // Limpiar cookies de sesión
  response.cookies.set("sb-access-token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });

  response.cookies.set("mra-session", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });

  return response;
}
