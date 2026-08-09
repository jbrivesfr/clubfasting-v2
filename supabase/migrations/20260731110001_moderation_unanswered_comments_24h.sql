CREATE OR REPLACE VIEW public.moderation_unanswered_comments_24h
WITH (security_invoker = true)
AS
SELECT
  c.id,
  c.post_id,
  c.user_id,
  c.content,
  c.created_at,
  p.title AS post_title
FROM public.comments c
LEFT JOIN public.posts p ON c.post_id = p.id
WHERE c.parent_id IS NULL
  AND c.created_at < NOW() - INTERVAL '24 hours'
  AND NOT EXISTS (
    SELECT 1
    FROM public.comments r
    WHERE r.parent_id = c.id
      AND r.author_name ILIKE '%team%'
  );

GRANT SELECT ON public.moderation_unanswered_comments_24h TO authenticated;
