-- @generated_by_model: gemini-2.5-pro
-- @generated_at: 2026-11-17T12:20:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 11
-- @sprint_number: 11
-- @task_id: S11-T01

-- 1. Tabla incidentes (RF-23, data-model.md §2)
-- Registra accidentes, robos, fallas mecánicas y pérdida de llaves
CREATE TABLE IF NOT EXISTS incidentes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  vehiculo_id uuid NOT NULL REFERENCES vehiculos(id),
  tipo tipo_incidente NOT NULL,
  ocurrido_en timestamptz NOT NULL,
  avisado_en timestamptz NOT NULL DEFAULT now(),
  -- Columna generada: el aviso es tardío si se da después del mismo día del hecho (cláusula 12.ª, T-68)
  aviso_tardio boolean GENERATED ALWAYS AS (avisado_en::date > ocurrido_en::date) STORED,
  descripcion text NOT NULL,
  avaluo bigint NOT NULL DEFAULT 0, -- centavos
  cargo_cliente bigint NOT NULL DEFAULT 0, -- centavos
  aseguradora_referencia text,
  unidad_sustituta_id uuid REFERENCES vehiculos(id),
  bonificacion bigint NOT NULL DEFAULT 0, -- centavos
  cerrado_en timestamptz,
  registrado_por uuid REFERENCES usuarios(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incidentes_contrato ON incidentes(contrato_id);
CREATE INDEX IF NOT EXISTS idx_incidentes_abiertos ON incidentes(contrato_id) WHERE cerrado_en IS NULL;

-- 2. Función y Trigger: Al registrar un incidente abierto, pasa el contrato a 'en_incidente'
-- y bloquea el paso a 'concluido' mientras permanezca abierto (T-69).
CREATE OR REPLACE FUNCTION fn_trg_incidente_abierto()
RETURNS trigger AS $$
BEGIN
  IF NEW.cerrado_en IS NULL THEN
    UPDATE contratos
    SET estado = 'en_incidente',
        updated_at = now()
    WHERE id = NEW.contrato_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_incidente_abierto ON incidentes;
CREATE TRIGGER trg_incidente_abierto
  AFTER INSERT OR UPDATE OF cerrado_en ON incidentes
  FOR EACH ROW
  EXECUTE FUNCTION fn_trg_incidente_abierto();

-- 3. Regla en contratos: Impedir que un contrato con incidente abierto pase a 'concluido'
CREATE OR REPLACE FUNCTION fn_validar_bloqueo_incidente_concluido()
RETURNS trigger AS $$
BEGIN
  IF NEW.estado = 'concluido' THEN
    IF EXISTS (
      SELECT 1 FROM incidentes
      WHERE contrato_id = NEW.id AND cerrado_en IS NULL
    ) THEN
      RAISE EXCEPTION 'INCIDENTE_ABIERTO: El contrato no puede concluirse mientras tenga incidentes abiertos (T-69).';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bloqueo_incidente_concluido ON contratos;
CREATE TRIGGER trg_bloqueo_incidente_concluido
  BEFORE UPDATE OF estado ON contratos
  FOR EACH ROW
  EXECUTE FUNCTION fn_validar_bloqueo_incidente_concluido();
