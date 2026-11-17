-- Migración 0014: Configuración de Buckets de Almacenamiento Privado y Políticas RLS (RF-36, Sprint 16)
-- Crea los buckets para licencias, identificaciones, fotos de entrega, fotos de recepción y contratos firmados.

-- 1. Crear buckets privados en el esquema storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('licencias', 'licencias', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('identificaciones', 'identificaciones', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('evidencias-entrega', 'evidencias-entrega', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('evidencias-recepcion', 'evidencias-recepcion', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('contratos-firmados', 'contratos-firmados', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Políticas de Seguridad (RLS) sobre storage.objects
-- Lectura: Solo mediante URLs firmadas generadas en backend o personal autorizado
CREATE POLICY "Lectura evidencias para usuarios autorizados"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id IN ('licencias', 'identificaciones', 'evidencias-entrega', 'evidencias-recepcion', 'contratos-firmados')
    AND EXISTS (
        SELECT 1 FROM public.usuarios u
        WHERE u.id = auth.uid()
        AND u.rol IN ('administrador', 'titular', 'operador', 'mantenimiento')
    )
);

-- Inserción: Operadores, administradores y titulares
CREATE POLICY "Subida evidencias para personal de mostrador"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN ('licencias', 'identificaciones', 'evidencias-entrega', 'evidencias-recepcion', 'contratos-firmados')
    AND EXISTS (
        SELECT 1 FROM public.usuarios u
        WHERE u.id = auth.uid()
        AND u.rol IN ('administrador', 'titular', 'operador')
    )
);

-- Regla de inmutabilidad: PROHIBIDO UPDATE Y DELETE en evidencias y contratos
-- No se crean políticas para UPDATE ni DELETE en estos buckets para preservar la cadena de custodia.
