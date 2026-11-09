-- Preserve the existing creation-time order; UUID breaks previously unspecified ties.
ALTER TABLE public.accounts ADD COLUMN sort_order bigint;

WITH positions AS (
  SELECT id, row_number() OVER (PARTITION BY user_id ORDER BY created_at, id) - 1 AS position
  FROM public.accounts
)
UPDATE public.accounts AS account
SET sort_order = positions.position
FROM positions
WHERE account.id = positions.id;

ALTER TABLE public.accounts
  ALTER COLUMN sort_order SET NOT NULL,
  ADD CONSTRAINT accounts_sort_order_nonnegative CHECK (sort_order >= 0),
  ADD CONSTRAINT accounts_user_sort_order_key UNIQUE (user_id, sort_order) DEFERRABLE INITIALLY IMMEDIATE;

-- Serialize appends and reorders for this user. Existing inserts need no client changes.
CREATE FUNCTION public.append_account_sort_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('account-order:' || NEW.user_id::text, 0));
  SELECT COALESCE(MAX(sort_order), -1) + 1 INTO NEW.sort_order
  FROM public.accounts WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER append_account_sort_order
BEFORE INSERT ON public.accounts
FOR EACH ROW EXECUTE FUNCTION public.append_account_sort_order();

-- One transaction, only ordering columns, with RLS and an explicit ownership boundary.
-- The expected order prevents an older tab/request from overwriting a newer arrangement.
CREATE FUNCTION public.reorder_accounts(p_expected_ids uuid[], p_ordered_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  owner_id uuid := auth.uid();
  current_ids uuid[];
BEGIN
  IF owner_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('account-order:' || owner_id::text, 0));
  -- Also protect the membership snapshot from concurrent deletes or ownership updates.
  PERFORM id FROM public.accounts WHERE user_id = owner_id ORDER BY id FOR UPDATE;
  SELECT COALESCE(array_agg(id ORDER BY sort_order, created_at, id), ARRAY[]::uuid[])
  INTO current_ids FROM public.accounts WHERE user_id = owner_id;

  IF p_ordered_ids IS NULL
     OR cardinality(p_ordered_ids) <> cardinality(current_ids)
     OR (SELECT array_agg(id ORDER BY id) FROM unnest(p_ordered_ids) AS item(id))
        IS DISTINCT FROM (SELECT array_agg(id ORDER BY id) FROM unnest(current_ids) AS item(id)) THEN
    RAISE EXCEPTION 'Account list changed. Refresh and try again.' USING ERRCODE = '22023';
  END IF;

  IF current_ids = p_ordered_ids THEN RETURN; END IF;
  IF current_ids IS DISTINCT FROM p_expected_ids THEN
    RAISE EXCEPTION 'Account order changed elsewhere. Refresh and try again.' USING ERRCODE = '40001';
  END IF;

  UPDATE public.accounts AS account
  SET sort_order = requested.position - 1
  FROM unnest(p_ordered_ids) WITH ORDINALITY AS requested(id, position)
  WHERE account.id = requested.id AND account.user_id = owner_id
    AND account.sort_order IS DISTINCT FROM requested.position - 1;
END;
$$;

REVOKE ALL ON FUNCTION public.append_account_sort_order() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.reorder_accounts(uuid[], uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reorder_accounts(uuid[], uuid[]) TO authenticated;
