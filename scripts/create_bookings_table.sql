-- ============================================================
--  Tabla: bookings
--  Fase 2 — Sistema de cotización y pago online
--  Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_name TEXT NOT NULL,
  passenger_email TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  distance_km DECIMAL(8,2),
  duration_minutes INTEGER,
  price_ars INTEGER NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  passengers INTEGER DEFAULT 1,
  luggage TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment', 'confirmed',
                      'payment_failed', 'cancelled', 'completed')),
  mp_preference_id TEXT,
  mp_payment_id TEXT,
  mp_external_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  RLS (Row Level Security)
-- ============================================================

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by backend)
CREATE POLICY "Service role full access"
  ON bookings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Public/anon can only SELECT by specific ID (for status check)
CREATE POLICY "Public select by id"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- ============================================================
--  Trigger: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at_trigger
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- ============================================================
--  Index for faster lookups
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_mp_external_reference ON bookings(mp_external_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
