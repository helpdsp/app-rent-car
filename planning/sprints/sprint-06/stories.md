---
generated_by_model: 'claude-sonnet-5-5'
generated_at: '2026-11-17T04:45:55.358Z'
agent_roles: 'product-manager + project-management-project-shepherd'
vision_command: 'generate_sprints'
sprint_number: 6
source_spec_kit: 'spec-kit/input/'
---
# Sprint 6 Stories

## S-12 · RF-12 — Borrador de contrato y validaciones

- **Prioridad:** Must
- **Pantallas:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 15 Conductor adicional, referencia, pagaré y facturar a (`spec-kit/input/mockups/previews/15-conductor-pagare-facturar.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).
- **Criterios de aceptación:**
  - [ ] Selección de cliente y vehículo existentes; captura de destino, fechas y horas de salida y entrada prevista, lugar de devolución y referencia del cliente.
  - [ ] Autorización de salida del país: no autorizada por defecto; si es autorizada, requiere adjuntar el permiso escrito.
  - [ ] Al menos un conductor registrado en el contrato (el arrendatario o un conductor adicional) debe tener licencia vigente durante todo el periodo; si ninguno la tiene, el contrato no avanza. El arrendatario puede no conducir y no tener licencia si un conductor adicional la tiene (caso real del contrato 08590).
  - [ ] «Facturar a» es un dato del contrato, con nombre y RFC propios, que puede ser distinto del arrendatario (caso real del contrato 08357).
  - [ ] La salida no puede ser anterior a la emisión, y la entrada prevista debe ser posterior a la salida.
  - [ ] El borrador puede guardarse incompleto y retomarse; solo un contrato completo pasa a "por firmar".

## S-13 · RF-13 — Folio y estados del contrato

- **Prioridad:** Must
- **Pantallas:** pantallas 5 Firma en tableta (`spec-kit/input/mockups/previews/05-firma.html`); 11 Contratos: listado y búsqueda (`spec-kit/input/mockups/previews/11-contratos-listado.html`).
- **Criterios de aceptación:**
  - [ ] Folio único y no reutilizable, que no se asigna hasta que el contrato se emite. **El folio digital debe usar una serie propia, distinta de los folios preimpresos:** los folios de papel no son consecutivos ni cronológicos (varios talonarios a la vez, ya se llegó a 09834), así que iniciar en 8161 chocaría con contratos de papel existentes. Formato propuesto: `D-00001` (prefijo `D-` y 5 dígitos), que el cliente confirma. El folio del talonario de papel puede registrarse aparte, como campo opcional, durante la transición.
  - [ ] Estados: borrador, por firmar, vigente, por vencer, rezagado, recibido, concluido, cancelado, en incidente.
  - [ ] Las transiciones se validan en el servidor (por ejemplo, no se puede pasar de borrador a concluido).
  - [ ] Cada cambio de estado queda en la bitácora con su autor.

## S-14 · RF-14 — Cálculo automático de tarifas

- **Prioridad:** Must
- **Pantallas:** pantallas 3 Contrato: vehículo y fechas (`spec-kit/input/mockups/previews/03-contrato-vehiculo-fechas.html`); M2 Nuevo contrato (celular) (`spec-kit/input/mockups/previews/m2-movil-nuevo-contrato.html`); 7 Recepción y liquidación (`spec-kit/input/mockups/previews/07-recepcion-liquidacion.html`).
- **Criterios de aceptación:**
  - [ ] Días, renta base, anticipo (tarifa × días), hora extra (tarifa ÷ 8 redondeada a peso), km excedente (tarifa ÷ 500 o tarifa pactada), seguro nocturno y total, según el reglamento.
  - [ ] Desde la 5.ª hora de retraso se cobra un día extra; en seguro nocturno cualquier retraso cobra el día completo.
  - [ ] El operador puede sobrescribir la tarifa de km por contrato con una nota obligatoria.
  - [ ] La tarifa de 24 h es un dato **del contrato**: el catálogo propone un valor, pero las rentas reales varían (por ejemplo $1,470, $1,512, $1,633 y $2,216 para modelos y fechas distintos). Cambiarla exige un motivo; quién puede hacerlo y en qué rango se define con el cliente. La hora extra y el km extra se recalculan con la tarifa pactada.
  - [ ] Las líneas de cargo se guardan una por una (renta, retraso, km, limpieza, multas, traslado, bonificaciones) y suman exactamente el total.
  - [ ] El cálculo reproduce el contrato 08160 y está cubierto por pruebas automáticas.
