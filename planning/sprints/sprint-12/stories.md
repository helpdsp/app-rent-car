---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:40:00Z'
agent_roles: 'product-manager + project-management-project-shepherd + testing-reality-checker'
vision_command: 'start_sprint --sprint 12'
sprint_number: 12
source_spec_kit: 'spec-kit/input/'
---
# Sprint 12 Stories

## S-27 · RF-27 — Exportación de históricos

- **Prioridad:** Should
- **Pantallas:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
- **Criterios de aceptación:**
  - [x] Exportación a CSV de clientes, vehículos, contratos y documentos, con filtros por fechas y estado.
  - [x] Solo administrador y titular; cada exportación queda en la bitácora.

## S-29 · RF-29 — Preparación para integración futura

- **Prioridad:** Could
- **Pantallas:** sin interfaz (preparación interna: campo `ghl_contact_id` y tabla de eventos).
- **Criterios de aceptación:**
  - [x] Cada cliente y contrato tiene un campo vacío `ghl_contact_id` y un identificador externo.
  - [x] Una tabla de eventos (`outbox`) registra reserva creada, contrato firmado, vehículo entregado, contrato rezagado y contrato concluido, sin enviarlos a ningún servicio en el MVP.
