---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T07:10:00Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer + testing-reality-checker'
vision_command: 'start_sprint --sprint 5'
sprint_number: 5
source_spec_kit: 'spec-kit/input/'
---
# Sprint 5 Stories

## S-10 · RF-10 — Alertas de vigencia

- **Prioridad:** Must
- **Pantallas:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).
- **Criterios de aceptación:**
  - [x] Un proceso diario revisa licencia, credencial, tarjeta de circulación y póliza.
  - [x] Se notifica por correo a los 30, 15 y 7 días antes del vencimiento y el día en que vence (días configurables).
  - [x] Cada alerta guarda documento, fecha, destinatario y estado (pendiente, enviada, atendida).
  - [x] Una alerta se marca atendida automáticamente cuando se sube el documento renovado.

## S-11 · RF-11 — Tablero del operador

- **Prioridad:** Should
- **Pantallas:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).
- **Criterios de aceptación:**
  - [x] Accesos directos a nuevo contrato, entrega, recepción, clientes y vehículos.
  - [x] Secciones de documentos próximos a vencer, contratos que vencen hoy y contratos rezagados.
  - [x] Funciona en tableta, escritorio y celular sin desplazamiento horizontal; en celular se priorizan las acciones y lo que requiere atención.
