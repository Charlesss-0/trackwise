-- ============================================================================
-- 001_initial_schema.sql
-- Sets up all tables, RLS policies, indexes, and default category seeds
-- for the personal finance app.
-- ============================================================================

-- ─── Custom Types ────────────────────────────────────────────────────────────

CREATE TYPE account_type   AS ENUM ('debit', 'credit', 'cash', 'savings');
CREATE TYPE currency_code  AS ENUM ('NIO', 'USD');
CREATE TYPE txn_type       AS ENUM ('income', 'expense');
CREATE TYPE recurring_freq AS ENUM ('monthly', 'weekly', 'biweekly', 'yearly');

-- ─── Accounts ────────────────────────────────────────────────────────────────

CREATE TABLE accounts (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID          NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT          NOT NULL,
  type       account_type  NOT NULL,
  currency   currency_code NOT NULL DEFAULT 'USD',
  balance    NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own accounts"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts"
  ON accounts FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Categories ──────────────────────────────────────────────────────────────

CREATE TABLE categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  icon       TEXT        NOT NULL,
  color      TEXT        NOT NULL,
  is_default BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_user_id ON categories(user_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow users to see default categories AND their own custom categories
CREATE POLICY "Users can view default or own categories"
  ON categories FOR SELECT
  USING (is_default = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Transactions ────────────────────────────────────────────────────────────

CREATE TABLE transactions (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID          NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id          UUID          NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  category_id         UUID          NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount              NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  currency            currency_code NOT NULL DEFAULT 'USD',
  type                txn_type      NOT NULL,
  date                DATE          NOT NULL DEFAULT CURRENT_DATE,
  note                TEXT,
  is_recurring        BOOLEAN       NOT NULL DEFAULT false,
  recurring_frequency recurring_freq,
  recurring_due_day   INTEGER       CHECK (recurring_due_day IS NULL OR (recurring_due_day >= 1 AND recurring_due_day <= 31)),
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user_id    ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date       ON transactions(date);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Debts ───────────────────────────────────────────────────────────────────

CREATE TABLE debts (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID          NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  creditor_name     TEXT          NOT NULL,
  total_amount      NUMERIC(15,2) NOT NULL CHECK (total_amount > 0),
  currency          currency_code NOT NULL DEFAULT 'USD',
  monthly_payment   NUMERIC(15,2) NOT NULL CHECK (monthly_payment > 0),
  due_day           INTEGER       NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  remaining_balance NUMERIC(15,2) NOT NULL CHECK (remaining_balance >= 0),
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_debts_user_id ON debts(user_id);

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own debts"
  ON debts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debts"
  ON debts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debts"
  ON debts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own debts"
  ON debts FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Exchange Rates ──────────────────────────────────────────────────────────

CREATE TABLE exchange_rates (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency   TEXT        NOT NULL,
  target_currency TEXT        NOT NULL,
  rate            NUMERIC(12,6) NOT NULL CHECK (rate > 0),
  fetched_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_manual       BOOLEAN     NOT NULL DEFAULT false
);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read exchange rates
CREATE POLICY "Authenticated users can view exchange rates"
  ON exchange_rates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert exchange rates"
  ON exchange_rates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exchange rates"
  ON exchange_rates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Seed Default Categories ─────────────────────────────────────────────────

INSERT INTO categories (user_id, name, icon, color, is_default) VALUES
  (NULL, 'Food & Dining',    'utensils',       '#EF4444', true),
  (NULL, 'Housing & Rent',   'home',           '#8B5CF6', true),
  (NULL, 'Transportation',   'car',            '#3B82F6', true),
  (NULL, 'Subscriptions',    'credit-card',    '#EC4899', true),
  (NULL, 'Entertainment',    'film',           '#F59E0B', true),
  (NULL, 'Health & Medical', 'heart-pulse',    '#10B981', true),
  (NULL, 'Shopping',         'shopping-bag',   '#F97316', true),
  (NULL, 'Utilities',        'zap',            '#6366F1', true),
  (NULL, 'Education',        'graduation-cap', '#14B8A6', true),
  (NULL, 'Travel',           'plane',          '#0EA5E9', true),
  (NULL, 'Income',           'wallet',         '#22C55E', true);
