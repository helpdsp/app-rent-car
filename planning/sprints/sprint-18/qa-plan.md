---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:30:00Z'
agent_roles: 'testing-reality-checker + testing-api-tester'
vision_command: 'generate_sprints'
sprint_number: 18
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 18 QA Plan

## Casos de Prueba

### Q18-01: Procesamiento asíncrono de eventos en `outbox`
- **Objetivo:** Emitir un nuevo contrato y verificar que se inserta un evento en `outbox` y que el worker lo procesa marcándolo como `procesado`.
- **Criterio de aceptación:** Si la API externa falla, el worker incrementa el contador de reintentos y programa el siguiente reintento exponencialmente sin bloquear el flujo principal.

### Q18-02: Envío de correo con PDF adjunto (Resend)
- **Objetivo:** Concluir o emitir un contrato con correo del cliente especificado.
- **Criterio de aceptación:** Se invoca la API de Resend adjuntando el archivo PDF generado en Sprint 17.

### Q18-03: Envío de mensaje y recordatorios por WhatsApp
- **Objetivo:** Ejecutar el cron de recordatorios cuando un contrato está a 2 horas de su hora pactada de entrega.
- **Criterio de aceptación:** Se envía mensaje de WhatsApp con formato amigable recordando hora de entrega, tolerancia de 59 minutos y ubicación del mostrador.
