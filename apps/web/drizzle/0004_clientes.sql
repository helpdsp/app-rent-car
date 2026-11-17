-- @generated_by_model: gemini-3.8-flash
-- @generated_at: 2026-11-17T05:35:00Z
-- @agent_roles: engineering-backend-architect + engineering-database-optimizer
-- @vision_command: start_sprint --sprint 3
-- @sprint_number: 3
-- @task_id: S03-T01, S03-T04

-- 1. Tabla clientes (RF-04, RF-06)
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_cliente integer NOT NULL UNIQUE DEFAULT nextval('seq_numero_cliente'),
  nombre_completo text NOT NULL CHECK (char_length(trim(nombre_completo)) > 0),
  identificacion_numero text NOT NULL,
  domicilio text,
  ciudad text,
  estado text,
  telefono text,
  celular text,
  correo citext,
  requiere_factura boolean NOT NULL DEFAULT false,
  razon_social text,
  rfc text,
  domicilio_fiscal text,
  regimen_fiscal text,
  aviso_privacidad_version text,
  aviso_privacidad_aceptado_en timestamptz,
  ghl_contact_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id),
  deleted_at timestamptz,
  CONSTRAINT ck_cliente_telefono_o_celular CHECK (telefono IS NOT NULL OR celular IS NOT NULL),
  CONSTRAINT ck_cliente_rfc_formato CHECK (
    rfc IS NULL OR rfc ~ '^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$'
  )
);

-- Índices de búsqueda y detección de duplicados (RF-04, RF-06)
CREATE INDEX IF NOT EXISTS idx_clientes_identificacion ON clientes(identificacion_numero) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clientes_nombre_trgm ON clientes USING gin (lower(nombre_completo) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono ON clientes(telefono) WHERE telefono IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clientes_celular ON clientes(celular) WHERE celular IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_clientes_rfc ON clientes(rfc) WHERE rfc IS NOT NULL;

-- Trigger de auditoría para clientes
DROP TRIGGER IF EXISTS trg_auditar_clientes ON clientes;
CREATE TRIGGER trg_auditar_clientes
AFTER INSERT OR UPDATE OR DELETE ON clientes
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- 2. Tabla documentos (RF-05)
CREATE TABLE IF NOT EXISTS documentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo tipo_documento NOT NULL,
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  vehiculo_id uuid, -- se completará con la tabla vehiculos en sprint 4
  contrato_id uuid, -- se completará con la tabla contratos en sprint 6
  numero text,
  tipo_licencia text,
  expedido_en text,
  fecha_expedicion date,
  fecha_vencimiento date,
  aseguradora text,
  agente text,
  agente_contacto text,
  archivos jsonb NOT NULL DEFAULT '[]'::jsonb,
  vigente boolean GENERATED ALWAYS AS (fecha_vencimiento >= current_date) STORED,
  observaciones text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES usuarios(id),
  CONSTRAINT ck_documento_pertenencia CHECK (
    (cliente_id IS NOT NULL AND vehiculo_id IS NULL AND contrato_id IS NULL) OR
    (cliente_id IS NULL AND vehiculo_id IS NOT NULL AND contrato_id IS NULL) OR
    (tipo = 'permiso_salida_pais' AND contrato_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_documentos_cliente_id ON documentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_documentos_fecha_vencimiento ON documentos(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo);

-- Trigger de auditoría para documentos
DROP TRIGGER IF EXISTS trg_auditar_documentos ON documentos;
CREATE TRIGGER trg_auditar_documentos
AFTER INSERT OR UPDATE OR DELETE ON documentos
FOR EACH ROW
EXECUTE FUNCTION fn_auditar();

-- 3. Políticas RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY clientes_select_policy ON clientes FOR SELECT USING (true);
CREATE POLICY clientes_insert_policy ON clientes FOR INSERT WITH CHECK (fn_rol_usuario_actual() IN ('operador', 'administrador'));
CREATE POLICY clientes_update_policy ON clientes FOR UPDATE USING (fn_rol_usuario_actual() IN ('operador', 'administrador'));

CREATE POLICY documentos_select_policy ON documentos FOR SELECT USING (true);
CREATE POLICY documentos_insert_policy ON documentos FOR INSERT WITH CHECK (fn_rol_usuario_actual() IN ('operador', 'administrador'));
CREATE POLICY documentos_update_policy ON documentos FOR UPDATE USING (fn_rol_usuario_actual() IN ('operador', 'administrador'));

-- 4. Semilla sintética de clientes y documentos para pruebas (Caso Ricardo Medina Salazar No. 00127)
INSERT INTO clientes (
  id, numero_cliente, nombre_completo, identificacion_numero, domicilio, ciudad, estado,
  telefono, celular, correo, requiere_factura, aviso_privacidad_version, aviso_privacidad_aceptado_en
) VALUES (
  '12700000-0000-4000-8000-000000000127',
  127,
  'Ricardo Medina Salazar',
  'B2302042880',
  'Av. Reforma 1125, Col. Nueva, C.P. 21100',
  'Mexicali',
  'B.C.',
  '6865550100',
  '6865550142',
  'ricardo.medina@correo.mx',
  false,
  '2026.1',
  '2026-11-16T10:00:00Z'
) ON CONFLICT (numero_cliente) DO NOTHING;

INSERT INTO documentos (
  id, tipo, cliente_id, numero, tipo_licencia, expedido_en, fecha_vencimiento, archivos
) VALUES
(
  '33333333-3333-4333-8333-333333333301',
  'licencia',
  '12700000-0000-4000-8000-000000000127',
  'B2302042880',
  'A',
  'Mexicali, B.C.',
  '2028-05-27',
  '[{"tipo":"frente","path":"documentos/clientes/127/licencia_frente.jpg"},{"tipo":"reverso","path":"documentos/clientes/127/licencia_reverso.jpg"}]'::jsonb
),
(
  '33333333-3333-4333-8333-333333333302',
  'credencial',
  '12700000-0000-4000-8000-000000000127',
  'INE-88231023',
  NULL,
  'Mexicali, B.C.',
  (current_date + interval '7 days')::date,
  '[{"tipo":"frente","path":"documentos/clientes/127/ine_frente.jpg"},{"tipo":"reverso","path":"documentos/clientes/127/ine_reverso.jpg"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;
