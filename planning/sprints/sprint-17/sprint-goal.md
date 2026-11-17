---
generated_by_model: 'gemini-2.5-pro'
generated_at: '2026-11-17T06:25:00Z'
agent_roles: 'engineering-frontend-developer + specialized-document-generator + engineering-backend-architect'
vision_command: 'generate_sprints'
sprint_number: 17
source_spec_kit: 'spec-kit/input/'
source_refdocs: 'refdocs/etapa-dos-pos-mvp.md'
---
# Sprint 17: Motor Oficial de PDF Legal, QR y Sello SHA-256

## Objetivo

Construir el generador nativo de documentos PDF descargables e imprimibles en servidor, produciendo un documento formal de 2 páginas con las cláusulas exactas del contrato 08160 de Mexicali, firmas electrónicas incrustadas, código QR de verificación pública y huella digital criptográfica SHA-256 inmutable.

## Alcance

- **Requisitos:** RF-37
- **Pantallas:** Vista de Contrato (/contratos/[id]), Página de Validación Pública (/validar/[folio])
- **Tareas:** 7 · **Puntos:** 27
- **Duración:** 1 semana

## Demo al cliente

Generación y descarga de un PDF legal auténtico del contrato 08160: 2 páginas con membrete de México Renta de Autos, cláusulas legales, desglose exacto de centavos, firmas nítidas del cliente y operador, y escaneo del código QR con un celular que abre la pantalla de verificación confirmando que el contrato no ha sido alterado.

## Criterio de éxito

1. Generación de PDF en menos de 2.5 segundos con formato idéntico al contrato físico de Mexicali.
2. Inserción de firmas capturadas en canvas tanto del cliente como del representante legal.
3. Código QR funcional que apunta a `https://app-mexico-rent.vercel.app/validar/[folio]`.
4. Sellado con hash SHA-256 almacenado en `contratos.hash_sha256` y guardado inmutable en Supabase Storage (`contratos-firmados/[folio].pdf`).
