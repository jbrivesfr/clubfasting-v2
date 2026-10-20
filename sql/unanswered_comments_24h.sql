-- View: top-level comments older than 24h with zero replies. Powers Phase 1 #3 moderation triage.
CREATE OR REPLACE VIEW public.unanswered_comments_24h AS
SELECT
  c.id,
  c.author_id,
  c.body,
  c.created_at
FROM public.comments c
WHERE c.parent_id IS NULL
  AND c.created_at < (now() - interval '24 hours')
  AND NOT EXISTS (
    SELECT 1 FROM public.comments r
    WHERE r.parent_id = c.id
  );
