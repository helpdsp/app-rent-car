---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:10:00Z'
agent_roles: 'design-ux-architect + engineering-frontend-developer + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 14
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 14: Flujo Integral de Reservaciones y DatePicker

## Objetivo

Proveer un flujo guiado y visual de reservación de vehículos de punta a punta, apoyado por componentes de selección de fecha y hora tipo calendario interactivo (evitando entrada de texto plano), cotización en vivo y conversión inmediata a contrato al entregar la unidad.

## Alcance

- **Requisitos:** RF-30, RF-31
- **Pantallas:** Nueva pantalla de Reservaciones (/reservaciones), Nueva Reserva (/reservaciones/nueva), Detalle de Reserva
- **Tareas:** 8 · **Puntos:** 28
- **Duración:** 1 semana

## Demo al cliente

Demostración interactiva en pantalla táctil: seleccionar fechas en un calendario mensual, ver qué vehículos están libres en esas fechas sin solapamiento, generar una cotización instantánea, apartar con folio `R-00001` y hacer un clic en "Convertir a Contrato" que precarga todo en la entrega.

## Criterio de éxito

1. Selector interactivo tipo calendario en español que permite elegir rangos de fecha y hora fácilmente.
2. Bloqueo de fechas pasadas y validación de disponibilidad en tiempo real.
3. Tabla `reservaciones` en Postgres con folio atómico `R-00001` y estados (`pendiente`, `confirmada`, `convertida`, `cancelada`).
4. Flujo de conversión a contrato `D-00001` con un solo toque en mostrador.
