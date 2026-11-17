/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:23:00Z
 * @agent_roles engineering-identity-access-engineer + engineering-backend-architect
 * @vision_command start_sprint --sprint 15
 * @sprint_number 15
 * @task_id S15-T01
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClientServer() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mra-placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // El método `setAll` fue llamado desde un Server Component.
          // Esto puede ignorarse si hay un middleware que actualiza la sesión.
        }
      },
    },
  });
}
