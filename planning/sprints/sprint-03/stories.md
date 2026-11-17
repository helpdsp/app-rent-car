---
generated_by_model: 'gemini-3.8-flash'
generated_at: '2026-11-17T05:43:00Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'start_sprint --sprint 3'
sprint_number: 3
source_spec_kit: 'spec-kit/input/'
---
# Sprint 3 Stories

## S-04 · RF-04 — Registro único de clientes

- **Prioridad:** Must
- **Pantalla:** pantalla 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
- **Criterios de aceptación:**
  - [x] Registro único por identificación oficial; un intento duplicado se detecta y rechaza con aviso (409).
  - [x] Formato de RFC validado con CHECK/regex oficial del SAT.
  - [x] Número único de cliente secuencial.

## S-05 · RF-05 — Documentos del cliente en almacenamiento privado

- **Prioridad:** Must
- **Criterios de aceptación:**
  - [x] Subida directa de fotos (licencia e INE por ambos lados) a Storage privado mediante URL firmada.
  - [x] Cada lectura de documento genera obligatoriamente una entrada `SELECT_SENSIBLE` en la bitácora.
  - [x] Registro de vigencias de licencia y credencial.

## S-06 · RF-06 — Búsqueda flexible e historial del cliente

- **Prioridad:** Must
- **Criterios de aceptación:**
  - [x] Búsqueda por nombre, número de cliente, identificación, teléfono o RFC.
  - [x] Ficha del cliente muestra su historial de contratos y kilómetros recorridos.
