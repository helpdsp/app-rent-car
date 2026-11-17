---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---
# Sprint 1 Stories

## S-01 · RF-01 — Autenticación y roles

- **Prioridad:** Must
- **Pantallas:** pantallas 8 Inicio de sesión y verificación (`spec-kit/input/mockups/previews/08-inicio-de-sesion.html`); 17 Administración: usuarios y roles (`spec-kit/input/mockups/previews/17-admin-usuarios-roles.html`).
- **Criterios de aceptación:**
  - [ ] Inicio de sesión con correo y contraseña, con segundo factor (MFA) para administrador y titular.
  - [ ] Tres roles: operador, administrador, titular; permisos aplicados en el servidor, no solo ocultos en pantalla.
  - [ ] Cierre de sesión por inactividad configurable (por defecto 30 minutos).
  - [ ] El administrador crea, desactiva y cambia el rol de usuarios; un usuario desactivado conserva su autoría en la bitácora.
