---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:05:00Z'
agent_roles: 'engineering-backend-architect + engineering-software-architect'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Data model — Contratos digitales de México Renta de Autos (MVP)

Base de datos **Supabase Postgres**; migraciones con **Drizzle**. Convenciones:

- Claves primarias `uuid` (`gen_random_uuid()`). Folios y números legibles aparte (secuencias).
- **Dinero en centavos enteros** (`bigint`), nunca decimales. Moneda MXN.
- Fechas y horas `timestamptz` en UTC; la interfaz muestra America/Tijuana.
- Todas las tablas llevan `created_at`, `updated_at`, `created_by`. Las entidades de negocio usan **eliminación lógica** (`deleted_at`).
- Enums nativos de Postgres para estados y tipos.
- Seguridad a nivel de fila (RLS) activada en todas las tablas; el acceso por rol se valida también en el servidor.

## 1. Enums

| Enum | Valores |
|---|---|
| `rol_usuario` | `operador`, `administrador`, `titular` |
| `estado_contrato` | `borrador`, `por_firmar`, `vigente`, `por_vencer`, `rezagado`, `recibido`, `concluido`, `cancelado`, `en_incidente` |
| `tipo_documento` | `credencial`, `licencia`, `tarjeta_circulacion`, `poliza`, `constancia_fiscal`, `permiso_salida_pais`, `otro` |
| `estado_vehiculo` | `disponible`, `rentado`, `mantenimiento`, `baja` |
| `tipo_garantia` | `efectivo`, `tarjeta_credito`, `visa_laser` |
| `forma_pago` | `efectivo`, `tarjeta_debito`, `tarjeta_credito`, `transferencia_deposito` |
| `angulo_evidencia` | `frente`, `atras`, `izquierda`, `derecha`, `tablero_km`, `interior`, `video`, `otro` |
| `tipo_pago` | `anticipo`, `deposito_garantia`, `pago_saldo`, `devolucion_deposito`, `aplicacion_deposito` |
| `momento_evidencia` | `entrega`, `recepcion`, `incidente` |
| `tipo_incidente` | `accidente`, `robo`, `falla_mecanica`, `perdida_llaves`, `retencion_indebida`, `otro` |
| `estado_alerta` | `pendiente`, `enviada`, `atendida`, `error` |
| `tipo_cargo` | `renta_base`, `retraso`, `km_excedente`, `seguro_nocturno`, `gasolina`, `limpieza`, `quemaduras`, `multa`, `traslado`, `penalizacion`, `pena_convencional`, `cuota_proteccion`, `faltante`, `otro`, `bonificacion` |

## 2. Tablas

### `usuarios`
Perfil de aplicación ligado a `auth.users` de Supabase.

| Columna | Tipo | Reglas |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `nombre` | text | obligatorio |
| `correo` | citext | único |
| `rol` | rol_usuario | obligatorio |
| `activo` | boolean | por defecto `true`; un usuario desactivado conserva su autoría |

### `clientes`
| Columna | Tipo | Reglas |
|---|---|---|
| `id` | uuid PK | |
| `numero_cliente` | integer | único; secuencia `seq_numero_cliente`; no editable |
| `nombre_completo` | text | obligatorio |
| `identificacion_numero` | text | obligatorio; índice para detección de duplicados |
| `domicilio`, `ciudad`, `estado` | text | |
| `telefono`, `celular` | text | al menos uno obligatorio |
| `correo` | citext | para envío de contrato |
| `requiere_factura` | boolean | por defecto `false` |
| `razon_social`, `rfc`, `domicilio_fiscal`, `regimen_fiscal` | text | obligatorios si `requiere_factura`; `rfc` con CHECK de formato |
| `aviso_privacidad_version`, `aviso_privacidad_aceptado_en` | text, timestamptz | RF-28 |
| `ghl_contact_id` | text | nulo en el MVP (RF-29) |
| `deleted_at` | timestamptz | eliminación lógica / anonimización |

### `vehiculos`
| Columna | Tipo | Reglas |
|---|---|---|
| `id` | uuid PK | |
| `clave_auto` | integer | único; secuencia `seq_clave_auto` |
| `marca`, `modelo`, `tipo`, `color` | text | |
| `placas` | text | único entre no eliminados |
| `kilometraje_actual` | integer | CHECK `>= 0`; solo crece salvo corrección de administrador (auditada) |
| `valor_asegurado` | bigint | centavos |
| `estado` | estado_vehiculo | |
| `categoria_tarifa_id` | uuid FK → `tarifas` | |
| `observaciones` | text | |

### `documentos`
Repositorio de documentos oficiales, ligados a un cliente o a un vehículo.

| Columna | Tipo | Reglas |
|---|---|---|
| `id` | uuid PK | |
| `tipo` | tipo_documento | |
| `cliente_id` | uuid FK nulo | |
| `vehiculo_id` | uuid FK nulo | CHECK: exactamente uno de `cliente_id` / `vehiculo_id` (salvo `permiso_salida_pais`, que apunta a un contrato) |
| `contrato_id` | uuid FK nulo | solo para `permiso_salida_pais` |
| `numero` | text | número de licencia, credencial, póliza |
| `tipo_licencia` | text | p. ej. "A" |
| `expedido_en` | text | lugar de expedición |
| `fecha_expedicion`, `fecha_vencimiento` | date | `fecha_vencimiento` indexada para las alertas |
| `aseguradora`, `agente`, `agente_contacto` | text | para pólizas |
| `archivos` | jsonb | lista de rutas en Storage (frente, reverso, PDF); nunca URLs públicas |
| `vigente` | boolean generada | `fecha_vencimiento >= current_date` |
| `observaciones` | text | |

### `tarifas`
Catálogo editable por el administrador (RF-03).

| Columna | Tipo | Reglas |
|---|---|---|
| `id` | uuid PK | |
| `nombre` | text | categoría o unidad |
| `tarifa_dia` | bigint | centavos; CHECK `> 0` |
| `seguro_nocturno` | bigint | centavos; entre $400 y $1,000 |
| `cuota_proteccion` | bigint | centavos |
| `vigente_desde` | timestamptz | los cambios crean una fila nueva; no se reescribe el historial |

### `parametros`
Clave-valor tipado para reglas ambiguas (RF-03). Cada cambio queda en la bitácora.

| Clave | Valor por defecto |
|---|---|
| `km_por_dia` | 500 |
| `divisor_hora_extra` | 8 |
| `hora_desde_la_que_se_cobra_dia` | 5 |
| `tolerancia_minutos` | 0 |
| `deducible_pct` / `deducible_cristales_pct` | 30 / 20 |
| `cancelacion_pct` / `cancelacion_horas_total` | 20 / 24 |
| `dias_alerta_vigencia` | `[30,15,7,0]` |
| `inactividad_sesion_min` | 30 |
| `profeco_registro_numero`, `profeco_registro_fecha`, `jurisdiccion_ciudad`, `telefono_fallas` | vacíos hasta que el cliente los confirme |

### `contratos`
| Columna | Tipo | Reglas |
|---|---|---|
| `id` | uuid PK | |
| `folio` | text | único; formato `D-` más número de 5 dígitos (`D-00001`) generado con la secuencia `seq_folio_contrato`, que inicia en 1; **serie propia, distinta de los folios preimpresos** (los de papel no son consecutivos y llegan al menos a 09834); se asigna solo al emitir; no reutilizable |
| `folio_papel` | text | opcional; número del talonario preimpreso si el operador también llena la copia en papel durante la transición |
| `estado` | estado_contrato | transiciones validadas por trigger |
| `cliente_id`, `vehiculo_id` | uuid FK | obligatorios |
| `vehiculo2_id` | uuid FK nulo | segundo auto (RF-15) |
| `contrato_origen_id` | uuid FK nulo | renovación (RF-24) |
| `destino` | text | |
| `salida_en`, `entrada_prevista_en`, `entrada_real_en` | timestamptz | CHECK `entrada_prevista_en > salida_en` |
| `lugar_devolucion` | text | por defecto la sucursal |
| `salida_pais_autorizada` | boolean | por defecto `false`; si `true`, requiere un documento `permiso_salida_pais` |
| `referencia_nombre`, `referencia_telefono`, `referencia_celular` | text | |
| `facturar_a_nombre`, `facturar_a_rfc` | text | opcionales; «Facturar a» es del contrato y puede ser distinto del arrendatario (contrato 08357); `rfc` con CHECK de formato |
| `km_salida`, `km_entrada` | integer | CHECK `km_entrada >= km_salida` |
| `km_por_dia` | integer | copia del parámetro al emitir |
| `gasolina_salida`, `gasolina_entrada` | smallint | octavos, 0 a 8 |
| `odometro_danado` | boolean | cláusula 16.ª |
| `tarifa_dia`, `tarifa_hora_extra`, `tarifa_km_extra`, `seguro_nocturno` | bigint | **copia al emitir**; los cambios posteriores del catálogo no la alteran |
| `tarifa_km_sobrescrita`, `tarifa_km_nota` | bigint, text | si el operador la cambia, la nota es obligatoria |
| `tarifa_catalogo_dia`, `tarifa_motivo` | bigint, text | tarifa del catálogo al emitir y motivo de la diferencia; el motivo es obligatorio si `tarifa_dia` es distinta del catálogo (las rentas reales varían: $1,470, $1,512, $1,633, $2,216) |
| `dias` | integer | calculado |
| `anticipo` | bigint | = renta base al emitir |
| `deducible_accidente_pct`, `deducible_robo_pct`, `valor_auto_asegurado` | numeric, bigint | copia al emitir |
| `observaciones` | text | |
| `pdf_contrato_path`, `pdf_reglamento_path`, `pdf_hash` | text | PDF inmutable una vez firmado |
| `firma_arrendatario_path`, `firmado_en`, `firmado_por`, `firma_dispositivo` | text, timestamptz, uuid, text | RF-18 |
| `rango` | tstzrange generada | `[salida_en, entrada_prevista_en)`; base de la exclusión |
| `ghl_contact_id`, `ghl_opportunity_id` | text | nulos en el MVP |
| `emitido_en`, `concluido_en`, `cancelado_en` | timestamptz | |

**Restricción de exclusión (RF-09):** `EXCLUDE USING gist (vehiculo_id WITH =, rango WITH &&) WHERE (estado NOT IN ('borrador','cancelado','concluido'))` con la extensión `btree_gist`. El mismo criterio se aplica a `vehiculo2_id` mediante trigger.

### `contrato_conductores`
`contrato_id`, `nombre`, `domicilio`, `ciudad_estado`, `telefono`, `licencia_numero`, `licencia_vencimiento` (CHECK vigente en el periodo, validado por trigger), `firma_path`.

### `contrato_cargos`
Una fila por línea de cargo; la suma es el total.

| Columna | Tipo | Reglas |
|---|---|---|
| `contrato_id` | uuid FK | |
| `tipo` | tipo_cargo | |
| `concepto` | text | |
| `monto` | bigint | centavos; **negativo** para bonificaciones |
| `momento` | text | `emision` o `liquidacion` |

### `pagos`
| Columna | Tipo | Reglas |
|---|---|---|
| `contrato_id` | uuid FK | |
| `tipo` | tipo_pago | |
| `monto` | bigint | centavos |
| `garantia_tipo` | tipo_garantia | solo para depósito |
| `forma` | forma_pago | obligatoria; **un anticipo puede tener varias filas con formas distintas** (p. ej. $4,399 en efectivo y $500 por transferencia); la suma de los anticipos debe cubrir la renta base antes de pasar a `vigente` |
| `referencia` | text | opcional; folio de la transferencia o autorización; nunca un número de tarjeta |
| `tarjeta_ultimos4` | char(4) | **nunca el número completo** |
| `recibido_por` | uuid FK | |
| `recibo_numero` | integer | secuencia; imprimible (cláusula 8.ª) |

### `evidencias`
`contrato_id`, `momento`, `tipo` (`foto` / `video`), `angulo` (angulo_evidencia), `path` en Storage, `tamano_bytes`, `sha256`, `dispositivo`, `nota`, `tomada_en`, `subida_por`, `km_capturado` (entero; obligatorio en el ángulo `tablero_km` y igual al km guardado en el contrato).

**Reglas:** sin `UPDATE` ni `DELETE` (una repetición se agrega como fila nueva y la anterior queda); una entrega o recepción solo se completa si existen los seis ángulos (`frente`, `atras`, `izquierda`, `derecha`, `tablero_km`, `interior`) en ese momento, salvo autorización de un administrador con nota (`fn_validar_evidencias_completas()`). La comparación entrega contra recepción se resuelve con una consulta por `angulo`.

### `inventario_contrato`
Una fila por contrato y momento (`entrega` / `recepcion`): casillas `refacciones`, `gato`, `herramienta`, `reflejantes`, `tapetes`, `radio`, `bocinas`, `cinturones`, `placas`, `antena` (boolean) y `danos` (jsonb: lista de `{vista, x, y, nota}` sobre las 4 vistas del diagrama).

### `incidentes`
`contrato_id`, `vehiculo_id`, `tipo`, `ocurrido_en`, `avisado_en`, `aviso_tardio` (generada: `avisado_en::date > ocurrido_en::date`), `descripcion`, `avaluo`, `cargo_cliente`, `aseguradora_referencia`, `unidad_sustituta_id`, `bonificacion`, `cerrado_en`.

### `bloqueos_vehiculo`
`vehiculo_id`, `rango tstzrange`, `motivo` (mantenimiento u otro); exclusión contra `contratos.rango` mediante trigger.

### `pagares`
`contrato_id`, `monto`, `fecha`, `ciudad`, `interes_mensual_pct`, `suscriptor_nombre`, `suscriptor_domicilio`, `firma_path`; opcional (RF-26).

### `alertas`
`documento_id`, `dias_antes`, `fecha_vencimiento`, `destinatario`, `estado`, `enviada_en`, `error`; única por `(documento_id, dias_antes, fecha_vencimiento)` para que el proceso diario sea idempotente.

### `auditoria` (solo agregado)
| Columna | Tipo | Reglas |
|---|---|---|
| `id` | bigserial PK | |
| `ocurrido_en` | timestamptz | |
| `usuario_id` | uuid | nulo para procesos del sistema |
| `accion` | text | `INSERT`, `UPDATE`, `DELETE`, `SELECT_SENSIBLE`, `EXPORT` |
| `tabla`, `registro_id` | text, uuid | |
| `valor_anterior`, `valor_nuevo` | jsonb | |

Se llena con triggers en todas las tablas de negocio. Sin permisos `UPDATE`/`DELETE` para ningún rol, incluido el de servicio de la aplicación.

### `outbox`
`id`, `evento` (`reserva_creada`, `contrato_firmado`, `vehiculo_entregado`, `contrato_rezagado`, `contrato_concluido`), `payload` jsonb, `creado_en`, `procesado_en` nulo. Sin consumidor en el MVP (RF-29).

## 3. Relaciones

```
usuarios 1──N auditoria
clientes 1──N documentos 
clientes 1──N contratos N──1 vehiculos 1──N documentos
vehiculos 1──N bloqueos_vehiculo
contratos 1──N contrato_conductores
contratos 1──N contrato_cargos
contratos 1──N pagos
contratos 1──N evidencias
contratos 1──2 inventario_contrato (entrega, recepcion)
contratos 1──N incidentes
contratos 1──0..1 pagares
contratos 0..1──1 contratos (contrato_origen_id)
documentos 1──N alertas
tarifas 1──N vehiculos
```

## 4. Secuencias y funciones

- `seq_folio_contrato`: inicia en 1 y produce el folio `D-00001`, `D-00002`, etc. Se consume al pasar de `borrador` a `por_firmar` dentro de la misma transacción; un folio nunca se reasigna. La serie `D-` evita choques con los folios de papel (08160 a 09834 y más).
- `seq_numero_cliente`, `seq_clave_auto`, `seq_recibo`.
- `fn_validar_transicion_estado()`: trigger `BEFORE UPDATE` en `contratos` con la tabla de transiciones permitidas:

| Desde | Hacia |
|---|---|
| `borrador` | `por_firmar`, `cancelado` |
| `por_firmar` | `vigente`, `cancelado`, `borrador` |
| `vigente` | `por_vencer`, `rezagado`, `recibido`, `en_incidente` |
| `por_vencer` | `rezagado`, `recibido`, `en_incidente` |
| `rezagado` | `recibido`, `en_incidente` |
| `en_incidente` | `vigente`, `rezagado`, `recibido` |
| `recibido` | `concluido` |
| `concluido`, `cancelado` | (final) |

- `fn_validar_licencia_periodo()`: impide emitir un contrato si **ningún conductor** (el arrendatario o un conductor adicional) tiene una licencia vigente hasta `entrada_prevista_en`. El arrendatario puede no tener licencia si conduce un adicional (contrato 08590).
- `fn_validar_documentos_vehiculo()`: impide asignar un vehículo con tarjeta o póliza vencida.
- `fn_auditar()`: función genérica de bitácora para triggers.

## 5. Almacenamiento de archivos

Buckets privados de Supabase Storage: `documentos`, `evidencias`, `contratos`, `firmas`. Ruta: `{bucket}/{entidad}/{id}/{timestamp}-{nombre}`. Acceso exclusivo mediante URL firmada de corta duración generada en el servidor; cada acceso a `documentos` registra una entrada `SELECT_SENSIBLE` en la bitácora.

## 6. Índices principales

`clientes(identificacion_numero)`, `clientes(lower(nombre_completo) gin_trgm_ops)`, `documentos(fecha_vencimiento)`, `contratos(estado)`, `contratos(cliente_id)`, `contratos(vehiculo_id)`, `contratos` GiST sobre `(vehiculo_id, rango)`, `auditoria(tabla, registro_id)`, `auditoria(ocurrido_en)`.

## 7. Datos semilla

Parámetros por defecto, usuario administrador inicial, secuencias y un catálogo de tarifas de ejemplo con el caso de referencia del contrato 08160 ($1,633, seguro nocturno de $400) para pruebas.
