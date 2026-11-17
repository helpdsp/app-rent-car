---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T09:50:00Z'
agent_roles: 'product-manager + project-management-project-shepherd + testing-reality-checker'
vision_command: 'start_sprint --sprint 8'
sprint_number: 8
source_spec_kit: 'spec-kit/input/'
---
# Sprint 8 Stories

## S-17 · RF-17 — Generación de PDF del contrato y del reglamento

- **Prioridad:** Must
- **Pantallas:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`).
- **Criterios de aceptación:**
  - [x] Contrato de dos caras: carátula con datos, inventario y pagaré opcional, y las 21 cláusulas, prellenado con los datos del contrato.
  - [x] Reglamento prellenado y firmable.
  - [x] Los PDF se generan sin pasos manuales y se pueden imprimir.
  - [x] Cada PDF emitido se conserva con su hash para detectar alteraciones.
  - [x] Los datos pendientes del formato (registro PROFECO, ciudad de jurisdicción, teléfono de fallas) son parámetros configurables.

## S-18 · RF-18 — Firma digital en tableta

- **Prioridad:** Must
- **Pantallas:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`). No hay versión de celular.
- **Criterios de aceptación:**
  - [x] Captura de la firma del arrendatario, de los conductores adicionales y del pagaré en un área táctil.
  - [x] Se guarda la imagen de la firma, el hash del PDF firmado, fecha, hora, usuario y dispositivo.
  - [x] Una vez firmado, el PDF es inmutable; cualquier corrección genera una nueva versión que se vuelve a firmar.
  - [x] Alternativa de impresión y firma manuscrita, con escaneo adjunto al expediente.
