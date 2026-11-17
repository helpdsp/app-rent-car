---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T08:55:00Z'
agent_roles: 'product-manager + project-management-project-shepherd + testing-reality-checker'
vision_command: 'start_sprint --sprint 7'
sprint_number: 7
source_spec_kit: 'spec-kit/input/'
---
# Sprint 7 Stories

## S-15 · RF-15 — Conductores adicionales, segundo auto y referencia

- **Prioridad:** Should
- **Pantallas:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
- **Criterios de aceptación:**
  - [x] De 0 a N conductores adicionales por contrato con nombre, domicilio, teléfono, licencia, vencimiento y firma; su licencia debe estar vigente en el periodo.
  - [x] Segundo vehículo opcional con las mismas validaciones de disponibilidad y documentos.
  - [x] Referencia del cliente con nombre, teléfono y celular.

## S-16 · RF-16 — Anticipo, garantía y pagos

- **Prioridad:** Must
- **Pantallas:** pantallas 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
- **Criterios de aceptación:**
  - [x] Se registra el anticipo (renta total pagada por adelantado) y el depósito en garantía con tipo: efectivo, tarjeta de crédito o Visa Láser, y monto.
  - [x] Un anticipo admite **varios pagos de formas distintas** (efectivo, tarjeta, transferencia o depósito), por ejemplo parte por transferencia y parte en efectivo; la suma debe cubrir la renta total antes de pasar a vigente.
  - [x] **El sistema nunca almacena números de tarjeta.**
  - [x] Recibo de depósito imprimible con razón social, fecha, importe y firma de quien recibe (cláusula 8.ª).
  - [x] Al concluir, el depósito se aplica al saldo o se devuelve, y cada movimiento queda registrado.
  - [x] Un contrato no pasa a vigente sin anticipo y depósito registrados.

## S-26 · RF-26 — Pagaré

- **Prioridad:** Could
- **Pantallas:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`).
- **Criterios de aceptación:**
  - [x] Pagaré opcional con monto, fecha, ciudad, interés mensual, nombre y domicilio del suscriptor.
  - [x] Se incluye en el PDF solo cuando el operador lo activa y requiere firma.
