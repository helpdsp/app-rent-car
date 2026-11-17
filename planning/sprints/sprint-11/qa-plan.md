---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 11
source_spec_kit: 'spec-kit/input/'
---
# Sprint 11 QA Plan

## Casos del plan de pruebas

- T-68
- T-69
- T-70
- T-71
- T-72
- T-73

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- Un aviso después del día del hecho queda marcado como tardío.
- Un contrato con incidente abierto no puede concluirse.
- Un contrato vigente no se cancela.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- La penalización de cancelación es ambigua en el reglamento: se implementa como parámetro y se confirma con el cliente.
