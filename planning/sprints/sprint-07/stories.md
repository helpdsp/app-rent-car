---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 7
source_spec_kit: 'spec-kit/input/'
---
# Sprint 7 Stories

## S-15 · RF-15 — Conductores adicionales, segundo auto y referencia

- **Prioridad:** Should
- **Pantallas:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
- **Criterios de aceptación:**
  - [ ] De 0 a N conductores adicionales por contrato con nombre, domicilio, teléfono, licencia, vencimiento y firma; su licencia debe estar vigente en el periodo.
  - [ ] Segundo vehículo opcional con las mismas validaciones de disponibilidad y documentos.
  - [ ] Referencia del cliente con nombre, teléfono y celular.

## S-16 · RF-16 — Anticipo, garantía y pagos

- **Prioridad:** Must
- **Pantallas:** pantallas 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
- **Criterios de aceptación:**
  - [ ] Se registra el anticipo (renta total pagada por adelantado) y el depósito en garantía con tipo: efectivo, tarjeta de crédito o Visa Láser, y monto.
  - [ ] Un anticipo admite **varios pagos de formas distintas** (efectivo, tarjeta, transferencia o depósito), por ejemplo parte por transferencia y parte en efectivo; la suma debe cubrir la renta total antes de pasar a vigente.
  - [ ] **El sistema nunca almacena números de tarjeta.**
  - [ ] Recibo de depósito imprimible con razón social, fecha, importe y firma de quien recibe (cláusula 8.ª).
  - [ ] Al concluir, el depósito se aplica al saldo o se devuelve, y cada movimiento queda registrado.
  - [ ] Un contrato no pasa a vigente sin anticipo y depósito registrados.

## S-26 · RF-26 — Pagaré

- **Prioridad:** Could
- **Pantallas:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`).
- **Criterios de aceptación:**
  - [ ] Pagaré opcional con monto, fecha, ciudad, interés mensual, nombre y domicilio del suscriptor.
  - [ ] Se incluye en el PDF solo cuando el operador lo activa y requiere firma.
