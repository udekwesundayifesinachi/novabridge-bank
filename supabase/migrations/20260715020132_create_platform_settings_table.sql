/*
# Platform settings table

1. New Table
   - `platform_settings`: Single-row key-value store for admin-configurable settings.
2. RLS
   - Enabled with full access for `authenticated` users (admin-only in practice).
3. Columns
   - `platform_name` text
   - `support_email` text
   - `support_phone` text
   - `default_loan_rate` numeric (monthly interest rate %)
   - `max_loan_amount` numeric
   - `min_loan_amount` numeric
   - `flexible_savings_rate` numeric (annual %)
   - `fixed_deposit_rate` numeric (annual %)
*/

CREATE TABLE IF NOT EXISTS platform_settings (
  id integer PRIMARY KEY DEFAULT 1,
  platform_name text NOT NULL DEFAULT 'NovabridgeBank',
  support_email text DEFAULT 'hello@novabridgebank.com',
  support_phone text DEFAULT '+1 800 NOVA BANK',
  default_loan_rate numeric DEFAULT 2.5,
  max_loan_amount numeric DEFAULT 5000000,
  min_loan_amount numeric DEFAULT 50000,
  flexible_savings_rate numeric DEFAULT 18,
  fixed_deposit_rate numeric DEFAULT 22,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO platform_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_read_authenticated" ON platform_settings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "settings_write_authenticated" ON platform_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "settings_insert_authenticated" ON platform_settings FOR INSERT
  TO authenticated WITH CHECK (true);