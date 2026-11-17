---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:20:00Z'
agent_roles: 'engineering-software-architect + engineering-backend-architect + engineering-devops-automator'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Technical specification — Contratos digitales de México Renta de Autos (MVP)

Complementa `data-model.md` (esquema), `api-spec.yaml` (contrato HTTP) y `refdocs/decisiones-tecnicas-mvp.md` (razones de las decisiones).

## 1. Arquitectura

```
Tableta / celular / PC (PWA)
        │ HTTPS
        ▼
┌────────────── Vercel (Next.js, TypeScript) ──────────────┐
│ App Router: UI táctil, asistentes por pasos              │
│ Route handlers /api/*: autorización por rol, validación  │
│ (Zod), casos de uso, motor de tarifas (lib/pricing)      │
│ Vercel Cron: /api/cron/vigencias, /api/cron/rezagados    │
└───────┬───────────────┬────────────────┬─────────────────┘
        │ SQL (pooler)  │ Storage (URL   │ HTTPS
        ▼               │ firmada)       ▼
┌── Supabase ───────┐   ▼            Resend (correo)
│ Postgres + RLS    │ Buckets privados
│ Auth (MFA)        │ documentos / evidencias /
│ Storage           │ contratos / firmas
└───────────────────┘
```

**Principio:** la base de datos es la autoridad de integridad (folio, exclusión de fechas, transiciones, auditoría). El servidor valida y orquesta; la interfaz nunca decide reglas de negocio.

## 2. Estructura del repositorio

```
apps/web/
  src/app/            rutas (App Router) y route handlers (api/)
  src/lib/pricing/    motor de tarifas (función pura, ya implementado)
  src/lib/db/         esquema Drizzle, migraciones, cliente
  src/lib/auth/       sesión, roles, guardas
  src/lib/pdf/        plantillas React → PDF
  src/lib/storage/    URLs firmadas
  src/lib/mail/       envío con Resend
  src/lib/audit/      utilidades de bitácora (lectura)
  src/lib/validation/ esquemas Zod compartidos con el cliente
  drizzle/            migraciones SQL (triggers, funciones, exclusión)
  tests/              integración y e2e
```

## 3. Módulos y responsabilidades

| Módulo | Responsabilidad | RF |
|---|---|---|
| Autenticación | Sesión de Supabase, MFA, cierre por inactividad, guarda de rol en cada handler | RF-01 |
| Auditoría | Triggers escriben; la API solo lee con filtros | RF-02 |
| Catálogo y parámetros | Versionado de tarifas; parámetros tipados; copia al emitir | RF-03 |
| Clientes / Vehículos / Documentos | CRUD, validación, subida directa a Storage | RF-04…08 |
| Disponibilidad | Consulta con motivo de exclusión; exclusión por rango en BD | RF-09 |
| Alertas | Cron diario, idempotente por `(documento, días, vencimiento)` | RF-10 |
| Contratos | Casos de uso: borrador, emitir, firmar, entregar, recibir, concluir, cancelar, renovar | RF-12…26 |
| Motor de tarifas | Cálculo puro; recibe parámetros, no lee la BD | RF-14, RF-21 |
| PDF | Render del contrato (carátula + 21 cláusulas) y reglamento; hash SHA-256 | RF-17 |
| Firma | Captura en canvas, guarda PNG y hash del PDF | RF-18 |
| Correo | Cola simple con reintentos y registro de resultado | RF-10, RF-20 |
| Exportaciones | CSV por flujo, con bitácora | RF-27 |

## 4. Flujos críticos

### 4.1 Emitir un contrato (transaccional)
1. Validar entrada con Zod y el rol del usuario.
2. En **una transacción**: bloquear la fila del vehículo; comprobar que al menos un conductor (arrendatario o adicional) tenga licencia vigente durante todo el periodo, y tarjeta y póliza del vehículo vigentes; validar que los pagos del anticipo sumen la renta base; calcular la cotización con `lib/pricing`; copiar tarifas y parámetros al contrato; consumir `seq_folio_contrato`; cambiar el estado a `por_firmar`; insertar el evento en `outbox`.
3. Si la exclusión de rango falla (`23P01`), responder 409 `VEHICULO_NO_DISPONIBLE`.
4. Fuera de la transacción: generar los PDF y guardar su ruta y hash.

Una falla al generar el PDF **no** revierte el folio; el contrato queda emitido con el PDF pendiente y un reintento manual.

### 4.2 Firmar
Guardar la imagen de firma en el bucket `firmas`; calcular el hash del PDF vigente; registrar usuario, fecha, hora y dispositivo; marcar el PDF como inmutable. Una corrección posterior genera una versión nueva del PDF y exige firmar de nuevo.

### 4.3 Entregar
Validar anticipo (suma de pagos ≥ renta base), depósito y firma. Registrar km de salida (≥ kilometraje del vehículo, con la foto del tablero ligada al valor capturado), gasolina en octavos, inventario y los seis ángulos de foto obligatorios. La captura funciona con la cámara del celular o de la tableta; las fotos suben directo a Storage y cada una guarda usuario, dispositivo y huella. Pasar a `vigente`, actualizar el estado del vehículo a `rentado` y encolar el envío del PDF.

### 4.4 Recibir y liquidar
Registrar km de entrada (≥ salida), gasolina, inventario, daños y evidencias. Calcular con `liquidar()`: renta base, retraso, km excedente, otros cargos y bonificaciones. Guardar una fila por línea en `contrato_cargos`; el saldo es total menos anticipo. Pasar a `recibido`; `concluido` solo con saldo en cero y depósito aplicado o devuelto.

### 4.5 Alertas de vigencia
Cron diario (America/Tijuana). Para cada documento con vencimiento en `{30, 15, 7, 0}` días: insertar alerta con `ON CONFLICT DO NOTHING`, enviar correo, marcar `enviada` o `error`. Al subir el documento renovado, las alertas pendientes pasan a `atendida`.

### 4.6 Rezagados
Cron cada 15 minutos en horario de mostrador: contratos `vigente` o `por_vencer` con `entrada_prevista_en < ahora` pasan a `rezagado`; `por_vencer` se marca dentro de las 2 horas previas.

## 5. Reglas de dominio

- **Motor de tarifas:** `apps/web/src/lib/pricing/index.ts`; funciones puras, centavos enteros, caso de referencia 08160. Los supuestos del reglamento se pasan como parámetros (tolerancia, hora desde la que se cobra un día, divisor).
- **Copia al emitir:** el contrato guarda tarifa, hora extra, km extra, seguro nocturno, km por día, deducible y valor asegurado; el catálogo cambia sin alterar contratos viejos.
- **Dinero:** `bigint` en centavos; la interfaz formatea MXN. Nunca punto flotante.
- **Folios:** serie propia `D-00001` generada con una secuencia de Postgres que inicia en 1; huecos permitidos, reutilización prohibida. Es distinta de los folios de papel (no consecutivos, de 08160 a 09834 y más) para no chocar con ellos; `folio_papel` es opcional durante la transición.
- **Eliminación:** lógica. El administrador puede eliminar contratos en borrador; un contrato emitido solo se cancela.

## 6. Seguridad y privacidad

| Tema | Decisión |
|---|---|
| Autenticación | Supabase Auth; MFA obligatorio para administrador y titular |
| Autorización | Guarda de rol en cada route handler **y** RLS en las tablas; el cliente nunca usa la clave de servicio |
| Archivos sensibles | Buckets privados; URLs firmadas de pocos minutos; cada lectura de `documentos` genera `SELECT_SENSIBLE` en la bitácora |
| Tarjetas | No se almacena número; solo tipo de garantía y últimos 4 dígitos |
| Auditoría | Solo agregado; sin `UPDATE`/`DELETE` para ningún rol |
| Secretos | Variables de entorno en Vercel (sensibles); clave de servicio de Supabase solo en el servidor; secreto de cron en cabecera `Authorization` |
| Transporte | HTTPS; cabeceras de seguridad (CSP, HSTS, `X-Content-Type-Options`) |
| Validación de archivos | Tipo MIME y tamaño máximo (foto 10 MB, PDF 15 MB, video 100 MB); extensión verificada por contenido |
| Privacidad | Aviso aceptado con versión y fecha; retención configurable; anonimización a solicitud (ARCO) |
| Residencia | Supabase en el oeste de EE. UU.; debe constar en el aviso de privacidad |
| Abuso | Límite de intentos de inicio de sesión; límite de solicitudes por usuario en endpoints de subida y exportación |

## 7. Experiencia de uso (decisiones de UX del brief)

Responsive para escritorio y tableta, con celular soportado en captura y consulta (tablero, nuevo contrato, fotos y kilometraje, comparación de fotos, cobro); la firma y la administración se piden en tableta o escritorio; un solo tema visual; flujo simple con asistentes por pasos; accesibilidad básica (contraste, controles táctiles de al menos 44 px, etiquetas de formulario). Estilo visual pendiente de `clarify_spec_kit`. Los formularios guardan borrador automáticamente para tolerar cortes de conexión breves.

## 8. Entornos y despliegue

| Entorno | Hosting | Base de datos | Uso |
|---|---|---|---|
| Local | `next dev` | Supabase local (Docker) o proyecto de desarrollo | Desarrollo |
| Preview | Vercel (por rama) | Proyecto Supabase de pruebas | Revisión de PR; protegido con autenticación de Vercel |
| Producción | Vercel (`rent-car-mvp`) | Proyecto Supabase de producción | Cliente |

- Proyecto Vercel: directorio raíz `apps/web`, región de funciones `sfo1`.
- CI: instalar, `lint`, `tsc --noEmit`, pruebas unitarias y de integración contra Postgres efímero, `next build`.
- Migraciones: Drizzle; se aplican antes del despliegue; las migraciones con triggers son SQL versionado.
- Copias de seguridad: las diarias de Supabase; prueba de restauración antes del piloto.

### Variables de entorno
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (solo servidor), `DATABASE_URL` (pooler), `RESEND_API_KEY`, `MAIL_FROM`, `CRON_SECRET`, `APP_TIMEZONE=America/Tijuana`.

## 9. Observabilidad y errores

- Registro estructurado por solicitud con identificador de correlación; sin datos personales en los logs.
- Errores de negocio con código estable (`VEHICULO_NO_DISPONIBLE`, `LICENCIA_VENCIDA`, `TRANSICION_INVALIDA`, `SALDO_PENDIENTE`) y mensaje en español.
- Alertas operativas: fallos del cron, correos fallidos y PDF pendientes se muestran en el tablero del administrador.

## 10. Rendimiento y capacidad

Volumen asumido: una sucursal, decenas de contratos al mes, hasta 5,000 clientes. Listados paginados con índices; PDF en menos de 5 s; subida directa a Storage para no pasar archivos por las funciones de Vercel (límite de tamaño de solicitud).

## 11. Preparación para GHL

`ghl_contact_id` en clientes y contratos, `ghl_opportunity_id` en contratos y la tabla `outbox`. Un futuro worker leerá `outbox` y escribirá en GHL a un ritmo menor a 10 solicitudes por segundo, con idempotencia por identificador externo. Fuera del MVP; ver `refdocs/decisiones-tecnicas-mvp.md` §7 para los hallazgos pendientes de verificar.

## 12. Decisiones y alternativas descartadas

| Decisión | Alternativa descartada | Razón |
|---|---|---|
| Postgres con exclusión por rango | Calendarios de GHL o D1 | Garantía atómica contra dobles reservas |
| Supabase Storage | R2 | Un proveedor menos; misma política de acceso con URLs firmadas |
| Vercel | Cloudflare Workers + OpenNext | Next.js nativo, sin adaptador ni límites de runtime |
| Firma propia en canvas | Firma nativa de GHL | Control del PDF y de la evidencia; GHL fuera del MVP |
| Sin modo offline | PWA con cola local | Complejidad no justificada para una sucursal con conexión estable |

## 13. Riesgos técnicos

1. **Concurrencia de reservas:** cubrir con pruebas contra Postgres real.
2. **PDF fiel al formato impreso:** validar contra el contrato 08160 con el cliente.
3. **Video desde tableta:** tamaño y conectividad; fijar límites tras una prueba en sitio.
4. **Dependencia de un solo proveedor en mostrador:** definir contingencia (impresión del formato en blanco).
5. **Vulnerabilidades de herramientas de desarrollo** (`vitest`): actualizar antes del primer despliegue.

## 14. Mockups

La interfaz tiene 22 pantallas diseñadas (18 de tableta de 1194×834 y 4 de celular de 390×844) en `spec-kit/input/mockups/`: vistas HTML navegables en `previews/`, capturas en `png/` e índice con requisitos en `README.md`. Reglas de uso:

- La implementación sigue la **estructura, los datos mostrados y las reglas visibles** de cada pantalla (estados, avisos, validaciones, qué se pide en cada paso). Los datos de ejemplo no son requisitos.
- Colores, tipografías y espaciado de los mockups son la propuesta visual: rojo de la marca (#B5141B) sobre papel crema (#F6F2E8), Inter para texto y Space Grotesk para títulos, controles de 44 px o más. El estilo visual definitivo se cierra en `clarify_spec_kit`.
- Los componentes repetidos (barra lateral, pasos del contrato, chips de estado, tarjetas, tablas) se construyen una sola vez y se reutilizan.
- La firma y la administración no tienen versión de celular.
- Las pruebas E2E comparan capturas de la aplicación contra `png/` (ver el plan de pruebas).
