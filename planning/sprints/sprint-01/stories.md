---
generated_by_model: 'gemini-4-argon'
generated_at: '2026-11-17T05:22:00Z'
agent_roles: 'product-product-manager + project-management-project-shepherd'
vision_command: 'start_sprint --sprint 1'
sprint_number: 1
source_spec_kit: 'spec-kit/input/'
---
# Sprint 1 Stories

## S-01 · RF-01 — Autenticación y roles

- **Prioridad:** Must
- **Pantallas:** pantallas 8 Inicio de sesión y verificación (`spec-kit/input/mockups/previews/08-inicio-de-sesion.html`); 17 Administración: usuarios y roles (`spec-kit/input/mockups/previews/17-admin-usuarios-roles.html`).
- **Criterios de aceptación:**
  - [x] Inicio de sesión con correo y contraseña, con segundo factor (MFA) para administrador y titular.
  - [x] Tres roles: operador, administrador, titular; permisos aplicados en el servidor, no solo ocultos en pantalla.
  - [x] Cierre de sesión por inactividad configurable (por defecto 30 minutos).
  - [x] El administrador crea, desactiva y cambia el rol de usuarios; un usuario desactivado conserva su autoría en la bitácora.
