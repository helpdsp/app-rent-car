---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:20:00Z'
agent_roles: 'testing-api-tester + engineering-software-architect + product-manager'
vision_command: 'generate_spec_kit'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Test plan — Contratos digitales de México Renta de Autos (MVP)

## 1. Estrategia

| Nivel | Herramienta | Alcance |
|---|---|---|
| Unitarias | Vitest | Motor de tarifas, validaciones Zod, utilidades; sin red ni BD |
| Integración | Vitest + Postgres efímero | Migraciones, triggers, exclusión de fechas, RLS, casos de uso |
| API | Vitest + `fetch` contra route handlers | Contrato de `api-spec.yaml`, códigos de error, permisos por rol |
| E2E | Playwright (viewport de tableta, escritorio y celular de 390×844) | Flujos completos del operador |
| Visual | Playwright (capturas) contra `spec-kit/input/mockups/png/` | Cada pantalla implementada coincide con su mockup en estructura, datos mostrados y reglas visibles; las diferencias se revisan a mano, no se exige coincidencia de píxeles |
| Seguridad | Pruebas dirigidas + revisión | Acceso por rol, URLs firmadas, secretos, subida de archivos |
| Aceptación | Con el cliente, por módulo | Casos del contrato 08160 y reglas del reglamento |

**Principio:** las reglas críticas se prueban donde viven. Las de dinero, en el motor puro; las de integridad, contra una base real, no con simulaciones.

## 2. Datos de prueba

- **Contrato de referencia 08160:** tarifa $1,633, 3 días, salida 28/06/2024 11:00, entrada 01/07/2024 11:00; anticipo $4,899; hora extra $204; km extra $3; depósito $8,000; Kia Forte; destino Nogales.
- Catálogo semilla con seguro nocturno de $400.
- Cinco clientes y cinco vehículos sintéticos, incluidos uno con licencia por vencer, uno con póliza vencida y uno en mantenimiento.
- **Nunca datos reales** de clientes en pruebas ni en entornos de preview.

## 3. Casos críticos por requisito

### Fundamentos (RF-01, 02, 03, 28)
| ID | Caso | Esperado |
|---|---|---|
| T-01 | Operador intenta crear una tarifa | 403 |
| T-02 | Administrador cambia una tarifa | Fila nueva; contratos emitidos no cambian; entrada en bitácora |
| T-03 | `UPDATE` o `DELETE` sobre `auditoria` con cualquier rol | Rechazado |
| T-04 | Edición de un contrato | Bitácora con usuario, fecha, valor anterior y nuevo |
| T-05 | Usuario desactivado | No inicia sesión; su autoría sigue visible |
| T-06 | Administrador sin MFA | No accede a rutas de administración |
| T-07 | Solicitud de anonimización de un cliente | Datos personales borrados; contratos y cargos conservados |

### Clientes y vehículos (RF-04…08)
| ID | Caso | Esperado |
|---|---|---|
| T-10 | Dos clientes con la misma identificación | Aviso de posible duplicado (409) |
| T-11 | RFC inválido | 422 con mensaje claro |
| T-12 | Subir foto de licencia | Va directo a Storage; solo se lee con URL firmada |
| T-13 | Leer un documento sensible | Entrada `SELECT_SENSIBLE` en la bitácora |
| T-14 | Vehículo con póliza vencida | No aparece como disponible; no se puede asignar |
| T-15 | Reducir el kilometraje de un vehículo | Rechazado, salvo corrección de administrador auditada |

### Disponibilidad y alertas (RF-09, 10, 11)
| ID | Caso | Esperado |
|---|---|---|
| T-20 | Dos operadores emiten contratos del mismo vehículo con fechas que se cruzan, a la vez | Uno gana; el otro recibe 409; **prueba de concurrencia con 20 intentos paralelos** |
| T-21 | Contratos consecutivos sin cruce (uno termina a las 11:00, el otro empieza a las 11:00) | Permitido |
| T-22 | Bloqueo por mantenimiento que cruza un contrato existente | 409 |
| T-23 | Cron diario dos veces el mismo día | Sin alertas duplicadas |
| T-24 | Documento vence en 30, 15, 7 y 0 días | Un correo por umbral |
| T-25 | Se sube el documento renovado | Alertas pendientes pasan a `atendida` |

### Contrato y tarifas (RF-12…16, 26)
| ID | Caso | Esperado |
|---|---|---|
| T-30 | Reproducir 08160 | 3 días, $4,899, hora extra $204, km extra $3 |
| T-31 | Ningún conductor con licencia vigente en todo el periodo | No se puede emitir (422 `LICENCIA_VENCIDA`) |
| T-32 | Entrada anterior o igual a la salida | 422 |
| T-33 | Folio | Formato `D-00001`, consecutivo y único en la serie digital; ante dos emisiones concurrentes no hay duplicados; nunca coincide con un folio de papel |
| T-34 | Transición inválida (borrador → concluido) | Rechazada por el trigger |
| T-35 | Cambio posterior de tarifa | El contrato emitido conserva su copia |
| T-36 | Sobrescribir la tarifa de km sin nota | 422 |
| T-37 | Suma de líneas de cargo | Igual al total, siempre |
| T-38 | Registrar garantía con tarjeta | Solo se guardan tipo y últimos 4; un número completo se rechaza |
| T-39 | Pasar a vigente sin anticipo o depósito | 409 |
| T-40 | Conductor adicional con licencia vencida | Rechazado |
| T-41 | Anticipo pagado en dos formas ($4,399 efectivo y $500 transferencia para $4,899) | Se registran dos pagos; el contrato puede pasar a vigente |
| T-42 | Anticipo cuyos pagos suman menos que la renta base | 409; no pasa a vigente |
| T-43 | Arrendatario sin licencia y conductor adicional con licencia vigente (caso 08590) | Se puede emitir |
| T-44 | Arrendatario y conductor adicional sin licencia vigente | 422 `LICENCIA_VENCIDA` |
| T-45 | Tarifa pactada distinta del catálogo sin motivo | 422 |
| T-46 | «Facturar a» con nombre y RFC distintos del arrendatario (caso 08357) | Se guarda en el contrato sin alterar los datos del cliente |
| T-47 | Pago con tarjeta | Solo se guardan forma y últimos 4 dígitos; un número completo se rechaza |

### Documentos y firma (RF-17, 18, 20)
| ID | Caso | Esperado |
|---|---|---|
| T-50 | PDF del contrato | Carátula + 21 cláusulas, datos correctos, comparado con el formato 08160 |
| T-51 | Firma | Se guarda imagen, hash, usuario, fecha y dispositivo |
| T-52 | Modificar un contrato firmado | Rechazado; una corrección crea versión nueva y exige firmar otra vez |
| T-53 | Alterar el PDF almacenado | El hash no coincide y se detecta |
| T-54 | Falla de correo | Reintento y registro; reenvío manual disponible |
| T-55 | Falla al generar PDF tras emitir | El folio se conserva; PDF pendiente con reintento |

### Entrega, recepción y excepciones (RF-19, 21…25)
| ID | Caso | Esperado |
|---|---|---|
| T-60 | Km de salida menor al actual del vehículo | Rechazado |
| T-61 | Entrega completa | Contrato `vigente`; vehículo `rentado` |
| T-62 | Devolución a tiempo, sin excedente | Saldo 0 |
| T-63 | 2 h tarde + 50 km extra + limpieza $500 − bonificación $100 | Total y saldo según el motor |
| T-64 | 4 h 1 min de retraso | Se cobra un día extra, no horas |
| T-65 | Seguro nocturno con retraso | Se cobra el día completo |
| T-66 | Odómetro dañado | Cobro por día, sin km extra |
| T-67 | Contrato sin devolver pasada la hora | Pasa a `rezagado` y aparece en el tablero |
| T-68 | Aviso de accidente al día siguiente | Marcado como tardío |
| T-69 | Incidente abierto | El contrato no puede concluirse |
| T-70 | Renovar | Contrato nuevo ligado; se revalida disponibilidad y licencia |
| T-71 | Cancelar con 48 h de anticipación | Penalización 20 % |
| T-72 | Cancelar con 24 h o menos | Penalización por el total |
| T-73 | Cancelar un contrato vigente | 409 |
| T-74 | Completar la entrega con 5 de 6 ángulos de foto | 409; indica el ángulo que falta |
| T-75 | Foto del tablero sin km capturado, o km distinto al del contrato | 422 |
| T-76 | Reemplazar o borrar una foto | Rechazado; una repetición se agrega como foto nueva y la anterior se conserva |
| T-77 | Completar recepción con ángulo pendiente | 409; un administrador puede autorizarlo con nota |
| T-78 | Comparación entrega contra recepción | Un par por ángulo; el lado faltante viene nulo |
| T-79 | Flujo de captura de fotos en celular (390×844) | Los 6 ángulos se capturan con la cámara y avanzan 1 de 6 a 6 de 6 sin desplazamiento horizontal |
| T-83 | Cada foto | Guarda fecha, hora, usuario, dispositivo y huella SHA-256 |

### Exportaciones y preparación futura (RF-27, 29)
| ID | Caso | Esperado |
|---|---|---|
| T-80 | Operador exporta CSV | 403 |
| T-81 | Administrador exporta | CSV correcto; entrada en la bitácora |
| T-82 | Eventos relevantes | Se insertan en `outbox` sin consumidor |

## 4. Pruebas no funcionales

| Tema | Criterio |
|---|---|
| Rendimiento | Listados en menos de 2 s con 5,000 clientes; PDF en menos de 5 s |
| Seguridad | Sin acceso entre roles; sin URL pública a archivos sensibles; el cron rechaza solicitudes sin secreto; cabeceras de seguridad presentes |
| Subida de archivos | Rechaza tipos no permitidos y tamaños excedidos |
| Usabilidad en tableta | Flujo completo de un contrato sin desplazamiento horizontal; controles de 44 px o más; firma fluida |
| Accesibilidad básica | Contraste suficiente y etiquetas en todos los campos |
| Resiliencia | Cierre de sesión por inactividad; borrador conservado ante un corte breve |

## 5. Criterios de aceptación del MVP

1. El contrato 08160 se reproduce de punta a punta, con el mismo anticipo y recargos.
2. Es imposible el doble reservado, incluso bajo concurrencia.
3. Ningún contrato se emite con documentos vencidos.
4. Cada cambio queda en la bitácora con valor anterior y nuevo.
5. El cliente recibe el contrato y el reglamento por correo tras la entrega.
6. No existe en la base ni en los logs ningún número completo de tarjeta.
7. El cliente da su visto bueno por módulo en una demo con datos de prueba.

## 6. Entrada y salida por sprint

- **Entrada:** historia con criterios de aceptación y datos de prueba definidos.
- **Salida:** pruebas del sprint en verde en CI; sin defectos críticos abiertos; demo aceptada por el cliente.

## 7. Cobertura mínima

Motor de tarifas: 100 % de ramas. Triggers y funciones de Postgres: cada ruta de error con una prueba. Casos de uso de contrato: todos los estados y transiciones. E2E: el flujo feliz y cinco flujos de excepción (cancelar, rezagado, incidente, renovación y documento vencido).

## 8. Pendientes que condicionan las pruebas

Confirmar con el cliente los supuestos de tolerancia, retrasos de más de 24 h, cancelación con 24 h o menos y penalizaciones; sin esa confirmación, las pruebas T-63 a T-66 y T-71 a T-72 verifican el valor por defecto, no una regla validada.
