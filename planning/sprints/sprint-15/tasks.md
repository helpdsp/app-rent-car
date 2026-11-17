---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:15:00Z'
agent_roles: 'engineering-identity-access-engineer + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 15
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 15 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S15-T01 | Configuración de cliente Supabase SSR (`@supabase/ssr`) para App Router | RF-35 | auth | — | apps/web/src/lib/supabase/server.ts | — | backend | 3 | todo |
| S15-T02 | Migración SQL: Trigger de sincronización de `auth.users` a `public.usuarios` con roles | RF-35 | DB | — | apps/web/drizzle/0013_auth_sync.sql | — | backend | 3 | todo |
| S15-T03 | Middleware de Next.js para protección de rutas y control de acceso por roles | RF-35 | auth | global | apps/web/src/middleware.ts | — | backend | 4 | todo |
| S15-T04 | Pantalla de inicio de sesión institucional (/login) con validación de credenciales | RF-35 | UI | /login | apps/web/src/app/login/page.tsx | nuevo | frontend | 4 | todo |
| S15-T05 | Flujo de recuperación de contraseña y actualización de clave (/recuperar) | RF-35 | UI | /recuperar | apps/web/src/app/recuperar/page.tsx | nuevo | frontend | 3 | todo |
| S15-T06 | Endpoint y botón de cierre de sesión seguro con limpieza de cookies | RF-35 | API/UI | /api/auth/logout | apps/web/src/app/api/auth/logout/route.ts | — | fullstack | 3 | todo |
| S15-T07 | Pruebas de autenticación, expiración de sesión, protección de rutas y auditoría | RF-35 | tests | — | apps/web/tests/auth.test.ts | — | qa | 5 | todo |

**Total:** 7 tareas · 25 puntos.
