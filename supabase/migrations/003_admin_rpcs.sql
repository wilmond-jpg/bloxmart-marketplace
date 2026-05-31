-- ============================================================
-- BloxMart Schema: Admin RPC Functions
-- ============================================================

-- ============================================================
-- 1. REVOKE ROLE
-- ============================================================
CREATE OR REPLACE FUNCTION public.revoke_role(
  target_user_id uuid,
  target_role_key text,
  reason_val text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can revoke roles';
  END IF;

  INSERT INTO public.user_role_history (user_id, role_key, status, assigned_by, reason)
  VALUES (target_user_id, target_role_key, 'revoked', auth.uid(), reason_val);
END;
$$;

-- ============================================================
-- 2. UPDATE ACCOUNT STATUS
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_account_status(
  target_user_id uuid,
  new_status text,
  reason_val text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can update account status';
  END IF;

  IF new_status NOT IN ('active', 'suspended', 'banned') THEN
    RAISE EXCEPTION 'Invalid status: %', new_status;
  END IF;

  UPDATE public.user_profiles
  SET account_status = new_status
  WHERE id = target_user_id;
END;
$$;
