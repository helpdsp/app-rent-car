# Instrucciones para Gemini — México Renta de Autos (MVP)

Este archivo es el punto de entrada para escribir el código. El plan ya está hecho por otro agente: **tu trabajo es implementarlo, no re-planearlo.**

## Qué se construye

Una aplicación web (PWA) para el mostrador de México Renta de Autos (Mexicali, B.C.): clientes, vehículos, documentos con vigencia, contratos de renta de punta a punta (cotización, firma en tableta, entrega y recepción con fotos), alertas y bitácora. Todo auditable.

- **Stack:** Next.js (TypeScript, App Router) en `apps/web`, Supabase (Postgres, Auth, Storage), Drizzle, Resend, Vitest, hospedaje en Vercel.
- **Sin GoHighLevel en el MVP.** Solo se deja preparado `ghl_contact_id` y la tabla `outbox`.
- **Idioma de la interfaz y de los mensajes de error:** español.

## Orden de lectura

1. `spec-kit/input/sprint-plan.md`: los 12 sprints de 1 semana y su orden.
2. `planning/sprints/sprint-NN/`: `tasks.md` (tareas con requisito, componente, ruta, archivo sugerido y pantalla), `stories.md` (criterios de aceptación), `qa-plan.md`.
3. `spec-kit/input/product-prd.md`: los 29 requisitos (RF-01 a RF-29).
4. `spec-kit/input/data-model.md` y `api-spec.yaml`: esquema de Postgres y contrato de la API.
5. `spec-kit/input/technical-spec.md`: arquitectura, flujos críticos y seguridad.
6. `spec-kit/input/test-plan.md`: casos de prueba (T-01 a T-83).
7. `spec-kit/input/mockups/README.md`, `previews/*.html` y `png/*.png`: las 22 pantallas.

## Next.js: versión nueva, lee la documentación local primero

`apps/web/AGENTS.md` advierte que **esta versión de Next.js tiene cambios incompatibles** (APIs, convenciones y estructura de archivos) respecto de lo que los modelos suelen conocer. Antes de escribir código de rutas, route handlers, caché o middleware, lee la guía correspondiente en `apps/web/node_modules/next/dist/docs/` y respeta los avisos de obsoletos. Si `node_modules` no existe, ejecuta `npm install` dentro de `apps/web`.

## Cómo trabajar un sprint

1. Toma el siguiente sprint sin terminar y lee su `sprint-goal.md`.
2. Implementa las tareas de `tasks.md` en orden; cambia su `Status` de `todo` a `done` al terminarlas.
3. Escribe las pruebas del `qa-plan.md` junto con el código, no al final.
4. Una tarea de interfaz está terminada cuando coincide con su mockup en estructura, datos mostrados y reglas visibles. Los datos de ejemplo de los mockups no son requisitos.
5. Un sprint termina con las pruebas en verde, sin defectos críticos y con el código listo para la demo al cliente.

## Reglas que no se negocian

- **Dinero en centavos enteros** (`bigint`), nunca decimales ni punto flotante.
- **Nunca guardar un número de tarjeta.** Solo la forma de pago y los últimos 4 dígitos. Un número completo se rechaza.
- **La base de datos es la autoridad de integridad:** folio atómico (serie `D-00001`, distinta de los folios de papel), restricción de exclusión por rango de fechas para evitar dobles reservas, triggers de transición de estado y de auditoría. El servidor valida; la interfaz nunca decide reglas de negocio.
- **Bitácora de solo agregado:** ningún rol, incluido el de servicio, puede hacer `UPDATE` ni `DELETE` en `auditoria` ni en `evidencias`.
- **Permisos en el servidor y en RLS**, no solo ocultando botones.
- **Archivos sensibles** (credencial, licencia, fotos) en buckets privados con URL firmada de pocos minutos; cada lectura queda en la bitácora.
- **Copia al emitir:** el contrato guarda las tarifas y parámetros vigentes al emitirse; un cambio posterior del catálogo no lo altera.
- **Un contrato firmado es inmutable** (PDF con huella SHA-256); una corrección crea una versión nueva.
- **Reglas ambiguas del reglamento van como parámetros editables**, no fijas en el código: tolerancia al devolver tarde, redondeo de la hora extra, cancelación (20 % o total con 24 h o menos), penalizaciones. Hoy el motor redondea a peso; los contratos de papel parecen truncar la hora extra. **No decidas esto por tu cuenta.**
- **Caso de referencia:** el contrato 08160, 3 días × $1,633 = $4,899 de anticipo, hora extra $204 y km extra $3. Debe reproducirse de punta a punta.

## Terminología

- **Documentos** = licencia, credencial, tarjeta de circulación y póliza (sus vigencias).
- **Contratos** = los contratos de renta.
- No los mezcles en la interfaz, el código ni los mensajes.

## Qué no debes hacer

- **No ejecutes `generate_spec_kit`, `generate_sprints` ni `init`.** Sobrescribirían archivos del Spec Kit escritos a mano (`data-model.md`, `api-spec.yaml`, `technical-spec.md`, `epics.md`, `sprint-plan.md`, `test-plan.md`).
- **No leas ni imprimas `.env`** (tiene credenciales) ni lo subas a git.
- **No inventes requisitos.** Si algo no está en el PRD, el modelo de datos o los mockups, o si dos documentos se contradicen, detente y pregunta.
- **No cambies el alcance del MVP.** Quedan fuera: reservaciones en línea, sitio web y funnels, cobros en línea, facturación CFDI, WhatsApp, mantenimiento de flota y la integración con GHL.
- No uses el HTML de los mockups como código de producción: son maquetas estáticas.

## Decisiones abiertas con el cliente

Mientras no se confirmen, usa el valor por defecto como parámetro y deja una nota `TODO(cliente)`:

- Truncar o redondear la hora extra.
- Quién puede pactar la tarifa de un contrato distinta del catálogo.
- Formas de pago aceptadas («T/D» es ambiguo en los contratos de papel).
- Formato del folio digital (propuesta: `D-00001`).
- Registro PROFECO, ciudad de jurisdicción y teléfono de fallas (cláusula 10.ª-L): son parámetros que van en blanco.
- Validez legal de la firma digital frente a PROFECO (la confirma un abogado antes del sprint 8).

## Estado actual del código

- `apps/web` es un proyecto Next.js recién creado.
- `apps/web/src/lib/pricing/` es el **motor de tarifas**: funciones puras en centavos, con 23 pruebas que pasan (`npm test`). Es la pieza más sensible del sistema: no cambies una regla sin actualizar sus pruebas.
- **Pendiente de infraestructura:** el proyecto de Vercel no se creó y el de Supabase no existe. El Sprint 1 depende de ellos.
- **vitest:** la 5.1.0 falla en este equipo y la 3.x que funciona trae vulnerabilidades de herramientas de desarrollo. Hay una tarea en el Sprint 1 para resolverlo; no actualices a ciegas.

## Convenciones de código

- TypeScript estricto, validación de entrada con Zod en cada route handler, errores con código estable (`VEHICULO_NO_DISPONIBLE`, `LICENCIA_VENCIDA`, `TRANSICION_INVALIDA`, `SALDO_PENDIENTE`) y mensaje en español.
- Migraciones versionadas con Drizzle; los triggers, funciones y restricciones de exclusión van en SQL versionado.
- Fechas en UTC en la base, mostradas en America/Tijuana.
- Componentes de interfaz reutilizables (barra lateral, pasos del contrato, chips de estado, tarjetas, tablas), construidos una sola vez.
- Controles táctiles de 44 px o más; la firma y la administración no tienen versión de celular.
- Rutas y archivos: sigue la columna **Location** de cada `tasks.md`.

## Sugerencia de reparto si usas más de un modelo

Es una sugerencia, no una regla: lo que tiene reglas de integridad (migraciones con triggers, restricción de exclusión, transacción de emisión, liquidación, firma, auditoría) conviene que lo escriba y revise el modelo más cuidadoso, y las pantallas y componentes repetitivos pueden ir con el más rápido. Cualquier cambio a la base de datos o a `lib/pricing` debe pasar por una revisión con sus pruebas.
