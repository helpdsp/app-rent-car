---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 2
source_spec_kit: 'spec-kit/input/'
---
# Sprint 2 QA Plan

## Casos del plan de pruebas

- T-02
- T-03
- T-04
- T-07

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- Ningún rol, incluido el de servicio, puede hacer UPDATE ni DELETE en `auditoria`.
- Un cambio de tarifa no altera contratos ya emitidos.
- Cada lectura de un archivo sensible genera una entrada de bitácora.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- La residencia de datos en EE. UU. debe constar en el aviso de privacidad antes del piloto.
- La redondeo de la hora extra (truncar o redondear) sigue por confirmar con el cliente.
