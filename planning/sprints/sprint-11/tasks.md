---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 11
source_spec_kit: 'spec-kit/input/'
---
# Sprint 11 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S11-T01 | Tabla `incidentes` con aviso tardío generado y estado `en_incidente` que impide concluir | RF-23 | DB | — | drizzle/0009_incidentes.sql | — | fullstack | 3 | todo |
| S11-T02 | Pantalla Registrar incidente: tipo, fechas, evidencias, avalúo, cargo, unidad sustituta y bonificación | RF-23 | IncidentePage | /contratos/[id]/incidente | apps/web/src/app/contratos/[id]/incidente/page.tsx | 12 | fullstack | 5 | todo |
| S11-T03 | Renovación: contrato nuevo ligado al anterior, revalidando disponibilidad y licencia | RF-24 | lib/contratos | /api/contratos/[id]/renovar | apps/web/src/lib/contratos/renovar.ts | — | fullstack | 3 | todo |
| S11-T04 | Pantalla Renovar contrato con comparación de contratos, validaciones y destino del depósito | RF-24 | RenovarPage | /contratos/[id]/renovar | apps/web/src/app/contratos/[id]/renovar/page.tsx | 13 | fullstack | 3 | todo |
| S11-T05 | Cancelación con penalización configurable (20 % o total con 24 h o menos) y liberación del vehículo | RF-25 | lib/contratos | /api/contratos/[id]/cancelar | apps/web/src/lib/contratos/cancelar.ts | — | fullstack | 3 | todo |
| S11-T06 | Pantalla Cancelar contrato con cálculo de penalización y reembolso | RF-25 | CancelarPage | /contratos/[id]/cancelar | apps/web/src/app/contratos/[id]/cancelar/page.tsx | 14 | fullstack | 3 | todo |
| S11-T07 | Cargos adicionales (limpieza, multas, traslado, penalización) como líneas del contrato | RF-21 | lib/contratos | — | apps/web/src/lib/contratos/cargos.ts | — | fullstack | 2 | todo |
| S11-T08 | Pruebas de incidentes, renovación y cancelación (T-68 a T-73) | RF-23 | tests | — | apps/web/tests/excepciones.test.ts | — | qa | 3 | todo |

**Total:** 8 tareas · 25 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
