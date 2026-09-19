-- Trimora PostgreSQL Schema Migration 002
-- Customer Relationship Management (CRM) Architecture

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  salon_id TEXT NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  customer_code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'unspecified')),
  date_of_birth DATE,
  profile_image TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'active', 'returning', 'loyal', 'vip', 'inactive', 'at_risk')),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint & indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_salon_code ON customers(salon_id, customer_code);
CREATE INDEX IF NOT EXISTS idx_customers_salon_phone ON customers(salon_id, phone);
CREATE INDEX IF NOT EXISTS idx_customers_salon_email ON customers(salon_id, email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_is_archived ON customers(is_archived);

-- 2. Customer Preferences Table
CREATE TABLE IF NOT EXISTS customer_preferences (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  customer_id TEXT NOT NULL UNIQUE REFERENCES customers(id) ON DELETE CASCADE,
  preferred_service TEXT,
  preferred_staff TEXT,
  preferred_time TEXT,
  hair_preferences TEXT,
  skin_preferences TEXT,
  communication_preferences TEXT DEFAULT 'whatsapp' CHECK (communication_preferences IN ('whatsapp', 'sms', 'email', 'call')),
  whatsapp_opt_in BOOLEAN DEFAULT TRUE,
  email_opt_in BOOLEAN DEFAULT TRUE,
  sms_opt_in BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer Tags Table
CREATE TABLE IF NOT EXISTS customer_tags (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_tags_tag ON customer_tags(tag);
CREATE INDEX IF NOT EXISTS idx_customer_tags_customer ON customer_tags(customer_id);

-- 4. Customer Notes Table (Internal Atelier Notes)
CREATE TABLE IF NOT EXISTS customer_notes (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'Stylist Staff',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON customer_notes(customer_id);

-- 5. Customer Activity Audit Trail
CREATE TABLE IF NOT EXISTS customer_activity (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_activity_customer ON customer_activity(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_activity_type ON customer_activity(activity_type);

-- 6. Link Appointments to Customers Table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_appointments_customer'
  ) THEN
    ALTER TABLE appointments
    ADD CONSTRAINT fk_appointments_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
