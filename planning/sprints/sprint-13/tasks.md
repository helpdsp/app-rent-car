---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:05:00Z'
agent_roles: 'design-ux-architect + design-ui-designer + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 13
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 13 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S13-T01 | Instalar y configurar paquete de íconos Lucide React y crear catálogo de íconos semánticos MRA | RF-32 | UI | — | apps/web/src/components/ui/icons.tsx | — | frontend | 2 | todo |
| S13-T02 | Rediseñar barra de navegación con modo Mobile (Bottom Navigation) y Drawer táctil en tableta | RF-33 | UI | global | apps/web/src/components/layout/Navbar.tsx | global | frontend | 4 | todo |
| S13-T03 | Adaptar tablas de clientes a tarjetas táctiles responsivas con acciones rápidas | RF-33 | UI | /clientes | apps/web/src/app/clientes/page.tsx | 08 | frontend | 3 | todo |
| S13-T04 | Adaptar catálogo de vehículos a vista de cuadrícula responsiva (Grid/Cards) para móvil | RF-33 | UI | /vehiculos | apps/web/src/app/vehiculos/page.tsx | 15 | frontend | 3 | todo |
| S13-T05 | Implementar botones Cancelar/Volver y modal de confirmación en formulario de cliente | RF-34 | UI | /clientes | apps/web/src/components/clientes/ClienteModal.tsx | 09 | frontend | 3 | todo |
| S13-T06 | Botón de cancelar y descarte en pantalla de emisión de contrato y cotizador | RF-34 | UI | /contratos/nuevo | apps/web/src/app/contratos/nuevo/page.tsx | 02 | frontend | 3 | todo |
| S13-T07 | Modal genérico reutilizable de confirmación de descarte de cambios (Dirty Form Guard) | RF-34 | UI | — | apps/web/src/components/ui/ConfirmDialog.tsx | — | frontend | 4 | todo |
| S13-T08 | Pruebas de responsividad, targets táctiles mínimos de 44px y flujo de cancelación | RF-33, RF-34 | tests | — | apps/web/tests/ux/responsividad.test.ts | — | qa | 4 | todo |

**Total:** 8 tareas · 26 puntos.
