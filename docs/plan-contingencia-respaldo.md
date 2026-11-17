# Plan de Contingencia, Respaldo y Recuperación ante Desastres (DRP)
## México Renta de Autos (MRA) — Mostrador Mexicali, B.C.

**Versión:** 1.0 (MVP)  
**Fecha:** 17 de noviembre de 2026  
**Responsable:** Administrador del Sistema / Titular  

---

### 1. Objetivo y Alcance

Garantizar la continuidad operativa del mostrador de renta en Mexicali ante fallas de energía eléctrica, cortes de internet, caída del proveedor de nube o corrupción de datos, asegurando la integridad de los contratos, inventarios y evidencias fotográficas.

---

### 2. Estrategia de Respaldo (Backup)

| Componente | Tipo de Respaldo | Frecuencia | Retención | Almacenamiento |
|---|---|---|---|---|
| **Base de Datos Postgres (Supabase)** | Completo (Logical Dump + WAL) | Diario (02:00 UTC) + Point-in-Time Recovery (PITR) | 30 días continuos + 12 mensuales | Storage multi-región cifrado (AES-256) |
| **Storage de Evidencias (Fotos/Videos/PDFs)** | Replicación en caliente | Inmediata (Object Storage con Versioning) | 5 años (Políticas LFPDPPP) | Bucket privado con inmutabilidad WORM |
| **Configuraciones y Secretos** | Snapshot encriptado | Ante cualquier cambio | Histórico completo | Vault / Gestor seguro |

#### Comando de respaldo manual (CLI):
```bash
pg_dump --clean --if-exists --no-owner --no-privileges -Fc "$DATABASE_URL" > backups/mra_backup_$(date +%Y%m%d_%H%M%S).dump
```

---

### 3. Prueba de Restauración Verificada

1. **Aislamiento:** Se levanta una base de datos temporal limpia en contenedor Postgres.
2. **Restauración:**
   ```bash
   pg_restore --verbose --clean --no-owner -d "$DATABASE_RESTORE_URL" backups/mra_backup_YYYYMMDD.dump
   ```
3. **Verificación de Integridad:**
   - Verificación de hash SHA-256 de contratos emitidos y firmados.
   - Total de registros en `auditoria` (comprobación de inmutabilidad: `SELECT COUNT(*) FROM auditoria`).
   - Comprobación de secuencias atómicas de folio digital (`D-00001` en adelante).

---

### 4. Protocolo de Operación en Contingencia (Offline / Caída de Conexión)

Cuando el mostrador experimenta pérdida total de conectividad con Vercel o Supabase:

1. **Uso de Folios de Reserva de Papel:**
   - El personal tiene asignado un talonario de folios de papel oficial (serie física).
   - Se llena el contrato físico recabando firma autógrafa y datos de tarjeta (últimos 4 dígitos).
   - Las fotos de entrega se capturan con la cámara de la tableta localmente (guardadas en la galería local).
2. **Reanudación del Servicio:**
   - Una vez restablecida la conexión, el operador ingresa al sistema y utiliza la opción **"Capturar Contrato en Contingencia / Folio Papel"** registrando el número de folio físico en `folio_papel`.
   - Se suben las fotos de la galería local al sistema para timbrado de hash SHA-256 y auditoría.
   - El sistema vincula el contrato físico con el folio digital garantizando auditoría continua.
