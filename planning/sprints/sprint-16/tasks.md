---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:20:00Z'
agent_roles: 'engineering-frontend-developer + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 16
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 16 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S16-T01 | Migración SQL: Configuración de buckets de Storage y políticas de seguridad RLS | RF-36 | DB/Storage | — | apps/web/drizzle/0014_storage_buckets.sql | — | backend | 3 | done |
| S16-T02 | Módulo de compresión de imágenes en cliente (Canvas/WebP <350KB) | RF-36 | lib | — | apps/web/src/lib/storage/image-compression.ts | — | frontend | 4 | done |
| S16-T03 | API de subida de evidencias con validación de tipo MIME y tamaño máximo | RF-36 | API | /api/storage/upload | apps/web/src/app/api/storage/upload/route.ts | — | backend | 4 | done |
| S16-T04 | API de generación de URLs firmadas temporales (15 min) y auditoría de lectura | RF-36 | API | /api/storage/signed-url | apps/web/src/app/api/storage/signed-url/route.ts | — | backend | 3 | done |
| S16-T05 | Componente interactivo de captura fotográfica y previsualización para tabletas | RF-36 | UI | — | apps/web/src/components/ui/PhotoCapture.tsx | 04, 07 | frontend | 4 | done |
| S16-T06 | Conexión del flujo de 6 fotos de inspección con Supabase Storage real | RF-36 | UI | /contratos/[id]/inspeccion | apps/web/src/app/contratos/[id]/inspeccion/page.tsx | 04 | fullstack | 4 | done |
| S16-T07 | Pruebas de compresión WebP, subida de archivos, expiración de URLs y auditoría | RF-36 | tests | — | apps/web/tests/storage.test.ts | — | qa | 4 | done |

**Total:** 7 tareas · 26 puntos.
