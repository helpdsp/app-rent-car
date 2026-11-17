---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:25:00Z'
agent_roles: 'testing-reality-checker + testing-performance-benchmarker'
vision_command: 'generate_sprints'
sprint_number: 17
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 17 QA Plan

## Casos de Prueba

### Q17-01: Generación de PDF y verificación de 2 páginas
- **Objetivo:** Solicitar la generación del contrato 08160.
- **Criterio de aceptación:** El PDF generado tiene exactamente 2 páginas, las cláusulas completas, los importes en pesos con centavos alineados, y se genera en menos de 2.5 segundos.

### Q17-02: Calidad e incrustación de firmas electrónicas
- **Objetivo:** Firmar en el canvas táctil con firma de cliente y operador y verificar el PDF.
- **Criterio de aceptación:** Ambas firmas se incrustan en sus respectivos recuadros sin deformación y con fondo transparente.

### Q17-03: Escaneo de código QR y validación pública
- **Objetivo:** Escanear el código QR del PDF generado con la cámara de un teléfono.
- **Criterio de aceptación:** Dirige a `/validar/[folio]`, la cual muestra el folio, fecha, estado del contrato, cliente anonimizado y confirmación de que la huella SHA-256 coincide exactamente.

### Q17-04: Detección de alteración (inmutabilidad)
- **Objetivo:** Modificar 1 solo byte del archivo PDF.
- **Criterio de aceptación:** El validador detecta que el hash SHA-256 no coincide y muestra alerta de "Documento alterado o no auténtico".
