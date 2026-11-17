---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:05:00Z'
agent_roles: 'design-ux-architect + design-ui-designer + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 13
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 13 Stories

## S-32 · RF-32 — Sistema de Iconografía Semántica (Lucide Icons)
Como operador de mostrador, quiero ver íconos claros en cada botón, estado y paso para entender y deducir de inmediato qué acción estoy realizando.
- [ ] Incorporar Lucide Icons en barra de navegación, encabezados y botones de acción rápida.
- [ ] Íconos de estado para contratos (Borrador, Activo, Concluido, Cancelado, Rezagado).
- [ ] Íconos específicos de combustible (tanque), odómetro (velocímetro) y fotos (cámara).

## S-33 · RF-33 — Adaptabilidad y Responsividad Total (Mobile & Tablet First)
Como operador que usa tableta en mostrador o celular en patio, quiero que la interfaz se adapte a cualquier tamaño de pantalla sin desbordarse ni requerir zoom.
- [ ] Barra inferior táctil (Bottom Navigation) en pantallas móviles (<768px).
- [ ] Drawer lateral colapsable en tableta (768px a 1024px) y barra fija en escritorio.
- [ ] Tablas de clientes, vehículos y contratos convertibles a vista de tarjetas táctiles en pantallas móviles.
- [ ] Controles táctiles con área mínima de 44px de toque.

## S-34 · RF-34 — Botones de Cancelar, Descarte y Confirmación
Como operador o administrador, quiero poder cancelar cualquier formulario o acción sin que se guarde automáticamente, y que el sistema me pida confirmación si modifiqué datos.
- [ ] Botones secundarios "Cancelar" y "Volver" en formulario de cliente (nuevo/editar).
- [ ] Botones "Cancelar" en creación de contrato y cotizador.
- [ ] Modal de confirmación "¿Deseas descartar los cambios no guardados?" al intentar cancelar o navegar fuera con formulario sucio.
- [ ] Acción de cancelar contrato en estado borrador con liberación inmediata de la unidad.
