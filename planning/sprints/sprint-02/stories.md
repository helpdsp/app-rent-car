---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-17T05:34:00Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'start_sprint --sprint 2'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---
# Sprint 2 Stories

## S-02 · RF-02 — Bitácora inmutable de auditoría

- **Prioridad:** Must
- **Pantalla:** pantalla 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
- **Criterios de aceptación:**
  - [x] Toda operación de inserción, actualización, eliminación, consulta sensible o exportación queda registrada con usuario, fecha, valor anterior y nuevo.
  - [x] La tabla `auditoria` es de solo agregado (sin UPDATE ni DELETE para ningún rol).
  - [x] Pantalla con filtros por registro, usuario y rango de fechas.

## S-03 · RF-03 — Tarifas y parámetros

- **Prioridad:** Must
- **Pantalla:** pantalla 16 Tarifas y parámetros (`spec-kit/input/mockups/previews/16-admin-tarifas-parametros.html`).
- **Criterios de aceptación:**
  - [x] Catálogo de tarifas versionado: cada cambio crea una fila nueva; los contratos emitidos no se alteran.
  - [x] Parámetros configurables conectados al motor de tarifas (tolerancia, hora desde la que se cobra día, redondeo o truncado de hora extra).
  - [x] Datos legales del contrato (PROFECO, jurisdicción, auxilio vial) gestionables por el administrador.

## S-28 · RF-28 — Aviso de privacidad y retención de datos

- **Prioridad:** Must
- **Criterios de aceptación:**
  - [x] Aviso de privacidad integral con versión, fecha y cláusula de residencia de datos en EE. UU.
  - [x] Proceso de atención a solicitudes ARCO (anonimización de datos personales conservando folios y cargos contractuales).
  - [x] Storage privado con URLs firmadas y registro obligatorio `SELECT_SENSIBLE` al consultar documentos.
