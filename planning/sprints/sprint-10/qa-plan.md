---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 10
source_spec_kit: 'spec-kit/input/'
---
# Sprint 10 QA Plan

## Casos del plan de pruebas

- T-62
- T-63
- T-64
- T-65
- T-66
- T-67
- T-77
- T-78

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- 4 h 1 min de retraso cobra un día, no horas.
- Con seguro nocturno cualquier retraso cobra el día completo.
- La suma de las líneas de cargo es siempre el total.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- Tolerancia, retrasos de más de 24 h y redondeo de la hora extra dependen de decisiones del cliente.
