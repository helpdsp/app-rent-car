---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 8
source_spec_kit: 'spec-kit/input/'
---
# Sprint 8 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S08-T01 | Plantilla React a PDF de la carátula: datos, inventario y pagaré opcional | RF-17 | lib/pdf | — | apps/web/src/lib/pdf/contrato.tsx | — | fullstack | 5 | todo |
| S08-T02 | Las 21 cláusulas con los datos pendientes configurables (registro PROFECO, jurisdicción, teléfono de fallas) | RF-17 | lib/pdf | — | apps/web/src/lib/pdf/clausulas.tsx | — | fullstack | 3 | todo |
| S08-T03 | Plantilla del reglamento prellenado | RF-17 | lib/pdf | — | apps/web/src/lib/pdf/reglamento.tsx | — | fullstack | 2 | todo |
| S08-T04 | Huella SHA-256, almacenamiento del PDF inmutable y versión nueva al corregir | RF-17 | lib/pdf | /api/contratos/[id]/pdf | apps/web/src/lib/pdf/guardar.ts | — | fullstack | 3 | todo |
| S08-T05 | Pantalla Firma: vista previa del contrato y el reglamento, firma táctil en canvas y confirmación | RF-18 | FirmaPage | /contratos/[id]/firma | apps/web/src/app/contratos/[id]/firma/page.tsx | 5 | fullstack | 5 | todo |
| S08-T06 | Registro de la firma (imagen, huella, usuario, fecha, dispositivo) por firmante: arrendatario, conductor y pagaré | RF-18 | lib/firma | /api/contratos/[id]/firmar | apps/web/src/lib/firma/registrar.ts | — | fullstack | 3 | todo |
| S08-T07 | Alternativa de impresión con firma manuscrita y escaneo adjunto | RF-18 | lib/firma | — | apps/web/src/lib/firma/escaneo.ts | — | fullstack | 2 | todo |
| S08-T08 | Pruebas del PDF contra el formato 08160, inmutabilidad y detección de alteración (T-50 a T-53, T-55) | RF-17 | tests | — | apps/web/tests/pdf-firma.test.ts | — | qa | 3 | todo |

**Total:** 8 tareas · 26 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
