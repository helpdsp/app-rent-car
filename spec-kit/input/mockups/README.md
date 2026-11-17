---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:40:27.286Z'
agent_roles: 'design-ux-architect + design-ui-designer'
vision_command: 'generate_spec_kit (complemento: mockups exportados)'
---

# Mockups del MVP

Copia local de los mockups del lienzo de diseño. **Son maquetas estáticas con datos de ejemplo**, no código de producción: definen estructura, datos mostrados y reglas visibles, no la implementación.

## Qué hay aquí

| Carpeta o archivo | Contenido |
|---|---|
| `previews/` | Una página HTML por pantalla, navegable (los botones llevan a la siguiente pantalla). Ábrelas con el navegador; no necesitan servidor. |
| `png/` | Captura de cada pantalla al tamaño real, para revisar sin abrir nada y para comparar contra lo implementado. |
| `source/` | Fuentes originales del lienzo (`.dc.html`). Solo sirven para volver a publicar en el lienzo. |
| `canvas.json` | Posición de cada pantalla en el lienzo. |
| `screens.json` | Índice legible por máquina: número, título, archivo, tamaño. |

El lienzo original es privado: https://claude.ai/artifact/PjrL88UdRnGcTHG3tpoaa9. **Esta carpeta es la referencia del plan**; si el lienzo y esta carpeta difieren, prevalece esta carpeta.

## Pantallas

| # | Pantalla | Archivos | Tamaño | Requisitos |
|---|---|---|---|---|
| 1 | Tablero del operador | [HTML](previews/01-tablero.html) · [PNG](png/01-tablero.png) | 1194×834 | RF-06, RF-10, RF-11, RF-22 |
| 2 | Cliente: ficha y documentos | [HTML](previews/02-cliente.html) · [PNG](png/02-cliente.png) | 1194×834 | RF-04, RF-05, RF-06, RF-28 |
| 3 | Contrato: vehículo y fechas | [HTML](previews/03-contrato-vehiculo-fechas.html) · [PNG](png/03-contrato-vehiculo-fechas.png) | 1194×834 | RF-03, RF-09, RF-12, RF-14 |
| 4 | Contrato: cobro y garantía | [HTML](previews/04-contrato-cobro-garantia.html) · [PNG](png/04-contrato-cobro-garantia.png) | 1194×834 | RF-15, RF-16 |
| 5 | Firma en tableta | [HTML](previews/05-firma.html) · [PNG](png/05-firma.png) | 1194×834 | RF-13, RF-17, RF-18 |
| 6 | Entrega del vehículo | [HTML](previews/06-entrega.html) · [PNG](png/06-entrega.png) | 1194×834 | RF-19, RF-20 |
| 7 | Recepción y liquidación | [HTML](previews/07-recepcion-liquidacion.html) · [PNG](png/07-recepcion-liquidacion.png) | 1194×834 | RF-14, RF-21, RF-22 |
| 8 | Inicio de sesión y verificación | [HTML](previews/08-inicio-de-sesion.html) · [PNG](png/08-inicio-de-sesion.png) | 1194×834 | RF-01 |
| 9 | Vehículos: listado | [HTML](previews/09-vehiculos-listado.html) · [PNG](png/09-vehiculos-listado.png) | 1194×834 | RF-07, RF-08 |
| 10 | Vehículo: ficha, documentos e historial | [HTML](previews/10-vehiculo-ficha.html) · [PNG](png/10-vehiculo-ficha.png) | 1194×834 | RF-07, RF-08 |
| 11 | Contratos: listado y búsqueda | [HTML](previews/11-contratos-listado.html) · [PNG](png/11-contratos-listado.png) | 1194×834 | RF-06, RF-12, RF-13 |
| 12 | Registrar incidente | [HTML](previews/12-incidente.html) · [PNG](png/12-incidente.png) | 1194×834 | RF-23 |
| 13 | Renovar contrato | [HTML](previews/13-renovar.html) · [PNG](png/13-renovar.png) | 1194×834 | RF-24 |
| 14 | Cancelar contrato | [HTML](previews/14-cancelar.html) · [PNG](png/14-cancelar.png) | 1194×834 | RF-25 |
| 15 | Conductor adicional, referencia, pagaré y facturar a | [HTML](previews/15-conductor-pagare-facturar.html) · [PNG](png/15-conductor-pagare-facturar.png) | 1194×834 | RF-12, RF-15, RF-26 |
| 16 | Administración: tarifas y parámetros | [HTML](previews/16-admin-tarifas-parametros.html) · [PNG](png/16-admin-tarifas-parametros.png) | 1194×834 | RF-03 |
| 17 | Administración: usuarios y roles | [HTML](previews/17-admin-usuarios-roles.html) · [PNG](png/17-admin-usuarios-roles.png) | 1194×834 | RF-01 |
| 18 | Bitácora y exportaciones | [HTML](previews/18-admin-bitacora-exportaciones.html) · [PNG](png/18-admin-bitacora-exportaciones.png) | 1194×834 | RF-02, RF-27 |
| M1 | Tablero (celular) | [HTML](previews/m1-movil-tablero.html) · [PNG](png/m1-movil-tablero.png) | 390×844 | RF-06, RF-10, RF-11, RF-22 |
| M2 | Nuevo contrato (celular) | [HTML](previews/m2-movil-nuevo-contrato.html) · [PNG](png/m2-movil-nuevo-contrato.png) | 390×844 | RF-09, RF-12, RF-14 |
| M3 | Fotos de entrega (celular) | [HTML](previews/m3-movil-fotos-entrega.html) · [PNG](png/m3-movil-fotos-entrega.png) | 390×844 | RF-19 |
| M4 | Recepción: comparar fotos (celular) | [HTML](previews/m4-movil-recepcion-comparar.html) · [PNG](png/m4-movil-recepcion-comparar.png) | 390×844 | RF-21 |

## Cómo se usan en los sprints

1. Cada requisito del PRD (`product-prd.md`) y cada historia (`stories.md`) tiene una línea **Mockup** con la ruta de sus pantallas.
2. La tabla de `sprint-plan.md` indica qué pantallas entran en cada sprint.
3. Una tarea de interfaz está terminada cuando la pantalla implementada coincide con su mockup en estructura, datos mostrados y reglas visibles (estados, avisos, validaciones). Los datos de ejemplo no son requisitos.
4. Si una pantalla implementada se aparta del mockup, se actualiza el mockup en el mismo cambio.

## Terminología

«Documentos» son la licencia, la credencial, la tarjeta de circulación y la póliza (sus vigencias). «Contratos» son los contratos de renta.

## Pendientes

Sin pantalla: RF-20 (el envío por correo no tiene pantalla propia), RF-29 (sin interfaz), la política de retención de RF-28 y el tablero de escritorio. Decisiones por confirmar que aparecen en pantalla: truncar o redondear la hora extra (16), quién pacta la tarifa de un contrato (16 y 17), datos legales del contrato (16) y el formato del folio.
