---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:30:00Z'
agent_roles: 'testing-reality-checker + testing-api-tester'
vision_command: 'generate_sprints'
sprint_number: 18
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/plan-detallado-sprint-18-integraciones-ghl.md'
---
# Sprint 18 QA Plan

## Casos de Prueba

### Q18-01: Procesamiento asíncrono de eventos en `outbox`
- **Objetivo:** Emitir un nuevo contrato y verificar que se inserta un evento en `outbox` y que el worker lo procesa marcándolo como `completado`.
- **Criterio de aceptación:** Si la API externa falla, el worker incrementa el contador de reintentos y programa el siguiente reintento exponencialmente sin bloquear el flujo principal.

### Q18-02: Envío de correo con PDF adjunto (Resend)
- **Objetivo:** Concluir o emitir un contrato con correo del cliente especificado.
- **Criterio de aceptación:** Se invoca la API de Resend adjuntando el archivo PDF generado en Sprint 17.

### Q18-03: Envío de mensaje y recordatorios por WhatsApp
- **Objetivo:** Ejecutar el cron de recordatorios cuando un contrato está a 2 horas de su hora pactada de entrega.
- **Criterio de aceptación:** Se envía mensaje de WhatsApp con formato amigable recordando hora de entrega, tolerancia de 59 minutos y ubicación del mostrador.

### Q18-04: Sincronización con GoHighLevel (Contactos, Campos y Webhook Inbound)
- **Objetivo:** Validar que al crearse un contrato se envía la actualización a GHL (contacto y custom fields), y que un payload de webhook entrante de GHL Rentals genera una reservación `R-XXXXX` válida en la PWA.
- **Criterio de aceptación:** Mapeo de campos correcto y respuesta 200/201 con `ghl_contact_id` registrado.

### Q18-05: Panel Administrativo de Integraciones
- **Objetivo:** Navegar a `/admin/integraciones` con sesión de administrador (`haaron@bajaworks.org`).
- **Criterio de aceptación:** Visualización de badges de estado, ejecución de pruebas de ping con 1 clic y visualización de la cola outbox en tiempo real.
