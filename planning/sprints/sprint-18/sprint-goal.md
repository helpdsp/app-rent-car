---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:30:00Z'
agent_roles: 'engineering-api-platform-engineer + engineering-devops-automator'
vision_command: 'generate_sprints'
sprint_number: 18
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/plan-detallado-sprint-18-integraciones-ghl.md'
---
# Sprint 18: Comunicaciones y Sincronización CRM (WhatsApp + Resend + GHL)

## Objetivo

Automatizar la entrega de información al cliente mediante WhatsApp Business Cloud API y correo transaccional (Resend), poner en marcha el worker en segundo plano que procese la tabla `outbox` para sincronizar contactos y etapas con GoHighLevel, y habilitar la recepción de reservas generadas en GHL Rentals hacia la PWA de mostrador.

## Alcance

- **Requisitos:** RF-38
- **Integraciones:** WhatsApp Business Cloud API (Meta Graph v21.0), Resend Email API, GoHighLevel REST API v2 (Contactos, Oportunidades y Webhooks de Rentals).
- **Tareas:** 8 · **Puntos:** 28
- **Duración:** 1 semana

## Demo al cliente

Al confirmar una renta o reserva: el cliente recibe un WhatsApp automático con su folio y un correo electrónico con el PDF del contrato adjunto; en GoHighLevel se crea o actualiza el contacto y se mueve la oportunidad a la etapa "Auto en Renta". Además, las reservas creadas en el catálogo web de GHL Rentals se sincronizan automáticamente con la lista de reservaciones de la PWA.

## Criterio de éxito

1. Worker cron que procese los eventos pendientes en `outbox` de forma asíncrona y con reintentos exponenciales.
2. Envío de correos transaccionales mediante Resend con el PDF oficial del contrato firmado adjunto.
3. Notificaciones automáticas de WhatsApp al reservar y recordatorios 24 horas y 2 horas antes de la entrega para evitar cargos de rezago.
4. Webhook receptor de reservas desde GHL Rentals.
5. Panel administrativo para monitorear y probar integraciones en vivo.
