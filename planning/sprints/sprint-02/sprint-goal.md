---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---
# Sprint 2: Auditoría, tarifas y privacidad

## Objetivo

Cada cambio queda en una bitácora inmutable, el administrador mantiene tarifas y parámetros, y el aviso de privacidad y el almacenamiento seguro están listos.

## Alcance

- **Requisitos:** RF-02, RF-03, RF-28
- **Pantallas (spec-kit/input/mockups/):** 16, 18
- **Tareas:** 11 · **Puntos:** 29 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Un cambio de tarifa aparece en la bitácora con valor anterior y nuevo; ningún rol puede editar ni borrar la bitácora; los parámetros cambian el motor de tarifas.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- La residencia de datos en EE. UU. debe constar en el aviso de privacidad antes del piloto.
- La redondeo de la hora extra (truncar o redondear) sigue por confirmar con el cliente.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
