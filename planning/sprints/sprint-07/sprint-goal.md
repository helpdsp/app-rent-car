---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 7
source_spec_kit: 'spec-kit/input/'
---
# Sprint 7: Contrato núcleo II: cobro, conductores y pagaré

## Objetivo

El operador registra el anticipo en una o varias formas de pago, el depósito, los conductores adicionales, el pagaré y «facturar a», sin guardar nunca un número de tarjeta.

## Alcance

- **Requisitos:** RF-15, RF-16, RF-26
- **Pantallas (spec-kit/input/mockups/):** 4, 15
- **Tareas:** 9 · **Puntos:** 26 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Anticipo de $4,899 con $4,399 en efectivo y $500 por transferencia; depósito de $8,000 con recibo; conductor adicional con licencia; pagaré opcional.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- «T/D» es ambiguo en los contratos de papel: confirmar las formas de pago con el cliente.
- Quién puede cambiar la tarifa de un contrato sigue por definir.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
