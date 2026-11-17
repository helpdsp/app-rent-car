---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---
# Sprint 4 Stories

## S-07 · RF-07 — Alta y edición de vehículos

- **Prioridad:** Must
- **Pantallas:** pantallas 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`); 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`).
- **Criterios de aceptación:**
  - [ ] Captura de marca, modelo, tipo y color, placas, kilometraje, valor asegurado y observaciones.
  - [ ] Clave de auto única y automática.
  - [ ] Estado operativo: disponible, rentado, en mantenimiento o baja.
  - [ ] El kilometraje actual no puede disminuir salvo por corrección de un administrador, que queda auditada.

## S-08 · RF-08 — Documentos del vehículo

- **Prioridad:** Must
- **Pantallas:** pantallas 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`); 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`). El estado «No rentable» se ve en la 9.
- **Criterios de aceptación:**
  - [ ] Tarjeta de circulación (expedición y vigencia) y póliza de seguro (aseguradora, agente, contacto, expedición y vigencia), con imagen o PDF.
  - [ ] Un vehículo con tarjeta o póliza vencida queda marcado como no rentable y no puede asignarse a un contrato nuevo.

## S-09 · RF-09 — Disponibilidad y bloqueos

- **Prioridad:** Must
- **Pantallas:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`).
- **Criterios de aceptación:**
  - [ ] Un vehículo no puede estar en dos contratos cuyas fechas se crucen, incluso si dos operadores lo intentan a la vez; la base de datos lo impide.
  - [ ] El administrador puede bloquear un vehículo por mantenimiento con fecha de inicio y fin.
  - [ ] Al elegir fechas en un contrato, la lista de vehículos muestra solo los disponibles y explica por qué no aparece uno (rentado, en mantenimiento o documentos vencidos).
  - [ ] Las unidades reservadas están sujetas a cambio por una unidad similar (leyenda del formato impreso); el cambio queda registrado.
