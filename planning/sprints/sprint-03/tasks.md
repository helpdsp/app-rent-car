---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 3
source_spec_kit: 'spec-kit/input/'
---
# Sprint 3 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S03-T01 | Tabla `clientes` (número único con secuencia, RFC con CHECK, índices de duplicados y búsqueda) y migración | RF-04 | DB | — | drizzle/0004_clientes.sql | — | fullstack | 3 | todo |
| S03-T02 | API de clientes con validación Zod y detección de duplicados (409) | RF-04 | API | /api/clientes | apps/web/src/app/api/clientes/route.ts | — | fullstack | 3 | todo |
| S03-T03 | Pantalla Cliente: datos generales y fiscales, aviso de privacidad aceptado | RF-04 | ClientePage | /clientes/[id] | apps/web/src/app/clientes/[id]/page.tsx | 2 | fullstack | 3 | todo |
| S03-T04 | Tabla `documentos` y subida directa a Storage con URL firmada | RF-05 | DB, lib/storage | /api/archivos/subida | drizzle/0004_clientes.sql | — | fullstack | 3 | todo |
| S03-T05 | Captura de credencial y licencia por ambos lados con la cámara y sus vigencias | RF-05 | DocumentosCliente | /clientes/[id] | apps/web/src/components/clientes/DocumentosCliente.tsx | 2 | fullstack | 3 | todo |
| S03-T06 | Lectura de documentos con URL firmada y bitácora de acceso sensible | RF-05 | API | /api/archivos/lectura | apps/web/src/app/api/archivos/lectura/route.ts | — | fullstack | 2 | todo |
| S03-T07 | Búsqueda por nombre, número, identificación, teléfono y RFC (índices trigram) | RF-06 | API | /api/clientes?q= | apps/web/src/app/api/clientes/route.ts | — | fullstack | 2 | todo |
| S03-T08 | Historial de rentas del cliente con kilómetros recorridos (queda vacío hasta que existan contratos) | RF-06 | ClientePage | /clientes/[id] | apps/web/src/components/clientes/Historial.tsx | 2 | fullstack | 2 | todo |
| S03-T09 | Listado de clientes con búsqueda y paginación | RF-06 | ClientesPage | /clientes | apps/web/src/app/clientes/page.tsx | — | fullstack | 2 | todo |
| S03-T10 | Pruebas de duplicados, RFC, subida y lectura de documentos (T-10 a T-13) | RF-04 | tests | — | apps/web/tests/clientes.test.ts | — | qa | 3 | todo |

**Total:** 10 tareas · 26 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
