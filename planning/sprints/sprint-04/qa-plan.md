---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---
# Sprint 4 QA Plan

## Casos del plan de pruebas

- T-14
- T-15
- T-20
- T-21
- T-22

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- 20 intentos paralelos sobre el mismo vehículo y fechas: solo uno gana.
- Una renta que termina a las 11:00 no choca con otra que empieza a las 11:00.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- La restricción de exclusión por rango debe probarse contra Postgres real con concurrencia, no con simulaciones.
