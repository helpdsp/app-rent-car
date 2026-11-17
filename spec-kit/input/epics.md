---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:10:00Z'
agent_roles: 'product-manager + product-sprint-prioritizer'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Epics — Contratos digitales de México Renta de Autos (MVP)

Agrupadas por **dominio de negocio** (no por cantidad de requisitos). Cada épica entrega valor verificable por el cliente (visto bueno por módulo, según la propuesta original).

## Mapa épica ↔ RF

| Épica | Nombre | RF | Prioridad |
|---|---|---|---|
| E-01 | Fundamentos, seguridad y auditoría | RF-01, RF-02, RF-03, RF-28 | Must |
| E-02 | Clientes y sus documentos | RF-04, RF-05, RF-06 | Must |
| E-03 | Vehículos y disponibilidad | RF-07, RF-08, RF-09 | Must |
| E-04 | Vigencias y tablero del operador | RF-10, RF-11 | Must |
| E-05 | Contrato: núcleo, tarifas y pagos | RF-12, RF-13, RF-14, RF-15, RF-16, RF-26 | Must |
| E-06 | Documentos del contrato y firma | RF-17, RF-18, RF-20 | Must |
| E-07 | Entrega, recepción y liquidación | RF-19, RF-21, RF-22 | Must |
| E-08 | Excepciones del contrato | RF-23, RF-24, RF-25 | Should |
| E-09 | Datos, reportes y preparación futura | RF-27, RF-29 | Should |

## E-01 — Fundamentos, seguridad y auditoría

**Objetivo:** una base segura y auditable sobre la que se construye todo lo demás.
**Valor:** el titular confía en que cada cambio queda registrado; el administrador controla quién hace qué.
- Proyecto en Vercel y Supabase, migraciones, CI y variables de entorno.
- Autenticación con MFA y tres roles aplicados en el servidor (RF-01).
- Bitácora de solo agregado por triggers (RF-02).
- Catálogo de tarifas y parámetros editables; el motor de tarifas ya existe con 23 pruebas (RF-03).
- Aviso de privacidad, retención y derechos ARCO (RF-28).
**Dependencias:** ninguna. **Riesgo:** residencia de datos en EE. UU. debe cubrirse en el aviso de privacidad.

## E-02 — Clientes y sus documentos

**Objetivo:** registrar al cliente una sola vez y reutilizarlo en cada renta.
**Valor:** elimina la recaptura (O2).
- Alta y edición con número único, datos fiscales opcionales y detección de duplicados (RF-04).
- Foto de credencial y licencia por ambos lados, con almacenamiento privado (RF-05).
- Búsqueda, historial y exportación (RF-06).
**Dependencias:** E-01.

## E-03 — Vehículos y disponibilidad

**Objetivo:** flota con documentos al día y cero dobles reservas.
**Valor:** el operador solo ve unidades rentables y disponibles.
- Alta de vehículos con clave única y estado (RF-07).
- Tarjeta de circulación y póliza con bloqueo por vencimiento (RF-08).
- Restricción de exclusión por fechas, bloqueos por mantenimiento y cambio por unidad similar (RF-09).
**Dependencias:** E-01. **Riesgo técnico principal:** la exclusión por rango debe probarse con concurrencia.

## E-04 — Vigencias y tablero del operador

**Objetivo:** que nadie renta con un documento vencido y nada vence sin aviso.
**Valor:** O3 (garantizar vigencias).
- Revisión diaria y correos a 30, 15, 7 días y el día del vencimiento (RF-10).
- Tablero con accesos directos y listas de atención (RF-11).
**Dependencias:** E-02, E-03.

## E-05 — Contrato: núcleo, tarifas y pagos

**Objetivo:** emitir un contrato válido, con folio, cálculo correcto y garantía registrada.
**Valor:** O1 y O6; es el módulo de mayor complejidad.
- Borrador con validaciones de licencia, disponibilidad y fechas (RF-12).
- Folio atómico y máquina de estados validada en la base (RF-13).
- Cálculo de días, anticipo, hora extra y km con la copia de tarifas al emitir (RF-14).
- Conductores adicionales, segundo auto y referencia (RF-15).
- Anticipo, depósito y recibo, sin guardar tarjetas (RF-16).
- Pagaré opcional (RF-26).
**Dependencias:** E-02, E-03. **Riesgo:** reglas ambiguas del reglamento; viven como parámetros.

## E-06 — Documentos del contrato y firma

**Objetivo:** contrato y reglamento prellenados, firmados en tableta y entregados al cliente.
**Valor:** O1 y O5; reemplaza el formato impreso.
- PDF de dos caras y reglamento prellenados con hash (RF-17).
- Firma táctil con evidencia de fecha, usuario y dispositivo (RF-18).
- Envío por correo con reintento (RF-20).
**Dependencias:** E-05. **Riesgo:** validez legal de la firma frente a PROFECO; requiere abogado.

## E-07 — Entrega, recepción y liquidación

**Objetivo:** el ciclo físico del vehículo con evidencia y cobro correcto.
**Valor:** menos disputas por daños y cargos.
- Entrega con inventario, diagrama de daños, gasolina, km, fotos y video (RF-19).
- Recepción y liquidación automática, con saldo y aplicación del depósito (RF-21).
- Rezagados con cargo acumulado y aviso al operador (RF-22).
**Dependencias:** E-05, E-06.

## E-08 — Excepciones del contrato

**Objetivo:** cubrir los casos que salen del camino feliz.
- Incidentes con aviso tardío, evidencias y unidad sustituta (RF-23).
- Renovación como contrato nuevo ligado (RF-24).
- Cancelación con penalización configurable (RF-25).
**Dependencias:** E-07.

## E-09 — Datos, reportes y preparación futura

**Objetivo:** salida de información y puerta abierta a GHL.
- Exportaciones a CSV con bitácora (RF-27).
- Campos `ghl_contact_id` y tabla `outbox` sin consumidor (RF-29).
**Dependencias:** E-05.

## Fuera de las épicas del MVP (roadmap)

Integración con GoHighLevel, reservaciones en línea, sitio y funnels, cobros en línea, CFDI, WhatsApp y mantenimiento de flota.
