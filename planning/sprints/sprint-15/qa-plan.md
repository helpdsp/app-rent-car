---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:15:00Z'
agent_roles: 'testing-reality-checker + engineering-identity-access-engineer'
vision_command: 'generate_sprints'
sprint_number: 15
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 15 QA Plan

## Casos de Prueba

### Q15-01: Redirección automática a /login
- **Objetivo:** Intentar acceder a `/` o `/contratos` sin cookie de sesión.
- **Criterio de aceptación:** El middleware intercepta la petición y redirige a `/login?redirect=/contratos`.

### Q15-02: Inicio de sesión con credenciales válidas e inválidas
- **Objetivo:** Probar credenciales erróneas y luego correctas.
- **Criterio de aceptación:** Error claro en español ante contraseña inválida; redirección al Tablero ante éxito, estableciendo cookies HTTP-only.

### Q15-03: Restricción de acceso a panel administrativo por rol
- **Objetivo:** Iniciar sesión como `operador` e intentar acceder a `/admin/usuarios` o `/admin/bitacora`.
- **Criterio de aceptación:** Acceso denegado con código 403 Forbidden y mensaje en español; solo roles `administrador` o `titular` pueden acceder.

### Q15-04: Cierre de sesión y descarte de cookies
- **Objetivo:** Presionar "Cerrar sesión" en el menú de usuario.
- **Criterio de aceptación:** Las cookies de sesión se eliminan y el usuario es redirigido a `/login`.
