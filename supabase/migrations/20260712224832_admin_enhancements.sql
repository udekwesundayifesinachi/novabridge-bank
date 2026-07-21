/*
# Admin Dashboard Enhancements Migration

## Purpose
Adds fields and capabilities required by the full admin dashboard.

## Changes

### profiles table — new columns
- `status` (text): Account status — 'active' | 'suspended' | 'closed'. Defaults to 'active'.
- `is_admin` (boolean): Whether this profile has admin privileges. Defaults to false.
- `admin_notes` (text, nullable): Internal notes written by admins about the user.

### accounts table — new columns
- `account_name` (text): Human-readable label for the account (e.g. "Main Wallet").
- `interest_rate` (numeric): Annual interest rate for savings accounts.

### loans table — new columns
- `admin_notes` (text, nullable): Internal admin notes on a loan decision.
- `approved_by` (text, nullable): Admin identifier who approved/rejected.
- `approved_at` (timestamptz, nullable): When the approval/rejection happened.

### transactions table — new columns
- `admin_created` (boolean): Marks transactions created by admin (not user-initiated).
- `notes` (text, nullable): Admin notes on a transaction.

## Security
- All new columns inherit existing RLS policies on their respective tables.
- service_role key bypasses RLS for admin API routes.

## Notes
1. All additions use IF NOT EXISTS guards for idempotency.
2. No existing columns are modified or dropped — pure additions only.
*/

-- profiles additions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='status') THEN
    ALTER TABLE profiles ADD COLUMN status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','closed'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_admin') THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='admin_notes') THEN
    ALTER TABLE profiles ADD COLUMN admin_notes text;
  END IF;
END $$;

-- accounts additions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='accounts' AND column_name='account_name') THEN
    ALTER TABLE accounts ADD COLUMN account_name text DEFAULT 'Main Account';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='accounts' AND column_name='interest_rate') THEN
    ALTER TABLE accounts ADD COLUMN interest_rate numeric(5,4) DEFAULT 0;
  END IF;
END $$;

-- loans additions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loans' AND column_name='admin_notes') THEN
    ALTER TABLE loans ADD COLUMN admin_notes text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loans' AND column_name='approved_by') THEN
    ALTER TABLE loans ADD COLUMN approved_by text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='loans' AND column_name='approved_at') THEN
    ALTER TABLE loans ADD COLUMN approved_at timestamptz;
  END IF;
END $$;

-- transactions additions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='admin_created') THEN
    ALTER TABLE transactions ADD COLUMN admin_created boolean DEFAULT false;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='notes') THEN
    ALTER TABLE transactions ADD COLUMN notes text;
  END IF;
END $$;

-- savings additions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='savings_plans' AND column_name='admin_notes') THEN
    ALTER TABLE savings_plans ADD COLUMN admin_notes text;
  END IF;
END $$;

-- Create index for status filtering on profiles
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_loans_status_created ON loans(status, created_at DESC);
