---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:20:00Z'
agent_roles: 'engineering-frontend-developer + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 16
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 16: Subida Real a Supabase Storage y Compresión WebP

## Objetivo

Implementar la persistencia fotográfica real en la nube privada utilizando Supabase Storage para licencias, identificaciones (INE) y las 6 fotos de inspección obligatorias, con compresión automática en cliente a WebP para garantizar velocidad y bajo consumo de datos en patio.

## Alcance

- **Requisitos:** RF-36
- **Pantallas:** Registro de Cliente (documentos), Inspección de Entrega (Mockup 04), Inspección de Recepción (Mockup 07)
- **Tareas:** 7 · **Puntos:** 26
- **Duración:** 1 semana

## Demo al cliente

Capturar fotos de un vehículo con la cámara de una tableta/celular: compresión visual instantánea (de 4 MB a ~250 KB en WebP), subida exitosa a Supabase Storage y visualización mediante URLs firmadas seguras de 15 minutos.

## Criterio de éxito

1. 4 buckets privados configurados con RLS: `licencias`, `identificaciones`, `evidencias-entrega`, `evidencias-recepcion`.
2. Compresión en cliente ejecutada mediante Canvas/Web Worker antes de la subida.
3. Generación de URLs firmadas de lectura con expiración de 15 minutos y registro en la tabla `auditoria`.
4. Soporte offline temporal en IndexedDB si se pierde la conexión Wi-Fi en el patio.
