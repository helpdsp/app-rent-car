---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:20:00Z'
agent_roles: 'testing-reality-checker + testing-performance-benchmarker'
vision_command: 'generate_sprints'
sprint_number: 16
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 16 QA Plan

## Casos de Prueba

### Q16-01: Verificación de compresión WebP en cliente
- **Objetivo:** Subir una fotografía JPEG de 5 MB tomada con cámara de alta resolución.
- **Criterio de aceptación:** El cliente la comprime a WebP con ancho máximo de 1200px y peso final inferior a 350 KB en menos de 800 ms.

### Q16-02: Subida y validación de tipos MIME
- **Objetivo:** Intentar subir un archivo ejecutable `.exe` o PDF en el selector de fotos.
- **Criterio de aceptación:** El servidor y el componente rechazan el archivo; solo se admiten `image/jpeg`, `image/png`, `image/webp`.

### Q16-03: Expiración y acceso a URLs firmadas
- **Objetivo:** Solicitar una URL firmada de una licencia y verificar su validez.
- **Criterio de aceptación:** La URL permite ver la imagen; tras 15 minutos, la misma URL responde 403 / Access Denied.

### Q16-04: Registro en bitácora de auditoría al leer documentos sensibles
- **Objetivo:** Visualizar la identificación oficial (INE) de un cliente desde el panel.
- **Criterio de aceptación:** Se inserta automáticamente un registro en `auditoria` con `accion: 'LECTURA_DOCUMENTO_SENSIBLE'`.
