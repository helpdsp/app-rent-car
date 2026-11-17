-- @generated_by_model: gemini-4-argon
-- @generated_at: 2026-11-17T05:06:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 1
-- @sprint_number: 1
-- @task_id: S01-T02

-- Migración inicial 0001_init.sql — México Renta de Autos (MVP)
-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Enums nativos de Postgres (spec-kit/input/data-model.md §1)
DO $$ BEGIN
  CREATE TYPE rol_usuario AS ENUM ('operador', 'administrador', 'titular');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE estado_contrato AS ENUM (
    'borrador', 'por_firmar', 'vigente', 'por_vencer', 'rezagado',
    'recibido', 'concluido', 'cancelado', 'en_incidente'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_documento AS ENUM (
    'credencial', 'licencia', 'tarjeta_circulacion', 'poliza',
    'constancia_fiscal', 'permiso_salida_pais', 'otro'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE estado_vehiculo AS ENUM ('disponible', 'rentado', 'mantenimiento', 'baja');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_garantia AS ENUM ('efectivo', 'tarjeta_credito', 'visa_laser');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE forma_pago AS ENUM (
    'efectivo', 'tarjeta_debito', 'tarjeta_credito', 'transferencia_deposito'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE angulo_evidencia AS ENUM (
    'frente', 'atras', 'izquierda', 'derecha', 'tablero_km', 'interior', 'video', 'otro'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_pago AS ENUM (
    'anticipo', 'deposito_garantia', 'pago_saldo', 'devolucion_deposito', 'aplicacion_deposito'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE momento_evidencia AS ENUM ('entrega', 'recepcion', 'incidente');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_incidente AS ENUM (
    'accidente', 'robo', 'falla_mecanica', 'perdida_llaves', 'retencion_indebida', 'otro'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE estado_alerta AS ENUM ('pendiente', 'enviada', 'atendida', 'error');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_cargo AS ENUM (
    'renta_base', 'retraso', 'km_excedente', 'seguro_nocturno', 'gasolina',
    'limpieza', 'quemaduras', 'multa', 'traslado', 'penalizacion',
    'pena_convencional', 'cuota_proteccion', 'faltante', 'otro', 'bonificacion'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Secuencias (spec-kit/input/data-model.md §4)
CREATE SEQUENCE IF NOT EXISTS seq_folio_contrato START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS seq_numero_cliente START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS seq_clave_auto START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE SEQUENCE IF NOT EXISTS seq_recibo START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

-- Función auxiliar para producir folios digitales en serie propia D-00001
CREATE OR REPLACE FUNCTION fn_siguiente_folio_contrato()
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT 'D-' || lpad(nextval('seq_folio_contrato')::text, 5, '0');
$$;

-- 3. Tabla de perfiles de usuario (RF-01)
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL CHECK (char_length(trim(nombre)) > 0),
  correo citext NOT NULL UNIQUE,
  rol rol_usuario NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  mfa_activo boolean NOT NULL DEFAULT false,
  ultimo_acceso_en timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_activo ON usuarios(activo);

-- Impedir DELETE físico en usuarios para conservar autoría en la bitácora (RF-01)
CREATE OR REPLACE FUNCTION fn_impedir_borrado_usuario()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'ACCION_PROHIBIDA: Los usuarios no se eliminan físicamente; desactívelos con activo = false para conservar su autoría en la bitácora.';
END;
$$;

DROP TRIGGER IF EXISTS trg_impedir_borrado_usuario ON usuarios;
CREATE TRIGGER trg_impedir_borrado_usuario
BEFORE DELETE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION fn_impedir_borrado_usuario();

-- 4. Seguridad a nivel de fila (RLS) en usuarios (S01-T07)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para consultar el rol del usuario autenticado activo
CREATE OR REPLACE FUNCTION fn_rol_usuario_actual()
RETURNS rol_usuario
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT rol FROM public.usuarios
  WHERE id = auth.uid() AND activo = true;
$$;

-- Políticas RLS:
-- a) Cualquier usuario activo puede leer su propio perfil; administrador y titular pueden ver el listado
DROP POLICY IF EXISTS usuarios_select_policy ON usuarios;
CREATE POLICY usuarios_select_policy ON usuarios
  FOR SELECT
  USING (
    id = auth.uid()
    OR fn_rol_usuario_actual() IN ('administrador', 'titular')
  );

-- b) Solo un administrador activo puede insertar usuarios
DROP POLICY IF EXISTS usuarios_insert_policy ON usuarios;
CREATE POLICY usuarios_insert_policy ON usuarios
  FOR INSERT
  WITH CHECK (
    fn_rol_usuario_actual() = 'administrador'
  );

-- c) Solo un administrador activo puede actualizar usuarios (cambiar rol, desactivar)
DROP POLICY IF EXISTS usuarios_update_policy ON usuarios;
CREATE POLICY usuarios_update_policy ON usuarios
  FOR UPDATE
  USING (
    fn_rol_usuario_actual() = 'administrador'
  )
  WITH CHECK (
    fn_rol_usuario_actual() = 'administrador'
  );
