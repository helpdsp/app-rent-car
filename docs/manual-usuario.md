# Manual de Usuario y Guía de Capacitación de Mostrador
## México Renta de Autos (MRA) — Mexicali, B.C.

**Versión:** 1.0 (MVP)  
**Dirigido a:** Operadores de mostrador, Supervisores y Administradores  

---

## 1. Introducción y Acceso al Sistema

El sistema opera como una aplicación web progresiva (PWA) optimizada para tabletas en mostrador (resolución 1194×834 px) y navegadores de escritorio.

- **URL de acceso:** `https://renta-autos-mra.vercel.app/login`
- **Inicio de sesión:** Correo institucional y contraseña.
- **Autenticación reforzada (MFA):** Requerida para administradores y titulares en consultas de datos sensibles o exportaciones.

---

## 2. Ciclo de Vida del Contrato de Renta

### 2.1 Cotización y Registro de Cliente
1. Ir a **Tablero** o **Contratos** y hacer clic en **"Nuevo contrato"**.
2. Buscar cliente por nombre, teléfono o identificación oficial. Si no existe, capturar sus datos:
   - Nombre completo, teléfono, correo y número de identificación oficial (INE/Pasaporte).
   - Licencia de conducir: capturar número y vigencia. *(El sistema rechazará la emisión si la licencia vence durante el periodo de renta).*
3. Seleccionar fechas de salida y devolución prevista.
4. Seleccionar vehículo disponible de la lista (filtrado automáticamente por disponibilidad en tiempo real).

### 2.2 Validación de Tarifas y Emisión
1. El sistema calcula automáticamente la cotización:
   - Días completos de renta (mínimo 1 día).
   - Anticipo requerido.
   - Tarifa de hora extra (1/8 del costo diario truncada/redondeada a pesos).
   - Tarifa de kilómetro extra (1/500 del costo diario).
   - 500 km diarios incluidos acumulables.
2. Si se pacta una tarifa distinta del catálogo, se debe ingresar el motivo obligatorio en el campo correspondiente (queda registrado en auditoría).
3. Hacer clic en **"Emitir contrato"**: el sistema generará el folio digital atómico (ej. `D-00001`).

### 2.3 Cobro de Anticipo y Firma en Tableta
1. Registrar la forma de pago del anticipo (efectivo, transferencia o tarjeta con últimos 4 dígitos). **Nunca registrar el número de tarjeta completo**.
2. Entregar la tableta al cliente en modo firma:
   - El cliente revisa los datos del vehículo y el reglamento de arrendamiento.
   - Plasma su firma digital en el recuadro táctil de al menos 44 px.
   - El sistema sella el contrato generando un PDF inmutable con huella digital SHA-256.

### 2.4 Entrega del Vehículo e Inspección con Fotos
1. Con la tableta, el operador toma las fotos obligatorias del vehículo en los ángulos indicados:
   - `frente`, `atras`, `izquierda`, `derecha`, `tablero_km`, `interior`.
2. Registrar el odómetro exacto y nivel de gasolina de salida (en octavos, ej. 8/8).
3. Completar entrega: el contrato pasa automáticamente a estado **vigente** y se envía copia sellada por correo al cliente.

---

## 3. Recepción y Liquidación del Vehículo

1. Al regreso del cliente, buscar el contrato en **Contratos** y seleccionar **"Registrar recepción"**.
2. Tomar las fotos de recepción en los mismos ángulos para comparación lado a lado.
3. Capturar odómetro de retorno y nivel de gasolina:
   - El sistema calcula si hubo retraso en horas (o día extra a partir de la 5.ª hora).
   - Si el contrato incluía seguro nocturno, cualquier retraso aplica el cobro de día completo.
   - Calcula kilómetros excedentes multiplicados por la tarifa de km extra.
   - Diferencia de gasolina faltante.
4. Se agregan cargos adicionales si aplican (limpieza, grúa, multas) o bonificaciones.
5. Se procede a la devolución o aplicación del depósito en garantía y el contrato concluye liberando el vehículo a **disponible**.

---

## 4. Manejo de Excepciones

- **Incidentes:** Registrar choques, fallas mecánicas o robo en `/contratos/[id]/incidente`. Si el aviso se recibe en día posterior al hecho, se marca como aviso tardío. El contrato pasa a `en_incidente` y no puede cerrarse hasta dictaminarse.
- **Renovación:** Extender la renta en `/contratos/[id]/renovar`. Genera un nuevo contrato vinculado sin prórroga tácita, revalidando licencias y disponibilidad.
- **Cancelación:** En `/contratos/[id]/cancelar`. Aplica 20 % de penalización con más de 24 h de anticipación o 100 % con 24 h o menos. Un contrato con la unidad ya entregada (`vigente`) no se puede cancelar; debe recibirse.

---

## 5. Exportaciones y Bitácora para Administradores

1. Ingresar a **Admin > Bitácora y exportaciones**.
2. Seleccionar la entidad a exportar: **Clientes**, **Vehículos**, **Contratos** o **Documentos**.
3. Seleccionar filtros de estado o fecha y hacer clic en **"Exportar a CSV"**.
4. Cada descarga queda permanentemente auditada en la bitácora inmutable.
