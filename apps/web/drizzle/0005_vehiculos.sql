-- @generated_by_model: gemini-2.5-pro
-- @generated_at: 2026-11-17T06:00:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 4
-- @sprint_number: 4
-- @task_id: S04-T01, S04-T02

-- 1. Asegurar extensión btree_gist para exclusión combinada UUID + tstzrange
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Asegurar secuencia para clave de auto única
CREATE SEQUENCE IF NOT EXISTS seq_clave_auto START WITH 1 INCREMENT BY 1;

-- 3. Tabla vehiculos (RF-07)
CREATE TABLE IF NOT EXISTS vehiculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave_auto integer NOT NULL UNIQUE DEFAULT nextval('seq_clave_auto'),
  marca text NOT NULL CHECK (char_length(trim(marca)) > 0),
  modelo text NOT NULL CHECK (char_length(trim(modelo)) > 0),
  tipo text NOT NULL CHECK (char_length(trim(tipo)) > 0),
  color text NOT NULL CHECK (char_length(trim(color)) > 0),
  placas text NOT NULL,
  kilometraje_actual integer NOT NULL CHECK (kilometraje_actual >= 0),
  valor_asegurado bigint NOT NULL CHECK (valor_asegurado > 0),
  estado estado_vehiculo NOT NULL DEFAULT 'disponible',
  categoria_tarifa_id uuid REFERENCES tarifas(id),
  observaciones text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id),
  deleted_at timestamptz
);

-- Placas únicas entre vehículos activos
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehiculos_placas_activas ON vehiculos(placas) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehiculos_estado ON vehiculos(estado) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vehiculos_clave ON vehiculos(clave_auto);

-- Vincular clave foránea en documentos si existe la tabla
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_documentos_vehiculo'
  ) THEN
    ALTER TABLE documentos
      ADD CONSTRAINT fk_documentos_vehiculo
      FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 4. Tabla bloqueos_vehiculo (RF-09)
CREATE TABLE IF NOT EXISTS bloqueos_vehiculo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehiculo_id uuid NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
  rango tstzrange NOT NULL,
  motivo text NOT NULL CHECK (char_length(trim(motivo)) > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id),
  CONSTRAINT ck_bloqueo_rango_valido CHECK (lower(rango) < upper(rango)),
  CONSTRAINT uq_bloqueo_vehiculo_rango EXCLUDE USING gist (vehiculo_id WITH =, rango WITH &&)
);

CREATE INDEX IF NOT EXISTS idx_bloqueos_vehiculo_id ON bloqueos_vehiculo(vehiculo_id);

-- 5. Esqueleto de la tabla contratos para restricción de exclusión y disponibilidad (RF-09, RF-12)
CREATE TABLE IF NOT EXISTS contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folio text UNIQUE,
  folio_papel text,
  estado estado_contrato NOT NULL DEFAULT 'borrador',
  cliente_id uuid NOT NULL REFERENCES clientes(id),
  vehiculo_id uuid NOT NULL REFERENCES vehiculos(id),
  vehiculo2_id uuid REFERENCES vehiculos(id),
  contrato_origen_id uuid REFERENCES contratos(id),
  destino text,
  salida_en timestamptz NOT NULL,
  entrada_prevista_en timestamptz NOT NULL,
  entrada_real_en timestamptz,
  rango tstzrange GENERATED ALWAYS AS (tstzrange(salida_en, entrada_prevista_en, '[)')) STORED,
  lugar_devolucion text DEFAULT 'Sucursal Mexicali',
  salida_pais_autorizada boolean NOT NULL DEFAULT false,
  referencia_nombre text,
  referencia_telefono text,
  referencia_celular text,
  facturar_a_nombre text,
  facturar_a_rfc text,
  km_salida integer,
  km_entrada integer,
  km_por_dia integer NOT NULL DEFAULT 500,
  gasolina_salida smallint CHECK (gasolina_salida BETWEEN 0 AND 8),
  gasolina_entrada smallint CHECK (gasolina_entrada BETWEEN 0 AND 8),
  odometro_danado boolean NOT NULL DEFAULT false,
  tarifa_dia bigint NOT NULL DEFAULT 0,
  tarifa_hora_extra bigint NOT NULL DEFAULT 0,
  tarifa_km_extra bigint NOT NULL DEFAULT 0,
  seguro_nocturno bigint NOT NULL DEFAULT 0,
  tarifa_km_sobrescrita bigint,
  tarifa_km_nota text,
  tarifa_catalogo_dia bigint,
  tarifa_motivo text,
  dias integer NOT NULL DEFAULT 1,
  anticipo bigint NOT NULL DEFAULT 0,
  deducible_accidente_pct numeric(5,2) DEFAULT 30.00,
  deducible_robo_pct numeric(5,2) DEFAULT 30.00,
  valor_auto_asegurado bigint,
  observaciones text,
  pdf_contrato_path text,
  pdf_reglamento_path text,
  pdf_hash text,
  firma_arrendatario_path text,
  firmado_en timestamptz,
  firmado_por uuid REFERENCES usuarios(id),
  firma_dispositivo text,
  ghl_contact_id text,
  ghl_opportunity_id text,
  emitido_en timestamptz,
  concluido_en timestamptz,
  cancelado_en timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id),
  deleted_at timestamptz,
  CONSTRAINT ck_contrato_fechas CHECK (entrada_prevista_en > salida_en),
  CONSTRAINT ck_contrato_km CHECK (km_entrada IS NULL OR km_salida IS NULL OR km_entrada >= km_salida),
  CONSTRAINT uq_contrato_vehiculo_rango EXCLUDE USING gist (vehiculo_id WITH =, rango WITH &&)
    WHERE (estado NOT IN ('borrador', 'cancelado', 'concluido'))
);

CREATE INDEX IF NOT EXISTS idx_contratos_vehiculo_fechas ON contratos(vehiculo_id, salida_en, entrada_prevista_en);
CREATE INDEX IF NOT EXISTS idx_contratos_cliente ON contratos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contratos_estado ON contratos(estado);

-- 6. Trigger para cruce entre contratos y bloqueos de mantenimiento
CREATE OR REPLACE FUNCTION fn_validar_bloqueo_mantenimiento()
RETURNS trigger AS $$
DECLARE
  v_contrato_conflicto record;
  v_bloqueo_conflicto record;
BEGIN
  IF TG_TABLE_NAME = 'bloqueos_vehiculo' THEN
    -- Al insertar un bloqueo, verificar si choca con un contrato activo
    SELECT id, folio, estado, salida_en, entrada_prevista_en INTO v_contrato_conflicto
    FROM contratos
    WHERE vehiculo_id = NEW.vehiculo_id
      AND estado NOT IN ('borrador', 'cancelado', 'concluido')
      AND rango && NEW.rango
    LIMIT 1;

    IF FOUND THEN
      RAISE EXCEPTION 'VEHICULO_CON_CONTRATO_ACTIVO: El vehiculo ya cuenta con el contrato % en el periodo indicado (%)',
        COALESCE(v_contrato_conflicto.folio, v_contrato_conflicto.id::text),
        NEW.rango
      USING ERRCODE = '40901';
    END IF;

    RETURN NEW;
  ELSIF TG_TABLE_NAME = 'contratos' THEN
    -- Al insertar o actualizar un contrato, verificar si choca con un bloqueo
    IF NEW.estado NOT IN ('borrador', 'cancelado', 'concluido') THEN
      SELECT id, motivo, rango INTO v_bloqueo_conflicto
      FROM bloqueos_vehiculo
      WHERE vehiculo_id = NEW.vehiculo_id
        AND rango && NEW.rango
      LIMIT 1;

      IF FOUND THEN
        RAISE EXCEPTION 'VEHICULO_BLOQUEADO_MANTENIMIENTO: El vehiculo esta bloqueado por mantenimiento (%: %)',
          v_bloqueo_conflicto.motivo, v_bloqueo_conflicto.rango
        USING ERRCODE = '40902';
      END IF;

      -- Verificar también vehiculo2_id si aplica (RF-15)
      IF NEW.vehiculo2_id IS NOT NULL THEN
        SELECT id, motivo, rango INTO v_bloqueo_conflicto
        FROM bloqueos_vehiculo
        WHERE vehiculo_id = NEW.vehiculo2_id
          AND rango && NEW.rango
        LIMIT 1;

        IF FOUND THEN
          RAISE EXCEPTION 'VEHICULO2_BLOQUEADO_MANTENIMIENTO: El segundo vehiculo esta bloqueado por mantenimiento (%: %)',
            v_bloqueo_conflicto.motivo, v_bloqueo_conflicto.rango
          USING ERRCODE = '40902';
        END IF;

        IF EXISTS (
          SELECT 1 FROM contratos
          WHERE (vehiculo_id = NEW.vehiculo2_id OR vehiculo2_id = NEW.vehiculo2_id)
            AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
            AND estado NOT IN ('borrador', 'cancelado', 'concluido')
            AND rango && NEW.rango
        ) THEN
          RAISE EXCEPTION 'VEHICULO2_NO_DISPONIBLE: El segundo vehiculo ya tiene una reserva activa'
          USING ERRCODE = '40901';
        END IF;
      END IF;
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_bloqueos_validar_contratos ON bloqueos_vehiculo;
CREATE TRIGGER trg_bloqueos_validar_contratos
BEFORE INSERT OR UPDATE ON bloqueos_vehiculo
FOR EACH ROW
EXECUTE FUNCTION fn_validar_bloqueo_mantenimiento();

DROP TRIGGER IF EXISTS trg_contratos_validar_bloqueos ON contratos;
CREATE TRIGGER trg_contratos_validar_bloqueos
BEFORE INSERT OR UPDATE ON contratos
FOR EACH ROW
EXECUTE FUNCTION fn_validar_bloqueo_mantenimiento();

-- 7. Trigger para regla de kilometraje: solo puede subir salvo corrección de administrador
CREATE OR REPLACE FUNCTION fn_validar_kilometraje_vehiculo()
RETURNS trigger AS $$
DECLARE
  v_es_admin boolean := false;
  v_permite_override boolean := false;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.kilometraje_actual < OLD.kilometraje_actual THEN
      v_es_admin := (current_setting('app.current_user_role', true) = 'administrador');
      v_permite_override := (current_setting('app.override_kilometraje_admin', true) = 'true');

      IF NOT (v_es_admin AND v_permite_override) THEN
        RAISE EXCEPTION 'KILOMETRAJE_INVALIDO: El kilometraje actual (% km) no puede ser menor al anterior (% km) salvo correccion auditada por un administrador',
          NEW.kilometraje_actual, OLD.kilometraje_actual
        USING ERRCODE = '42201';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_kilometraje_vehiculo ON vehiculos;
CREATE TRIGGER trg_validar_kilometraje_vehiculo
BEFORE UPDATE ON vehiculos
FOR EACH ROW
EXECUTE FUNCTION fn_validar_kilometraje_vehiculo();

-- 8. Triggers de auditoría
DROP TRIGGER IF EXISTS trg_auditar_vehiculos ON vehiculos;
CREATE TRIGGER trg_auditar_vehiculos
AFTER INSERT OR UPDATE OR DELETE ON vehiculos
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

DROP TRIGGER IF EXISTS trg_auditar_bloqueos_vehiculo ON bloqueos_vehiculo;
CREATE TRIGGER trg_auditar_bloqueos_vehiculo
AFTER INSERT OR UPDATE OR DELETE ON bloqueos_vehiculo
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

DROP TRIGGER IF EXISTS trg_auditar_contratos ON contratos;
CREATE TRIGGER trg_auditar_contratos
AFTER INSERT OR UPDATE OR DELETE ON contratos
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- 9. Políticas de Seguridad a Nivel de Fila (RLS)
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueos_vehiculo ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos ENABLE ROW LEVEL SECURITY;

-- vehiculos: lectura para usuarios autenticados, escritura administradores y operadores
CREATE POLICY pol_vehiculos_select ON vehiculos
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY pol_vehiculos_insert ON vehiculos
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY pol_vehiculos_update ON vehiculos
  FOR UPDATE TO authenticated USING (deleted_at IS NULL);

-- bloqueos: lectura authenticated, inserción/eliminación solo administradores
CREATE POLICY pol_bloqueos_select ON bloqueos_vehiculo
  FOR SELECT TO authenticated USING (true);

CREATE POLICY pol_bloqueos_insert ON bloqueos_vehiculo
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid() AND usuarios.rol IN ('administrador', 'titular')
    )
  );

-- contratos: lectura y escritura por usuarios autenticados
CREATE POLICY pol_contratos_select ON contratos
  FOR SELECT TO authenticated USING (deleted_at IS NULL);

CREATE POLICY pol_contratos_all ON contratos
  FOR ALL TO authenticated USING (deleted_at IS NULL);
