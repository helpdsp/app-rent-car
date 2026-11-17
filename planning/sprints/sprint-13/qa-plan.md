---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:05:00Z'
agent_roles: 'testing-reality-checker + design-ui-finish-gate-reviewer'
vision_command: 'generate_sprints'
sprint_number: 13
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 13 QA Plan

## Casos de Prueba

### Q13-01: Verificación de Bottom Navigation en móvil (<768px)
- **Objetivo:** Verificar que en pantalla móvil la barra lateral se oculta y aparece la barra inferior táctil con accesos directos (Tablero, Contratos, Clientes, Flota).
- **Criterio de aceptación:** Todos los botones son accesibles con un solo toque y miden al menos 44x44px.

### Q13-02: Verificación de iconografía Lucide en botones y estados
- **Objetivo:** Verificar que las acciones principales cuentan con ícono representativo y que los estados de contratos muestran ícono coherente.
- **Criterio de aceptación:** Ningún botón de acción primaria o secundaria queda sin ícono semántico o con diseño ambiguo.

### Q13-03: Diálogo de confirmación al cancelar formulario sucio
- **Objetivo:** Modificar campos en el formulario de alta de cliente y hacer clic en "Cancelar".
- **Criterio de aceptación:** Aparece modal "¿Deseas descartar los cambios no guardados?" con opciones "Continuar editando" y "Descartar cambios". Si se descarta, el formulario se cierra sin guardar datos.

### Q13-04: Cancelación en emisión de contrato
- **Objetivo:** Iniciar una nueva cotización/contrato y presionar "Cancelar".
- **Criterio de aceptación:** Se limpia el estado temporal y se redirige de vuelta al listado de contratos sin crear registro fantasma.
