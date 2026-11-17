# Etapa Dos Post-MVP: Operación Real en Mostrador, Experiencia de Usuario y Reservaciones
**México Renta de Autos (Mexicali, B.C.)**

---

## 1. Justificación y Objetivos de la Etapa Dos

El MVP (Sprints 1 al 12) construyó exitosamente las bases algorítmicas, el modelo de datos relacional en centavos enteros, los contratos de API y las pantallas clave de administración y mostrador.

Sin embargo, para llevar la plataforma a un uso real diario en el mostrador físico de Mexicali, es indispensable superar las limitaciones identificadas en la experiencia de usuario, interacción táctil, flujos de reservación e infraestructura en la nube:

1. **Flujo Integral de Reservación de Vehículos:** Poder seleccionar fechas en un calendario, visualizar la flota disponible en tiempo real, cotizar con las tarifas del catálogo, apartar el vehículo con anticipo y convertir la reserva en contrato formal al momento de la entrega en mostrador.
2. **Controles de Fecha y Hora Especializados (Date & Time Pickers):** Reemplazar los campos de texto plano por selectores de calendario visual interactivo con restricciones mínimas, cálculo automático de días/horas y validaciones de horario operativo.
3. **Sistema Visual e Iconografía Integral (Lucide React Icons):** Incorporar iconografía semántica en toda la aplicación (barra de navegación, pasos de wizards, tablas, chips de estado, alertas y acciones) para que el operador y el cliente deduzcan intuitivamente cada acción.
4. **Diseño 100% Responsivo (Mobile & Tablet First):** La aplicación debe operar sin fricción tanto en tabletas de mostrador (10"-12") como en celulares de operadores en patio (Android/iOS), con navegación táctil, menús colapsables/inferiores y áreas táctiles de mínimo 44px.
5. **Acciones de Cancelación, Retorno y Deshacer:** Toda operación (alta de cliente, edición de vehículo, emisión de contrato, registro de inspección) debe contar con botones explícitos de "Cancelar", "Volver" y diálogos de confirmación antes de descartar cambios.
6. **Infraestructura de Producción Real:** Conectar Supabase Auth (login y roles reales), Supabase Storage (subida real de fotos y compresión WebP en cliente), generación de PDFs legales con código QR y sello SHA-256, y conexión activa a Supabase Postgres en Vercel.

---

## 2. Nuevos Requisitos Funcionales y de UX (RF-30 a RF-38)

### RF-30 — Flujo Completo de Reservaciones de Flota
- Calendario visual interactivo de disponibilidad de flota por categoría y vehículo específico.
- Proceso guiado en 3 pasos:
  1. *Selección de fechas y categoría/vehículo:* Fechas de inicio/fin, visualización de disponibilidad sin solapamiento (aprovechando la restricción Postgres).
  2. *Cotización en tiempo real:* Cálculo de días, tarifa base, seguro, kilometraje incluido y anticipo/depósito requerido.
  3. *Datos del cliente y confirmación:* Vinculación con cliente existente o alta rápida; generación de folio de reserva (`R-00001`), voucher de confirmación y opción para convertir directamente a contrato (`D-00001`) al entregar el auto.

### RF-31 — Selectores de Fecha y Hora Interactivos (Calendar & Time Picker)
- Selector de fecha visual en español (calendario mensual interactivo con selección de rangos).
- Selector de hora con intervalos de 30 minutos (respetando horarios de oficina y cálculo de horario nocturno de 20:00 a 08:00).
- Deshabilitación automática de fechas pasadas y cálculo dinámico de duración exacta (días y horas de tolerancia).

### RF-32 — Sistema de Iconografía Semántica (Lucide React Icons)
- Integración global de iconografía coherente en:
  - Navegación principal y secundaria (tablero, contratos, reservaciones, clientes, flota, alertas, configuración).
  - Indicadores de estado de contratos (Borrador, Activo, Concluido, Cancelado, Rezagado).
  - Niveles de gasolina (ícono de tanque con niveles 1/8 a 8/8) y odómetro.
  - Acciones rápidas (Imprimir, Descargar PDF, Ver Evidencias, Firmar, Cancelar, Editar, Eliminar).

### RF-33 — Adaptabilidad y Responsividad Total (Mobile & Tablet First)
- Barra de navegación adaptable: Menú lateral fijo en escritorio, barra inferior táctil (*Bottom Navigation Bar*) en móviles y barra compacta colapsable en tabletas.
- Formulario de inspección de 6 fotos adaptado para captura directa con cámara de celular/tableta en patio con previsualización inmediata.
- Grid de flota y tablas de contratos convertibles a tarjetas táctiles en pantallas pequeñas (< 768px).

### RF-34 — Control de Cancelación, Descarte y Diálogos de Confirmación
- Toda pantalla de formulario (alta de cliente, edición, creación de contrato) incluye botones claros de acción secundaria: "Cancelar" y "Descartar cambios".
- Modal de advertencia ("¿Deseas descartar los cambios no guardados?") al intentar navegar fuera con campos modificados.
- Capacidad de cancelar contratos en estado `borrador` o reservaciones pendientes con liberación inmediata de la unidad.

### RF-35 — Autenticación Real y Gestión de Sesiones (Supabase Auth)
- Pantalla de inicio de sesión institucional con correo y contraseña.
- Middleware de Next.js para protección estricta de rutas y redirección a login si la sesión caduca.
- Persistencia de sesión segura en cookies HTTP-only (`@supabase/ssr`).
- Cierre de sesión seguro y bitácora de auditoría en cada evento de login/logout.

### RF-36 — Subida Real de Evidencias a Supabase Storage con WebP
- Almacenamiento directo en buckets privados: `licencias`, `identificaciones`, `evidencias-entrega`, `evidencias-recepcion`.
- Compresión y redimensionamiento automático en cliente mediante Canvas/Web Worker (WebP, máx 1200px, < 350 KB) para optimizar ancho de banda.
- Generación de URLs firmadas de lectura con expiración de 15 minutos y registro de auditoría.

### RF-37 — Motor Nativo de Generación de PDF Legal y Sellado SHA-256
- Generador de PDF en servidor con diseño idéntico al contrato oficial de Mexicali (contrato de referencia 08160).
- Inserción de firmas electrónicas capturadas en canvas.
- Código QR impreso con URL pública de verificación de autenticidad (`/validar/[folio]`).
- Cálculo de huella digital criptográfica SHA-256 almacenada en base de datos e incrustada en el PDF.

### RF-38 — Integración de Comunicaciones y CRM (WhatsApp + Resend + GHL)
- Envío automático de confirmación de reserva y contrato en PDF por correo electrónico (Resend).
- Notificaciones automáticas de WhatsApp al cliente (confirmación de renta y recordatorio de devolución 24 horas y 2 horas antes).
- Worker programado para procesar la cola `outbox` y sincronizar contactos y oportunidades con GoHighLevel.

---

## 3. Hoja de Ruta de Sprints: Fase 2 (Sprints 13 al 18)

| Sprint | Nombre | Enfoque Principal | Requisitos |
| :---: | :--- | :--- | :--- |
| **13** | **UX Móvil, Iconografía y Cancelaciones** | Diseño 100% responsivo, barra inferior táctil, Lucide Icons global, botones Cancelar/Volver y modales de confirmación | RF-32, RF-33, RF-34 |
| **14** | **Flujo Integral de Reservaciones y DatePicker** | Calendario visual mensual, selector de fecha/hora interactivo, creación de reserva `R-00001`, cotización en vivo y conversión a contrato | RF-30, RF-31 |
| **15** | **Autenticación Real y Sesiones con Supabase Auth** | Login institucional, middleware de rutas protegidas, cookies seguras HTTP-only, roles reales y bitácora de accesos | RF-35 |
| **16** | **Subida Real de Fotos a Storage y Compresión WebP** | Buckets privados en Supabase Storage, compresión WebP en cliente, URLs firmadas de 15 min y captura móvil en patio | RF-36 |
| **17** | **Motor de PDF Legal Oficial, QR y Sello SHA-256** | Generación de PDF legal idéntico al contrato 08160, firmas incrustadas, código QR de verificación y sellado criptográfico | RF-37 |
| **18** | **Integraciones Externas (WhatsApp, Resend y Worker GHL)** | Notificaciones automáticas por WhatsApp, envío de contrato por correo vía Resend y worker de procesamiento outbox hacia GHL | RF-38 |

---

## 4. Estándares Técnicos Innegociables
- Dinero siempre en centavos enteros (`bigint`).
- Nunca almacenar números completos de tarjeta de crédito/débito (PAN).
- Base de datos relacional Postgres con RLS e integridad estricta como autoridad final.
- Bitácora de auditoría inmutable de solo lectura/inserción (`auditoria`).
- Interfaz en español neutro para mostrador de Mexicali, B.C., con zona horaria `America/Tijuana`.
