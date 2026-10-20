-- phase3 engagement analytics

CREATE OR REPLACE VIEW public.daily_moderation_metrics
WITH (security_invoker = true)
AS
WITH date_series AS (
    SELECT DISTINCT date_trunc('day', created_at)::date AS date FROM public.comments
    UNION
    SELECT DISTINCT date_trunc('day', created_at)::date AS date FROM auth.users
),
unanswered_counts AS (
    SELECT
        date_trunc('day', c.created_at)::date AS date,
        count(*)::int AS count
    FROM public.comments c
    WHERE c.parent_id IS NULL
      AND c.created_at < NOW() - INTERVAL '24 hours'
      AND NOT EXISTS (
        SELECT 1
        FROM public.comments r
        WHERE r.parent_id = c.id
          AND r.author_name ILIKE '%team%'
      )
    GROUP BY date_trunc('day', c.created_at)::date
),
total_comment_counts AS (
    SELECT
        date_trunc('day', created_at)::date AS date,
        count(*)::int AS count
    FROM public.comments
    GROUP BY date_trunc('day', created_at)::date
),
new_user_counts AS (
    SELECT
        date_trunc('day', created_at)::date AS date,
        count(*)::int AS count
    FROM auth.users
    GROUP BY date_trunc('day', created_at)::date
)
SELECT
    ds.date,
    COALESCE(u.count, 0)::int AS unanswered_24h,
    COALESCE(t.count, 0)::int AS total_comments,
    COALESCE(n.count, 0)::int AS new_users
FROM date_series ds
LEFT JOIN unanswered_counts u ON u.date = ds.date
LEFT JOIN total_comment_counts t ON t.date = ds.date
LEFT JOIN new_user_counts n ON n.date = ds.date
ORDER BY ds.date DESC;

GRANT SELECT ON public.daily_moderation_metrics TO authenticated;
