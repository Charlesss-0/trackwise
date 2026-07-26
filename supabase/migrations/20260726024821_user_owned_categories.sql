-- ============================================================================
-- 002_user_owned_categories.sql
-- Converts categories from "shared global defaults (user_id IS NULL)" to
-- "every category row belongs to exactly one user." Defaults become a
-- template table that gets copied into each user's own categories:
--   - once for every existing user (backfill)
--   - automatically for every new user (trigger on auth.users)
-- Users can then freely rename/recolor/delete their own copies without
-- affecting anyone else.
-- ============================================================================

-- ─── 1. Template table (the "menu" of defaults, not tied to any user) ────────

CREATE TABLE category_templates (
  id         UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT    NOT NULL,
  icon       TEXT    NOT NULL,
  color      TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE category_templates ENABLE ROW LEVEL SECURITY;

-- Read-only reference data, anyone authenticated can see the menu of options
CREATE POLICY "Authenticated users can view category templates"
  ON category_templates FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies -> only editable via migrations / service role.

-- Move the existing global defaults out of categories and into the template table
INSERT INTO category_templates (name, icon, color, sort_order)
SELECT name, icon, color, row_number() OVER () 
FROM categories
WHERE user_id IS NULL;

-- ─── 2. Backfill: give every existing user their own copy of the defaults ────

CREATE OR REPLACE FUNCTION copy_default_categories_for_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color, is_default)
  SELECT target_user_id, ct.name, ct.icon, ct.color, true
  FROM category_templates ct
  WHERE NOT EXISTS (
    SELECT 1 FROM categories c
    WHERE c.user_id = target_user_id AND c.name = ct.name
  );
END;
$$;

DO $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN SELECT id FROM auth.users LOOP
    PERFORM copy_default_categories_for_user(u.id);
  END LOOP;
END $$;

-- ─── 3. Repoint existing transactions off the old global rows ───────────────
-- Any transaction currently pointing at an old user_id IS NULL default
-- category gets repointed to that same user's new personal copy (matched by name).

UPDATE transactions t
SET category_id = new_c.id
FROM categories old_c, categories new_c
WHERE t.category_id = old_c.id
  AND old_c.user_id IS NULL
  AND new_c.name = old_c.name
  AND new_c.user_id = t.user_id
  AND new_c.is_default = true;

-- ─── 4. Remove the now-unused global rows ───────────────────────────────────

DELETE FROM categories WHERE user_id IS NULL;

-- ─── 5. Lock down the schema: every category must belong to a user ─────────

ALTER TABLE categories ALTER COLUMN user_id SET NOT NULL;

-- Prevent a user from ending up with two categories of the same name
ALTER TABLE categories ADD CONSTRAINT categories_user_id_name_key UNIQUE (user_id, name);

-- ─── 6. Simplify RLS now that every row is user-owned ───────────────────────

DROP POLICY IF EXISTS "Users can view default or own categories" ON categories;

CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT / UPDATE / DELETE policies from 001 are unchanged and still correct,
-- since they already required auth.uid() = user_id.

-- ─── 7. Auto-provision defaults for every new signup ────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user_default_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM copy_default_categories_for_user(NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_categories
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_default_categories();