---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 6
source_spec_kit: 'spec-kit/input/'
---
# Sprint 6: Contrato núcleo I: borrador, folio y cotización

## Objetivo

El operador crea un contrato en borrador, el sistema valida licencia, vehículo y fechas, calcula la cotización y asigna un folio digital único al emitir.

## Alcance

- **Requisitos:** RF-12, RF-13, RF-14
- **Pantallas (spec-kit/input/mockups/):** 3, M2, 11
- **Tareas:** 9 · **Puntos:** 28 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Se reproduce el contrato 08160: 3 días, $4,899 de anticipo, hora extra $204 y km extra $3; folio D-00001; listado de contratos con filtros por estado.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- Es el sprint con más reglas de negocio: las ambiguas del reglamento viven como parámetros y se confirman con el cliente antes.
- Folio con prefijo D- por confirmar con el cliente.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
