-- ============================================================
-- BloxMart Supabase Schema: Auth, Roles, and Marketplace
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ============================================================
-- 1. ROLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.roles (
  key   text PRIMARY KEY,
  label text NOT NULL
);

INSERT INTO public.roles (key, label) VALUES
  ('buyer',            'Buyer'),
  ('seller',           'Seller'),
  ('verified_trader',  'Verified Trader'),
  ('moderator',        'Moderator'),
  ('admin',            'Admin')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 2. USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       text UNIQUE NOT NULL,
  display_name   text,
  avatar_url     text,
  bio            text,
  account_status text NOT NULL DEFAULT 'active',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. USER ROLE HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_role_history (
  id          bigserial PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_key    text NOT NULL REFERENCES public.roles(key),
  status      text NOT NULL CHECK (status IN ('granted', 'revoked')),
  assigned_by uuid REFERENCES auth.users(id),
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. SELLER APPLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.seller_applications (
  id              bigserial PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name       text,
  contact_email   text,
  reason          text,
  proof_url       text,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by     uuid REFERENCES auth.users(id),
  review_notes    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. CURRENT USER ROLES VIEW
-- ============================================================
CREATE OR REPLACE VIEW public.user_roles_current AS
SELECT DISTINCT ON (urh.user_id, urh.role_key)
  urh.user_id,
  urh.role_key,
  r.label
FROM public.user_role_history urh
JOIN public.roles r ON r.key = urh.role_key
WHERE urh.status = 'granted'
ORDER BY urh.user_id, urh.role_key, urh.created_at DESC;

-- ============================================================
-- 6. HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_role(role_key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles_current
    WHERE user_id = auth.uid() AND role_key = has_role.role_key
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.has_role('admin');
$$;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.has_role('moderator') OR public.has_role('admin');
$$;

-- ============================================================
-- 7. AUTO-PROFILE CREATION ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  generated_username text;
BEGIN
  generated_username := COALESCE(
    NEW.raw_user_meta_data ->> 'username',
    'user_' || substring(NEW.id::text from 1 for 8)
  );

  INSERT INTO public.user_profiles (id, username, display_name, avatar_url, bio)
  VALUES (
    NEW.id,
    generated_username,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', generated_username),
    NEW.raw_user_meta_data ->> 'avatar_url',
    ''
  );

  INSERT INTO public.user_role_history (user_id, role_key, status, reason)
  VALUES (NEW.id, 'buyer', 'granted', 'Default role on signup');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. ADMIN ROLE GRANT FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.grant_role(
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
    RAISE EXCEPTION 'Only admins can grant roles';
  END IF;

  INSERT INTO public.user_role_history (user_id, role_key, status, assigned_by, reason)
  VALUES (target_user_id, target_role_key, 'granted', auth.uid(), reason_val);
END;
$$;

-- ============================================================
-- 9. RLS POLICIES
-- ============================================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- roles: anyone can read
DROP POLICY IF EXISTS "roles_select" ON public.roles;
CREATE POLICY "roles_select" ON public.roles FOR SELECT USING (true);

-- user_profiles
DROP POLICY IF EXISTS "profiles_select" ON public.user_profiles;
CREATE POLICY "profiles_select" ON public.user_profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;
CREATE POLICY "profiles_update_own" ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_update" ON public.user_profiles;
CREATE POLICY "profiles_admin_update" ON public.user_profiles
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- user_role_history
DROP POLICY IF EXISTS "role_history_select_own" ON public.user_role_history;
CREATE POLICY "role_history_select_own" ON public.user_role_history
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "role_history_admin_insert" ON public.user_role_history;
CREATE POLICY "role_history_admin_insert" ON public.user_role_history
  FOR INSERT
  WITH CHECK (public.is_admin());

-- seller_applications
DROP POLICY IF EXISTS "seller_app_select_own_or_admin" ON public.seller_applications;
CREATE POLICY "seller_app_select_own_or_admin" ON public.seller_applications
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "seller_app_insert_auth" ON public.seller_applications;
CREATE POLICY "seller_app_insert_auth" ON public.seller_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "seller_app_update_admin" ON public.seller_applications;
CREATE POLICY "seller_app_update_admin" ON public.seller_applications
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- 10. NOTES
-- ============================================================
-- After running this migration:
-- 1. To make a user an admin, run this in the Supabase SQL editor:
--
--    INSERT INTO public.user_role_history (user_id, role_key, status, reason)
--    VALUES ('<user-uuid>', 'admin', 'granted', 'Manual admin setup');
--
-- 2. Seller role is requested via seller_applications and granted by admins.
-- 3. Verified Trader logic needs trade/review data (manual grant for now).
