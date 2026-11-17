---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-sprint-prioritizer + project-management-project-shepherd'
vision_command: 'generate_spec_kit (plan de sprints ajustado en generate_sprints)'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Sprint plan — Contratos digitales de México Renta de Autos (MVP)

**12 sprints de 1 semana** (unas 12 semanas), con una persona full-stack y una de QA. Capacidad estimada: 25 a 30 puntos por semana. Cada sprint termina con una demo al cliente y su visto bueno del módulo.

El plan original tenía 8 sprints; con sprints de una semana se **repartió en 12** porque el contrato núcleo, la firma y la entrega no caben en una semana cada uno.

| Sprint | Goal | RF / stories cubiertas | Dependencias | Mockups | Puntos |
|--------|------|---------------------------|--------------|---------|--------|
| 1 | El proyecto está desplegado en Vercel con base de datos y CI, y un administrador entra con verificación en dos pasos y crea usuarios con rol | RF-01 (S-01) | — | 8, 17 | 28 |
| 2 | Cada cambio queda en una bitácora inmutable, el administrador mantiene tarifas y parámetros, y el aviso de privacidad y el almacenamiento seguro están listos | RF-02, RF-03, RF-28 (S-02, S-03, S-28) | Sprint 1 | 16, 18 | 29 |
| 3 | El operador registra a un cliente una sola vez, con foto de credencial y licencia, y lo encuentra por nombre, identificación, teléfono o RFC | RF-04, RF-05, RF-06 (S-04, S-05, S-06) | Sprint 2 | 2 | 26 |
| 4 | La flota está registrada con sus documentos al día y es imposible rentar la misma unidad en fechas que se cruzan, incluso con dos operadores a la vez | RF-07, RF-08, RF-09 (S-07, S-08, S-09) | Sprint 3 | 9, 10 | 25 |
| 5 | Nada vence sin aviso: el sistema revisa a diario las vigencias, manda correos y el operador ve su tablero en tableta y celular | RF-10, RF-11 (S-10, S-11) | Sprint 4 | 1, M1 | 23 |
| 6 | El operador crea un contrato en borrador, el sistema valida licencia, vehículo y fechas, calcula la cotización y asigna un folio digital único al emitir | RF-12, RF-13, RF-14 (S-12, S-13, S-14) | Sprint 5 | 3, M2, 11 | 28 |
| 7 | El operador registra el anticipo en una o varias formas de pago, el depósito, los conductores adicionales, el pagaré y «facturar a», sin guardar nunca un número de tarjeta | RF-15, RF-16, RF-26 (S-15, S-16, S-26) | Sprint 6 | 4, 15 | 26 |
| 8 | El contrato y el reglamento se generan prellenados en PDF, el cliente firma en la tableta y el PDF queda inmutable con su huella | RF-17, RF-18 (S-17, S-18) | Sprint 7 | 5 | 26 |
| 9 | El operador entrega el vehículo con inventario, daños, gasolina, kilometraje y seis fotos, y el cliente recibe el contrato y el reglamento por correo | RF-19, RF-20 (S-19, S-20) | Sprint 8 | 6, M3 | 26 |
| 10 | Al recibir el vehículo el sistema compara las fotos con las de la entrega, liquida con las reglas del reglamento, aplica o devuelve el depósito y marca los contratos rezagados | RF-21, RF-22 (S-21, S-22) | Sprint 9 | 7, M4 | 28 |
| 11 | El sistema cubre lo que sale del camino feliz: incidentes con aviso tardío, renovación como contrato nuevo ligado y cancelación con penalización | RF-23, RF-24, RF-25 (S-23, S-24, S-25) | Sprint 10 | 12, 13, 14 | 25 |
| 12 | El sistema está listo para el piloto: exportaciones, preparación para GHL, pruebas de carga y seguridad, personal capacitado y aceptación del cliente | RF-27, RF-29 (S-27, S-29) | Sprint 11 | 18 | 29 |

Pantallas: los archivos están en `spec-kit/input/mockups/` (`previews/` navegables y `png/` a tamaño real; `README.md` lista cada pantalla con sus requisitos). Cada tarea de interfaz debe cumplir la pantalla indicada en la columna **Mockups** y se considera terminada cuando coincide con ella en estructura, datos mostrados y reglas visibles. Los números son los del README de mockups; «M» son pantallas de celular.

## Detalle por sprint

El detalle de tareas, puntos, ubicación sugerida y pruebas de cada sprint está en `planning/sprints/sprint-NN/` (`sprint-goal.md`, `stories.md`, `tasks.md`, `qa-plan.md`).

**Sprint 1, Fundación y acceso.** Crear el proyecto rent-car-mvp en Vercel (raíz apps/web, región sfo1) y el proyecto de Supabase; configurar variables de entorno; Esquema base con Drizzle: enums, usuarios, secuencias y extensiones (btree_gist, pg_trgm, citext); migración inicial; Integración continua: lint, tsc, pruebas unitarias y de integración contra Postgres efímero, build; Resolver las vulnerabilidades de herramientas de prueba (npm audit propone vitest 5.1.0, que falla en este equipo): probar la última 4.x o reinstalar node_modules; verificar que el motor de tarifas (23 pruebas) sigue pasando; y 8 tareas más.

**Sprint 2, Auditoría, tarifas y privacidad.** Función fn_auditar y triggers en todas las tablas de negocio existentes; plantilla para las nuevas; Tabla auditoria de solo agregado (sin UPDATE ni DELETE para ningún rol) y pruebas de que se rechaza; Pantalla Bitácora: filtros por registro, usuario y fechas; GET /api/auditoria; Tablas tarifas y parametros con versionado y semilla (500 km, ÷8, 5.ª hora, 20 % y 24 h, deducible 30 % y 20 %, alertas 30/15/7/0); y 7 tareas más.

**Sprint 3, Clientes y sus documentos.** Tabla clientes (número único con secuencia, RFC con CHECK, índices de duplicados y búsqueda) y migración; API de clientes con validación Zod y detección de duplicados (409); Pantalla Cliente: datos generales y fiscales, aviso de privacidad aceptado; Tabla documentos y subida directa a Storage con URL firmada; y 6 tareas más.

**Sprint 4, Vehículos y disponibilidad.** Tablas vehiculos, bloqueos_vehiculo y esqueleto de contratos con rango de fechas; extensión btree_gist; Restricción de exclusión por rango y por vehículo, más trigger contra bloqueos; prueba de concurrencia con 20 intentos; API de vehículos con estado, clave única y kilometraje que solo sube salvo corrección de administrador; Pantallas Vehículos (listado) y Vehículo (ficha con datos e historial de kilómetros); y 4 tareas más.

**Sprint 5, Vigencias y tablero.** Tabla alertas idempotente por (documento, días, vencimiento) y función de revisión de vigencias; Cron diario /api/cron/vigencias protegido con secreto, en horario de America/Tijuana; Envío de correos con Resend a 30, 15, 7 días y el día del vencimiento; estado enviada o error; Marcar alertas como atendidas al subir el documento renovado; y 4 tareas más.

**Sprint 6, Contrato núcleo I: borrador, folio y cotización.** Tabla contratos completa (copia de tarifas, rango, estado, folio, folio_papel) y secuencia seq_folio_contrato que produce D-00001; Trigger de transiciones de estado con la tabla permitida y bitácora de cada cambio; Emisión transaccional: bloquea el vehículo, valida, copia tarifas, consume el folio y registra el evento en outbox; Validaciones de emisión: al menos un conductor con licencia vigente en todo el periodo, documentos del vehículo, fechas, destino y permiso de salida del país; y 5 tareas más.

**Sprint 7, Contrato núcleo II: cobro, conductores y pagaré.** Tabla pagos con forma y referencia; un anticipo en varias filas con formas distintas; Regla: los pagos del anticipo suman la renta base antes de vigente; nunca se guarda un número de tarjeta; Depósito en garantía (efectivo, tarjeta, Visa Láser) y recibo imprimible con secuencia; Pantalla Cobro y garantía con pagos mixtos y total a recibir; y 5 tareas más.

**Sprint 8, PDF y firma en tableta.** Plantilla React a PDF de la carátula: datos, inventario y pagaré opcional; Las 21 cláusulas con los datos pendientes configurables (registro PROFECO, jurisdicción, teléfono de fallas); Plantilla del reglamento prellenado; Huella SHA-256, almacenamiento del PDF inmutable y versión nueva al corregir; y 4 tareas más.

**Sprint 9, Entrega del vehículo y envío por correo.** Tablas inventario_contrato y evidencias (ángulo, km capturado, huella, dispositivo) sin UPDATE ni DELETE; fn_validar_evidencias_completas: seis ángulos obligatorios, con autorización de administrador por excepción; Subida directa de fotos y video a Storage con compresión en el dispositivo y límites de tamaño; Pantalla Entrega: inventario de 10 conceptos, gasolina en octavos, diagrama de daños, km con foto del tablero; y 4 tareas más.

**Sprint 10, Recepción, liquidación y rezagados.** Registro de recepción: km de entrada, gasolina, inventario, daños y las mismas seis fotos; Liquidación con liquidar() y guardado línea por línea en contrato_cargos; cargo por gasolina faltante; Aplicar o devolver el depósito, saldo y paso a concluido; Pantalla Recepción y liquidación con cargos, bonificaciones, saldo y depósito; y 4 tareas más.

**Sprint 11, Excepciones: incidentes, renovación y cancelación.** Tabla incidentes con aviso tardío generado y estado en_incidente que impide concluir; Pantalla Registrar incidente: tipo, fechas, evidencias, avalúo, cargo, unidad sustituta y bonificación; Renovación: contrato nuevo ligado al anterior, revalidando disponibilidad y licencia; Pantalla Renovar contrato con comparación de contratos, validaciones y destino del depósito; y 4 tareas más.

**Sprint 12, Cierre del MVP, endurecimiento y capacitación.** Exportaciones a CSV de clientes, vehículos, contratos y documentos, con filtros y entrada en la bitácora; Campos ghl_contact_id y ghl_opportunity_id y tabla outbox con los eventos definidos, sin consumidor; Pruebas de carga y rendimiento: 5,000 clientes, PDF en menos de 5 s; Revisión de seguridad: RLS, URLs firmadas, secretos, cabeceras, subida de archivos y vulnerabilidades de dependencias; y 5 tareas más.

## Hitos y criterios de salida

| Hito | Sprint | Criterio |
|---|---|---|
| Base segura | 1–2 | Un administrador crea usuarios con rol y MFA; cada cambio queda en la bitácora inmutable. |
| Datos maestros | 3–4 | Un cliente y un vehículo se registran una sola vez; un vehículo con póliza vencida no aparece como disponible; dos operadores no pueden reservar la misma unidad. |
| Vigencias | 5 | Un documento a 7 días de vencer genera un solo correo; el tablero lo muestra. |
| Primer contrato | 6–7 | El contrato 08160 se reproduce: 3 días, $4,899 de anticipo, hora extra $204, km extra $3, con pago en varias formas. |
| Contrato firmado | 8 | Un contrato se firma en tableta, el PDF queda inmutable con huella y se detecta si se altera. |
| Ciclo completo | 9–10 | Un contrato recorre borrador, vigente, recibido y concluido con seis fotos por momento y saldo correcto. |
| Excepciones | 11 | Incidente, renovación y cancelación funcionan con sus reglas. |
| MVP | 12 | Piloto en mostrador con el personal capacitado y pruebas de negocio aprobadas por el cliente. |

## Riesgos de planeación

- **Cadencia de una semana:** el margen es corto; si un sprint se desborda, el siguiente absorbe lo pendiente y el MVP se mueve semana a semana. Los sprints 6, 9 y 10 son los más cargados de reglas de negocio.
- **Reglas ambiguas del reglamento** (cancelación, penalizaciones, tolerancia, redondeo de la hora extra): confirmarlas antes del sprint 6; viven como parámetros.
- **Validez legal de la firma digital:** consultar a un abogado antes del sprint 8.
- **Datos pendientes del formato** (registro PROFECO, jurisdicción, teléfono de fallas): necesarios para el PDF final.
- **Subida de video desde tableta y celular:** probar tamaños y conectividad real en el sprint 3.
- **Infraestructura:** los proyectos de Vercel y Supabase deben existir al iniciar el sprint 1.
- **Decisiones del cliente por confirmar:** truncar o redondear la hora extra, quién puede pactar la tarifa de un contrato, formas de pago («T/D») y formato del folio.

**Total RF en plan:** 29 · **Sprints:** 12 · **Tareas:** 108 · **Puntos:** 319
