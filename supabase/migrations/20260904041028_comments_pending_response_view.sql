CREATE OR REPLACE VIEW public.comments_pending_response
WITH (security_invoker = true)
AS
SELECT
    c.id AS comment_id,
    c.user_id AS author_id,
    c.content AS body,
    c.created_at AS created_at,
    r.id AS response_id,
    r.user_id AS response_author_id,
    r.created_at AS response_created_at,
    EXTRACT(EPOCH FROM (now() - c.created_at))/3600 AS age_hours,
    (r.id IS NULL AND EXTRACT(EPOCH FROM (now() - c.created_at))/3600 > 24) AS needs_response
FROM public.comments c
LEFT JOIN public.comments r ON r.parent_id = c.id
WHERE c.parent_id IS NULL
ORDER BY needs_response DESC, age_hours DESC;

GRANT SELECT ON public.comments_pending_response TO authenticated;
