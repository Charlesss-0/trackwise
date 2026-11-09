-- Keep sort_order optional in generated Supabase insert types, preserving existing
-- account creation payloads. The BEFORE INSERT trigger always assigns the real
-- final position, replacing this placeholder before constraints are checked.
ALTER TABLE public.accounts ALTER COLUMN sort_order SET DEFAULT 0;
