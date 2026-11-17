---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T12:15:00Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer + testing-reality-checker'
vision_command: 'start_sprint --sprint 10'
sprint_number: 10
source_spec_kit: 'spec-kit/input/'
---
# Sprint 10 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S10-T01 | Registro de recepción: km de entrada, gasolina, inventario, daños y las mismas seis fotos | RF-21 | lib/contratos | /api/contratos/[id]/recepcion | apps/web/src/lib/contratos/recibir.ts | — | fullstack | 3 | done |
| S10-T02 | Liquidación con `liquidar()` y guardado línea por línea en `contrato_cargos`; cargo por gasolina faltante | RF-21 | lib/pricing | — | apps/web/src/lib/contratos/liquidar.ts | — | fullstack | 5 | done |
| S10-T03 | Aplicar o devolver el depósito, saldo y paso a concluido | RF-21 | lib/pagos | /api/contratos/[id]/concluir | apps/web/src/lib/pagos/liquidar-deposito.ts | — | fullstack | 3 | done |
| S10-T04 | Pantalla Recepción y liquidación con cargos, bonificaciones, saldo y depósito | RF-21 | RecepcionPage | /contratos/[id]/recepcion | apps/web/src/app/contratos/[id]/recepcion/page.tsx | 7 | fullstack | 5 | done |
| S10-T05 | Comparación de fotos entrega contra hoy por ángulo y `GET /api/contratos/[id]/comparacion-fotos` | RF-21 | ComparacionFotos | /contratos/[id]/recepcion | apps/web/src/components/recepcion/ComparacionFotos.tsx | 7, M4 | fullstack | 3 | done |
| S10-T06 | Vista de celular de la recepción con comparación y cobro | RF-21 | RecepcionMovil | /contratos/[id]/recepcion | apps/web/src/components/recepcion/RecepcionMovil.tsx | M4 | fullstack | 3 | done |
| S10-T07 | Cron cada 15 minutos que marca rezagados, calcula el cargo acumulado y alimenta el tablero | RF-22 | API | /api/cron/rezagados | apps/web/src/app/api/cron/rezagados/route.ts | 1, M1 | fullstack | 3 | done |
| S10-T08 | Pruebas de liquidación, retraso, km, nocturno, comparación y rezagados (T-62 a T-67, T-77, T-78) | RF-21 | tests | — | apps/web/tests/recepcion.test.ts | — | qa | 3 | done |

**Total:** 8 tareas · 28 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
