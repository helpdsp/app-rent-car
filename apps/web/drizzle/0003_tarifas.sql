-- @generated_by_model: gemini-3.8-flash
-- @generated_at: 2026-11-17T05:25:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 2
-- @sprint_number: 2
-- @task_id: S02-T04

-- 1. Tabla tarifas (catálogo versionado, copia inmutable al emitir) — RF-03
CREATE TABLE IF NOT EXISTS tarifas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tarifa_dia bigint NOT NULL CHECK (tarifa_dia > 0),
  seguro_nocturno bigint NOT NULL DEFAULT 40000 CHECK (seguro_nocturno BETWEEN 40000 AND 100000),
  cuota_proteccion bigint NOT NULL DEFAULT 25000 CHECK (cuota_proteccion >= 0),
  vigente_desde timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tarifas_nombre ON tarifas(nombre);
CREATE INDEX IF NOT EXISTS idx_tarifas_vigente_desde ON tarifas(vigente_desde);

-- Trigger de auditoría para tarifas
DROP TRIGGER IF EXISTS trg_auditar_tarifas ON tarifas;
CREATE TRIGGER trg_auditar_tarifas
AFTER INSERT OR UPDATE OR DELETE ON tarifas
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- 2. Tabla parametros (clave-valor tipado para reglas ambiguas) — RF-03
CREATE TABLE IF NOT EXISTS parametros (
  clave text PRIMARY KEY,
  valor jsonb NOT NULL,
  descripcion text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES usuarios(id)
);

-- Trigger de auditoría para parametros
DROP TRIGGER IF EXISTS trg_auditar_parametros ON parametros;
CREATE TRIGGER trg_auditar_parametros
AFTER INSERT OR UPDATE OR DELETE ON parametros
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- 3. Semilla de tarifas y parámetros por defecto (spec-kit/input/data-model.md §2)
INSERT INTO tarifas (id, nombre, tarifa_dia, seguro_nocturno, cuota_proteccion, vigente_desde)
VALUES
  ('22222222-2222-4222-8222-222222222201', 'Hyundai Elantra', 163300, 40000, 25000, '2026-05-01T00:00:00Z'),
  ('22222222-2222-4222-8222-222222222202', 'Kia Forte', 163300, 40000, 25000, '2026-05-01T00:00:00Z'),
  ('22222222-2222-4222-8222-222222222203', 'Nissan Altima', 163300, 45000, 25000, '2026-05-01T00:00:00Z'),
  ('22222222-2222-4222-8222-222222222204', 'Mazda 3', 163300, 40000, 25000, '2026-05-01T00:00:00Z'),
  ('22222222-2222-4222-8222-222222222205', 'Honda CR-V', 221600, 70000, 40000, '2026-05-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO parametros (clave, valor, descripcion)
VALUES
  ('km_por_dia', '500'::jsonb, 'Km incluidos por día'),
  ('divisor_hora_extra', '8'::jsonb, 'Divisor de tarifa por día para calcular hora extra'),
  ('hora_desde_la_que_se_cobra_dia', '5'::jsonb, 'Hora a partir de la cual se cobra día completo en retraso'),
  ('tolerancia_minutos', '0'::jsonb, 'Tolerancia en minutos para entrega'),
  ('redondeo_hora_extra', '"redondear"'::jsonb, 'Regla de redondeo de hora extra (redondear a peso o truncar)'),
  ('deducible_pct', '30'::jsonb, 'Porcentaje de deducible general'),
  ('deducible_cristales_pct', '20'::jsonb, 'Porcentaje de deducible cristales'),
  ('cancelacion_pct', '20'::jsonb, 'Porcentaje de penalización por cancelación con más de 24h'),
  ('cancelacion_horas_total', '24'::jsonb, 'Horas de anticipación bajo las cuales se penaliza el 100%'),
  ('dias_alerta_vigencia', '[30, 15, 7, 0]'::jsonb, 'Días de anticipación para generar alertas de vigencia de documentos'),
  ('inactividad_sesion_min', '30'::jsonb, 'Tiempo máximo de inactividad de sesión antes de auto-cerrar'),
  ('profeco_registro_numero', '""'::jsonb, 'Número de registro ante PROFECO'),
  ('profeco_registro_fecha', '""'::jsonb, 'Fecha de registro PROFECO'),
  ('jurisdiccion_ciudad', '"Mexicali, Baja California"'::jsonb, 'Ciudad y estado para jurisdicción'),
  ('telefono_fallas', '""'::jsonb, 'Teléfono de auxilio vial y fallas (cláusula 10-L)')
ON CONFLICT (clave) DO NOTHING;

-- Políticas RLS para tarifas y parametros:
ALTER TABLE tarifas ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametros ENABLE ROW LEVEL SECURITY;

CREATE POLICY tarifas_select_policy ON tarifas FOR SELECT USING (true);
CREATE POLICY tarifas_insert_policy ON tarifas FOR INSERT WITH CHECK (fn_rol_usuario_actual() = 'administrador');
CREATE POLICY tarifas_update_policy ON tarifas FOR UPDATE USING (fn_rol_usuario_actual() = 'administrador');

CREATE POLICY parametros_select_policy ON parametros FOR SELECT USING (true);
CREATE POLICY parametros_update_policy ON parametros FOR UPDATE USING (fn_rol_usuario_actual() = 'administrador');
