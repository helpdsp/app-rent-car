---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 11
source_spec_kit: 'spec-kit/input/'
---
# Sprint 11: Excepciones: incidentes, renovación y cancelación

## Objetivo

El sistema cubre lo que sale del camino feliz: incidentes con aviso tardío, renovación como contrato nuevo ligado y cancelación con penalización.

## Alcance

- **Requisitos:** RF-23, RF-24, RF-25
- **Pantallas (spec-kit/input/mockups/):** 12, 13, 14
- **Tareas:** 8 · **Puntos:** 25 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Registro de un accidente con aviso tardío; renovación de un contrato que vence hoy; cancelación con penalización de 20 % y del total.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- La penalización de cancelación es ambigua en el reglamento: se implementa como parámetro y se confirma con el cliente.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
