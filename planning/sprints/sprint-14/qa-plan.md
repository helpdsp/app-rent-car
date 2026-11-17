---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:10:00Z'
agent_roles: 'testing-reality-checker + testing-api-tester'
vision_command: 'generate_sprints'
sprint_number: 14
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 14 QA Plan

## Casos de Prueba

### Q14-01: Selección de fechas con DatePicker interactivo
- **Objetivo:** Probar el componente de calendario seleccionando fecha de inicio y devolución.
- **Criterio de aceptación:** No permite seleccionar fechas en el pasado; calcula automáticamente los días enteros y horas adicionales; maneja correctamente la zona horaria `America/Tijuana`.

### Q14-02: Generación atómica de folio de reservación `R-00001`
- **Objetivo:** Crear dos reservaciones consecutivas.
- **Criterio de aceptación:** Se asignan folios correlativos sin huecos (ej. `R-00001`, `R-00002`).

### Q14-03: Validación de no solapamiento en reservaciones
- **Objetivo:** Intentar reservar un vehículo específico para fechas que ya están comprometidas en otra reserva confirmada o contrato activo.
- **Criterio de aceptación:** El sistema rechaza la operación con código `VEHICULO_NO_DISPONIBLE` y muestra opciones alternativas.

### Q14-04: Conversión de reservación a contrato
- **Objetivo:** Tomar una reservación confirmada y pulsar "Convertir a Contrato".
- **Criterio de aceptación:** Se crea un contrato en estado `activo` o `borrador` con folio `D-xxxxx`, precargando vehículo, cliente, fechas, tarifas y anticipo; el estado de la reserva pasa a `convertida`.
