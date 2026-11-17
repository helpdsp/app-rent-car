---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:20:00Z'
agent_roles: 'engineering-frontend-developer + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 16
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 16 Stories

## S-36 · RF-36 — Subida Real de Evidencias a Supabase Storage con WebP
Como operador de patio o mostrador, quiero tomar fotos claras de licencias y del auto y que se suban de inmediato a la nube sin saturar el internet, para respaldar el estado físico de la unidad.
- [ ] Creación de buckets privados seguros en Supabase Storage con políticas de acceso RLS.
- [ ] Compresor de imágenes en navegador (WebP, máx 1200px, compresión calidad 0.82, < 350 KB).
- [ ] Componente visual de cámara y subida con previsualización inmediata y opción de reintentar.
- [ ] Generación de URLs firmadas temporales (15 minutos) para proteger la privacidad del cliente.
- [ ] Registro en bitácora de cada consulta a una URL firmada de documento sensible.
