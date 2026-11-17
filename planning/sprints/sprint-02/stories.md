---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---
# Sprint 2 Stories

## S-02 · RF-02 — Bitácora de auditoría

- **Prioridad:** Must
- **Pantallas:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
- **Criterios de aceptación:**
  - [ ] Cada creación, modificación, eliminación lógica y consulta de contrato o documento registra usuario, fecha y hora, acción, valor anterior y valor nuevo.
  - [ ] La bitácora es solo de agregado: ningún rol puede editarla ni borrarla.
  - [ ] Se llena por triggers en la base de datos, no por código de la aplicación, para que no se pueda omitir.
  - [ ] El titular y el administrador consultan la bitácora filtrando por contrato, usuario y rango de fechas.

## S-03 · RF-03 — Catálogo de tarifas y parámetros

- **Prioridad:** Must
- **Pantallas:** pantallas 16 Administración: tarifas y parámetros (`spec-kit/input/mockups/previews/16-admin-tarifas-parametros.html`); 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`). Los datos legales pendientes se ven en la 16; la tarifa editable con motivo, en la 3.
- **Criterios de aceptación:**
  - [ ] El administrador mantiene el catálogo: tarifa por 24 h, seguro nocturno ($400 a $1,000), valor asegurado y cuota de protección por vehículo o categoría.
  - [ ] Parámetros editables con sus valores por defecto: 500 km por día, divisor de hora extra (8), hora desde la que se cobra un día (5), tolerancia (0), redondeo a peso, deducible (30 % y 20 % en cristales).
  - [ ] Todo cambio de tarifa o parámetro queda en la bitácora y no altera contratos ya emitidos.
  - [ ] Cada contrato guarda una copia de las tarifas y parámetros vigentes al emitirse.

## S-28 · RF-28 — Privacidad y datos personales

- **Prioridad:** Must
- **Pantallas:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`). Falta dibujar la política de retención.
- **Criterios de aceptación:**
  - [ ] Aviso de privacidad visible y aceptado por el cliente en el alta, con fecha y versión del texto.
  - [ ] Política de retención configurable para documentos de identidad.
  - [ ] Eliminación o anonimización de datos de un cliente a solicitud (derechos ARCO), conservando la información contractual obligatoria.
  - [ ] Datos y archivos sensibles cifrados en tránsito y en reposo.
