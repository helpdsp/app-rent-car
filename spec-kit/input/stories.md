---
generated_by_model: 'claude-sonnet-5-5 (script de VISION sobre product-prd.md actualizado)'
generated_at: '2026-11-17T04:40:38.783Z'
agent_roles: 'pending-ide-agent-review'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'resolved (see command Paso 2 order)'
---
# User stories — Contratos digitales de México Renta de Autos (MVP)

> **VISION fallback:** una historia por cada **RF** detectado (`### RF-XX` en el PRD). Completa criterios y owners con el detalle del PRD.

El PRD de producto está disponible: se usan encabezados `### RF-XX` para generar historias.

## Brief aprobado (extracto)

---
generated_by_model: 'claude-sonnet-5-5 (script de VISION sobre product-prd.md actualizado)'
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
| **Conductor adicional** | Persona autorizada a manejar, con sus propios datos y licencia (0..N por c

...(truncated — see full product PRD in refdocs or pass a larger file)...


## Tabla índice (stories ↔ RF)

| Story | RF | Título |
|-------|-----|--------|
| S-01 | RF-01 | Autenticación y roles |
| S-02 | RF-02 | Bitácora de auditoría |
| S-03 | RF-03 | Catálogo de tarifas y parámetros |
| S-04 | RF-04 | Alta y edición de clientes |
| S-05 | RF-05 | Documentos del cliente (credencial y licencia) |
| S-06 | RF-06 | Búsqueda, historial y exportación de clientes |
| S-07 | RF-07 | Alta y edición de vehículos |
| S-08 | RF-08 | Documentos del vehículo |
| S-09 | RF-09 | Disponibilidad y bloqueos |
| S-10 | RF-10 | Alertas de vigencia |
| S-11 | RF-11 | Tablero del operador |
| S-12 | RF-12 | Borrador de contrato y validaciones |
| S-13 | RF-13 | Folio y estados del contrato |
| S-14 | RF-14 | Cálculo automático de tarifas |
| S-15 | RF-15 | Conductores adicionales, segundo auto y referencia |
| S-16 | RF-16 | Anticipo, garantía y pagos |
| S-17 | RF-17 | Generación de PDF del contrato y del reglamento |
| S-18 | RF-18 | Firma digital en tableta |
| S-19 | RF-19 | Entrega del vehículo |
| S-20 | RF-20 | Envío del contrato por correo |
| S-21 | RF-21 | Recepción del vehículo y liquidación |
| S-22 | RF-22 | Contratos rezagados |
| S-23 | RF-23 | Incidentes |
| S-24 | RF-24 | Renovación y extensión |
| S-25 | RF-25 | Cancelación |
| S-26 | RF-26 | Pagaré |
| S-27 | RF-27 | Exportación de históricos |
| S-28 | RF-28 | Privacidad y datos personales |
| S-29 | RF-29 | Preparación para integración futura |

---

## RF-01 — Autenticación y roles

### S-01 — Autenticación y roles

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-01** **para** cumplir el requisito funcional.
- **RF:** RF-01
- **Criterios de aceptación (checklist):**
  - [ ] Inicio de sesión con correo y contraseña, con segundo factor (MFA) para administrador y titular.
  - [ ] Tres roles: operador, administrador, titular; permisos aplicados en el servidor, no solo ocultos en pantalla.
  - [ ] Cierre de sesión por inactividad configurable (por defecto 30 minutos).
  - [ ] El administrador crea, desactiva y cambia el rol de usuarios; un usuario desactivado conserva su autoría en la bitácora.
  - [ ] **Mockup:** pantallas 8 Inicio de sesión y verificación (`spec-kit/input/mockups/previews/08-inicio-de-sesion.html`); 17 Administración: usuarios y roles (`spec-kit/input/mockups/previews/17-admin-usuarios-roles.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-01)

```text
**Prioridad:** Must
- Inicio de sesión con correo y contraseña, con segundo factor (MFA) para administrador y titular.
- Tres roles: operador, administrador, titular; permisos aplicados en el servidor, no solo ocultos en pantalla.
- Cierre de sesión por inactividad configurable (por defecto 30 minutos).
- El administrador crea, desactiva y cambia el rol de usuarios; un usuario desactivado conserva su autoría en la bitácora.
- **Mockup:** pantallas 8 Inicio de sesión y verificación (`spec-kit/input/mockups/previews/08-inicio-de-sesion.html`); 17 Administración: usuarios y roles (`spec-kit/input/mockups/previews/17-admin-usuarios-roles.html`).
```

---

## RF-02 — Bitácora de auditoría

### S-02 — Bitácora de auditoría

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-02** **para** cumplir el requisito funcional.
- **RF:** RF-02
- **Criterios de aceptación (checklist):**
  - [ ] Cada creación, modificación, eliminación lógica y consulta de contrato o documento registra usuario, fecha y hora, acción, valor anterior y valor nuevo.
  - [ ] La bitácora es solo de agregado: ningún rol puede editarla ni borrarla.
  - [ ] Se llena por triggers en la base de datos, no por código de la aplicación, para que no se pueda omitir.
  - [ ] El titular y el administrador consultan la bitácora filtrando por contrato, usuario y rango de fechas.
  - [ ] **Mockup:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-02)

```text
**Prioridad:** Must
- Cada creación, modificación, eliminación lógica y consulta de contrato o documento registra usuario, fecha y hora, acción, valor anterior y valor nuevo.
- La bitácora es solo de agregado: ningún rol puede editarla ni borrarla.
- Se llena por triggers en la base de datos, no por código de la aplicación, para que no se pueda omitir.
- El titular y el administrador consultan la bitácora filtrando por contrato, usuario y rango de fechas.
- **Mockup:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
```

---

## RF-03 — Catálogo de tarifas y parámetros

### S-03 — Catálogo de tarifas y parámetros

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-03** **para** cumplir el requisito funcional.
- **RF:** RF-03
- **Criterios de aceptación (checklist):**
  - [ ] El administrador mantiene el catálogo: tarifa por 24 h, seguro nocturno ($400 a $1,000), valor asegurado y cuota de protección por vehículo o categoría.
  - [ ] Parámetros editables con sus valores por defecto: 500 km por día, divisor de hora extra (8), hora desde la que se cobra un día (5), tolerancia (0), redondeo a peso, deducible (30 % y 20 % en cristales).
  - [ ] Todo cambio de tarifa o parámetro queda en la bitácora y no altera contratos ya emitidos.
  - [ ] Cada contrato guarda una copia de las tarifas y parámetros vigentes al emitirse.
  - [ ] **Mockup:** pantallas 16 Administración: tarifas y parámetros (`spec-kit/input/mockups/previews/16-admin-tarifas-parametros.html`); 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`). Los datos legales pendientes se ven en la 16; la tarifa editable con motivo, en la 3.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-03)

```text
**Prioridad:** Must
- El administrador mantiene el catálogo: tarifa por 24 h, seguro nocturno ($400 a $1,000), valor asegurado y cuota de protección por vehículo o categoría.
- Parámetros editables con sus valores por defecto: 500 km por día, divisor de hora extra (8), hora desde la que se cobra un día (5), tolerancia (0), redondeo a peso, deducible (30 % y 20 % en cristales).
- Todo cambio de tarifa o parámetro queda en la bitácora y no altera contratos ya emitidos.
- Cada contrato guarda una copia de las tarifas y parámetros vigentes al emitirse.
- **Mockup:** pantallas 16 Administración: tarifas y parámetros (`spec-kit/input/mockups/previews/16-admin-tarifas-parametros.html`); 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`). Los datos legales pendientes se ven en la 16; la tarifa editable con motivo, en la 3.
```

---

## RF-04 — Alta y edición de clientes

### S-04 — Alta y edición de clientes

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-04** **para** cumplir el requisito funcional.
- **RF:** RF-04
- **Criterios de aceptación (checklist):**
  - [ ] Captura de nombre completo, identificación, domicilio, ciudad y estado, teléfono y celular por separado.
  - [ ] Número de cliente único y automático; no editable.
  - [ ] Datos fiscales opcionales: razón social, RFC, domicilio fiscal, régimen y constancia de situación fiscal.
  - [ ] Validación de formato de RFC y de teléfono; detección de posibles duplicados por nombre e identificación.
  - [ ] Un cliente se registra una sola vez y se reutiliza en todos sus contratos.
  - [ ] **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-04)

```text
**Prioridad:** Must
- Captura de nombre completo, identificación, domicilio, ciudad y estado, teléfono y celular por separado.
- Número de cliente único y automático; no editable.
- Datos fiscales opcionales: razón social, RFC, domicilio fiscal, régimen y constancia de situación fiscal.
- Validación de formato de RFC y de teléfono; detección de posibles duplicados por nombre e identificación.
- Un cliente se registra una sola vez y se reutiliza en todos sus contratos.
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
```

---

## RF-05 — Documentos del cliente (credencial y licencia)

### S-05 — Documentos del cliente (credencial y licencia)

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-05** **para** cumplir el requisito funcional.
- **RF:** RF-05
- **Criterios de aceptación (checklist):**
  - [ ] Captura de foto o escaneo de ambos lados de la credencial y de la licencia, con la cámara de la tableta.
  - [ ] Licencia: número, tipo, lugar de expedición y fecha de vencimiento; credencial: número y vigencia.
  - [ ] Los archivos se guardan en almacenamiento privado y solo se ven mediante enlaces firmados de corta duración.
  - [ ] Cada consulta de un documento sensible queda en la bitácora.
  - [ ] **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-05)

```text
**Prioridad:** Must
- Captura de foto o escaneo de ambos lados de la credencial y de la licencia, con la cámara de la tableta.
- Licencia: número, tipo, lugar de expedición y fecha de vencimiento; credencial: número y vigencia.
- Los archivos se guardan en almacenamiento privado y solo se ven mediante enlaces firmados de corta duración.
- Cada consulta de un documento sensible queda en la bitácora.
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).
```

---

## RF-06 — Búsqueda, historial y exportación de clientes

### S-06 — Búsqueda, historial y exportación de clientes

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-06** **para** cumplir el requisito funcional.
- **RF:** RF-06
- **Criterios de aceptación (checklist):**
  - [ ] Búsqueda por nombre, número de cliente, identificación, teléfono y RFC.
  - [ ] Historial de rentas por cliente, con estado, total y kilómetros recorridos de cada una (kilometraje de entrada menos el de salida; «en curso» si aún no se recibe).
  - [ ] El historial del vehículo muestra también los kilómetros recorridos por renta y su suma acumulada.
  - [ ] Exportación a CSV del listado y del historial (solo administrador y titular).
  - [ ] **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`); 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`). La búsqueda está en 1 y M1.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-06)

```text
**Prioridad:** Should
- Búsqueda por nombre, número de cliente, identificación, teléfono y RFC.
- Historial de rentas por cliente, con estado, total y kilómetros recorridos de cada una (kilometraje de entrada menos el de salida; «en curso» si aún no se recibe).
- El historial del vehículo muestra también los kilómetros recorridos por renta y su suma acumulada.
- Exportación a CSV del listado y del historial (solo administrador y titular).
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`); 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`). La búsqueda está en 1 y M1.
```

---

## RF-07 — Alta y edición de vehículos

### S-07 — Alta y edición de vehículos

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-07** **para** cumplir el requisito funcional.
- **RF:** RF-07
- **Criterios de aceptación (checklist):**
  - [ ] Captura de marca, modelo, tipo y color, placas, kilometraje, valor asegurado y observaciones.
  - [ ] Clave de auto única y automática.
  - [ ] Estado operativo: disponible, rentado, en mantenimiento o baja.
  - [ ] El kilometraje actual no puede disminuir salvo por corrección de un administrador, que queda auditada.
  - [ ] **Mockup:** pantallas 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`); 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-07)

```text
**Prioridad:** Must
- Captura de marca, modelo, tipo y color, placas, kilometraje, valor asegurado y observaciones.
- Clave de auto única y automática.
- Estado operativo: disponible, rentado, en mantenimiento o baja.
- El kilometraje actual no puede disminuir salvo por corrección de un administrador, que queda auditada.
- **Mockup:** pantallas 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`); 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`).
```

---

## RF-08 — Documentos del vehículo

### S-08 — Documentos del vehículo

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-08** **para** cumplir el requisito funcional.
- **RF:** RF-08
- **Criterios de aceptación (checklist):**
  - [ ] Tarjeta de circulación (expedición y vigencia) y póliza de seguro (aseguradora, agente, contacto, expedición y vigencia), con imagen o PDF.
  - [ ] Un vehículo con tarjeta o póliza vencida queda marcado como no rentable y no puede asignarse a un contrato nuevo.
  - [ ] **Mockup:** pantallas 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`); 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`). El estado «No rentable» se ve en la 9.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-08)

```text
**Prioridad:** Must
- Tarjeta de circulación (expedición y vigencia) y póliza de seguro (aseguradora, agente, contacto, expedición y vigencia), con imagen o PDF.
- Un vehículo con tarjeta o póliza vencida queda marcado como no rentable y no puede asignarse a un contrato nuevo.
- **Mockup:** pantallas 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`); 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`). El estado «No rentable» se ve en la 9.
```

---

## RF-09 — Disponibilidad y bloqueos

### S-09 — Disponibilidad y bloqueos

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-09** **para** cumplir el requisito funcional.
- **RF:** RF-09
- **Criterios de aceptación (checklist):**
  - [ ] Un vehículo no puede estar en dos contratos cuyas fechas se crucen, incluso si dos operadores lo intentan a la vez; la base de datos lo impide.
  - [ ] El administrador puede bloquear un vehículo por mantenimiento con fecha de inicio y fin.
  - [ ] Al elegir fechas en un contrato, la lista de vehículos muestra solo los disponibles y explica por qué no aparece uno (rentado, en mantenimiento o documentos vencidos).
  - [ ] Las unidades reservadas están sujetas a cambio por una unidad similar (leyenda del formato impreso); el cambio queda registrado.
  - [ ] **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-09)

```text
**Prioridad:** Must
- Un vehículo no puede estar en dos contratos cuyas fechas se crucen, incluso si dos operadores lo intentan a la vez; la base de datos lo impide.
- El administrador puede bloquear un vehículo por mantenimiento con fecha de inicio y fin.
- Al elegir fechas en un contrato, la lista de vehículos muestra solo los disponibles y explica por qué no aparece uno (rentado, en mantenimiento o documentos vencidos).
- Las unidades reservadas están sujetas a cambio por una unidad similar (leyenda del formato impreso); el cambio queda registrado.
- **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`).
```

---

## RF-10 — Alertas de vigencia

### S-10 — Alertas de vigencia

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-10** **para** cumplir el requisito funcional.
- **RF:** RF-10
- **Criterios de aceptación (checklist):**
  - [ ] Un proceso diario revisa licencia, credencial, tarjeta de circulación y póliza.
  - [ ] Se notifica por correo a los 30, 15 y 7 días antes del vencimiento y el día en que vence (días configurables).
  - [ ] Cada alerta guarda documento, fecha, destinatario y estado (pendiente, enviada, atendida).
  - [ ] Una alerta se marca atendida automáticamente cuando se sube el documento renovado.
  - [ ] **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-10)

```text
**Prioridad:** Must
- Un proceso diario revisa licencia, credencial, tarjeta de circulación y póliza.
- Se notifica por correo a los 30, 15 y 7 días antes del vencimiento y el día en que vence (días configurables).
- Cada alerta guarda documento, fecha, destinatario y estado (pendiente, enviada, atendida).
- Una alerta se marca atendida automáticamente cuando se sube el documento renovado.
- **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).
```

---

## RF-11 — Tablero del operador

### S-11 — Tablero del operador

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-11** **para** cumplir el requisito funcional.
- **RF:** RF-11
- **Criterios de aceptación (checklist):**
  - [ ] Accesos directos a nuevo contrato, entrega, recepción, clientes y vehículos.
  - [ ] Secciones de documentos próximos a vencer, contratos que vencen hoy y contratos rezagados.
  - [ ] Funciona en tableta, escritorio y celular sin desplazamiento horizontal; en celular se priorizan las acciones y lo que requiere atención.
  - [ ] **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-11)

```text
**Prioridad:** Should
- Accesos directos a nuevo contrato, entrega, recepción, clientes y vehículos.
- Secciones de documentos próximos a vencer, contratos que vencen hoy y contratos rezagados.
- Funciona en tableta, escritorio y celular sin desplazamiento horizontal; en celular se priorizan las acciones y lo que requiere atención.
- **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).
```

---

## RF-12 — Borrador de contrato y validaciones

### S-12 — Borrador de contrato y validaciones

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-12** **para** cumplir el requisito funcional.
- **RF:** RF-12
- **Criterios de aceptación (checklist):**
  - [ ] Selección de cliente y vehículo existentes; captura de destino, fechas y horas de salida y entrada prevista, lugar de devolución y referencia del cliente.
  - [ ] Autorización de salida del país: no autorizada por defecto; si es autorizada, requiere adjuntar el permiso escrito.
  - [ ] Al menos un conductor registrado en el contrato (el arrendatario o un conductor adicional) debe tener licencia vigente durante todo el periodo; si ninguno la tiene, el contrato no avanza. El arrendatario puede no conducir y no tener licencia si un conductor adicional la tiene (caso real del contrato 08590).
  - [ ] «Facturar a» es un dato del contrato, con nombre y RFC propios, que puede ser distinto del arrendatario (caso real del contrato 08357).
  - [ ] La salida no puede ser anterior a la emisión, y la entrada prevista debe ser posterior a la salida.
  - [ ] El borrador puede guardarse incompleto y retomarse; solo un contrato completo pasa a "por firmar".
  - [ ] **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-12)

```text
**Prioridad:** Must
- Selección de cliente y vehículo existentes; captura de destino, fechas y horas de salida y entrada prevista, lugar de devolución y referencia del cliente.
- Autorización de salida del país: no autorizada por defecto; si es autorizada, requiere adjuntar el permiso escrito.
- Al menos un conductor registrado en el contrato (el arrendatario o un conductor adicional) debe tener licencia vigente durante todo el periodo; si ninguno la tiene, el contrato no avanza. El arrendatario puede no conducir y no tener licencia si un conductor adicional la tiene (caso real del contrato 08590).
- «Facturar a» es un dato del contrato, con nombre y RFC propios, que puede ser distinto del arrendatario (caso real del contrato 08357).
- La salida no puede ser anterior a la emisión, y la entrada prevista debe ser posterior a la salida.
- El borrador puede guardarse incompleto y retomarse; solo un contrato completo pasa a "por firmar".
- **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).
```

---

## RF-13 — Folio y estados del contrato

### S-13 — Folio y estados del contrato

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-13** **para** cumplir el requisito funcional.
- **RF:** RF-13
- **Criterios de aceptación (checklist):**
  - [ ] Folio único y no reutilizable, que no se asigna hasta que el contrato se emite. **El folio digital debe usar una serie propia, distinta de los folios preimpresos:** los folios de papel no son consecutivos ni cronológicos (varios talonarios a la vez, ya se llegó a 09834), así que iniciar en 8161 chocaría con contratos de papel existentes. Formato propuesto: `D-00001` (prefijo `D-` y 5 dígitos), que el cliente confirma. El folio del talonario de papel puede registrarse aparte, como campo opcional, durante la transición.
  - [ ] Estados: borrador, por firmar, vigente, por vencer, rezagado, recibido, concluido, cancelado, en incidente.
  - [ ] Las transiciones se validan en el servidor (por ejemplo, no se puede pasar de borrador a concluido).
  - [ ] Cada cambio de estado queda en la bitácora con su autor.
  - [ ] **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-13)

```text
**Prioridad:** Must
- Folio único y no reutilizable, que no se asigna hasta que el contrato se emite. **El folio digital debe usar una serie propia, distinta de los folios preimpresos:** los folios de papel no son consecutivos ni cronológicos (varios talonarios a la vez, ya se llegó a 09834), así que iniciar en 8161 chocaría con contratos de papel existentes. Formato propuesto: `D-00001` (prefijo `D-` y 5 dígitos), que el cliente confirma. El folio del talonario de papel puede registrarse aparte, como campo opcional, durante la transición.
- Estados: borrador, por firmar, vigente, por vencer, rezagado, recibido, concluido, cancelado, en incidente.
- Las transiciones se validan en el servidor (por ejemplo, no se puede pasar de borrador a concluido).
- Cada cambio de estado queda en la bitácora con su autor.
- **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).
```

---

## RF-14 — Cálculo automático de tarifas

### S-14 — Cálculo automático de tarifas

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-14** **para** cumplir el requisito funcional.
- **RF:** RF-14
- **Criterios de aceptación (checklist):**
  - [ ] Días, renta base, anticipo (tarifa × días), hora extra (tarifa ÷ 8 redondeada a peso), km excedente (tarifa ÷ 500 o tarifa pactada), seguro nocturno y total, según el reglamento.
  - [ ] Desde la 5.ª hora de retraso se cobra un día extra; en seguro nocturno cualquier retraso cobra el día completo.
  - [ ] El operador puede sobrescribir la tarifa de km por contrato con una nota obligatoria.
  - [ ] La tarifa de 24 h es un dato **del contrato**: el catálogo propone un valor, pero las rentas reales varían (por ejemplo $1,470, $1,512, $1,633 y $2,216 para modelos y fechas distintos). Cambiarla exige un motivo; quién puede hacerlo y en qué rango se define con el cliente. La hora extra y el km extra se recalculan con la tarifa pactada.
  - [ ] Las líneas de cargo se guardan una por una (renta, retraso, km, limpieza, multas, traslado, bonificaciones) y suman exactamente el total.
  - [ ] El cálculo reproduce el contrato 08160 y está cubierto por pruebas automáticas.
  - [ ] **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-14)

```text
**Prioridad:** Must
- Días, renta base, anticipo (tarifa × días), hora extra (tarifa ÷ 8 redondeada a peso), km excedente (tarifa ÷ 500 o tarifa pactada), seguro nocturno y total, según el reglamento.
- Desde la 5.ª hora de retraso se cobra un día extra; en seguro nocturno cualquier retraso cobra el día completo.
- El operador puede sobrescribir la tarifa de km por contrato con una nota obligatoria.
- La tarifa de 24 h es un dato **del contrato**: el catálogo propone un valor, pero las rentas reales varían (por ejemplo $1,470, $1,512, $1,633 y $2,216 para modelos y fechas distintos). Cambiarla exige un motivo; quién puede hacerlo y en qué rango se define con el cliente. La hora extra y el km extra se recalculan con la tarifa pactada.
- Las líneas de cargo se guardan una por una (renta, retraso, km, limpieza, multas, traslado, bonificaciones) y suman exactamente el total.
- El cálculo reproduce el contrato 08160 y está cubierto por pruebas automáticas.
- **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).
```

---

## RF-15 — Conductores adicionales, segundo auto y referencia

### S-15 — Conductores adicionales, segundo auto y referencia

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-15** **para** cumplir el requisito funcional.
- **RF:** RF-15
- **Criterios de aceptación (checklist):**
  - [ ] De 0 a N conductores adicionales por contrato con nombre, domicilio, teléfono, licencia, vencimiento y firma; su licencia debe estar vigente en el periodo.
  - [ ] Segundo vehículo opcional con las mismas validaciones de disponibilidad y documentos.
  - [ ] Referencia del cliente con nombre, teléfono y celular.
  - [ ] **Mockup:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-15)

```text
**Prioridad:** Should
- De 0 a N conductores adicionales por contrato con nombre, domicilio, teléfono, licencia, vencimiento y firma; su licencia debe estar vigente en el periodo.
- Segundo vehículo opcional con las mismas validaciones de disponibilidad y documentos.
- Referencia del cliente con nombre, teléfono y celular.
- **Mockup:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
```

---

## RF-16 — Anticipo, garantía y pagos

### S-16 — Anticipo, garantía y pagos

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-16** **para** cumplir el requisito funcional.
- **RF:** RF-16
- **Criterios de aceptación (checklist):**
  - [ ] Se registra el anticipo (renta total pagada por adelantado) y el depósito en garantía con tipo: efectivo, tarjeta de crédito o Visa Láser, y monto.
  - [ ] Un anticipo admite **varios pagos de formas distintas** (efectivo, tarjeta, transferencia o depósito), por ejemplo parte por transferencia y parte en efectivo; la suma debe cubrir la renta total antes de pasar a vigente.
  - [ ] **El sistema nunca almacena números de tarjeta.**
  - [ ] Recibo de depósito imprimible con razón social, fecha, importe y firma de quien recibe (cláusula 8.ª).
  - [ ] Al concluir, el depósito se aplica al saldo o se devuelve, y cada movimiento queda registrado.
  - [ ] Un contrato no pasa a vigente sin anticipo y depósito registrados.
  - [ ] **Mockup:** pantallas 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-16)

```text
**Prioridad:** Must
- Se registra el anticipo (renta total pagada por adelantado) y el depósito en garantía con tipo: efectivo, tarjeta de crédito o Visa Láser, y monto.
- Un anticipo admite **varios pagos de formas distintas** (efectivo, tarjeta, transferencia o depósito), por ejemplo parte por transferencia y parte en efectivo; la suma debe cubrir la renta total antes de pasar a vigente.
- **El sistema nunca almacena números de tarjeta.**
- Recibo de depósito imprimible con razón social, fecha, importe y firma de quien recibe (cláusula 8.ª).
- Al concluir, el depósito se aplica al saldo o se devuelve, y cada movimiento queda registrado.
- Un contrato no pasa a vigente sin anticipo y depósito registrados.
- **Mockup:** pantallas 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).
```

---

## RF-17 — Generación de PDF del contrato y del reglamento

### S-17 — Generación de PDF del contrato y del reglamento

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-17** **para** cumplir el requisito funcional.
- **RF:** RF-17
- **Criterios de aceptación (checklist):**
  - [ ] Contrato de dos caras: carátula con datos, inventario y pagaré opcional, y las 21 cláusulas, prellenado con los datos del contrato.
  - [ ] Reglamento prellenado y firmable.
  - [ ] Los PDF se generan sin pasos manuales y se pueden imprimir.
  - [ ] Cada PDF emitido se conserva con su hash para detectar alteraciones.
  - [ ] Los datos pendientes del formato (registro PROFECO, ciudad de jurisdicción, teléfono de fallas) son parámetros configurables.
  - [ ] **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-17)

```text
**Prioridad:** Must
- Contrato de dos caras: carátula con datos, inventario y pagaré opcional, y las 21 cláusulas, prellenado con los datos del contrato.
- Reglamento prellenado y firmable.
- Los PDF se generan sin pasos manuales y se pueden imprimir.
- Cada PDF emitido se conserva con su hash para detectar alteraciones.
- Los datos pendientes del formato (registro PROFECO, ciudad de jurisdicción, teléfono de fallas) son parámetros configurables.
- **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`).
```

---

## RF-18 — Firma digital en tableta

### S-18 — Firma digital en tableta

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-18** **para** cumplir el requisito funcional.
- **RF:** RF-18
- **Criterios de aceptación (checklist):**
  - [ ] Captura de la firma del arrendatario, de los conductores adicionales y del pagaré en un área táctil.
  - [ ] Se guarda la imagen de la firma, el hash del PDF firmado, fecha, hora, usuario y dispositivo.
  - [ ] Una vez firmado, el PDF es inmutable; cualquier corrección genera una nueva versión que se vuelve a firmar.
  - [ ] Alternativa de impresión y firma manuscrita, con escaneo adjunto al expediente.
  - [ ] **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`). No hay versión de celular.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-18)

```text
**Prioridad:** Must
- Captura de la firma del arrendatario, de los conductores adicionales y del pagaré en un área táctil.
- Se guarda la imagen de la firma, el hash del PDF firmado, fecha, hora, usuario y dispositivo.
- Una vez firmado, el PDF es inmutable; cualquier corrección genera una nueva versión que se vuelve a firmar.
- Alternativa de impresión y firma manuscrita, con escaneo adjunto al expediente.
- **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`). No hay versión de celular.
```

---

## RF-19 — Entrega del vehículo

### S-19 — Entrega del vehículo

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-19** **para** cumplir el requisito funcional.
- **RF:** RF-19
- **Criterios de aceptación (checklist):**
  - [ ] Inventario de 10 conceptos (refacciones, gato, herramienta, reflejantes, tapetes, radio, bocinas, cinturones, placas, antena).
  - [ ] Diagrama del vehículo en 4 vistas para marcar daños, con nota por cada daño.
  - [ ] Nivel de gasolina de salida en octavos y kilometraje de salida (mayor o igual al actual del vehículo).
  - [ ] Fotos y video del estado, subidos directamente al almacenamiento y ligados al contrato.
  - [ ] Seis ángulos de foto obligatorios: frente, atrás, izquierda, derecha, tablero con kilometraje e interior; sin ellos no se completa la entrega.
  - [ ] La captura usa la cámara del celular o de la tableta, con una guía por ángulo y el avance (por ejemplo, 5 de 6); la foto del tablero se captura junto con el campo de kilometraje.
  - [ ] La foto del tablero con el kilometraje es obligatoria para guardar el kilometraje de salida: el campo numérico y la foto se capturan juntos y quedan ligados; la foto guarda el valor capturado para poder cotejarlo después.
  - [ ] Cada foto guarda fecha, hora, usuario y dispositivo, y no se puede reemplazar ni borrar: una repetición se agrega como foto nueva.
  - [ ] Con la entrega completa, el contrato pasa a vigente.
  - [ ] **Mockup:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`); M3 Fotos de entrega (celular) (`spec-kit/input/mockups/previews/m3-movil-fotos-entrega.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-19)

```text
**Prioridad:** Must
- Inventario de 10 conceptos (refacciones, gato, herramienta, reflejantes, tapetes, radio, bocinas, cinturones, placas, antena).
- Diagrama del vehículo en 4 vistas para marcar daños, con nota por cada daño.
- Nivel de gasolina de salida en octavos y kilometraje de salida (mayor o igual al actual del vehículo).
- Fotos y video del estado, subidos directamente al almacenamiento y ligados al contrato.
- Seis ángulos de foto obligatorios: frente, atrás, izquierda, derecha, tablero con kilometraje e interior; sin ellos no se completa la entrega.
- La captura usa la cámara del celular o de la tableta, con una guía por ángulo y el avance (por ejemplo, 5 de 6); la foto del tablero se captura junto con el campo de kilometraje.
- La foto del tablero con el kilometraje es obligatoria para guardar el kilometraje de salida: el campo numérico y la foto se capturan juntos y quedan ligados; la foto guarda el valor capturado para poder cotejarlo después.
- Cada foto guarda fecha, hora, usuario y dispositivo, y no se puede reemplazar ni borrar: una repetición se agrega como foto nueva.
- Con la entrega completa, el contrato pasa a vigente.
- **Mockup:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`); M3 Fotos de entrega (celular) (`spec-kit/input/mockups/previews/m3-movil-fotos-entrega.html`).
```

---

## RF-20 — Envío del contrato por correo

### S-20 — Envío del contrato por correo

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-20** **para** cumplir el requisito funcional.
- **RF:** RF-20
- **Criterios de aceptación (checklist):**
  - [ ] Tras la entrega, el sistema envía al cliente el contrato firmado y el reglamento en PDF.
  - [ ] Se registra el resultado del envío; si falla, el operador puede reenviarlo.
  - [ ] El operador puede cambiar el correo destino antes de enviar.
  - [ ] **Mockup:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`). No tiene pantalla propia: el aviso aparece al completar la entrega.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-20)

```text
**Prioridad:** Must
- Tras la entrega, el sistema envía al cliente el contrato firmado y el reglamento en PDF.
- Se registra el resultado del envío; si falla, el operador puede reenviarlo.
- El operador puede cambiar el correo destino antes de enviar.
- **Mockup:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`). No tiene pantalla propia: el aviso aparece al completar la entrega.
```

---

## RF-21 — Recepción del vehículo y liquidación

### S-21 — Recepción del vehículo y liquidación

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-21** **para** cumplir el requisito funcional.
- **RF:** RF-21
- **Criterios de aceptación (checklist):**
  - [ ] Captura de kilometraje de entrada (mayor o igual al de salida), gasolina, inventario, daños, fotos y video.
  - [ ] Se piden los mismos seis ángulos de foto que en la entrega; la recepción no se completa con ángulos pendientes, salvo que un administrador lo autorice con una nota.
  - [ ] La foto del tablero con el kilometraje de entrada es obligatoria y se liga al valor capturado; el cálculo del kilometraje excedente usa los dos kilometrajes, y sus fotos respaldan el cobro si el cliente lo disputa.
  - [ ] Vista de comparación lado a lado, por ángulo, entre la foto de entrega y la de recepción, para determinar si un daño ya existía.
  - [ ] Las fotos y el video de entrega y recepción se conservan en el expediente del contrato durante el plazo de retención configurable (por defecto, el que defina el cliente con su aviso de privacidad) y se pueden consultar y exportar con el contrato.
  - [ ] Cargo por gasolina si se devuelve con faltante respecto a la salida.
  - [ ] Liquidación automática: renta base, retraso, km excedente, otros cargos y bonificaciones, con total y saldo (total menos anticipo).
  - [ ] Odómetro dañado por culpa del cliente: se cobra por día (cláusula 16.ª).
  - [ ] El contrato pasa a recibido y, al liquidar el saldo y aplicar o devolver el depósito, a concluido.
  - [ ] **Mockup:** pantallas 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`); M4 Recepción: comparar fotos (celular) (`spec-kit/input/mockups/previews/m4-movil-recepcion-comparar.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-21)

```text
**Prioridad:** Must
- Captura de kilometraje de entrada (mayor o igual al de salida), gasolina, inventario, daños, fotos y video.
- Se piden los mismos seis ángulos de foto que en la entrega; la recepción no se completa con ángulos pendientes, salvo que un administrador lo autorice con una nota.
- La foto del tablero con el kilometraje de entrada es obligatoria y se liga al valor capturado; el cálculo del kilometraje excedente usa los dos kilometrajes, y sus fotos respaldan el cobro si el cliente lo disputa.
- Vista de comparación lado a lado, por ángulo, entre la foto de entrega y la de recepción, para determinar si un daño ya existía.
- Las fotos y el video de entrega y recepción se conservan en el expediente del contrato durante el plazo de retención configurable (por defecto, el que defina el cliente con su aviso de privacidad) y se pueden consultar y exportar con el contrato.
- Cargo por gasolina si se devuelve con faltante respecto a la salida.
- Liquidación automática: renta base, retraso, km excedente, otros cargos y bonificaciones, con total y saldo (total menos anticipo).
- Odómetro dañado por culpa del cliente: se cobra por día (cláusula 16.ª).
- El contrato pasa a recibido y, al liquidar el saldo y aplicar o devolver el depósito, a concluido.
- **Mockup:** pantallas 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`); M4 Recepción: comparar fotos (celular) (`spec-kit/input/mockups/previews/m4-movil-recepcion-comparar.html`).
```

---

## RF-22 — Contratos rezagados

### S-22 — Contratos rezagados

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-22** **para** cumplir el requisito funcional.
- **RF:** RF-22
- **Criterios de aceptación (checklist):**
  - [ ] Pasada la hora de entrada prevista sin devolución, el contrato pasa a rezagado y aparece en el tablero.
  - [ ] Se muestra el cargo acumulado por retraso en tiempo real.
  - [ ] Se avisa al operador; el aviso al cliente queda fuera del MVP.
  - [ ] **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-22)

```text
**Prioridad:** Should
- Pasada la hora de entrada prevista sin devolución, el contrato pasa a rezagado y aparece en el tablero.
- Se muestra el cargo acumulado por retraso en tiempo real.
- Se avisa al operador; el aviso al cliente queda fuera del MVP.
- **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).
```

---

## RF-23 — Incidentes

### S-23 — Incidentes

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-23** **para** cumplir el requisito funcional.
- **RF:** RF-23
- **Criterios de aceptación (checklist):**
  - [ ] Registro de accidente, robo, falla mecánica, pérdida de llaves o retención indebida, con fecha y hora del hecho y del aviso.
  - [ ] Se marca como tardío un aviso dado después del mismo día del hecho (cláusula 12.ª).
  - [ ] Evidencias, avalúo, cargos al cliente y datos de la aseguradora.
  - [ ] Registro de la unidad sustituta y de la bonificación de tiempo en fallas no imputables (cláusula 17.ª).
  - [ ] Un contrato con incidente abierto pasa a "en incidente" y no puede concluirse hasta cerrarlo.
  - [ ] **Mockup:** pantallas 12 Registrar incidente (`spec-kit/input/mockups/previews/12-incidente.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-23)

```text
**Prioridad:** Should
- Registro de accidente, robo, falla mecánica, pérdida de llaves o retención indebida, con fecha y hora del hecho y del aviso.
- Se marca como tardío un aviso dado después del mismo día del hecho (cláusula 12.ª).
- Evidencias, avalúo, cargos al cliente y datos de la aseguradora.
- Registro de la unidad sustituta y de la bonificación de tiempo en fallas no imputables (cláusula 17.ª).
- Un contrato con incidente abierto pasa a "en incidente" y no puede concluirse hasta cerrarlo.
- **Mockup:** pantallas 12 Registrar incidente (`spec-kit/input/mockups/previews/12-incidente.html`).
```

---

## RF-24 — Renovación y extensión

### S-24 — Renovación y extensión

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-24** **para** cumplir el requisito funcional.
- **RF:** RF-24
- **Criterios de aceptación (checklist):**
  - [ ] No hay prórroga tácita (cláusula 3.ª): extender una renta crea un contrato nuevo ligado al anterior.
  - [ ] El nuevo contrato copia cliente, vehículo y conductores, y se valida de nuevo la disponibilidad y la licencia.
  - [ ] **Mockup:** pantallas 13 Renovar contrato (`spec-kit/input/mockups/previews/13-renovar.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-24)

```text
**Prioridad:** Should
- No hay prórroga tácita (cláusula 3.ª): extender una renta crea un contrato nuevo ligado al anterior.
- El nuevo contrato copia cliente, vehículo y conductores, y se valida de nuevo la disponibilidad y la licencia.
- **Mockup:** pantallas 13 Renovar contrato (`spec-kit/input/mockups/previews/13-renovar.html`).
```

---

## RF-25 — Cancelación

### S-25 — Cancelación

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-25** **para** cumplir el requisito funcional.
- **RF:** RF-25
- **Criterios de aceptación (checklist):**
  - [ ] Cancelación con penalización: 20 % del total, o el total si se solicita con 24 horas o menos de anticipación a la salida (regla configurable).
  - [ ] Registra motivo, usuario y cargo; libera el vehículo para otras fechas.
  - [ ] Un contrato vigente no puede cancelarse; se concluye por recepción.
  - [ ] **Mockup:** pantallas 14 Cancelar contrato (`spec-kit/input/mockups/previews/14-cancelar.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-25)

```text
**Prioridad:** Should
- Cancelación con penalización: 20 % del total, o el total si se solicita con 24 horas o menos de anticipación a la salida (regla configurable).
- Registra motivo, usuario y cargo; libera el vehículo para otras fechas.
- Un contrato vigente no puede cancelarse; se concluye por recepción.
- **Mockup:** pantallas 14 Cancelar contrato (`spec-kit/input/mockups/previews/14-cancelar.html`).
```

---

## RF-26 — Pagaré

### S-26 — Pagaré

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-26** **para** cumplir el requisito funcional.
- **RF:** RF-26
- **Criterios de aceptación (checklist):**
  - [ ] Pagaré opcional con monto, fecha, ciudad, interés mensual, nombre y domicilio del suscriptor.
  - [ ] Se incluye en el PDF solo cuando el operador lo activa y requiere firma.
  - [ ] **Mockup:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-26)

```text
**Prioridad:** Could
- Pagaré opcional con monto, fecha, ciudad, interés mensual, nombre y domicilio del suscriptor.
- Se incluye en el PDF solo cuando el operador lo activa y requiere firma.
- **Mockup:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`).
```

---

## RF-27 — Exportación de históricos

### S-27 — Exportación de históricos

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-27** **para** cumplir el requisito funcional.
- **RF:** RF-27
- **Criterios de aceptación (checklist):**
  - [ ] Exportación a CSV de clientes, vehículos, contratos y documentos, con filtros por fechas y estado.
  - [ ] Solo administrador y titular; cada exportación queda en la bitácora.
  - [ ] **Mockup:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-27)

```text
**Prioridad:** Should
- Exportación a CSV de clientes, vehículos, contratos y documentos, con filtros por fechas y estado.
- Solo administrador y titular; cada exportación queda en la bitácora.
- **Mockup:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).
```

---

## RF-28 — Privacidad y datos personales

### S-28 — Privacidad y datos personales

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-28** **para** cumplir el requisito funcional.
- **RF:** RF-28
- **Criterios de aceptación (checklist):**
  - [ ] Aviso de privacidad visible y aceptado por el cliente en el alta, con fecha y versión del texto.
  - [ ] Política de retención configurable para documentos de identidad.
  - [ ] Eliminación o anonimización de datos de un cliente a solicitud (derechos ARCO), conservando la información contractual obligatoria.
  - [ ] Datos y archivos sensibles cifrados en tránsito y en reposo.
  - [ ] **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`). Falta dibujar la política de retención.
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-28)

```text
**Prioridad:** Must
- Aviso de privacidad visible y aceptado por el cliente en el alta, con fecha y versión del texto.
- Política de retención configurable para documentos de identidad.
- Eliminación o anonimización de datos de un cliente a solicitud (derechos ARCO), conservando la información contractual obligatoria.
- Datos y archivos sensibles cifrados en tránsito y en reposo.
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`). Falta dibujar la política de retención.
```

---

## RF-29 — Preparación para integración futura

### S-29 — Preparación para integración futura

- **Como** parte de los roles definidos en el PRD **quiero** el comportamiento descrito en **RF-29** **para** cumplir el requisito funcional.
- **RF:** RF-29
- **Criterios de aceptación (checklist):**
  - [ ] Cada cliente y contrato tiene un campo vacío `ghl_contact_id` y un identificador externo.
  - [ ] Una tabla de eventos (`outbox`) registra reserva creada, contrato firmado, vehículo entregado, contrato rezagado y contrato concluido, sin enviarlos a ningún servicio en el MVP.
  - [ ] **Mockup:** sin interfaz (preparación interna: campo `ghl_contact_id` y tabla de eventos).
- **Dependencias:** orden lógico respecto a otros RF (ver PRD); integraciones listadas en §8 si aplica.
- **Owner sugerido:** frontend, backend
- **Notas técnicas:** tablas Supabase, RLS, RPC y Edge Functions según PRD §7–8.

#### Extracto PRD (RF-29)

```text
**Prioridad:** Could
- Cada cliente y contrato tiene un campo vacío `ghl_contact_id` y un identificador externo.
- Una tabla de eventos (`outbox`) registra reserva creada, contrato firmado, vehículo entregado, contrato rezagado y contrato concluido, sin enviarlos a ningún servicio en el MVP.
- **Mockup:** sin interfaz (preparación interna: campo `ghl_contact_id` y tabla de eventos).
```

---
