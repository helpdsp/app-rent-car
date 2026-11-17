---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'project-management-senior-project-manager + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 4
source_spec_kit: 'spec-kit/input/'
---
# Sprint 4 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S04-T01 | Tablas `vehiculos`, `bloqueos_vehiculo` y esqueleto de `contratos` con rango de fechas; extensión btree_gist | RF-09 | DB | — | drizzle/0005_vehiculos.sql | — | fullstack | 3 | todo |
| S04-T02 | Restricción de exclusión por rango y por vehículo, más trigger contra bloqueos; prueba de concurrencia con 20 intentos | RF-09 | DB | — | drizzle/0005_vehiculos.sql, tests/disponibilidad.test.ts | — | fullstack | 5 | todo |
| S04-T03 | API de vehículos con estado, clave única y kilometraje que solo sube salvo corrección de administrador | RF-07 | API | /api/vehiculos | apps/web/src/app/api/vehiculos/route.ts | — | fullstack | 3 | todo |
| S04-T04 | Pantallas Vehículos (listado) y Vehículo (ficha con datos e historial de kilómetros) | RF-07 | VehiculosPage, VehiculoPage | /vehiculos, /vehiculos/[id] | apps/web/src/app/vehiculos/ | 9, 10 | fullstack | 3 | todo |
| S04-T05 | Documentos del vehículo: tarjeta de circulación y póliza con vigencia, «Subir renovación» y bloqueo si vencen | RF-08 | DocumentosVehiculo | /vehiculos/[id] | apps/web/src/components/vehiculos/DocumentosVehiculo.tsx | 10 | fullstack | 3 | todo |
| S04-T06 | Bloqueo por mantenimiento desde la ficha, rechazado si cruza una renta | RF-09 | BloqueosVehiculo | /vehiculos/[id] | apps/web/src/components/vehiculos/Bloqueos.tsx | 10 | fullstack | 2 | todo |
| S04-T07 | Vehículos disponibles para un rango, con motivo de exclusión (rentado, mantenimiento, documentos vencidos, baja) | RF-09 | API | /api/vehiculos/disponibles | apps/web/src/app/api/vehiculos/disponibles/route.ts | — | fullstack | 3 | todo |
| S04-T08 | Pruebas de documentos vencidos, kilometraje y concurrencia (T-14, T-15, T-20, T-21, T-22) | RF-09 | tests | — | apps/web/tests/vehiculos.test.ts | — | qa | 3 | todo |

**Total:** 8 tareas · 25 puntos.

Las ubicaciones son sugeridas bajo `apps/web/`. «Mockup» remite a los números de `spec-kit/input/mockups/README.md`: la tarea está terminada cuando la pantalla coincide con su mockup en estructura, datos mostrados y reglas visibles.
