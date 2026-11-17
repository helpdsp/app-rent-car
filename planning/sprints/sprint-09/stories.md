---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 9
source_spec_kit: 'spec-kit/input/'
---
# Sprint 9 Stories

## S-19 · RF-19 — Entrega del vehículo

- **Prioridad:** Must
- **Pantallas:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`); M3 Fotos de entrega (celular) (`spec-kit/input/mockups/previews/m3-movil-fotos-entrega.html`).
- **Criterios de aceptación:**
  - [ ] Inventario de 10 conceptos (refacciones, gato, herramienta, reflejantes, tapetes, radio, bocinas, cinturones, placas, antena).
  - [ ] Diagrama del vehículo en 4 vistas para marcar daños, con nota por cada daño.
  - [ ] Nivel de gasolina de salida en octavos y kilometraje de salida (mayor o igual al actual del vehículo).
  - [ ] Fotos y video del estado, subidos directamente al almacenamiento y ligados al contrato.
  - [ ] Seis ángulos de foto obligatorios: frente, atrás, izquierda, derecha, tablero con kilometraje e interior; sin ellos no se completa la entrega.
  - [ ] La captura usa la cámara del celular o de la tableta, con una guía por ángulo y el avance (por ejemplo, 5 de 6); la foto del tablero se captura junto con el campo de kilometraje.
  - [ ] La foto del tablero con el kilometraje es obligatoria para guardar el kilometraje de salida: el campo numérico y la foto se capturan juntos y quedan ligados; la foto guarda el valor capturado para poder cotejarlo después.
  - [ ] Cada foto guarda fecha, hora, usuario y dispositivo, y no se puede reemplazar ni borrar: una repetición se agrega como foto nueva.
  - [ ] Con la entrega completa, el contrato pasa a vigente.

## S-20 · RF-20 — Envío del contrato por correo

- **Prioridad:** Must
- **Pantallas:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`). No tiene pantalla propia: el aviso aparece al completar la entrega.
- **Criterios de aceptación:**
  - [ ] Tras la entrega, el sistema envía al cliente el contrato firmado y el reglamento en PDF.
  - [ ] Se registra el resultado del envío; si falla, el operador puede reenviarlo.
  - [ ] El operador puede cambiar el correo destino antes de enviar.
