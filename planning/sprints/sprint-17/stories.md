---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:25:00Z'
agent_roles: 'engineering-frontend-developer + specialized-document-generator + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 17
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 17 Stories

## S-37 · RF-37 — Motor Nativo de Generación de PDF Legal y Sellado SHA-256
Como cliente y como empresa de renta, queremos un documento PDF oficial idéntico al contrato impreso, con valor legal, firmas y verificación digital que no dependa de vistas HTML del navegador.
- [ ] Generación nativa de PDF de 2 páginas con cláusulas de arrendamiento oficiales de Mexicali.
- [ ] Incorporación de datos de vehículo, cliente, fechas y desglose de tarifas en centavos convertidos a pesos con formato moneda.
- [ ] Incrustación de las firmas digitales capturadas en el paso de firma.
- [ ] Estampado de código QR de validación pública de autenticidad.
- [ ] Huella digital SHA-256 inmutable calculada sobre el archivo binario final.
- [ ] Página pública `/validar/[folio]` accesible sin autenticación para comprobar la validez del contrato frente a autoridades o aseguradoras.
