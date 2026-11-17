---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:40:38.633Z'
agent_roles: 'product-manager + engineering-technical-writer + engineering-software-architect'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---
# PRD — Contratos digitales de México Renta de Autos (MVP)

## Product PRD (input)

---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T03:50:00Z'
agent_roles: 'product-manager + engineering-technical-writer + engineering-software-architect'
vision_command: 'generate_spec_kit (PRD consolidado de entrada)'
source_brief: 'spec-kit/input/brief.md'
---

# PRD de producto — Contratos digitales de México Renta de Autos (MVP)

## 1. Resumen

Aplicación web (PWA) para que el personal de mostrador de México Renta de Autos (Mexicali, B.C.) opere el ciclo completo de renta: clientes, vehículos, documentos con vigencia, contrato prellenado con cálculo automático de tarifas, firma en tableta, entrega y recepción con evidencias, y alertas de vencimiento. Todo auditable. Fuentes: `brief.md` y `refdocs/` (contrato físico No. 08160, reglamento, requisitos de negocio, decisiones técnicas).

## 2. Roles

| Rol | Permisos |
|---|---|
| **Operador** | Crea y edita clientes, vehículos y contratos; entrega y recibe vehículos; captura evidencias; no elimina contratos ni cambia tarifas. |
| **Administrador** | Todo lo del operador, más usuarios, catálogo de tarifas, parámetros, eliminación lógica de contratos y exportaciones. |
| **Titular** | Solo lectura de contratos, historial, alertas y reportes. |

> Matriz de permisos propuesta por defecto; pendiente de validar con el cliente.

## 3. Alcance del MVP

Dentro: clientes, vehículos, documentos y vigencias, contratos de punta a punta, motor de tarifas, firma, PDF, correo, evidencias, roles y auditoría. Fuera: GHL, reservaciones en línea, cobros en línea, CFDI, WhatsApp, mantenimiento de flota, cobro por km como modalidad, migración de contratos en papel.

## 4. Convenciones de negocio

- Dinero en **centavos enteros**; la interfaz muestra pesos mexicanos (MXN).
- Hora local: America/Tijuana. Una renta es por períodos de 24 h.
- Caso de referencia: contrato 08160, 3 días × $1,633 = $4,899 de anticipo; hora extra $204; km extra $3; depósito $8,000.
- Las reglas ambiguas del reglamento viven como **parámetros editables** por el administrador, con su valor por defecto documentado.

## 5. Requisitos funcionales

### RF-01 — Autenticación y roles
**Prioridad:** Must
- Inicio de sesión con correo y contraseña, con segundo factor (MFA) para administrador y titular.
- Tres roles: operador, administrador, titular; permisos aplicados en el servidor, no solo ocultos en pantalla.
- Cierre de sesión por inactividad configurable (por defecto 30 minutos).
- El administrador crea, desactiva y cambia el rol de usuarios; un usuario desactivado conserva su autoría en la bitácora.
- **Mockup:** pantallas 8 Inicio de sesión y verificación (`spec-kit/input/mockups/previews/08-inicio-de-sesion.html`); 17 Administración: usuarios y roles (`spec-kit/input/mockups/previews/17-admin-usuarios-roles.html`).

### RF-02 — Bitácora de auditoría
**Prioridad:** Must
- Cada creación, modificación, eliminación lógica y consulta de contrato o documento registra usuario, fecha y hora, acción, valor anterior y valor nuevo.
- La bitácora es solo de agregado: ningún rol puede editarla ni borrarla.
- Se llena por triggers en la base de datos, no por código de la aplicación, para que no se pueda omitir.
- El titular y el administrador consultan la bitácora filtrando por contrato, usuario y rango de fechas.
- **Mockup:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).

### RF-03 — Catálogo de tarifas y parámetros
**Prioridad:** Must
- El administrador mantiene el catálogo: tarifa por 24 h, seguro nocturno ($400 a $1,000), valor asegurado y cuota de protección por vehículo o categoría.
- Parámetros editables con sus valores por defecto: 500 km por día, divisor de hora extra (8), hora desde la que se cobra un día (5), tolerancia (0), redondeo a peso, deducible (30 % y 20 % en cristales).
- Todo cambio de tarifa o parámetro queda en la bitácora y no altera contratos ya emitidos.
- Cada contrato guarda una copia de las tarifas y parámetros vigentes al emitirse.
- **Mockup:** pantallas 16 Administración: tarifas y parámetros (`spec-kit/input/mockups/previews/16-admin-tarifas-parametros.html`); 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`). Los datos legales pendientes se ven en la 16; la tarifa editable con motivo, en la 3.

### RF-04 — Alta y edición de clientes
**Prioridad:** Must
- Captura de nombre completo, identificación, domicilio, ciudad y estado, teléfono y celular por separado.
- Número de cliente único y automático; no editable.
- Datos fiscales opcionales: razón social, RFC, domicilio fiscal, régimen y constancia de situación fiscal.
- Validación de formato de RFC y de teléfono; detección de posibles duplicados por nombre e identificación.
- Un cliente se registra una sola vez y se reutiliza en todos sus contratos.
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).

### RF-05 — Documentos del cliente (credencial y licencia)
**Prioridad:** Must
- Captura de foto o escaneo de ambos lados de la credencial y de la licencia, con la cámara de la tableta.
- Licencia: número, tipo, lugar de expedición y fecha de vencimiento; credencial: número y vigencia.
- Los archivos se guardan en almacenamiento privado y solo se ven mediante enlaces firmados de corta duración.
- Cada consulta de un documento sensible queda en la bitácora.
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`).

### RF-06 — Búsqueda, historial y exportación de clientes
**Prioridad:** Should
- Búsqueda por nombre, número de cliente, identificación, teléfono y RFC.
- Historial de rentas por cliente, con estado, total y kilómetros recorridos de cada una (kilometraje de entrada menos el de salida; «en curso» si aún no se recibe).
- El historial del vehículo muestra también los kilómetros recorridos por renta y su suma acumulada.
- Exportación a CSV del listado y del historial (solo administrador y titular).
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`); 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`). La búsqueda está en 1 y M1.

### RF-07 — Alta y edición de vehículos
**Prioridad:** Must
- Captura de marca, modelo, tipo y color, placas, kilometraje, valor asegurado y observaciones.
- Clave de auto única y automática.
- Estado operativo: disponible, rentado, en mantenimiento o baja.
- El kilometraje actual no puede disminuir salvo por corrección de un administrador, que queda auditada.
- **Mockup:** pantallas 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`); 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`).

### RF-08 — Documentos del vehículo
**Prioridad:** Must
- Tarjeta de circulación (expedición y vigencia) y póliza de seguro (aseguradora, agente, contacto, expedición y vigencia), con imagen o PDF.
- Un vehículo con tarjeta o póliza vencida queda marcado como no rentable y no puede asignarse a un contrato nuevo.
- **Mockup:** pantallas 10 Vehículo: ficha, documentos e historial (`spec-kit/input/mockups/previews/10-vehiculo-ficha.html`); 9 Vehículos: listado (`spec-kit/input/mockups/previews/09-vehiculos-listado.html`). El estado «No rentable» se ve en la 9.

### RF-09 — Disponibilidad y bloqueos
**Prioridad:** Must
- Un vehículo no puede estar en dos contratos cuyas fechas se crucen, incluso si dos operadores lo intentan a la vez; la base de datos lo impide.
- El administrador puede bloquear un vehículo por mantenimiento con fecha de inicio y fin.
- Al elegir fechas en un contrato, la lista de vehículos muestra solo los disponibles y explica por qué no aparece uno (rentado, en mantenimiento o documentos vencidos).
- Las unidades reservadas están sujetas a cambio por una unidad similar (leyenda del formato impreso); el cambio queda registrado.
- **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`).

### RF-10 — Alertas de vigencia
**Prioridad:** Must
- Un proceso diario revisa licencia, credencial, tarjeta de circulación y póliza.
- Se notifica por correo a los 30, 15 y 7 días antes del vencimiento y el día en que vence (días configurables).
- Cada alerta guarda documento, fecha, destinatario y estado (pendiente, enviada, atendida).
- Una alerta se marca atendida automáticamente cuando se sube el documento renovado.
- **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).

### RF-11 — Tablero del operador
**Prioridad:** Should
- Accesos directos a nuevo contrato, entrega, recepción, clientes y vehículos.
- Secciones de documentos próximos a vencer, contratos que vencen hoy y contratos rezagados.
- Funciona en tableta, escritorio y celular sin desplazamiento horizontal; en celular se priorizan las acciones y lo que requiere atención.
- **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`).

### RF-12 — Borrador de contrato y validaciones
**Prioridad:** Must
- Selección de cliente y vehículo existentes; captura de destino, fechas y horas de salida y entrada prevista, lugar de devolución y referencia del cliente.
- Autorización de salida del país: no autorizada por defecto; si es autorizada, requiere adjuntar el permiso escrito.
- Al menos un conductor registrado en el contrato (el arrendatario o un conductor adicional) debe tener licencia vigente durante todo el periodo; si ninguno la tiene, el contrato no avanza. El arrendatario puede no conducir y no tener licencia si un conductor adicional la tiene (caso real del contrato 08590).
- «Facturar a» es un dato del contrato, con nombre y RFC propios, que puede ser distinto del arrendatario (caso real del contrato 08357).
- La salida no puede ser anterior a la emisión, y la entrada prevista debe ser posterior a la salida.
- El borrador puede guardarse incompleto y retomarse; solo un contrato completo pasa a "por firmar".
- **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).

### RF-13 — Folio y estados del contrato
**Prioridad:** Must
- Folio único y no reutilizable, que no se asigna hasta que el contrato se emite. **El folio digital debe usar una serie propia, distinta de los folios preimpresos:** los folios de papel no son consecutivos ni cronológicos (varios talonarios a la vez, ya se llegó a 09834), así que iniciar en 8161 chocaría con contratos de papel existentes. Formato propuesto: `D-00001` (prefijo `D-` y 5 dígitos), que el cliente confirma. El folio del talonario de papel puede registrarse aparte, como campo opcional, durante la transición.
- Estados: borrador, por firmar, vigente, por vencer, rezagado, recibido, concluido, cancelado, en incidente.
- Las transiciones se validan en el servidor (por ejemplo, no se puede pasar de borrador a concluido).
- Cada cambio de estado queda en la bitácora con su autor.
- **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).

### RF-14 — Cálculo automático de tarifas
**Prioridad:** Must
- Días, renta base, anticipo (tarifa × días), hora extra (tarifa ÷ 8 redondeada a peso), km excedente (tarifa ÷ 500 o tarifa pactada), seguro nocturno y total, según el reglamento.
- Desde la 5.ª hora de retraso se cobra un día extra; en seguro nocturno cualquier retraso cobra el día completo.
- El operador puede sobrescribir la tarifa de km por contrato con una nota obligatoria.
- La tarifa de 24 h es un dato **del contrato**: el catálogo propone un valor, pero las rentas reales varían (por ejemplo $1,470, $1,512, $1,633 y $2,216 para modelos y fechas distintos). Cambiarla exige un motivo; quién puede hacerlo y en qué rango se define con el cliente. La hora extra y el km extra se recalculan con la tarifa pactada.
- Las líneas de cargo se guardan una por una (renta, retraso, km, limpieza, multas, traslado, bonificaciones) y suman exactamente el total.
- El cálculo reproduce el contrato 08160 y está cubierto por pruebas automáticas.
- **Mockup:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).

### RF-15 — Conductores adicionales, segundo auto y referencia
**Prioridad:** Should
- De 0 a N conductores adicionales por contrato con nombre, domicilio, teléfono, licencia, vencimiento y firma; su licencia debe estar vigente en el periodo.
- Segundo vehículo opcional con las mismas validaciones de disponibilidad y documentos.
- Referencia del cliente con nombre, teléfono y celular.
- **Mockup:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).

### RF-16 — Anticipo, garantía y pagos
**Prioridad:** Must
- Se registra el anticipo (renta total pagada por adelantado) y el depósito en garantía con tipo: efectivo, tarjeta de crédito o Visa Láser, y monto.
- Un anticipo admite **varios pagos de formas distintas** (efectivo, tarjeta, transferencia o depósito), por ejemplo parte por transferencia y parte en efectivo; la suma debe cubrir la renta total antes de pasar a vigente.
- **El sistema nunca almacena números de tarjeta.**
- Recibo de depósito imprimible con razón social, fecha, importe y firma de quien recibe (cláusula 8.ª).
- Al concluir, el depósito se aplica al saldo o se devuelve, y cada movimiento queda registrado.
- Un contrato no pasa a vigente sin anticipo y depósito registrados.
- **Mockup:** pantallas 4 Contrato: cobro y garantía (`spec-kit/input/mockups/previews/04-contrato-cobro-garantia.html`).

### RF-17 — Generación de PDF del contrato y del reglamento
**Prioridad:** Must
- Contrato de dos caras: carátula con datos, inventario y pagaré opcional, y las 21 cláusulas, prellenado con los datos del contrato.
- Reglamento prellenado y firmable.
- Los PDF se generan sin pasos manuales y se pueden imprimir.
- Cada PDF emitido se conserva con su hash para detectar alteraciones.
- Los datos pendientes del formato (registro PROFECO, ciudad de jurisdicción, teléfono de fallas) son parámetros configurables.
- **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`).

### RF-18 — Firma digital en tableta
**Prioridad:** Must
- Captura de la firma del arrendatario, de los conductores adicionales y del pagaré en un área táctil.
- Se guarda la imagen de la firma, el hash del PDF firmado, fecha, hora, usuario y dispositivo.
- Una vez firmado, el PDF es inmutable; cualquier corrección genera una nueva versión que se vuelve a firmar.
- Alternativa de impresión y firma manuscrita, con escaneo adjunto al expediente.
- **Mockup:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`). No hay versión de celular.

### RF-19 — Entrega del vehículo
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

### RF-20 — Envío del contrato por correo
**Prioridad:** Must
- Tras la entrega, el sistema envía al cliente el contrato firmado y el reglamento en PDF.
- Se registra el resultado del envío; si falla, el operador puede reenviarlo.
- El operador puede cambiar el correo destino antes de enviar.
- **Mockup:** pantallas 6 Entrega del vehículo (`spec-kit/input/mockups/previews/06-entrega.html`). No tiene pantalla propia: el aviso aparece al completar la entrega.

### RF-21 — Recepción del vehículo y liquidación
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

### RF-22 — Contratos rezagados
**Prioridad:** Should
- Pasada la hora de entrada prevista sin devolución, el contrato pasa a rezagado y aparece en el tablero.
- Se muestra el cargo acumulado por retraso en tiempo real.
- Se avisa al operador; el aviso al cliente queda fuera del MVP.
- **Mockup:** pantallas 1 Tablero del operador (`spec-kit/input/mockups/previews/01-tablero.html`); M1 Tablero (celular) (`spec-kit/input/mockups/previews/m1-movil-tablero.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).

### RF-23 — Incidentes
**Prioridad:** Should
- Registro de accidente, robo, falla mecánica, pérdida de llaves o retención indebida, con fecha y hora del hecho y del aviso.
- Se marca como tardío un aviso dado después del mismo día del hecho (cláusula 12.ª).
- Evidencias, avalúo, cargos al cliente y datos de la aseguradora.
- Registro de la unidad sustituta y de la bonificación de tiempo en fallas no imputables (cláusula 17.ª).
- Un contrato con incidente abierto pasa a "en incidente" y no puede concluirse hasta cerrarlo.
- **Mockup:** pantallas 12 Registrar incidente (`spec-kit/input/mockups/previews/12-incidente.html`).

### RF-24 — Renovación y extensión
**Prioridad:** Should
- No hay prórroga tácita (cláusula 3.ª): extender una renta crea un contrato nuevo ligado al anterior.
- El nuevo contrato copia cliente, vehículo y conductores, y se valida de nuevo la disponibilidad y la licencia.
- **Mockup:** pantallas 13 Renovar contrato (`spec-kit/input/mockups/previews/13-renovar.html`).

### RF-25 — Cancelación
**Prioridad:** Should
- Cancelación con penalización: 20 % del total, o el total si se solicita con 24 horas o menos de anticipación a la salida (regla configurable).
- Registra motivo, usuario y cargo; libera el vehículo para otras fechas.
- Un contrato vigente no puede cancelarse; se concluye por recepción.
- **Mockup:** pantallas 14 Cancelar contrato (`spec-kit/input/mockups/previews/14-cancelar.html`).

### RF-26 — Pagaré
**Prioridad:** Could
- Pagaré opcional con monto, fecha, ciudad, interés mensual, nombre y domicilio del suscriptor.
- Se incluye en el PDF solo cuando el operador lo activa y requiere firma.
- **Mockup:** pantallas 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`).

### RF-27 — Exportación de históricos
**Prioridad:** Should
- Exportación a CSV de clientes, vehículos, contratos y documentos, con filtros por fechas y estado.
- Solo administrador y titular; cada exportación queda en la bitácora.
- **Mockup:** pantallas 18 Bitácora y exportaciones (`spec-kit/input/mockups/previews/18-admin-bitacora-exportaciones.html`).

### RF-28 — Privacidad y datos personales
**Prioridad:** Must
- Aviso de privacidad visible y aceptado por el cliente en el alta, con fecha y versión del texto.
- Política de retención configurable para documentos de identidad.
- Eliminación o anonimización de datos de un cliente a solicitud (derechos ARCO), conservando la información contractual obligatoria.
- Datos y archivos sensibles cifrados en tránsito y en reposo.
- **Mockup:** pantallas 2 Cliente: ficha y documentos (`spec-kit/input/mockups/previews/02-cliente.html`). Falta dibujar la política de retención.

### RF-29 — Preparación para integración futura
**Prioridad:** Could
- Cada cliente y contrato tiene un campo vacío `ghl_contact_id` y un identificador externo.
- Una tabla de eventos (`outbox`) registra reserva creada, contrato firmado, vehículo entregado, contrato rezagado y contrato concluido, sin enviarlos a ningún servicio en el MVP.
- **Mockup:** sin interfaz (preparación interna: campo `ghl_contact_id` y tabla de eventos).

## 6. Requisitos no funcionales

- **Dispositivos:** responsive para escritorio y tableta, y **celular soportado** en los flujos de captura y consulta: tablero, nuevo contrato, fotos y kilometraje de entrega y recepción, comparación de fotos y cobro. La firma del contrato y la administración (tarifas, usuarios, bitácora) se piden en tableta o escritorio. Controles táctiles de 44 px o más, flujo simple por pasos y un solo tema visual.
- **Rendimiento:** pantallas de listado en menos de 2 s con 5,000 clientes; generación de PDF en menos de 5 s.
- **Disponibilidad:** horario de mostrador (8:00 a 18:45). Sin modo sin conexión en el MVP.
- **Seguridad:** HTTPS, control de acceso por rol en servidor, enlaces firmados de corta duración, sin números de tarjeta.
- **Auditoría:** bitácora inmutable con valor anterior y nuevo.
- **Accesibilidad:** básica (contraste, tamaños táctiles y etiquetas de formulario).
- **Idioma:** español.
- **Calidad:** el motor de tarifas con pruebas automáticas; las migraciones de base de datos versionadas.

## 7. Decisiones técnicas relevantes

Vercel, Next.js, Supabase Postgres (oeste de EE. UU.), Supabase Auth y Storage, Drizzle, Resend, Vitest. Detalle en `refdocs/decisiones-tecnicas-mvp.md`.

## 8. Supuestos y preguntas abiertas

Supuestos del cálculo por confirmar con el cliente: sin tolerancia al devolver tarde; retrasos de más de 24 h cuentan días completos más horas; cancelación con 24 h o menos cobra el total; los "2 días mínimo" y el 20 % de la cláusula 18.ª no se acumulan; redondeo a peso completo.

Preguntas abiertas: ortografía del titular, registro PROFECO, ciudad de jurisdicción, teléfono de fallas, catálogo de tarifas, monto del depósito, uso real del pagaré, matriz de permisos, volumen y sucursales, validez legal de la firma digital y estilo visual.

## Executive brief

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
