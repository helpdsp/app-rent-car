---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:40:00Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer + testing-reality-checker'
vision_command: 'start_sprint --sprint 12'
sprint_number: 12
source_spec_kit: 'spec-kit/input/'
---
# Sprint 12 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S12-T01 | Exportaciones a CSV de clientes, vehículos, contratos y documentos, con filtros y entrada en la bitácora | RF-27 | API | /api/exportaciones/[entidad] | apps/web/src/app/api/exportaciones/[entidad]/route.ts | 18 | fullstack | 3 | done |
| S12-T02 | Campos `ghl_contact_id` y `ghl_opportunity_id` y tabla `outbox` con los eventos definidos, sin consumidor | RF-29 | DB | — | drizzle/0011_outbox.sql | — | fullstack | 3 | done |
| S12-T03 | Pruebas de carga y rendimiento: 5,000 clientes, PDF en menos de 5 s | RNF | tests | — | apps/web/tests/carga/ | — | qa | 3 | done |
| S12-T04 | Revisión de seguridad: RLS, URLs firmadas, secretos, cabeceras, subida de archivos y vulnerabilidades de dependencias | RNF | seguridad | — | apps/web/tests/seguridad/ | — | fullstack | 3 | done |
| S12-T05 | Revisión de privacidad con el cliente: aviso, retención y derechos ARCO | RF-28 | privacidad | — | apps/web/src/lib/privacidad/ | — | fullstack | 2 | done |
| S12-T06 | Plan de contingencia, respaldo y prueba de restauración | RNF | operación | — | docs/plan-contingencia-respaldo.md | — | fullstack | 2 | done |
| S12-T07 | Manual de usuario, capacitación del personal y piloto en mostrador | — | documentación | — | docs/manual-usuario.md | — | fullstack | 5 | done |
| S12-T08 | Pruebas E2E del ciclo completo y aceptación con el cliente (contrato 08160) | RF-14 | tests | — | apps/web/tests/e2e/ | — | qa | 5 | done |
| S12-T09 | Corrección de defectos del piloto | — | varios | — | apps/web/ | — | fullstack | 3 | done |

**Total:** 9 tareas · 29 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
