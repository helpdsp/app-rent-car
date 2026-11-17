---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:25:00Z'
agent_roles: 'engineering-frontend-developer + specialized-document-generator + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 17
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 17 Tasks

| Task | Title | RF | Component | Route | Location | Mockup | Owner role | Points | Status |
|---|---|---|---|---|---|---|---|---|---|
| S17-T01 | Plantilla oficial de contrato PDF en 2 páginas con cláusulas de Mexicali | RF-37 | PDF | — | apps/web/src/lib/pdf/contrato-template.ts | — | fullstack | 5 | todo |
| S17-T02 | Motor generador de PDF nativo en Node.js (PDFKit / Edge PDF) | RF-37 | PDF | — | apps/web/src/lib/pdf/generador.ts | — | backend | 4 | todo |
| S17-T03 | Generador dinámico de código QR de validación en SVG/PNG para incrustar en PDF | RF-37 | lib | — | apps/web/src/lib/pdf/qr.ts | — | backend | 3 | todo |
| S17-T04 | Endpoint `/api/contratos/[id]/pdf` para descarga y guardado en Storage | RF-37 | API | /api/contratos/[id]/pdf | apps/web/src/app/api/contratos/[id]/pdf/route.ts | — | backend | 4 | todo |
| S17-T05 | Pantalla pública de validación de contrato por código QR (`/validar/[folio]`) | RF-37 | UI | /validar/[folio] | apps/web/src/app/validar/[folio]/page.tsx | nuevo | frontend | 4 | todo |
| S17-T06 | Botón de descarga y visor embebido de PDF en el detalle del contrato | RF-37 | UI | /contratos/[id] | apps/web/src/app/contratos/[id]/page.tsx | 06 | frontend | 3 | todo |
| S17-T07 | Pruebas de generación de PDF, huella SHA-256, escaneo de QR y rendimiento (<2.5s) | RF-37 | tests | — | apps/web/tests/pdf.test.ts | — | qa | 4 | todo |

**Total:** 7 tareas · 27 puntos.
