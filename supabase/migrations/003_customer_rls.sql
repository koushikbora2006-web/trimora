-- Trimora PostgreSQL Schema Migration 003
-- Row Level Security (RLS) & Multi-Tenant Salon Isolation Policies

-- Enable RLS on all CRM and operational tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 1. Customers RLS Policy:
-- Salon staff can view and manage customers belonging to their assigned salon_id.
CREATE POLICY "Salon staff can view own customers"
  ON customers
  FOR SELECT
  USING (
    auth.role() = 'service_role' OR
    salon_id IN (
      SELECT id FROM salons WHERE owner_id = auth.uid()::text
    )
  );

CREATE POLICY "Salon staff can insert customers for own salon"
  ON customers
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role' OR
    salon_id IN (
      SELECT id FROM salons WHERE owner_id = auth.uid()::text
    )
  );

CREATE POLICY "Salon staff can update own salon customers"
  ON customers
  FOR UPDATE
  USING (
    auth.role() = 'service_role' OR
    salon_id IN (
      SELECT id FROM salons WHERE owner_id = auth.uid()::text
    )
  );

-- 2. Customer Preferences RLS:
CREATE POLICY "Salon staff can access customer preferences"
  ON customer_preferences
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    customer_id IN (
      SELECT id FROM customers WHERE salon_id IN (
        SELECT id FROM salons WHERE owner_id = auth.uid()::text
      )
    )
  );

-- 3. Customer Tags RLS:
CREATE POLICY "Salon staff can access customer tags"
  ON customer_tags
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    customer_id IN (
      SELECT id FROM customers WHERE salon_id IN (
        SELECT id FROM salons WHERE owner_id = auth.uid()::text
      )
    )
  );

-- 4. Customer Notes RLS (Protected internal notes - never public):
CREATE POLICY "Salon staff can access internal notes"
  ON customer_notes
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    customer_id IN (
      SELECT id FROM customers WHERE salon_id IN (
        SELECT id FROM salons WHERE owner_id = auth.uid()::text
      )
    )
  );

-- 5. Customer Activity RLS:
CREATE POLICY "Salon staff can view customer activity audit trail"
  ON customer_activity
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    customer_id IN (
      SELECT id FROM customers WHERE salon_id IN (
        SELECT id FROM salons WHERE owner_id = auth.uid()::text
      )
    )
  );

-- 6. Appointments RLS:
CREATE POLICY "Public can book appointment"
  ON appointments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Salon staff can manage salon appointments"
  ON appointments
  FOR ALL
  USING (
    auth.role() = 'service_role' OR
    salon_id IN (
      SELECT id FROM salons WHERE owner_id = auth.uid()::text
    )
  );
