-- @generated_by_model: gemini-2.5-pro
-- @generated_at: 2026-11-17T10:00:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 9
-- @sprint_number: 9
-- @task_id: S09-T01, S09-T02

-- 1. Tabla inventario_contrato (RF-19, Mockup 6)
-- Registra el inventario de 10 conceptos y diagrama de daños en 4 vistas para entrega y recepción
CREATE TABLE IF NOT EXISTS inventario_contrato (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  momento momento_evidencia NOT NULL DEFAULT 'entrega',
  refacciones boolean NOT NULL DEFAULT true,
  gato boolean NOT NULL DEFAULT true,
  herramienta boolean NOT NULL DEFAULT true,
  reflejantes boolean NOT NULL DEFAULT true,
  tapetes boolean NOT NULL DEFAULT true,
  radio boolean NOT NULL DEFAULT true,
  bocinas boolean NOT NULL DEFAULT true,
  cinturones boolean NOT NULL DEFAULT true,
  placas boolean NOT NULL DEFAULT true,
  antena boolean NOT NULL DEFAULT true,
  danos jsonb NOT NULL DEFAULT '[]'::jsonb, -- lista de {id, vista, x, y, nota}
  notas text,
  registrado_por uuid REFERENCES usuarios(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_inventario_contrato_momento UNIQUE (contrato_id, momento)
);

CREATE INDEX IF NOT EXISTS idx_inventario_contrato ON inventario_contrato(contrato_id);

-- 2. Tabla evidencias (RF-19, T-74 a T-76, T-83)
-- Almacena fotos y videos de evidencia del estado del vehículo.
-- Regla de integridad crítica: Solo agregado (append-only); no se permite UPDATE ni DELETE.
CREATE TABLE IF NOT EXISTS evidencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  momento momento_evidencia NOT NULL DEFAULT 'entrega',
  tipo text NOT NULL CHECK (tipo IN ('foto', 'video')),
  angulo angulo_evidencia NOT NULL,
  path text NOT NULL,
  tamano_bytes bigint,
  sha256 text NOT NULL,
  dispositivo text,
  nota text,
  tomada_en timestamptz NOT NULL DEFAULT now(),
  subida_por uuid REFERENCES usuarios(id),
  km_capturado integer, -- Obligatorio y ligado cuando angulo = 'tablero_km' (T-75)
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_evidencias_tablero_km CHECK (angulo <> 'tablero_km' OR km_capturado IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_evidencias_contrato ON evidencias(contrato_id, momento, angulo);

-- 3. Bloqueo estricto de UPDATE y DELETE en evidencias (T-76: Inmutabilidad de evidencias)
CREATE OR REPLACE FUNCTION fn_evidencias_bloquear_modificacion()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'La tabla evidencias es de solo agregado (append-only). No se permite UPDATE ni DELETE (T-76).';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evidencias_inmutable ON evidencias;
CREATE TRIGGER trg_evidencias_inmutable
  BEFORE UPDATE OR DELETE ON evidencias
  FOR EACH ROW
  EXECUTE FUNCTION fn_evidencias_bloquear_modificacion();

-- 4. Función de validación de evidencias completas (S09-T02, RF-19, T-74)
-- Valida que existan los 6 ángulos obligatorios ('frente', 'atras', 'izquierda', 'derecha', 'tablero_km', 'interior')
-- o que cuente con autorización de administrador con nota por excepción.
CREATE OR REPLACE FUNCTION fn_validar_evidencias_completas(
  p_contrato_id uuid,
  p_momento momento_evidencia DEFAULT 'entrega',
  p_autorizacion_admin text DEFAULT NULL
)
RETURNS TABLE (
  valido boolean,
  angulos_faltantes text[],
  autorizado_por_excepcion boolean
) AS $$
DECLARE
  v_angulos_requeridos text[] := ARRAY['frente', 'atras', 'izquierda', 'derecha', 'tablero_km', 'interior'];
  v_angulos_presentes text[];
  v_faltantes text[];
BEGIN
  SELECT array_agg(DISTINCT angulo::text)
  INTO v_angulos_presentes
  FROM evidencias
  WHERE contrato_id = p_contrato_id
    AND momento = p_momento
    AND tipo = 'foto';

  IF v_angulos_presentes IS NULL THEN
    v_angulos_presentes := ARRAY[]::text[];
  END IF;

  SELECT array_agg(req)
  INTO v_faltantes
  FROM unnest(v_angulos_requeridos) AS req
  WHERE NOT (req = ANY(v_angulos_presentes));

  IF v_faltantes IS NULL THEN
    v_faltantes := ARRAY[]::text[];
  END IF;

  IF cardinality(v_faltantes) = 0 THEN
    RETURN QUERY SELECT true, ARRAY[]::text[], false;
  ELSIF p_autorizacion_admin IS NOT NULL AND length(trim(p_autorizacion_admin)) > 0 THEN
    RETURN QUERY SELECT true, v_faltantes, true;
  ELSE
    RETURN QUERY SELECT false, v_faltantes, false;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;
