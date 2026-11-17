---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 6
source_spec_kit: 'spec-kit/input/'
---
# Sprint 6 QA Plan

## Casos del plan de pruebas

- T-30
- T-31
- T-32
- T-33
- T-34
- T-35
- T-36
- T-37

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- Caso de referencia 08160 de punta a punta.
- Dos emisiones concurrentes no duplican el folio.
- La transición borrador a concluido es rechazada por la base de datos.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- Es el sprint con más reglas de negocio: las ambiguas del reglamento viven como parámetros y se confirman con el cliente antes.
- Folio con prefijo D- por confirmar con el cliente.
