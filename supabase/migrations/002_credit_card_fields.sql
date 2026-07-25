-- Add credit_limit and available_balance columns for credit card accounts.
-- These are nullable; non-credit accounts leave them NULL.
-- For credit accounts:
--   amount_owed = credit_limit - available_balance (computed in app code)
--   The existing `balance` column continues to store amount_owed for backward compat.

ALTER TABLE accounts
  ADD COLUMN credit_limit      NUMERIC(15,2),
  ADD COLUMN available_balance NUMERIC(15,2);

-- Constraint: credit accounts must have valid credit_limit and available_balance
ALTER TABLE accounts
  ADD CONSTRAINT credit_card_fields_check CHECK (
    (type = 'credit'
      AND credit_limit IS NOT NULL AND credit_limit >= 0
      AND available_balance IS NOT NULL AND available_balance >= 0
      AND available_balance <= credit_limit)
    OR type != 'credit'
  );
