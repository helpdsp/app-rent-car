/**
 * @generated_by_model gemini-4-argon
 * @generated_at 2026-11-17T05:20:00Z
 * @agent_roles testing-reality-checker + engineering-devops-automator
 * @vision_command start_sprint --sprint 1
 * @sprint_number 1
 * @task_id S01-T04
 */

import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
  },
});
