---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 12
source_spec_kit: 'spec-kit/input/'
---
# Sprint 12 Stories

## S-27 · RF-27 — Exportación de históricos

- **Prioridad:** Should
- **Pantallas:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
- **Criterios de aceptación:**
  - [ ] Exportación a CSV de clientes, vehículos, contratos y documentos, con filtros por fechas y estado.
  - [ ] Solo administrador y titular; cada exportación queda en la bitácora.

## S-29 · RF-29 — Preparación para integración futura

- **Prioridad:** Could
- **Pantallas:** sin interfaz (preparación interna: campo `ghl_contact_id` y tabla de eventos).
- **Criterios de aceptación:**
  - [ ] Cada cliente y contrato tiene un campo vacío `ghl_contact_id` y un identificador externo.
  - [ ] Una tabla de eventos (`outbox`) registra reserva creada, contrato firmado, vehículo entregado, contrato rezagado y contrato concluido, sin enviarlos a ningún servicio en el MVP.
