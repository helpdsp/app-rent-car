/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T08:00:00Z
 * @agent_roles engineering-backend-architect
 * @vision_command start_sprint --sprint 7
 * @sprint_number 7
 * @task_id S07-T01
 */

-- Tabla de pagos y anticipos mixtos (RF-16)
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id UUID NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('anticipo', 'deposito_garantia', 'liquidacion', 'reembolso')),
  forma VARCHAR(30) NOT NULL CHECK (forma IN ('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'deposito_bancario', 'visa_laser')),
  monto BIGINT NOT NULL CHECK (monto > 0),
  tarjeta_ultimos_4 VARCHAR(4) CHECK (tarjeta_ultimos_4 IS NULL OR tarjeta_ultimos_4 ~ '^[0-9]{4}$'),
  tarjeta_tipo VARCHAR(30),
  referencia TEXT,
  recibo_folio VARCHAR(30),
  notas TEXT,
  recibido_por UUID NOT NULL REFERENCES usuarios(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pagos_contrato ON pagos(contrato_id);
CREATE INDEX IF NOT EXISTS idx_pagos_tipo ON pagos(tipo);
CREATE INDEX IF NOT EXISTS idx_pagos_recibo ON pagos(recibo_folio);

-- Secuencia para recibos de depósito en garantía (RF-16)
CREATE SEQUENCE IF NOT EXISTS seq_folio_recibo START WITH 1 INCREMENT BY 1;

-- Campos adicionales de pagaré en contratos si no existen (RF-26)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contratos' AND column_name = 'pagare_activado') THEN
    ALTER TABLE contratos ADD COLUMN pagare_activado BOOLEAN NOT NULL DEFAULT false;
    ALTER TABLE contratos ADD COLUMN pagare_monto BIGINT;
    ALTER TABLE contratos ADD COLUMN pagare_interes_mensual_pct NUMERIC(5, 2);
    ALTER TABLE contratos ADD COLUMN pagare_ciudad TEXT;
    ALTER TABLE contratos ADD COLUMN pagare_fecha DATE;
    ALTER TABLE contratos ADD COLUMN pagare_suscriptor TEXT;
    ALTER TABLE contratos ADD COLUMN pagare_domicilio TEXT;
  END IF;
END $$;

-- Función y trigger de seguridad: rechaza números de tarjeta completos (T-38, T-47)
CREATE OR REPLACE FUNCTION fn_prevenir_numero_tarjeta_completo()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que la referencia o notas no contengan cadenas con apariencia de PAN de 13 a 19 dígitos
  IF (NEW.referencia ~ '[0-9]{13,19}') OR (NEW.notas ~ '[0-9]{13,19}') THEN
    RAISE EXCEPTION 'NUMERO_TARJETA_PROHIBIDO: Nunca se permite almacenar un numero de tarjeta completo. Solo forma y ultimos 4 digitos.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_seguridad_pagos_tarjeta ON pagos;
CREATE TRIGGER trg_seguridad_pagos_tarjeta
  BEFORE INSERT OR UPDATE ON pagos
  FOR EACH ROW
  EXECUTE FUNCTION fn_prevenir_numero_tarjeta_completo();
