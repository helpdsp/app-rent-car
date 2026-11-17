---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:30:00Z'
agent_roles: 'engineering-api-platform-engineer + engineering-devops-automator'
vision_command: 'generate_sprints'
sprint_number: 18
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 18 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S18-T01 | Worker procesador de eventos de la tabla `outbox` con reintentos exponenciales | RF-38 | worker | /api/cron/outbox | apps/web/src/app/api/cron/outbox/route.ts | — | backend | 4 | todo |
| S18-T02 | Cliente de integración con API REST de GoHighLevel (contactos y oportunidades) | RF-38 | lib | — | apps/web/src/lib/integraciones/ghl.ts | — | backend | 4 | todo |
| S18-T03 | Módulo de envío de correos transaccionales con PDF adjunto mediante Resend | RF-38 | lib | — | apps/web/src/lib/comunicaciones/email.ts | — | backend | 3 | todo |
| S18-T04 | Cliente y plantillas de WhatsApp Business Cloud API (Meta Graph API) | RF-38 | lib | — | apps/web/src/lib/comunicaciones/whatsapp.ts | — | backend | 4 | todo |
| S18-T05 | Cron de recordatorios preventivos de devolución (24h y 2h antes) vía WhatsApp | RF-38 | API | /api/cron/recordatorios | apps/web/src/app/api/cron/recordatorios/route.ts | — | backend | 4 | todo |
| S18-T06 | Panel de configuración de integraciones (API Keys de Resend, WhatsApp, GHL) en Admin | RF-38 | UI | /admin/integraciones | apps/web/src/app/admin/integraciones/page.tsx | — | frontend | 3 | todo |
| S18-T07 | Pruebas de integración del worker outbox, envíos de WhatsApp y correos con mock | RF-38 | tests | — | apps/web/tests/integraciones.test.ts | — | qa | 3 | todo |

**Total:** 7 tareas · 25 puntos.
