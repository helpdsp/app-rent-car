---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 10
source_spec_kit: 'spec-kit/input/'
---
# Sprint 10: Recepción, liquidación y rezagados

## Objetivo

Al recibir el vehículo el sistema compara las fotos con las de la entrega, liquida con las reglas del reglamento, aplica o devuelve el depósito y marca los contratos rezagados.

## Alcance

- **Requisitos:** RF-21, RF-22
- **Pantallas (spec-kit/input/mockups/):** 7, M4
- **Tareas:** 8 · **Puntos:** 28 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Liquidación completa de un contrato con retraso, km excedente, gasolina y limpieza; comparación de fotos; un contrato sin devolver pasa a rezagado.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- Tolerancia, retrasos de más de 24 h y redondeo de la hora extra dependen de decisiones del cliente.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
