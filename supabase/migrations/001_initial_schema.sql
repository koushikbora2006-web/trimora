-- Trimora PostgreSQL Schema Migration 001
-- Core Tables: salons, services, offers, appointments, reviews

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Salons
CREATE TABLE IF NOT EXISTS salons (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  instagram_url TEXT,
  website_url TEXT,
  opening_hours JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Services Catalog
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  salon_id TEXT NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  department TEXT DEFAULT 'salon',
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  preparation TEXT,
  aftercare TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Offers & Promos
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  salon_id TEXT NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  promo_code TEXT,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  target_segment TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Appointments Base
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  reference_code TEXT NOT NULL UNIQUE,
  salon_id TEXT NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  customer_id TEXT, -- Linked to customers table in migration 002
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_id TEXT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  service_name TEXT NOT NULL,
  service_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  internal_notes TEXT,
  stylescan_reference JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_salon ON appointments(salon_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(customer_phone);
