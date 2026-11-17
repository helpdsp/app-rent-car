# México Renta de Autos — contratos digitales

Aplicación web para el mostrador de **México Renta de Autos** (Mexicali, B.C.) que reemplaza el contrato impreso de dos caras: clientes y vehículos se registran una sola vez, el contrato sale prellenado con cálculo automático de tarifas, se firma en tableta, y la entrega y la recepción del vehículo quedan con fotos. Todo es auditable.

| | |
|---|---|
| **Estado** | Planeación terminada. Ningún sprint iniciado; el código existente es el esqueleto de la app y el motor de tarifas |
| **Código** | [apps/web/](apps/web/): Next.js (TypeScript, App Router), Supabase, Drizzle, Resend, Vitest, Vercel |
| **Alcance del MVP** | Clientes, vehículos, documentos con alertas de vigencia, ciclo completo del contrato, motor de tarifas, firma en tableta, evidencias, PDF por correo, roles y bitácora |
| **Fuera del MVP** | Integración con GoHighLevel, reservaciones en línea, cobros en línea, facturación CFDI, WhatsApp, mantenimiento de flota |
| **Plan** | 12 sprints de 1 semana · 29 requisitos · 108 tareas · 319 puntos |
| **Interfaz** | 22 pantallas diseñadas: 18 de tableta (1194×834) y 4 de celular (390×844) |

---

## Qué resuelve

El contrato se llena hoy a mano, con copia y firmas manuscritas, y los datos de cliente y vehículo se recapturan en cada renta. Las fotos del estado del vehículo, las identificaciones y los contratos firmados quedan dispersos, y nada avisa cuando vence una licencia, una tarjeta de circulación o una póliza.

El sistema ofrece:

- **Registro único** de clientes y vehículos, con sus documentos (licencia, credencial, tarjeta de circulación y póliza) y alertas por correo a 30, 15, 7 días y el día del vencimiento.
- **Contrato** con folio digital (`D-00001`), cálculo automático de días, anticipo, hora extra, kilometraje excedente y saldo según el reglamento, y estados desde borrador hasta concluido.
- **Disponibilidad sin dobles reservas:** la base de datos impide que una misma unidad quede en dos contratos con fechas que se cruzan.
- **Firma en tableta** y PDF prellenado del contrato (21 cláusulas) y del reglamento, inmutable y con huella SHA-256.
- **Entrega y recepción** con inventario, diagrama de daños, gasolina en octavos, kilometraje y seis fotos por momento, comparables lado a lado.
- **Excepciones:** incidentes con aviso tardío, renovación como contrato nuevo ligado y cancelación con penalización.
- **Bitácora de solo agregado** (quién hizo qué, cuándo y el valor anterior), roles de operador, administrador y titular, y exportaciones a CSV.

Reglas de negocio de referencia: el contrato real No. 08160 (3 días × $1,633 = $4,899 de anticipo, hora extra de $204 y km extra de $3). **Nunca se almacena un número de tarjeta.**

---

## El plan

| Sprint | Tema | Requisitos |
|---|---|---|
| 1 | Fundación y acceso | RF-01 |
| 2 | Auditoría, tarifas y privacidad | RF-02, 03, 28 |
| 3 | Clientes y documentos | RF-04, 05, 06 |
| 4 | Vehículos y disponibilidad | RF-07, 08, 09 |
| 5 | Vigencias y tablero | RF-10, 11 |
| 6 | Contrato núcleo I: borrador, folio y cotización | RF-12, 13, 14 |
| 7 | Contrato núcleo II: cobro, conductores y pagaré | RF-15, 16, 26 |
| 8 | PDF y firma en tableta | RF-17, 18 |
| 9 | Entrega del vehículo y correo | RF-19, 20 |
| 10 | Recepción, liquidación y rezagados | RF-21, 22 |
| 11 | Incidentes, renovación y cancelación | RF-23, 24, 25 |
| 12 | Cierre del MVP, endurecimiento y capacitación | RF-27, 29 |

Cada sprint tiene su objetivo, demo al cliente, historias, tareas y plan de QA en [planning/sprints/](planning/sprints/). Cada tarea indica requisito, componente, ruta, archivo sugerido y pantalla del mockup.

---

## Documentación

| Qué | Dónde |
|---|---|
| **Instrucciones para implementar** (reglas, orden de lectura, qué no hacer) | [GEMINI.md](GEMINI.md) |
| Brief del proyecto | [spec-kit/input/brief.md](spec-kit/input/brief.md) |
| Requisitos (RF-01 a RF-29) | [spec-kit/input/product-prd.md](spec-kit/input/product-prd.md) |
| Modelo de datos (Postgres) | [spec-kit/input/data-model.md](spec-kit/input/data-model.md) |
| API (OpenAPI) | [spec-kit/input/api-spec.yaml](spec-kit/input/api-spec.yaml) |
| Arquitectura, flujos y seguridad | [spec-kit/input/technical-spec.md](spec-kit/input/technical-spec.md) |
| Plan de pruebas (T-01 a T-83) | [spec-kit/input/test-plan.md](spec-kit/input/test-plan.md) |
| Plan de sprints | [spec-kit/input/sprint-plan.md](spec-kit/input/sprint-plan.md) |
| **Mockups** (vistas HTML, capturas e índice por requisito) | [spec-kit/input/mockups/](spec-kit/input/mockups/README.md) |

Los mockups son maquetas estáticas con datos de ejemplo inventados: definen estructura, datos mostrados y reglas visibles, no la implementación.

**Terminología:** «documentos» son la licencia, la credencial, la tarjeta de circulación y la póliza; «contratos» son los contratos de renta.

---

## Decisiones técnicas

- **Sin GoHighLevel en el MVP.** GHL no garantiza el folio atómico, la auditoría con valor anterior ni el control de archivos sensibles. Queda preparada la integración (`ghl_contact_id` y una tabla de eventos `outbox`) para una fase posterior.
- **Postgres como autoridad de integridad:** restricción de exclusión por rango de fechas, secuencia de folios, triggers de transición de estado y de auditoría.
- **Hospedaje:** Vercel y Supabase (región del oeste de EE. UU.). Se descartó Cloudflare para el MVP.
- **Dinero en centavos enteros;** las reglas ambiguas del reglamento viven como parámetros editables, no fijas en el código.

## Pendientes y decisiones abiertas

**Infraestructura**
- Crear el proyecto de Vercel (`rent-car-mvp`, raíz `apps/web`, región `sfo1`) y el de Supabase. El Sprint 1 depende de ellos.
- vitest 5.1.0 falla en este equipo; se usa la 3.2.7, que trae vulnerabilidades de herramientas de desarrollo. Hay una tarea en el Sprint 1.

**Con el cliente**
- Truncar o redondear la hora extra (los contratos de papel parecen truncar).
- Quién puede pactar una tarifa distinta del catálogo en un contrato.
- Formas de pago aceptadas («T/D» es ambiguo).
- Formato del folio digital (propuesta: `D-00001`).
- Registro PROFECO, ciudad de jurisdicción y teléfono de fallas del contrato.
- Si la tarifa incluye IVA del 8 % (inferencia sin confirmar).
- Validez legal de la firma digital frente a PROFECO (la confirma un abogado antes del Sprint 8).

---

## Cómo ejecutar lo que existe

```bash
cd apps/web
npm install
npm test        # 23 pruebas del motor de tarifas
npm run dev     # app Next.js en desarrollo
```

El motor de tarifas está en [apps/web/src/lib/pricing/](apps/web/src/lib/pricing/): funciones puras en centavos que reproducen el contrato 08160.

> Esta versión de Next.js tiene cambios incompatibles con lo que los modelos suelen conocer. Antes de escribir código, lee la guía correspondiente en `apps/web/node_modules/next/dist/docs/` (ver [apps/web/AGENTS.md](apps/web/AGENTS.md)).

---

## Estructura del repositorio

```
apps/web/                  App Next.js del proyecto (esqueleto y motor de tarifas)
apps/satisfaction-survey/  Demo anterior de Copilot UX components (SPFx). No forma parte de este proyecto
spec-kit/input/            Brief, PRD, modelo de datos, API, spec técnico, historias, pruebas y plan
spec-kit/input/mockups/    22 pantallas: previews/ (HTML), png/ (capturas), source/ (lienzo) e índice
planning/                  Estado del workflow, clarificaciones y los 12 sprints
refdocs/                   Material de origen: contratos y reglamento transcritos, decisiones técnicas (no se versiona)
GEMINI.md                  Instrucciones para implementar el plan
commands/, scripts/,       Framework VISION (flujo de planeación)
agency-agents/, docs/
```

`refdocs/` está en `.gitignore`: los documentos de origen y las imágenes de los contratos solo existen en la copia local.

## Planeación con VISION

El proyecto se planeó con el framework VISION (brief → Spec Kit → sprints → ejecución). El estado actual es `sprint_plan_generated`.

```bash
npm install
npm run status        # ¿en qué etapa está el proyecto?
```

**No ejecutes `generate_spec_kit`, `generate_sprints` ni `init`:** el script solo produce una versión mecánica y sobrescribiría archivos del Spec Kit escritos a mano. Más información: [AGENTS.md](AGENTS.md) · [GUIA_COMPLETA_VISION.md](GUIA_COMPLETA_VISION.md).
