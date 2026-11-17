-- Migración 0013: Sincronización Automática de Supabase Auth a public.usuarios (RF-35, Sprint 15)
-- Vincula la autenticación institucional con la tabla de usuarios, asignación de roles y auditoría.

-- Función ejecutada cuando un usuario se registra o es dado de alta en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_nombre TEXT;
    v_rol TEXT;
BEGIN
    -- Extraer metadatos si vienen en el alta
    v_nombre := COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1));
    v_rol := COALESCE(NEW.raw_user_meta_data->>'rol', 'operador');

    -- Validar que el rol sea uno de los permitidos
    IF v_rol NOT IN ('administrador', 'titular', 'operador', 'mantenimiento') THEN
        v_rol := 'operador';
    END IF;

    -- Insertar en la tabla institucional de usuarios
    INSERT INTO public.usuarios (
        id,
        email,
        nombre,
        rol,
        activo,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        v_nombre,
        v_rol,
        true,
        now(),
        now()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = now();

    -- Registrar evento en la bitácora de auditoría inmutable
    INSERT INTO public.auditoria (
        usuario_id,
        usuario_nombre,
        accion,
        tabla,
        registro_id,
        registro_descripcion,
        valor_nuevo
    ) VALUES (
        NEW.id,
        v_nombre,
        'INSERT',
        'usuarios',
        NEW.id::TEXT,
        'Alta institucional de usuario desde Supabase Auth',
        jsonb_build_object('email', NEW.email, 'rol', v_rol)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sobre auth.users (Supabase Auth)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para actualización de correo
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.usuarios
    SET 
        email = NEW.email,
        updated_at = now()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
