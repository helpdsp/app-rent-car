---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:27:00Z'
agent_roles: 'product-manager + project-management-project-shepherd + testing-reality-checker'
vision_command: 'start_sprint --sprint 11'
sprint_number: 11
source_spec_kit: 'spec-kit/input/'
---
# Sprint 11 Stories

## S-23 · RF-23 — Incidentes

- **Prioridad:** Should
- **Pantallas:** pantallas 12 Registrar incidente (`spec-kit/input/mockups/previews/12-incidente.html`).
- **Criterios de aceptación:**
  - [x] Registro de accidente, robo, falla mecánica, pérdida de llaves o retención indebida, con fecha y hora del hecho y del aviso.
  - [x] Se marca como tardío un aviso dado después del mismo día del hecho (cláusula 12.ª).
  - [x] Evidencias, avalúo, cargos al cliente y datos de la aseguradora.
  - [x] Registro de la unidad sustituta y de la bonificación de tiempo en fallas no imputables (cláusula 17.ª).
  - [x] Un contrato con incidente abierto pasa a "en incidente" y no puede concluirse hasta cerrarlo.

## S-24 · RF-24 — Renovación y extensión

- **Prioridad:** Should
- **Pantallas:** pantallas 13 Renovar contrato (`spec-kit/input/mockups/previews/13-renovar.html`).
- **Criterios de aceptación:**
  - [x] No hay prórroga tácita (cláusula 3.ª): extender una renta crea un contrato nuevo ligado al anterior.
  - [x] El nuevo contrato copia cliente, vehículo y conductores, y se valida de nuevo la disponibilidad y la licencia.

## S-25 · RF-25 — Cancelación

- **Prioridad:** Should
- **Pantallas:** pantallas 14 Cancelar contrato (`spec-kit/input/mockups/previews/14-cancelar.html`).
- **Criterios de aceptación:**
  - [x] Cancelación con penalización: 20 % del total, o el total si se solicita con 24 horas o menos de anticipación a la salida (regla configurable).
  - [x] Registra motivo, usuario y cargo; libera el vehículo para otras fechas.
  - [x] Un contrato vigente no puede cancelarse; se concluye por recepción.
