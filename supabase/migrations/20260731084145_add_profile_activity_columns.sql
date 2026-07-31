-- Add profile activity columns for engagement signals (Phase 3 #1)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_comment_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_vote_at timestamptz;

-- Ensure RLS is enabled for profiles (in case it wasn't already)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to update their own profile's activity columns
CREATE POLICY "Users can update their own profile activity columns"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
