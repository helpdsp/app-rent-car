---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---
# Sprint 4: Vehículos y disponibilidad

## Objetivo

La flota está registrada con sus documentos al día y es imposible rentar la misma unidad en fechas que se cruzan, incluso con dos operadores a la vez.

## Alcance

- **Requisitos:** RF-07, RF-08, RF-09
- **Pantallas (spec-kit/input/mockups/):** 9, 10
- **Tareas:** 8 · **Puntos:** 25 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Alta de un vehículo con tarjeta de circulación y póliza; un vehículo con documentos vencidos no aparece como disponible; prueba en vivo de dos reservas simultáneas.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- La restricción de exclusión por rango debe probarse contra Postgres real con concurrencia, no con simulaciones.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
