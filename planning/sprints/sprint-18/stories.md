---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:30:00Z'
agent_roles: 'engineering-api-platform-engineer + engineering-devops-automator'
vision_command: 'generate_sprints'
sprint_number: 18
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/plan-detallado-sprint-18-integraciones-ghl.md'
---
# Sprint 18 Stories

## S-38 · RF-38 — Integración de Comunicaciones y CRM (WhatsApp + Resend + GHL)
Como cliente, quiero recibir mi contrato y recordatorios por WhatsApp y correo; y como gerente comercial, quiero que los clientes y rentas se sincronicen automáticamente en GoHighLevel, y que las reservas del catálogo GHL Rentals se reciban en mostrador.
- [ ] Procesador / worker de la tabla `outbox` con manejo de reintentos exponenciales y estados (`pendiente`, `procesando`, `completado`, `fallido`).
- [ ] Sincronización con API REST de GoHighLevel (crear/actualizar contacto con `ghl_contact_id`, custom fields y mover oportunidad en pipeline).
- [ ] Envío de correos electrónicos vía Resend con el PDF oficial del contrato adjunto.
- [ ] Mensajería de WhatsApp mediante Meta Cloud API: confirmación de reserva/contrato y avisos de devolución con 24h y 2h de anticipación.
- [ ] Webhook receptor de eventos de GoHighLevel Rentals para pre-crear reservaciones en la PWA.
- [ ] Panel en `/admin/integraciones` para configurar tokens, diagnosticar conexiones con 1-click y monitorear la cola `outbox`.
