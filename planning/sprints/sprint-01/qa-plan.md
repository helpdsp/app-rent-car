---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'testing-api-tester + product-manager'
vision_command: 'generate_sprints'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---
# Sprint 1 QA Plan

## Casos del plan de pruebas

- T-01
- T-05
- T-06

(Descripción de cada caso en `spec-kit/input/test-plan.md`.)

## Puntos de atención

- Acceso por rol en el servidor y en RLS, no solo en pantalla.
- MFA obligatorio para administrador y titular.
- Un usuario desactivado no inicia sesión y conserva su autoría.

## Entrada

- Historias del sprint con criterios de aceptación y datos de prueba definidos.
- Pantallas del sprint disponibles en `spec-kit/input/mockups/`.

## Salida

- Pruebas del sprint en verde en CI.
- Sin defectos críticos abiertos.
- Demo aceptada por el cliente.

## Riesgos monitoreados

- Los proyectos de Vercel y Supabase deben existir al iniciar (la conexión de la sesión no pudo crear el de Vercel).
- vitest 5.1.0 falla en este equipo y la 3.x que funciona tiene vulnerabilidades de desarrollo: buscar una versión sin vulnerabilidades que funcione aquí (probar la última 4.x) antes del primer despliegue.
