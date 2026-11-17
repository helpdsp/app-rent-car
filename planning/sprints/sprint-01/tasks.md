---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---
# Sprint 1 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S01-T01 | Crear el proyecto `rent-car-mvp` en Vercel (raíz apps/web, región sfo1) y el proyecto de Supabase; configurar variables de entorno | — | Infraestructura | — | vercel.json, .env.example | — | fullstack | 2 | todo |
| S01-T02 | Esquema base con Drizzle: enums, usuarios, secuencias y extensiones (btree_gist, pg_trgm, citext); migración inicial | RF-01 | lib/db | — | apps/web/src/lib/db/schema.ts, drizzle/0001_init.sql | — | fullstack | 3 | todo |
| S01-T03 | Integración continua: lint, tsc, pruebas unitarias y de integración contra Postgres efímero, build | — | CI | — | .github/workflows/ci.yml | — | fullstack | 2 | todo |
| S01-T04 | Resolver las vulnerabilidades de herramientas de prueba (`npm audit` propone vitest 5.1.0, que falla en este equipo): probar la última 4.x o reinstalar node_modules; verificar que el motor de tarifas (23 pruebas) sigue pasando | RF-14 | lib/pricing | — | apps/web/src/lib/pricing/ | — | fullstack | 1 | todo |
| S01-T05 | Autenticación con Supabase Auth (correo y contraseña) y sesión en Next.js | RF-01 | lib/auth | /login | apps/web/src/lib/auth/session.ts | — | fullstack | 2 | todo |
| S01-T06 | Verificación en dos pasos obligatoria para administrador y titular; códigos de respaldo | RF-01 | lib/auth | /login | apps/web/src/lib/auth/mfa.ts | 8 | fullstack | 2 | todo |
| S01-T07 | Roles operador, administrador y titular: guardas en cada route handler y políticas RLS | RF-01 | lib/auth | /api/* | apps/web/src/lib/auth/guards.ts | — | fullstack | 3 | todo |
| S01-T08 | Cierre de sesión por inactividad (30 min, parámetro) y bloqueo de 15 min tras 5 intentos fallidos | RF-01 | lib/auth | /login | apps/web/src/lib/auth/inactividad.ts | 8 | fullstack | 2 | todo |
| S01-T09 | Pantalla Inicio de sesión y verificación en dos pasos | RF-01 | LoginPage | /login | apps/web/src/app/login/page.tsx | 8 | fullstack | 2 | todo |
| S01-T10 | Pantalla Usuarios y roles: crear, desactivar y cambiar rol; la autoría se conserva | RF-01 | UsuariosPage | /admin/usuarios | apps/web/src/app/admin/usuarios/page.tsx, app/api/usuarios/route.ts | 17 | fullstack | 3 | todo |
| S01-T11 | Base de interfaz: barra lateral, chips de estado, tarjetas, pasos del contrato y tokens de color y tipografía de los mockups | — | components/ui | — | apps/web/src/components/ui/ | — | fullstack | 3 | todo |
| S01-T12 | Pruebas de acceso por rol, MFA y desactivación (T-01, T-05, T-06) | RF-01 | tests | — | apps/web/tests/auth.test.ts | — | qa | 3 | todo |

**Total:** 12 tareas · 28 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
