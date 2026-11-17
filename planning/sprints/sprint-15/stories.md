---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:15:00Z'
agent_roles: 'engineering-identity-access-engineer + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 15
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 15 Stories

## S-35 · RF-35 — Autenticación Real y Sesiones con Supabase Auth
Como titular de la empresa o administrador, quiero que el personal acceda con credenciales individuales para proteger la información del cliente y auditar quién emitió cada contrato.
- [x] Pantalla institucional de inicio de sesión (/login) con correo y contraseña.
- [x] Recuperación de contraseña vía correo electrónico con enlace seguro.
- [x] Sesiones persistidas en cookies seguras HTTP-only cifradas.
- [x] Middleware de Next.js que protege rutas y valida roles autorizados.
- [x] Trigger en base de datos para sincronizar nuevos usuarios de `auth.users` a la tabla `usuarios`.
- [x] Registro inmutable de eventos de acceso (login exitoso, login fallido, logout) en la tabla `auditoria`.
