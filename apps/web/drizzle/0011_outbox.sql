-- ============================================================================
-- Migración 0011_outbox.sql
-- Sprint 12 · S12-T02: Preparación para integración futura (RF-29)
-- Campos ghl_contact_id, ghl_opportunity_id y tabla outbox de eventos desacoplados
-- ============================================================================

-- 1. Añadir campos para integración externa con GoHighLevel (GHL)
ALTER TABLE IF EXISTS clientes
  ADD COLUMN IF NOT EXISTS ghl_contact_id VARCHAR(100) DEFAULT NULL;

ALTER TABLE IF EXISTS contratos
  ADD COLUMN IF NOT EXISTS ghl_opportunity_id VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ghl_contact_id VARCHAR(100) DEFAULT NULL;

-- 2. Tabla outbox: patrón transaccional para eventos del sistema sin consumidor en el MVP (RF-29)
-- Eventos registrados:
--   - reserva_creada
--   - contrato_firmado
--   - vehiculo_entregado
--   - contrato_rezagado
--   - contrato_cancelado
--   - contrato_concluido
--   - incidente_registrado
CREATE TABLE IF NOT EXISTS outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  intentos INT NOT NULL DEFAULT 0,
  ultimo_error TEXT,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  procesado_en TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_outbox_procesado ON outbox (procesado_en) WHERE procesado_en IS NULL;
CREATE INDEX IF NOT EXISTS idx_outbox_evento ON outbox (evento);
CREATE INDEX IF NOT EXISTS idx_clientes_ghl ON clientes (ghl_contact_id) WHERE ghl_contact_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contratos_ghl ON contratos (ghl_opportunity_id) WHERE ghl_opportunity_id IS NOT NULL;

-- 3. RLS para outbox: de solo lectura o acceso por rol de servicio/admin
ALTER TABLE outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo administradores pueden consultar outbox"
  ON outbox FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
        AND usuarios.rol IN ('administrador', 'titular')
    )
  );

COMMENT ON TABLE outbox IS 'Eventos desacoplados para integraciones futuras con CRM/GHL (RF-29)';
