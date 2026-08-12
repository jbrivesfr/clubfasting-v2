CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text
);

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.comments(id),
  author_id uuid REFERENCES public.profiles(id),
  author_name text,
  page_url text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- We might also need `user_analyses`? No, that has its own migration `20260528_create_user_analyses.sql`.
