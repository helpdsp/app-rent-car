---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 6
source_spec_kit: 'spec-kit/input/'
---
# Sprint 6 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S06-T01 | Tabla `contratos` completa (copia de tarifas, rango, estado, folio, `folio_papel`) y secuencia `seq_folio_contrato` que produce `D-00001` | RF-13 | DB | — | drizzle/0006_contratos.sql | — | fullstack | 3 | todo |
| S06-T02 | Trigger de transiciones de estado con la tabla permitida y bitácora de cada cambio | RF-13 | DB | — | drizzle/0006_contratos.sql | — | fullstack | 3 | todo |
| S06-T03 | Emisión transaccional: bloquea el vehículo, valida, copia tarifas, consume el folio y registra el evento en `outbox` | RF-13 | lib/contratos | /api/contratos/[id]/emitir | apps/web/src/lib/contratos/emitir.ts | — | fullstack | 3 | todo |
| S06-T04 | Validaciones de emisión: al menos un conductor con licencia vigente en todo el periodo, documentos del vehículo, fechas, destino y permiso de salida del país | RF-12 | lib/contratos | — | apps/web/src/lib/contratos/validar.ts | — | fullstack | 3 | todo |
| S06-T05 | API de borrador y cotización en vivo con `lib/pricing`; tarifa pactada con motivo obligatorio | RF-12 | API | /api/contratos, /api/contratos/[id]/cotizacion | apps/web/src/app/api/contratos/ | — | fullstack | 3 | todo |
| S06-T06 | Pantalla del asistente: vehículo y fechas con cotización | RF-12 | ContratoNuevoPage | /contratos/nuevo | apps/web/src/app/contratos/nuevo/page.tsx | 3 | fullstack | 5 | todo |
| S06-T07 | Vista de celular del nuevo contrato con barra fija de anticipo | RF-12 | ContratoNuevoMovil | /contratos/nuevo | apps/web/src/components/contratos/NuevoMovil.tsx | M2 | fullstack | 2 | todo |
| S06-T08 | Pantalla Contratos: listado con filtros por estado y búsqueda; folios digitales y de papel conviven | RF-13 | ContratosPage | /contratos | apps/web/src/app/contratos/page.tsx | 11 | fullstack | 3 | todo |
| S06-T09 | Pruebas del caso 08160, folio concurrente, transiciones y copia de tarifas (T-30 a T-37) | RF-14 | tests | — | apps/web/tests/contratos-nucleo.test.ts | — | qa | 3 | todo |

**Total:** 9 tareas · 28 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
