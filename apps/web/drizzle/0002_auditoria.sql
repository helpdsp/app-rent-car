-- @generated_by_model: gemini-3.8-flash
-- @generated_at: 2026-11-17T05:25:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 2
-- @sprint_number: 2
-- @task_id: S02-T01, S02-T02

-- 1. Tabla de auditoría (solo agregado / append-only) — RF-02
CREATE TABLE IF NOT EXISTS auditoria (
  id bigserial PRIMARY KEY,
  ocurrido_en timestamptz NOT NULL DEFAULT now(),
  usuario_id uuid,
  accion text NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT_SENSIBLE', 'EXPORT')),
  tabla text NOT NULL,
  registro_id uuid,
  valor_anterior jsonb,
  valor_nuevo jsonb
);

CREATE INDEX IF NOT EXISTS idx_auditoria_tabla_registro ON auditoria(tabla, registro_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_ocurrido_en ON auditoria(ocurrido_en);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario_id ON auditoria(usuario_id);

-- Regla no negociable: la bitácora es de SOLO AGREGADO.
-- Ningún rol (incluido service_role / superuser) puede hacer UPDATE ni DELETE en auditoria.
CREATE OR REPLACE FUNCTION fn_impedir_modificacion_auditoria()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'ACCION_PROHIBIDA: La tabla auditoria es inmutable (solo agregado). No se permite UPDATE ni DELETE para ningún rol.';
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_modificacion_auditoria ON auditoria;
CREATE TRIGGER trg_impedir_modificacion_auditoria
BEFORE UPDATE OR DELETE ON auditoria
FOR EACH ROW
EXECUTE FUNCTION fn_impedir_modificacion_auditoria();

-- 2. Función genérica fn_auditar para triggers de negocio
CREATE OR REPLACE FUNCTION fn_auditar()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usuario_id uuid;
  v_registro_id uuid;
  v_valor_anterior jsonb := NULL;
  v_valor_nuevo jsonb := NULL;
BEGIN
  -- Obtener usuario actual autenticado si existe
  BEGIN
    v_usuario_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_usuario_id := NULL;
  END;

  IF (TG_OP = 'INSERT') THEN
    v_registro_id := NEW.id;
    v_valor_nuevo := to_jsonb(NEW);
    INSERT INTO public.auditoria (ocurrido_en, usuario_id, accion, tabla, registro_id, valor_anterior, valor_nuevo)
    VALUES (now(), v_usuario_id, 'INSERT', TG_TABLE_NAME, v_registro_id, NULL, v_valor_nuevo);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_registro_id := NEW.id;
    v_valor_anterior := to_jsonb(OLD);
    v_valor_nuevo := to_jsonb(NEW);
    INSERT INTO public.auditoria (ocurrido_en, usuario_id, accion, tabla, registro_id, valor_anterior, valor_nuevo)
    VALUES (now(), v_usuario_id, 'UPDATE', TG_TABLE_NAME, v_registro_id, v_valor_anterior, v_valor_nuevo);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    v_registro_id := OLD.id;
    v_valor_anterior := to_jsonb(OLD);
    INSERT INTO public.auditoria (ocurrido_en, usuario_id, accion, tabla, registro_id, valor_anterior, valor_nuevo)
    VALUES (now(), v_usuario_id, 'DELETE', TG_TABLE_NAME, v_registro_id, v_valor_anterior, NULL);
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Vincular trigger de auditoría a la tabla usuarios existente
DROP TRIGGER IF EXISTS trg_auditar_usuarios ON usuarios;
CREATE TRIGGER trg_auditar_usuarios
AFTER INSERT OR UPDATE OR DELETE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- Políticas RLS para auditoria:
ALTER TABLE auditoria ENABLE ROW LEVEL SECURITY;

-- Solo administrador y titular pueden leer la bitácora
DROP POLICY IF EXISTS auditoria_select_policy ON auditoria;
CREATE POLICY auditoria_select_policy ON auditoria
  FOR SELECT
  USING (
    fn_rol_usuario_actual() IN ('administrador', 'titular')
  );
