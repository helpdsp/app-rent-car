---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17'
agent_roles: 'design-ux-architect + design-ui-designer + product-manager'
vision_command: 'generate_spec_kit (complemento: mapa de mockups)'
source_brief: 'spec-kit/input/brief.md'
source_product_prd: 'spec-kit/input/product-prd.md'
---

# Mockups: pantallas y requisitos que cubren

**Referencia del plan:** la carpeta `spec-kit/input/mockups/` (vistas HTML navegables en `previews/`, capturas en `png/`, índice con requisitos en `README.md`). Si difiere del lienzo, prevalece la carpeta.

Lienzo de diseño original (privado, solo su dueño): https://claude.ai/artifact/PjrL88UdRnGcTHG3tpoaa9

Son **maquetas estáticas** con datos de ejemplo: no son código ni definen la implementación final. Dirección visual propuesta: rojo de la marca (#B5141B) sobre papel crema, un solo tema, controles táctiles de 44 px o más, flujo por pasos. El estilo visual sigue abierto en `clarify_spec_kit`; esta es la propuesta para cerrarlo como «alineado a la marca».

**Terminología:** «documentos» = licencia, credencial, tarjeta de circulación y póliza (sus vigencias). «Contratos» = los contratos de renta.

## Tableta horizontal (1194×834)

| # | Pantalla | RF | Sprint |
|---|---|---|---|
| 1 | Tablero del operador | RF-11, RF-10, RF-22 | 5 |
| 2 | Cliente: ficha y documentos | RF-04, RF-05, RF-06, RF-28 | 3 |
| 3 | Contrato: vehículo y fechas | RF-12, RF-09, RF-14 | 6 |
| 4 | Contrato: cobro y garantía | RF-16, RF-15 | 7 |
| 5 | Firma en tableta | RF-17, RF-18, RF-13 | 8 |
| 6 | Entrega del vehículo | RF-19 | 9 |
| 7 | Recepción y liquidación | RF-21, RF-22 | 10 |
| 8 | Inicio de sesión y verificación en dos pasos | RF-01 | 1 |
| 9 | Vehículos: listado | RF-07, RF-08 | 4 |
| 10 | Vehículo: ficha, documentos e historial | RF-07, RF-08, RF-09 | 4 |
| 11 | Contratos: listado y búsqueda | RF-12, RF-13, RF-06 | 6 |
| 12 | Registrar incidente | RF-23 | 11 |
| 13 | Renovar contrato | RF-24 | 11 |
| 14 | Cancelar contrato | RF-25 | 11 |
| 15 | Conductor adicional, referencia, pagaré y facturar a | RF-15, RF-26, RF-12 | 7 |
| 16 | Administración: tarifas y parámetros | RF-03 | 2 |
| 17 | Administración: usuarios y roles | RF-01 | 1 |
| 18 | Bitácora y exportaciones | RF-02, RF-27 | 2 y 12 |

## Celular (390×844)

| # | Pantalla | RF | Sprint |
|---|---|---|---|
| M1 | Tablero | RF-11 | 5 |
| M2 | Nuevo contrato (vehículo y fechas) | RF-12, RF-14 | 6 |
| M3 | Fotos de entrega | RF-19 | 9 |
| M4 | Recepción: comparar fotos | RF-21 | 10 |

La **firma** y la **administración** se piden en tableta o escritorio: no hay versión de celular.

## Requisitos sin pantalla

- **RF-20** (envío del contrato por correo): no tiene pantalla propia; el aviso aparece al completar la entrega (pantalla 6).
- **RF-29** (preparación para GHL): sin interfaz.
- **RF-28** (privacidad): la pantalla 2 muestra el aviso aceptado; la política de retención y los derechos ARCO no están dibujados.
- **Tablero de escritorio:** solo hay tablero de tableta y de celular.

## Reglas de negocio que los mockups hicieron explícitas

- Anticipo con varios pagos de formas distintas (caso del contrato 08590).
- Tarifa del contrato distinta del catálogo, con motivo (casos 09442, 08357, 08540).
- Fotos de entrega y recepción con los mismos seis ángulos, comparables lado a lado; foto del tablero obligatoria para guardar el kilometraje.
- Folio digital con serie propia `D-00001`, que convive con los folios de papel.
- Al menos un conductor con licencia vigente; el arrendatario puede no conducir.
- «Facturar a» propio del contrato; el sistema captura los datos, no emite la factura.
- Aviso tardío de un incidente (después del día del hecho) marcado como incumplimiento.
- Renovación como contrato nuevo ligado; cancelación con penalización de 20 % o del total, regla configurable y por confirmar.

## Decisiones por confirmar que aparecen en pantalla

Truncar o redondear la hora extra (pantalla 16), quién puede pactar la tarifa de un contrato (pantallas 16 y 17), registro PROFECO, jurisdicción y teléfono de fallas (pantalla 16), y el formato del folio.

## Datos de ejemplo usados

Flota real que aparece en los contratos: Hyundai Elantra azul (ATU-703-A), Kia Forte (gris BNB-791-A y negro BAD-372-A), Nissan Altima blanco y Honda CR-V negra; Mazda 3 y Nissan Sentra completan la flota de ejemplo. Cálculos del contrato de referencia: 3 días × $1,633 = $4,899, hora extra $204 y km extra $3. Los nombres de personas, correos, teléfonos y licencias son inventados.
