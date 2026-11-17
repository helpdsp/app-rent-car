---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T12:15:00Z'
agent_roles: 'product-manager + project-management-project-shepherd + testing-reality-checker'
vision_command: 'start_sprint --sprint 10'
sprint_number: 10
source_spec_kit: 'spec-kit/input/'
---
# Sprint 10 Stories

## S-21 · RF-21 — Recepción del vehículo y liquidación

- **Prioridad:** Must
- **Pantallas:** pantallas 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`); M4 Recepción: comparar fotos (celular) (`spec-kit/input/mockups/previews/m4-movil-recepcion-comparar.html`).
- **Criterios de aceptación:**
  - [x] Captura de kilometraje de entrada (mayor o igual al de salida), gasolina, inventario, daños, fotos y video.
  - [x] Se piden los mismos seis ángulos de foto que en la entrega; la recepción no se completa con ángulos pendientes, salvo que un administrador lo autorice con una nota.
  - [x] La foto del tablero con el kilometraje de entrada es obligatoria y se liga al valor capturado; el cálculo del kilometraje excedente usa los dos kilometrajes, y sus fotos respaldan el cobro si el cliente lo disputa.
  - [x] Vista de comparación lado a lado, por ángulo, entre la foto de entrega y la de recepción, para determinar si un daño ya existía.
  - [x] Las fotos y el video de entrega y recepción se conservan en el expediente del contrato durante el plazo de retención configurable (por defecto, el que defina el cliente con su aviso de privacidad) y se pueden consultar y exportar con el contrato.
  - [x] Cargo por gasolina si se devuelve con faltante respecto a la salida.
  - [x] Liquidación automática: renta base, retraso, km excedente, otros cargos y bonificaciones, con total y saldo (total menos anticipo).
  - [x] Odómetro dañado por culpa del cliente: se cobra por día (cláusula 16.ª).
  - [x] El contrato pasa a recibido y, al liquidar el saldo y aplicar o devolver el depósito, a concluido.

## S-22 · RF-22 — Contratos rezagados

- **Prioridad:** Should
- **Pantallas:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).
- **Criterios de aceptación:**
  - [x] Pasada la hora de entrada prevista sin devolución, el contrato pasa a rezagado y aparece en el tablero.
  - [x] Se muestra el cargo acumulado por retraso en tiempo real.
  - [x] Se avisa al operador; el aviso al cliente queda fuera del MVP.
