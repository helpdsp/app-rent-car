-- @generated_by_model: gemini-2.5-pro
-- @generated_at: 2026-11-17T07:15:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 6
-- @sprint_number: 6
-- @task_id: S06-T01, S06-T02

-- 1. Tabla contrato_conductores (RF-12)
CREATE TABLE IF NOT EXISTS contrato_conductores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  nombre text NOT NULL CHECK (char_length(trim(nombre)) > 0),
  domicilio text,
  ciudad_estado text,
  telefono text,
  licencia_numero text NOT NULL,
  licencia_vencimiento date NOT NULL,
  firma_path text,
  es_arrendatario boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conductores_contrato ON contrato_conductores(contrato_id);

-- 2. Tabla contrato_cargos (RF-14, T-37)
CREATE TABLE IF NOT EXISTS contrato_cargos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  tipo tipo_cargo NOT NULL,
  concepto text NOT NULL,
  monto bigint NOT NULL, -- centavos enteros; negativo para bonificaciones
  momento text NOT NULL CHECK (momento IN ('emision', 'liquidacion')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cargos_contrato ON contrato_cargos(contrato_id);

-- 3. Tabla outbox para eventos asíncronos desacoplados (RF-29)
CREATE TABLE IF NOT EXISTS outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento text NOT NULL,
  payload jsonb NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now(),
  procesado_en timestamptz
);

CREATE INDEX IF NOT EXISTS idx_outbox_pendientes ON outbox(creado_en) WHERE procesado_en IS NULL;

-- 4. Función de validación de transiciones de estado de contratos (RF-13, T-34)
CREATE OR REPLACE FUNCTION fn_validar_transicion_contrato()
RETURNS trigger AS $$
BEGIN
  -- Si no hubo cambio de estado, permitir
  IF OLD.estado = NEW.estado THEN
    RETURN NEW;
  END IF;

  -- Matriz estricta de transiciones de estado permitidas
  IF OLD.estado = 'borrador' AND NEW.estado IN ('por_firmar', 'cancelado') THEN
    RETURN NEW;
  ELSIF OLD.estado = 'por_firmar' AND NEW.estado IN ('vigente', 'borrador', 'cancelado') THEN
    RETURN NEW;
  ELSIF OLD.estado = 'vigente' AND NEW.estado IN ('por_vencer', 'rezagado', 'recibido', 'en_incidente') THEN
    RETURN NEW;
  ELSIF OLD.estado = 'por_vencer' AND NEW.estado IN ('recibido', 'rezagado', 'en_incidente') THEN
    RETURN NEW;
  ELSIF OLD.estado = 'rezagado' AND NEW.estado IN ('recibido', 'en_incidente') THEN
    RETURN NEW;
  ELSIF OLD.estado = 'recibido' AND NEW.estado = 'concluido' THEN
    RETURN NEW;
  ELSIF OLD.estado = 'en_incidente' AND NEW.estado IN ('recibido', 'concluido') THEN
    RETURN NEW;
  END IF;

  -- Cualquier otra transición (ej. borrador -> concluido) es rechazada
  RAISE EXCEPTION 'TRANSICION_INVALIDA: No se permite cambiar el estado de contrato de % a %',
    OLD.estado, NEW.estado
  USING ERRCODE = '42202';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_transicion_contrato ON contratos;
CREATE TRIGGER trg_validar_transicion_contrato
BEFORE UPDATE OF estado ON contratos
FOR EACH ROW
EXECUTE FUNCTION fn_validar_transicion_contrato();
