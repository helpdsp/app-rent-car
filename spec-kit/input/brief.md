---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T03:40:00Z'
agent_roles: 'product-manager + engineering-technical-writer + engineering-software-architect'
vision_command: 'generate_brief'
---

# Brief — Digitalización de contratos de México Renta de Autos (MVP)

## Executive Summary

México Renta de Autos es una arrendadora de vehículos por día (24 h) con atención en mostrador en Mexicali, B.C. Hoy emite cada contrato **a mano** en un formato impreso de dos caras (carátula con datos e inventario, reverso con 21 cláusulas), con copia y firmas manuscritas, y vuelve a capturar los datos de cliente y vehículo en cada renta. La documentación (contrato firmado, fotos del estado del vehículo, identificaciones) queda dispersa y no hay control proactivo de vencimientos de licencias, tarjetas de circulación y pólizas.

El proyecto construye una **aplicación web** que el recepcionista usa desde tableta, celular o escritorio para operar el ciclo completo: registrar clientes y vehículos una sola vez, emitir el contrato prellenado con cálculos automáticos de tarifa, firmarlo en pantalla, entregar y recibir el vehículo con evidencias fotográficas, y recibir alertas antes de que venzan los documentos. Todo queda en un expediente por contrato, auditable y accesible fuera del mostrador.

La propuesta de valor: menos tiempo para emitir un contrato listo para firma, cero recaptura, cobros calculados con las reglas del reglamento y trazabilidad de quién hizo qué y cuándo.

## Context

- **Cliente:** México Renta de Autos, Mexicali, B.C. (frontera con EE. UU.; viajes frecuentes a Nogales y otras ciudades). Contraparte del proyecto: líder de proyecto del cliente. Horario: lun–vie 8:00–18:45, domingo 9:00–18:45 solo con cita.
- **Origen:** una propuesta de digitalización de marzo de 2024 basada en Microsoft 365, que no se ejecutó con esa plataforma. Esta versión se reconstruye como aplicación web propia; **se reutilizan solo los requisitos de negocio**, no la tecnología ni las condiciones comerciales de aquella propuesta.
- **Fuentes de verdad del negocio:** el contrato físico No. 08160 (carátula y cláusulas) y el reglamento impreso, transcritos desde fotografías. Donde contradicen a la propuesta, **prevalece el contrato**.
- **Decisión de arquitectura:** se evaluó usar GoHighLevel como base de datos y backend. Se decidió **aplazarlo**: el MVP corre sin GHL, porque la auditoría con valor anterior, el folio atómico y el bloqueo de dobles reservas no están garantizados allí. GHL se conectará después para CRM, marketing y automatización.

## Goals

- **O1 Digitalizar contratos:** reducir el tiempo de emisión de un contrato listo para firmar y centralizar las evidencias por contrato.
- **O2 Reutilizar información:** capturar cliente y vehículo una sola vez; eliminar la recaptura.
- **O3 Garantizar vigencias:** alertar antes de que venzan licencia, credencial, tarjeta de circulación y póliza.
- **O4 Accesibilidad:** el recepcionista opera todo el ciclo desde tableta, celular o escritorio.
- **O5 Trazabilidad:** contratos creados, consultados y modificados de forma confiable, confidencial y auditable (quién, cuándo, valor anterior).
- **O6 Cobro correcto:** calcular automáticamente días, anticipo, hora extra, kilometraje excedente y saldo según el reglamento, con el contrato 08160 como caso de referencia.

## Target Users / Roles

| Rol | Necesidad |
|---|---|
| **Operador / recepcionista** | Registrar clientes y vehículos, emitir contratos, entregar y recibir unidades, capturar fotos y video, consultar y dar seguimiento. |
| **Administrador** | Gestionar usuarios, catálogo de tarifas, parámetros y eliminaciones; capacitar al personal. |
| **Titular / líder del proyecto** | Consultar historial, alertas y avances; aprobar módulos. |
| **Cliente (arrendatario)** | Recibe por correo el contrato y el reglamento en PDF; firma en tableta. |
| **Conductor adicional** | Persona autorizada a manejar, con sus propios datos y licencia (0..N por contrato). |

La matriz exacta de permisos (quién elimina contratos o modifica tarifas) no fue definida por el cliente; se propone por defecto que solo el administrador elimine contratos y cambie tarifas.

## Scope — In

1. **Clientes:** datos generales y fiscales, credencial y licencia (ambos lados), número de cliente único automático, historial, búsqueda y filtros.
2. **Vehículos:** datos generales, tarjeta de circulación, póliza, clave de auto automática, valor asegurado, kilometraje, historial.
3. **Documentos oficiales:** repositorio ligado a cliente o vehículo, con vigencias, validación y alertas.
4. **Contratos (ciclo completo):** borrador → por firmar → vigente → por vencer/rezagado → recibido → concluido; además cancelado y en incidente. Incluye conductor adicional, segundo auto, referencia, destino, autorización de salida del país, garantía/depósito, pagaré opcional, inventario de entrega y recepción, diagrama de daños, nivel de gasolina en octavos, observaciones.
5. **Motor de tarifas:** días, anticipo, hora extra, km excedente, seguro nocturno, cargos extra, bonificaciones, liquidación y saldo.
6. **Firma digital en tableta** y generación del PDF del contrato (carátula y cláusulas) y del reglamento, prellenados.
7. **Evidencias:** fotos y video de entrega y recepción, ligados al contrato.
8. **Alertas de vencimiento** por correo y un tablero con documentos próximos a expirar.
9. **Envío por correo** del contrato y el reglamento en PDF tras la entrega.
10. **Roles, auditoría y exportación** de históricos (clientes, vehículos, contratos, documentos).
11. **Tablero del operador** con accesos directos y alertas.
12. **Uso en celular** para captura y consulta: tablero, nuevo contrato, fotos y kilometraje de entrega y recepción con la cámara, comparación de fotos y cobro. La firma del contrato y la administración se hacen en tableta o escritorio.

## Scope — Out / Non-goals

- Integración con **GoHighLevel** (se deja preparada: campo `ghl_contact_id` y tabla de eventos `outbox`, sin implementar).
- **Reservaciones en línea**, sitio web, funnels y marketing digital.
- **Cobros en línea** y procesamiento de pagos con tarjeta; **no se almacena ningún número de tarjeta**.
- **Facturación electrónica (CFDI)**: solo se capturan los datos fiscales.
- **WhatsApp** y mensajería promocional.
- Mantenimiento de flota y su costeo.
- Cobro por kilometraje como modalidad alternativa (el formato real usa 500 km por día).
- Migración de contratos históricos en papel (solo se evalúa cargar clientes y vehículos activos).

## Functional Requirements Summary

**Clientes y vehículos.** Alta, modificación, consulta, exportación y búsqueda. El número de cliente y la clave de auto son únicos y automáticos. Licencia de cliente con tipo, número, lugar de expedición y vencimiento; vehículo con tarjeta de circulación y póliza vigentes.

**Documentos y vigencias.** Cada documento tiene tipo, números, fecha de expedición, vencimiento y archivo. Un proceso diario revisa vigencias y notifica por correo; el operador ve una sección de "próximos a expirar". Un contrato no puede emitirse con licencia vencida durante el periodo ni con tarjeta o póliza del vehículo vencidas.

**Contrato.** Folio consecutivo único y no reutilizable (arranca después de 08160). Valida disponibilidad del vehículo y evita que dos contratos ocupen la misma unidad en fechas que se cruzan. Cláusula 3.ª: no hay prórroga tácita; extender una renta crea un contrato nuevo ligado al anterior. Todo conductor debe estar registrado en el contrato. Cada cambio conserva quién lo hizo, cuándo y el valor anterior.

**Reglas de cobro (reglamento).**
- Tarifa incluye 24 h, 500 km por día y seguro nacional con deducible de 30 % (20 % en cristales); en EE. UU., solo responsabilidad civil.
- Anticipo = tarifa × días, pagado por adelantado. Depósito en garantía independiente (ejemplo: $8,000 en efectivo).
- Hora extra = tarifa ÷ 8, por hora o fracción; desde la 5.ª hora se cobra un día extra. No aplica en seguro nocturno (18:00 a 08:00, de $400 a $1,000 según unidad).
- Km excedente = tarifa ÷ 500 por km; el contrato real usó $3 con tarifa de $1,633.
- Cancelación: 20 % del total; el total si se solicita con 24 h o menos de anticipación (lectura más probable de una regla ambigua).
- Cargos adicionales: limpieza y olor ($500 a $5,000), quemaduras, multas, traslado, penalización por incumplimiento, pena convencional de 20 % (cláusula 18.ª).
- **Caso de referencia:** contrato 08160, 3 días × $1,633 = $4,899 de anticipo.

**Entrega y recepción.** Inventario de 10 conceptos, diagrama del vehículo en 4 vistas con daños marcados, gasolina de salida y entrada en octavos, kilometraje y fotos o video. Incidentes con fecha y hora de aviso (aviso el mismo día, cláusula 12.ª) y evidencias.

**Documentos generados.** Contrato de arrendamiento (carátula con inventario y pagaré, más 21 cláusulas), reglamento firmable, PDF por correo, expediente por contrato, correos de recordatorio y exportaciones.

## Technical Stack & Constraints

**Decidido para el MVP** (detalle y razones en `refdocs/decisiones-tecnicas-mvp.md`):

| Capa | Elección |
|---|---|
| Hosting | Vercel |
| Aplicación | Next.js (TypeScript), PWA para tableta, celular y escritorio |
| Base de datos | Supabase Postgres, región oeste de EE. UU.; Drizzle para esquema y migraciones |
| Auth | Supabase Auth con MFA; roles operador, administrador, titular |
| Archivos | Supabase Storage privado, URLs firmadas de corta vida |
| PDF | Plantillas React renderizadas a PDF |
| Correo y alertas | Resend y cron diario |
| Pruebas | Vitest |

**Restricciones no funcionales.**
- **Auditable y confiable:** bitácora solo de agregado, con valor anterior y nuevo, alimentada por la base de datos.
- **Integridad:** folio atómico y restricción de exclusión por rango de fechas por vehículo; dinero en centavos enteros.
- **Privacidad (LFPDPPP):** credenciales y licencias son datos personales; requieren aviso de privacidad, consentimiento y política de retención. No se guardan números de tarjeta.
- **Usabilidad en mostrador y en campo:** operación táctil en tableta y celular, cámara para evidencias guiada por ángulo, captura de firma en tableta.
- **Español** como único idioma del MVP.
- **Ya implementado:** esqueleto Next.js en `apps/web` y el motor de tarifas (`apps/web/src/lib/pricing`) con 23 pruebas que reproducen el contrato 08160.

## Success Criteria

- Un operador emite un contrato completo, prellenado y firmado en tableta, sin recapturar datos de un cliente o vehículo ya registrado.
- El sistema reproduce el cálculo del contrato 08160 (días, anticipo, hora extra, km extra) y liquida correctamente retrasos, excedentes, cargos y bonificaciones.
- Es imposible reservar el mismo vehículo en fechas que se cruzan, incluso con operadores simultáneos.
- Los documentos próximos a vencer generan alerta por correo y aparecen en el tablero antes de expirar.
- Cada contrato tiene un expediente con el PDF firmado, las evidencias de entrega y recepción y el historial de cambios con autor y fecha.
- El cliente recibe el contrato y el reglamento en PDF por correo tras la entrega.
- El cliente valida cada módulo con pruebas de negocio antes de pasar al siguiente.

## Open Questions / Risks

**Preguntas abiertas con el cliente.**
1. Ortografía del titular (Arreola o Arriola) y datos del encabezado.
2. **Registro PROFECO** (número y fecha), **ciudad de jurisdicción** y **teléfono de fallas** (cláusula 10.ª-L): en blanco en el formato impreso.
3. Catálogo de tarifas por unidad, seguro nocturno por unidad y monto del depósito (¿$8,000 fijo?).
4. Volumen: sucursales, usuarios, unidades y contratos al mes.
5. Uso real del pagaré y su interés habitual.
6. Matriz de permisos.
7. Alcance de migración de datos históricos.
8. Validar contra el original los datos dudosos de la transcripción del contrato 08160 (nombre, licencia, placas, kilometraje, valor del auto).

**Supuestos del motor de tarifas por confirmar:** sin tolerancia al devolver tarde; retrasos de más de 24 h cuentan días completos más horas; cancelación con 24 h o menos cobra el total; los "2 días mínimo" y el 20 % de la cláusula 18.ª no se acumulan; hora y km extra se redondean a peso completo.

**Riesgos.**
- **Validez legal de la firma digital** frente a PROFECO (contrato de adhesión): requiere confirmación de un abogado; se conserva el PDF con hash, fecha y usuario.
- **Datos personales sensibles** (INE, licencias) sujetos a LFPDPPP, almacenados en infraestructura de EE. UU.; debe cubrirse en el aviso de privacidad.
- **Caída del proveedor en horario de mostrador:** sin modo sin conexión en el MVP; evaluar plan de contingencia.
- **Reglas ambiguas del reglamento** (cancelación, penalizaciones) pueden generar disputas si no se aclaran antes de automatizarlas.
- **Dependencias de desarrollo:** `npm audit` reporta vulnerabilidades en herramientas de prueba (solo desarrollo); pendiente actualizar vitest.
- **Pendientes de infraestructura:** crear el proyecto en Vercel (la conexión de la sesión devolvió 403) y el proyecto en Supabase.

## Input Sources

- refdocs: `requisitos-negocio-digitalizacion-contratos.md`, `decisiones-tecnicas-mvp.md`, `reglamento-mexico-renta-de-autos.md`, `contrato-arrendamiento-anverso.md`, `contrato-arrendamiento-clausulas.md`, `README.md`. La propuesta en PDF no pudo leerse directamente (falta `pdftoppm`); su contenido se tomó del documento de requisitos que la resume. Las tres imágenes de WhatsApp se leyeron a través de sus transcripciones en `.md`.
- source-code: no aplica (reverse engineering: no).
