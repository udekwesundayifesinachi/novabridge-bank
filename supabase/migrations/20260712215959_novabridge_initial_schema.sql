/*
# NovabridgeBank — Initial Database Schema

## Overview
This migration creates the complete database schema for NovabridgeBank, a digital banking platform.

## Tables Created

### 1. profiles
- Extends Supabase auth.users with user profile data
- Stores: name, phone, BVN/NIN, address, KYC status, account tier
- user_id references auth.users

### 2. accounts
- Bank account records per user
- Supports multiple account types: savings, current, wallet
- Tracks balance, account number, status

### 3. loans
- Loan application and management records
- Tracks: type, amount, status (pending/approved/rejected/disbursed/repaid)
- Monthly rate, EMI, outstanding balance, disbursement date

### 4. transactions
- Full transaction history
- Supports: credit/debit types, categories, references
- Links to accounts

### 5. savings_plans
- Individual savings plan records
- Tracks: type (flexible/fixed/target), balance, target, interest rate

### 6. cards
- Virtual and physical card records
- Tracks: card number (masked), type, status, spending limits

### 7. notifications
- In-app notification records per user

### 8. beneficiaries
- Saved payment beneficiaries per user

## Security
- RLS enabled on all tables
- Authenticated-only access, owner-scoped per user
- user_id defaults to auth.uid()
*/

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text,
  phone text,
  bvn text,
  nin text,
  date_of_birth date,
  address text,
  referral_code text,
  kyc_status text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  account_tier text NOT NULL DEFAULT 'starter' CHECK (account_tier IN ('starter', 'premium', 'business')),
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- ACCOUNTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number text NOT NULL UNIQUE DEFAULT LPAD(FLOOR(RANDOM() * 9999999999 + 1000000000)::text, 10, '0'),
  account_type text NOT NULL DEFAULT 'savings' CHECK (account_type IN ('savings', 'current', 'wallet', 'fixed_deposit')),
  currency text NOT NULL DEFAULT 'NGN',
  balance numeric(15,2) NOT NULL DEFAULT 0,
  locked_balance numeric(15,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_accounts" ON accounts;
CREATE POLICY "select_own_accounts" ON accounts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_accounts" ON accounts;
CREATE POLICY "insert_own_accounts" ON accounts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_accounts" ON accounts;
CREATE POLICY "update_own_accounts" ON accounts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_accounts" ON accounts;
CREATE POLICY "delete_own_accounts" ON accounts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- TRANSACTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  amount numeric(15,2) NOT NULL,
  balance_after numeric(15,2),
  category text,
  description text,
  reference text UNIQUE DEFAULT concat('TXN-', upper(substring(gen_random_uuid()::text, 1, 8))),
  recipient_name text,
  recipient_account text,
  recipient_bank text,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'reversed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_transactions" ON transactions;
CREATE POLICY "update_own_transactions" ON transactions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_transactions" ON transactions;
CREATE POLICY "delete_own_transactions" ON transactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- LOANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  loan_type text NOT NULL DEFAULT 'personal',
  amount numeric(15,2) NOT NULL,
  outstanding_balance numeric(15,2),
  monthly_rate numeric(5,4) NOT NULL DEFAULT 0.025,
  tenure_months int NOT NULL,
  emi_amount numeric(15,2),
  purpose text,
  employment_type text,
  employer_name text,
  monthly_income numeric(15,2),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'disbursed', 'repaid')),
  rejection_reason text,
  disbursed_at timestamptz,
  next_payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_loans" ON loans;
CREATE POLICY "select_own_loans" ON loans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_loans" ON loans;
CREATE POLICY "insert_own_loans" ON loans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_loans" ON loans;
CREATE POLICY "update_own_loans" ON loans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_loans" ON loans;
CREATE POLICY "delete_own_loans" ON loans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- SAVINGS PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS savings_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  plan_type text NOT NULL DEFAULT 'flexible' CHECK (plan_type IN ('flexible', 'fixed', 'target')),
  balance numeric(15,2) NOT NULL DEFAULT 0,
  target_amount numeric(15,2),
  annual_rate numeric(5,4) NOT NULL DEFAULT 0.18,
  maturity_date date,
  locked boolean NOT NULL DEFAULT false,
  auto_save_amount numeric(15,2),
  auto_save_frequency text CHECK (auto_save_frequency IN ('daily', 'weekly', 'monthly')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matured', 'withdrawn', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE savings_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_savings" ON savings_plans;
CREATE POLICY "select_own_savings" ON savings_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_savings" ON savings_plans;
CREATE POLICY "insert_own_savings" ON savings_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_savings" ON savings_plans;
CREATE POLICY "update_own_savings" ON savings_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_savings" ON savings_plans;
CREATE POLICY "delete_own_savings" ON savings_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- CARDS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  card_type text NOT NULL DEFAULT 'virtual' CHECK (card_type IN ('virtual', 'physical')),
  card_brand text NOT NULL DEFAULT 'visa' CHECK (card_brand IN ('visa', 'mastercard')),
  masked_number text,
  expiry_date text,
  currency text NOT NULL DEFAULT 'NGN',
  balance numeric(15,2) NOT NULL DEFAULT 0,
  spending_limit numeric(15,2),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'expired', 'cancelled')),
  online_payments_enabled boolean DEFAULT true,
  international_payments_enabled boolean DEFAULT false,
  contactless_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cards" ON cards;
CREATE POLICY "select_own_cards" ON cards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cards" ON cards;
CREATE POLICY "insert_own_cards" ON cards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cards" ON cards;
CREATE POLICY "update_own_cards" ON cards FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cards" ON cards;
CREATE POLICY "delete_own_cards" ON cards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean NOT NULL DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- BENEFICIARIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bank_name text NOT NULL,
  account_number text NOT NULL,
  account_name text,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, bank_name, account_number)
);

ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_beneficiaries" ON beneficiaries;
CREATE POLICY "select_own_beneficiaries" ON beneficiaries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_beneficiaries" ON beneficiaries;
CREATE POLICY "insert_own_beneficiaries" ON beneficiaries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_beneficiaries" ON beneficiaries;
CREATE POLICY "update_own_beneficiaries" ON beneficiaries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_beneficiaries" ON beneficiaries;
CREATE POLICY "delete_own_beneficiaries" ON beneficiaries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loans_user_id ON loans(user_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status);
CREATE INDEX IF NOT EXISTS idx_savings_user_id ON savings_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_user_id ON beneficiaries(user_id);
