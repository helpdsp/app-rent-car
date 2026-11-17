---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:10:00Z'
agent_roles: 'design-ux-architect + engineering-frontend-developer + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 14
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 14 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S14-T01 | Migración SQL: tabla `reservaciones` con secuencia `R-00001`, estados y restricciones | RF-30 | DB | — | apps/web/drizzle/0012_reservaciones.sql | — | backend | 4 | todo |
| S14-T02 | Componente visual interactivo DatePicker con calendario mensual en español | RF-31 | UI | — | apps/web/src/components/ui/DatePicker.tsx | — | frontend | 4 | todo |
| S14-T03 | Componente selector de hora TimePicker con intervalos de 30 min y horario nocturno | RF-31 | UI | — | apps/web/src/components/ui/TimePicker.tsx | — | frontend | 3 | todo |
| S14-T04 | API de reservaciones: listado, creación, cancelación y consulta de disponibilidad | RF-30 | API | /api/reservaciones | apps/web/src/app/api/reservaciones/route.ts | — | backend | 4 | todo |
| S14-T05 | Pantalla de Reservaciones: listado con filtros, buscador y tarjetas táctiles | RF-30 | UI | /reservaciones | apps/web/src/app/reservaciones/page.tsx | nuevo | frontend | 4 | todo |
| S14-T06 | Wizard de Nueva Reservación: selector de fechas, disponibilidad, cotizador y cliente | RF-30, RF-31 | UI | /reservaciones/nueva | apps/web/src/app/reservaciones/nueva/page.tsx | nuevo | frontend | 4 | todo |
| S14-T07 | Acción y endpoint para convertir Reservación en Contrato formal (`D-00001`) | RF-30 | API/UI | /api/reservaciones/[id]/convertir | apps/web/src/app/api/reservaciones/[id]/convertir/route.ts | — | fullstack | 3 | todo |
| S14-T08 | Pruebas unitarias y de integración de reservaciones, cotización y conversión | RF-30, RF-31 | tests | — | apps/web/tests/reservaciones.test.ts | — | qa | 2 | todo |

**Total:** 8 tareas · 28 puntos.
