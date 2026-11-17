---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 5
source_spec_kit: 'spec-kit/input/'
---
# Sprint 5: Vigencias y tablero

## Objetivo

Nada vence sin aviso: el sistema revisa a diario las vigencias, manda correos y el operador ve su tablero en tableta y celular.

## Alcance

- **Requisitos:** RF-10, RF-11
- **Pantallas (spec-kit/input/mockups/):** 1, M1
- **Tareas:** 8 · **Puntos:** 23 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Un documento a 7 días de vencer genera su correo una sola vez; el tablero muestra documentos por vencer y búsqueda global; vista de celular.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- El correo debe enviarse desde un dominio verificado en Resend antes del piloto.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
