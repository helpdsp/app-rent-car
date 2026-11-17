---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 7
source_spec_kit: 'spec-kit/input/'
---
# Sprint 7 QA Plan

## Casos del plan de pruebas

- T-38
- T-39
- T-40
- T-41
- T-42
- T-43
- T-44
- T-45
- T-46
- T-47

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- La suma de los anticipos cubre la renta base antes de pasar a vigente.
- Un número completo de tarjeta se rechaza.
- El arrendatario puede no tener licencia si un conductor adicional la tiene vigente.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- «T/D» es ambiguo en los contratos de papel: confirmar las formas de pago con el cliente.
- Quién puede cambiar la tarifa de un contrato sigue por definir.
