/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:23:00Z
 * @agent_roles engineering-identity-access-engineer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 15
 * @sprint_number 15
 * @task_id S15-T01
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClientBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mra-placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
