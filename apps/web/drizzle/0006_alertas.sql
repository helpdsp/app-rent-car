-- @generated_by_model: gemini-2.5-pro
-- @generated_at: 2026-11-17T06:40:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 5
-- @sprint_number: 5
-- @task_id: S05-T01

-- 1. Tabla alertas (RF-10)
-- Idempotente por (documento_id, dias_antes, fecha_vencimiento) para que el cron diario no duplique envíos (T-23).
CREATE TABLE IF NOT EXISTS alertas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  documento_id uuid NOT NULL REFERENCES documentos(id) ON DELETE CASCADE,
  dias_antes integer NOT NULL,
  fecha_vencimiento date NOT NULL,
  destinatario text NOT NULL CHECK (char_length(trim(destinatario)) > 0),
  estado estado_alerta NOT NULL DEFAULT 'pendiente',
  enviada_en timestamptz,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_alerta_idempotente UNIQUE (documento_id, dias_antes, fecha_vencimiento)
);

CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas(estado);
CREATE INDEX IF NOT EXISTS idx_alertas_documento ON alertas(documento_id);
CREATE INDEX IF NOT EXISTS idx_alertas_fecha_vencimiento ON alertas(fecha_vencimiento);

-- Trigger de auditoría para la tabla alertas
DROP TRIGGER IF EXISTS trg_auditar_alertas ON alertas;
CREATE TRIGGER trg_auditar_alertas
AFTER INSERT OR UPDATE OR DELETE ON alertas
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- Políticas de Seguridad a Nivel de Fila (RLS)
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY pol_alertas_select ON alertas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY pol_alertas_all ON alertas
  FOR ALL TO authenticated USING (true);
