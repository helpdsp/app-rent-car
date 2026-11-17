---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---
# Sprint 2 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S02-T01 | Función `fn_auditar` y triggers en todas las tablas de negocio existentes; plantilla para las nuevas | RF-02 | DB | — | drizzle/0002_auditoria.sql | — | fullstack | 3 | todo |
| S02-T02 | Tabla `auditoria` de solo agregado (sin UPDATE ni DELETE para ningún rol) y pruebas de que se rechaza | RF-02 | DB | — | drizzle/0002_auditoria.sql | — | fullstack | 2 | todo |
| S02-T03 | Pantalla Bitácora: filtros por registro, usuario y fechas; `GET /api/auditoria` | RF-02 | BitacoraPage | /admin/bitacora | apps/web/src/app/admin/bitacora/page.tsx | 18 | fullstack | 3 | todo |
| S02-T04 | Tablas `tarifas` y `parametros` con versionado y semilla (500 km, ÷8, 5.ª hora, 20 % y 24 h, deducible 30 % y 20 %, alertas 30/15/7/0) | RF-03 | DB | — | drizzle/0003_tarifas.sql | — | fullstack | 3 | todo |
| S02-T05 | Pantalla Tarifas y parámetros: versión nueva de tarifa, edición de parámetros y datos legales pendientes | RF-03 | TarifasPage | /admin/tarifas | apps/web/src/app/admin/tarifas/page.tsx | 16 | fullstack | 3 | todo |
| S02-T06 | Conectar los parámetros al motor de tarifas (tolerancia, redondeo, hora desde la que se cobra un día) | RF-03 | lib/pricing | — | apps/web/src/lib/pricing/parametros.ts | — | fullstack | 2 | todo |
| S02-T07 | Aviso de privacidad con versión y fecha de aceptación; texto configurable | RF-28 | privacidad | — | apps/web/src/lib/privacidad/ | — | fullstack | 2 | todo |
| S02-T08 | Política de retención configurable y proceso de anonimización por solicitud (ARCO) conservando lo contractual | RF-28 | privacidad | /admin/privacidad | apps/web/src/lib/privacidad/arco.ts | — | fullstack | 3 | todo |
| S02-T09 | Buckets privados de Storage, URLs firmadas de corta duración y entrada `SELECT_SENSIBLE` al leer | RF-05 | lib/storage | /api/archivos/* | apps/web/src/lib/storage/ | — | fullstack | 3 | todo |
| S02-T10 | Cabeceras de seguridad (CSP, HSTS, nosniff) y límite de solicitudes en subida y exportación | RNF | seguridad | — | apps/web/next.config.ts, middleware.ts | — | fullstack | 2 | todo |
| S02-T11 | Pruebas de bitácora inmutable, tarifas versionadas y anonimización (T-02, T-03, T-04, T-07) | RF-02 | tests | — | apps/web/tests/auditoria.test.ts | — | qa | 3 | todo |

**Total:** 11 tareas · 29 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
