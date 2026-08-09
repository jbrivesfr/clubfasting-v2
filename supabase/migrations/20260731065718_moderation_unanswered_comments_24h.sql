CREATE OR REPLACE VIEW public.moderation_unanswered_comments_24h
WITH (security_invoker = true)
AS
SELECT
  c.id,
  c.id AS post_id,
  c.author_id,
  c.content AS body,
  c.created_at,
  EXTRACT(EPOCH FROM (NOW() - c.created_at)) / 3600 AS hours_since_posted
FROM public.comments c
WHERE c.created_at < NOW() - INTERVAL '24 hours'
  AND NOT EXISTS (
    SELECT 1 FROM public.comments r WHERE r.parent_id = c.id
  )
ORDER BY c.created_at ASC;
