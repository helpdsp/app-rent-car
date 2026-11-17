---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 8
source_spec_kit: 'spec-kit/input/'
---
# Sprint 8: PDF y firma en tableta

## Objetivo

El contrato y el reglamento se generan prellenados en PDF, el cliente firma en la tableta y el PDF queda inmutable con su huella.

## Alcance

- **Requisitos:** RF-17, RF-18
- **Pantallas (spec-kit/input/mockups/):** 5
- **Tareas:** 8 · **Puntos:** 26 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Contrato de dos caras y reglamento prellenados; firma táctil; el PDF firmado no se puede alterar y se detecta si se modifica.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- La validez legal de la firma digital frente a PROFECO debe confirmarla un abogado.
- Registro PROFECO, jurisdicción y teléfono de fallas siguen en blanco en el formato: son parámetros hasta que el cliente los dé.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
