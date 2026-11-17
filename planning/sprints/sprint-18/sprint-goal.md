---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:30:00Z'
agent_roles: 'engineering-api-platform-engineer + engineering-devops-automator'
vision_command: 'generate_sprints'
sprint_number: 18
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 18: Comunicaciones y Sincronización CRM (WhatsApp + GHL)

## Objetivo

Automatizar la entrega de información al cliente mediante WhatsApp Business Cloud API y correo transaccional (Resend), y poner en marcha el worker en segundo plano que procese la tabla `outbox` para sincronizar contactos y etapas con GoHighLevel.

## Alcance

- **Requisitos:** RF-38
- **Integraciones:** WhatsApp Business Cloud API, Resend Email API, GoHighLevel REST API
- **Tareas:** 7 · **Puntos:** 25
- **Duración:** 1 semana

## Demo al cliente

Al confirmar una renta o reserva: el cliente recibe un WhatsApp automático con su folio y un correo electrónico con el PDF del contrato adjunto; en GoHighLevel se crea el contacto y se mueve la oportunidad a la etapa "Auto en Renta".

## Criterio de éxito

1. Worker cron que procese los eventos pendientes en `outbox` de forma asíncrona y con reintentos exponenciales.
2. Envío de correos transaccionales mediante Resend con el PDF del contrato firmado adjunto.
3. Notificaciones automáticas de WhatsApp al reservar y recordatorios 24 horas y 2 horas antes de la entrega para evitar cargos de rezago.
