CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text
);

CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.comments(id),
  user_id uuid REFERENCES public.profiles(id),
  author_id uuid REFERENCES public.profiles(id),
  post_id uuid,
  author_name text,
  page_url text,
  content text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text
);

CREATE TABLE IF NOT EXISTS public.comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  comment_id uuid REFERENCES public.comments(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  post_id uuid REFERENCES public.comments(id),
  comment_id uuid REFERENCES public.comments(id)
);
