---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:10:00Z'
agent_roles: 'design-ux-architect + engineering-frontend-developer + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 14
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 14 Stories

## S-30 · RF-30 — Flujo Completo de Reservaciones de Flota
Como cliente o agente de mostrador, quiero poder apartar un vehículo con fechas futuras, calcular el anticipo y recibir un folio de reserva para asegurar la disponibilidad del auto.
- [ ] Listado de reservaciones con filtros por estado (Pendiente, Confirmada, Convertida, Cancelada).
- [ ] Wizard de reserva en 3 pasos: (1) Fechas y auto, (2) Cotización y desglose, (3) Cliente y anticipo.
- [ ] Folio automático con serie `R-00001` generado de manera atómica.
- [ ] Botón de acción rápida: "Entregar Auto y Convertir a Contrato" que transfiere los datos a un contrato `D-00001` activo.

## S-31 · RF-31 — Selectores de Fecha y Hora Interactivos
Como usuario, quiero seleccionar fechas y horas usando un calendario visual interactivo en español para evitar errores de captura de texto y calcular automáticamente los días de renta.
- [ ] Selector visual de calendario mensual con selección de fecha inicio y fin.
- [ ] Selector desplegable de hora con incrementos de 30 minutos.
- [ ] Cálculo dinámico de horas extras y tolerancia según el reglamento vigente.
- [ ] Bloqueo visual de fechas previas al día de hoy.
