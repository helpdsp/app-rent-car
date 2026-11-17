-- Migración 0012: Tabla de Reservaciones de Flota (RF-30, Sprint 14)
-- Folio atómico serie R-00001, estados, restricciones temporales y auditoría.

CREATE SEQUENCE IF NOT EXISTS reservaciones_folio_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS public.reservaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio VARCHAR(20) NOT NULL UNIQUE,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
    vehiculo_id UUID NOT NULL REFERENCES public.vehiculos(id) ON DELETE RESTRICT,
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_fin TIMESTAMPTZ NOT NULL,
    lugar_entrega VARCHAR(200) NOT NULL DEFAULT 'Sucursal Mexicali',
    lugar_devolucion VARCHAR(200) NOT NULL DEFAULT 'Sucursal Mexicali',
    tarifa_dia BIGINT NOT NULL, -- en centavos
    dias_renta INTEGER NOT NULL CHECK (dias_renta > 0),
    anticipo_requerido BIGINT NOT NULL, -- en centavos
    anticipo_pagado BIGINT NOT NULL DEFAULT 0,
    deposito_garantia BIGINT NOT NULL DEFAULT 800000, -- en centavos ($8,000 MXN)
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente' 
        CHECK (estado IN ('pendiente', 'confirmada', 'convertida', 'cancelada')),
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE SET NULL,
    motivo_cancelacion TEXT,
    observaciones TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID,
    CONSTRAINT reservacion_fechas_validas CHECK (fecha_fin > fecha_inicio)
);

-- Función y trigger para asignación atómica de folio R-00001
CREATE OR REPLACE FUNCTION generar_folio_reservacion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.folio IS NULL OR NEW.folio = '' THEN
        NEW.folio := 'R-' || LPAD(nextval('reservaciones_folio_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_asignar_folio_reservacion ON public.reservaciones;
CREATE TRIGGER trg_asignar_folio_reservacion
BEFORE INSERT ON public.reservaciones
FOR EACH ROW
EXECUTE FUNCTION generar_folio_reservacion();

-- Índices para búsqueda rápida y rango de fechas
CREATE INDEX IF NOT EXISTS idx_reservaciones_vehiculo_fechas 
ON public.reservaciones(vehiculo_id, fecha_inicio, fecha_fin) 
WHERE estado IN ('pendiente', 'confirmada');

CREATE INDEX IF NOT EXISTS idx_reservaciones_cliente 
ON public.reservaciones(cliente_id);

CREATE INDEX IF NOT EXISTS idx_reservaciones_estado 
ON public.reservaciones(estado);

-- RLS
ALTER TABLE public.reservaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura reservaciones para personal autenticado"
ON public.reservaciones FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Escritura reservaciones para personal autorizado"
ON public.reservaciones FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.usuarios u
        WHERE u.id = auth.uid()
        AND u.rol IN ('administrador', 'titular', 'operador')
    )
);
