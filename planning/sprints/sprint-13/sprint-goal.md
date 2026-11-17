---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:05:00Z'
agent_roles: 'design-ux-architect + design-ui-designer + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 13
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 13: UX Móvil, Iconografía Global y Controles de Cancelación

## Objetivo

Transformar la experiencia de usuario del MVP para que sea 100% responsiva (Mobile & Tablet First), cuente con un sistema visual completo de iconografía intuitiva, y proporcione controles de cancelación, retorno y descarte con modales de confirmación en todos los formularios.

## Alcance

- **Requisitos:** RF-32, RF-33, RF-34
- **Pantallas Impactadas:** Tablero (/), Contratos (/contratos), Clientes (/clientes), Flota (/vehiculos), Cotizador e Inspección
- **Tareas:** 8 · **Puntos:** 26
- **Duración:** 1 semana

## Demo al cliente

Navegación fluida en celular y tableta física en mostrador: barra inferior táctil, botones con íconos claros, formularios de clientes y contratos con botones de cancelar y diálogo de confirmación para no perder datos por error.

## Criterio de éxito

1. En pantallas móviles (<768px), la barra lateral se oculta y aparece una barra de navegación inferior táctil (Bottom Navigation) accesible con el pulgar.
2. Todas las tablas de datos (clientes, vehículos, contratos) se adaptan como tarjetas táctiles legibles en celular y tableta.
3. Todo formulario dispone de botón "Cancelar" o "Volver" con modal de confirmación si hay datos modificados.
4. Iconografía Lucide en botones de acción, estados, pasos y encabezados.
