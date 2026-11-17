---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:15:00Z'
agent_roles: 'engineering-identity-access-engineer + engineering-backend-architect + engineering-frontend-developer'
vision_command: 'generate_sprints'
sprint_number: 15
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 15: Autenticación Real y Sesiones con Supabase Auth

## Objetivo

Reemplazar los roles y usuarios simulados por una infraestructura de autenticación institucional robusta usando Supabase Auth (`@supabase/ssr`), cookies HTTP-only, middleware de rutas protegidas y bitácora de accesos.

## Alcance

- **Requisitos:** RF-35
- **Pantallas:** Login (/login), Recuperación de Contraseña (/recuperar), Perfil de Usuario (/perfil)
- **Tareas:** 7 · **Puntos:** 25
- **Duración:** 1 semana

## Demo al cliente

Flujo de inicio de sesión real: entrar a la aplicación redirige a `/login`, inicio de sesión con correo y contraseña válidos, acceso condicional según el rol (`administrador`, `titular`, `operador`, `mantenimiento`), bloqueo de rutas no autorizadas y cierre de sesión con limpieza total de cookies.

## Criterio de éxito

1. Middleware Next.js en producción intercepta todas las rutas protegidas (`/`, `/contratos`, `/clientes`, `/vehiculos`, `/admin`) y redirige a `/login` si no hay sesión activa.
2. Sincronización automática de `auth.users` con la tabla interna `usuarios` (nombre, rol, activo).
3. Todas las acciones sensibles registran el `usuario_id` real autenticado en la bitácora `auditoria`.
