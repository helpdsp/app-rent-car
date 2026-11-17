---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---
# Sprint 1: Fundación y acceso

## Objetivo

El proyecto está desplegado en Vercel con base de datos y CI, y un administrador entra con verificación en dos pasos y crea usuarios con rol.

## Alcance

- **Requisitos:** RF-01
- **Pantallas (spec-kit/input/mockups/):** 8, 17
- **Tareas:** 12 · **Puntos:** 28 (capacidad estimada: 25 a 30 por semana con una persona full-stack y una de QA)
- **Duración:** 1 semana

## Demo al cliente

Inicio de sesión de un operador, un administrador con MFA y un titular; alta, desactivación y cambio de rol de usuarios.

## Criterio de éxito

Aprobación del cliente de lo demostrado, más las pruebas del sprint en verde en CI y ningún defecto crítico abierto.

## Riesgos

- Los proyectos de Vercel y Supabase deben existir al iniciar (la conexión de la sesión no pudo crear el de Vercel).
- vitest 5.1.0 falla en este equipo y la 3.x que funciona tiene vulnerabilidades de desarrollo: buscar una versión sin vulnerabilidades que funcione aquí (probar la última 4.x) antes del primer despliegue.

## Source

- spec-kit/input/sprint-plan.md
- spec-kit/input/product-prd.md
- spec-kit/input/mockups/README.md
