-- ============================================================
-- BloxMart Supabase Storage: Avatar Bucket + RLS
-- ============================================================

-- ============================================================
-- 1. CREATE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. ENABLE RLS ON STORAGE OBJECTS (if not already)
-- ============================================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. POLICIES
-- ============================================================

-- 3a. Users can read their own avatar
DROP POLICY IF EXISTS "avatar_select_own" ON storage.objects;
CREATE POLICY "avatar_select_own" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'user-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

-- 3b. Admins and moderators can read any avatar
DROP POLICY IF EXISTS "avatar_select_admin_mod" ON storage.objects;
CREATE POLICY "avatar_select_admin_mod" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'user-avatars'
    AND (public.is_admin() OR public.is_moderator())
  );

-- 3c. Users can upload/update only to their own folder
DROP POLICY IF EXISTS "avatar_insert_own" ON storage.objects;
CREATE POLICY "avatar_insert_own" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

DROP POLICY IF EXISTS "avatar_update_own" ON storage.objects;
CREATE POLICY "avatar_update_own" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'user-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  )
  WITH CHECK (
    bucket_id = 'user-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

-- 3d. Users can delete their own avatar
DROP POLICY IF EXISTS "avatar_delete_own" ON storage.objects;
CREATE POLICY "avatar_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'user-avatars'
    AND name LIKE (auth.uid()::text || '/%')
  );

-- 3e. Admins and moderators can delete any avatar
DROP POLICY IF EXISTS "avatar_delete_admin_mod" ON storage.objects;
CREATE POLICY "avatar_delete_admin_mod" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'user-avatars'
    AND (public.is_admin() OR public.is_moderator())
  );
