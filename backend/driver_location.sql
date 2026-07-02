-- Execute this in your Supabase SQL Editor to create the driver_location table

CREATE TABLE IF NOT EXISTS public.driver_location (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Habilitar RLS (opcional pero recomendado)
ALTER TABLE public.driver_location ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir a la service key y al anon key acceso (ajustar según necesidad)
CREATE POLICY "Allow read access for all users" ON public.driver_location FOR SELECT USING (true);
CREATE POLICY "Allow all operations for service role" ON public.driver_location USING (true) WITH CHECK (true);
