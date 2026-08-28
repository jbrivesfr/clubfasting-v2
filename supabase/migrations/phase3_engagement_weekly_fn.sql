-- Migration: Create public.get_newsfeed_engagement_weekly function

CREATE OR REPLACE FUNCTION public.get_newsfeed_engagement_weekly()
RETURNS TABLE(
    week_start date,
    active_users int,
    posts int,
    comments int,
    reactions int,
    wow_active_users_pct numeric,
    wow_posts_pct numeric,
    wow_comments_pct numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
WITH weeks AS (
    SELECT generate_series(
        date_trunc('week', now()) - interval '7 weeks',
        date_trunc('week', now()),
        interval '1 week'
    )::date AS week_start
),
activity_data AS (
    SELECT
        user_id,
        created_at,
        1 AS is_post,
        0 AS is_comment,
        0 AS is_reaction
    FROM public.newsfeed_posts
    WHERE created_at >= date_trunc('week', now()) - interval '7 weeks'
      AND user_id IS NOT NULL

    UNION ALL

    SELECT
        user_id,
        created_at,
        0 AS is_post,
        1 AS is_comment,
        0 AS is_reaction
    FROM public.newsfeed_comments
    WHERE created_at >= date_trunc('week', now()) - interval '7 weeks'
      AND user_id IS NOT NULL

    UNION ALL

    SELECT
        user_id,
        created_at,
        0 AS is_post,
        0 AS is_comment,
        1 AS is_reaction
    FROM public.newsfeed_reactions
    WHERE created_at >= date_trunc('week', now()) - interval '7 weeks'
      AND user_id IS NOT NULL
),
weekly_stats AS (
    SELECT
        w.week_start,
        COUNT(DISTINCT a.user_id)::int AS active_users,
        COALESCE(SUM(a.is_post), 0)::int AS posts,
        COALESCE(SUM(a.is_comment), 0)::int AS comments,
        COALESCE(SUM(a.is_reaction), 0)::int AS reactions
    FROM weeks w
    LEFT JOIN activity_data a
        ON date_trunc('week', a.created_at)::date = w.week_start
    GROUP BY w.week_start
)
SELECT
    ws.week_start,
    ws.active_users,
    ws.posts,
    ws.comments,
    ws.reactions,
    CASE
        WHEN LAG(ws.active_users) OVER (ORDER BY ws.week_start) > 0
        THEN ROUND(((ws.active_users - LAG(ws.active_users) OVER (ORDER BY ws.week_start))::numeric / LAG(ws.active_users) OVER (ORDER BY ws.week_start)) * 100, 2)
        ELSE NULL
    END AS wow_active_users_pct,
    CASE
        WHEN LAG(ws.posts) OVER (ORDER BY ws.week_start) > 0
        THEN ROUND(((ws.posts - LAG(ws.posts) OVER (ORDER BY ws.week_start))::numeric / LAG(ws.posts) OVER (ORDER BY ws.week_start)) * 100, 2)
        ELSE NULL
    END AS wow_posts_pct,
    CASE
        WHEN LAG(ws.comments) OVER (ORDER BY ws.week_start) > 0
        THEN ROUND(((ws.comments - LAG(ws.comments) OVER (ORDER BY ws.week_start))::numeric / LAG(ws.comments) OVER (ORDER BY ws.week_start)) * 100, 2)
        ELSE NULL
    END AS wow_comments_pct
FROM weekly_stats ws
ORDER BY ws.week_start DESC;
$$;
