---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T07:10:00Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer + testing-reality-checker'
vision_command: 'start_sprint --sprint 5'
sprint_number: 5
source_spec_kit: 'spec-kit/input/'
---
# Sprint 5 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S05-T01 | Tabla `alertas` idempotente por (documento, días, vencimiento) y función de revisión de vigencias | RF-10 | DB, lib/alertas | — | apps/web/src/lib/alertas/revisar.ts | — | fullstack | 3 | done |
| S05-T02 | Cron diario `/api/cron/vigencias` protegido con secreto, en horario de America/Tijuana | RF-10 | API | /api/cron/vigencias | apps/web/src/app/api/cron/vigencias/route.ts, vercel.json | — | fullstack | 2 | done |
| S05-T03 | Envío de correos con Resend a 30, 15, 7 días y el día del vencimiento; estado enviada o error | RF-10 | lib/mail | — | apps/web/src/lib/mail/alertas.ts | — | fullstack | 3 | done |
| S05-T04 | Marcar alertas como atendidas al subir el documento renovado | RF-10 | lib/alertas | — | apps/web/src/lib/alertas/atender.ts | — | fullstack | 2 | done |
| S05-T05 | Pantalla Tablero del operador: resumen, acciones rápidas, documentos por vencer, vencen hoy y rezagados | RF-11 | TableroPage | / | apps/web/src/app/page.tsx | 1 | fullstack | 5 | done |
| S05-T06 | Vista de celular del tablero con barra inferior | RF-11 | TableroMovil | / | apps/web/src/components/tablero/TableroMovil.tsx | M1 | fullstack | 3 | done |
| S05-T07 | Búsqueda global por cliente, folio o placas en el tablero | RF-06 | BusquedaGlobal | /api/busqueda | apps/web/src/app/api/busqueda/route.ts | 1, M1 | fullstack | 2 | done |
| S05-T08 | Pruebas de alertas idempotentes y atendidas (T-23, T-24, T-25) y del tablero en celular | RF-10 | tests | — | apps/web/tests/alertas.test.ts | — | qa | 3 | done |

**Total:** 8 tareas · 23 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
