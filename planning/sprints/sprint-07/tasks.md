---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 7
source_spec_kit: 'spec-kit/input/'
---
# Sprint 7 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S07-T01 | Tabla `pagos` con forma y referencia; un anticipo en varias filas con formas distintas | RF-16 | DB | — | drizzle/0007_pagos.sql | — | fullstack | 3 | todo |
| S07-T02 | Regla: los pagos del anticipo suman la renta base antes de vigente; nunca se guarda un número de tarjeta | RF-16 | lib/pagos | — | apps/web/src/lib/pagos/anticipo.ts | — | fullstack | 2 | todo |
| S07-T03 | Depósito en garantía (efectivo, tarjeta, Visa Láser) y recibo imprimible con secuencia | RF-16 | lib/pagos | /api/contratos/[id]/pagos | apps/web/src/lib/pagos/deposito.ts | — | fullstack | 3 | todo |
| S07-T04 | Pantalla Cobro y garantía con pagos mixtos y total a recibir | RF-16 | CobroPage | /contratos/[id]/cobro | apps/web/src/app/contratos/[id]/cobro/page.tsx | 4 | fullstack | 5 | todo |
| S07-T05 | Conductores adicionales (0 a N) con validación de licencia y segundo auto | RF-15 | lib/contratos | /api/contratos/[id]/conductores | apps/web/src/lib/contratos/conductores.ts | 15 | fullstack | 3 | todo |
| S07-T06 | Referencia del cliente y «facturar a» propios del contrato, con RFC validado | RF-15 | ContratoExtras | /contratos/[id]/extras | apps/web/src/components/contratos/Extras.tsx | 15 | fullstack | 2 | todo |
| S07-T07 | Pagaré opcional: datos, activación y firma | RF-26 | Pagare | /contratos/[id]/extras | apps/web/src/components/contratos/Pagare.tsx | 15 | fullstack | 2 | todo |
| S07-T08 | Pantalla de conductor adicional, referencia, pagaré y facturar a | RF-15 | ExtrasPage | /contratos/[id]/extras | apps/web/src/app/contratos/[id]/extras/page.tsx | 15 | fullstack | 3 | todo |
| S07-T09 | Pruebas de pagos mixtos, tarjeta, licencia por conductor adicional, tarifa pactada y facturar a (T-38 a T-47) | RF-16 | tests | — | apps/web/tests/pagos.test.ts | — | qa | 3 | todo |

**Total:** 9 tareas · 26 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
