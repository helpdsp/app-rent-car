---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 3
source_spec_kit: 'spec-kit/input/'
---
# Sprint 3 Stories

## S-04 · RF-04 — Alta y edición de clientes

- **Prioridad:** Must
- **Pantallas:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
- **Criterios de aceptación:**
  - [ ] Captura de nombre completo, identificación, domicilio, ciudad y estado, teléfono y celular por separado.
  - [ ] Número de cliente único y automático; no editable.
  - [ ] Datos fiscales opcionales: razón social, RFC, domicilio fiscal, régimen y constancia de situación fiscal.
  - [ ] Validación de formato de RFC y de teléfono; detección de posibles duplicados por nombre e identificación.
  - [ ] Un cliente se registra una sola vez y se reutiliza en todos sus contratos.

## S-05 · RF-05 — Documentos del cliente (credencial y licencia)

- **Prioridad:** Must
- **Pantallas:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
- **Criterios de aceptación:**
  - [ ] Captura de foto o escaneo de ambos lados de la credencial y de la licencia, con la cámara de la tableta.
  - [ ] Licencia: número, tipo, lugar de expedición y fecha de vencimiento; credencial: número y vigencia.
  - [ ] Los archivos se guardan en almacenamiento privado y solo se ven mediante enlaces firmados de corta duración.
  - [ ] Cada consulta de un documento sensible queda en la bitácora.

## S-06 · RF-06 — Búsqueda, historial y exportación de clientes

- **Prioridad:** Should
- **Pantallas:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`); 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`). La búsqueda está en 1 y M1.
- **Criterios de aceptación:**
  - [ ] Búsqueda por nombre, número de cliente, identificación, teléfono y RFC.
  - [ ] Historial de rentas por cliente, con estado, total y kilómetros recorridos de cada una (kilometraje de entrada menos el de salida; «en curso» si aún no se recibe).
  - [ ] El historial del vehículo muestra también los kilómetros recorridos por renta y su suma acumulada.
  - [ ] Exportación a CSV del listado y del historial (solo administrador y titular).
