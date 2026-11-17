---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T11:05:00Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer + testing-reality-checker'
vision_command: 'start_sprint --sprint 9'
sprint_number: 9
source_spec_kit: 'spec-kit/input/'
---
# Sprint 9 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S09-T01 | Tablas `inventario_contrato` y `evidencias` (ángulo, km capturado, huella, dispositivo) sin UPDATE ni DELETE | RF-19 | DB | — | drizzle/0009_evidencias.sql | — | fullstack | 3 | done |
| S09-T02 | `fn_validar_evidencias_completas`: seis ángulos obligatorios, con autorización de administrador por excepción | RF-19 | DB | — | drizzle/0009_evidencias.sql | — | fullstack | 2 | done |
| S09-T03 | Subida directa de fotos y video a Storage con compresión en el dispositivo y límites de tamaño | RF-19 | lib/storage | /api/contratos/[id]/evidencias | apps/web/src/lib/storage/evidencias.ts | — | fullstack | 3 | done |
| S09-T04 | Pantalla Entrega: inventario de 10 conceptos, gasolina en octavos, diagrama de daños, km con foto del tablero | RF-19 | EntregaPage | /contratos/[id]/entrega | apps/web/src/app/contratos/[id]/entrega/page.tsx | 6 | fullstack | 5 | done |
| S09-T05 | Captura guiada en celular: cámara, seis ángulos con avance y kilometraje ligado a la foto del tablero | RF-19 | CamaraGuiada | /contratos/[id]/entrega | apps/web/src/components/entrega/CamaraGuiada.tsx | M3 | fullstack | 5 | done |
| S09-T06 | Completar la entrega: contrato vigente, vehículo rentado y evento en `outbox` | RF-19 | lib/contratos | /api/contratos/[id]/entrega | apps/web/src/lib/contratos/entregar.ts | — | fullstack | 2 | done |
| S09-T07 | Envío del contrato y el reglamento por correo con reintento y reenvío manual | RF-20 | lib/mail | /api/contratos/[id]/envio | apps/web/src/lib/mail/contrato.ts | — | fullstack | 3 | done |
| S09-T08 | Pruebas de seis ángulos, km con foto, inmutabilidad, huella y flujo de celular (T-54, T-60, T-61, T-74 a T-76, T-79, T-83) | RF-19 | tests | — | apps/web/tests/entrega.test.ts | — | qa | 3 | done |

**Total:** 8 tareas · 26 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
