-- phase3 engagement analytics

CREATE OR REPLACE VIEW newsfeed_weekly_engagement WITH (security_invoker = true) AS
WITH all_activity AS (
    -- Posts
    SELECT
        date_trunc('week', created_at) AS week_start,
        1 AS is_post,
        0 AS is_comment,
        0 AS is_reaction,
        user_id
    FROM posts
    WHERE user_id IS NOT NULL

    UNION ALL

    -- Comments
    SELECT
        date_trunc('week', created_at) AS week_start,
        0 AS is_post,
        1 AS is_comment,
        0 AS is_reaction,
        user_id
    FROM comments
    WHERE user_id IS NOT NULL

    UNION ALL

    -- Reactions
    SELECT
        date_trunc('week', created_at) AS week_start,
        0 AS is_post,
        0 AS is_comment,
        1 AS is_reaction,
        user_id
    FROM reactions
    WHERE user_id IS NOT NULL
)
SELECT
    week_start,
    SUM(is_post)::integer AS posts,
    SUM(is_comment)::integer AS comments,
    SUM(is_reaction)::integer AS reactions,
    COUNT(DISTINCT user_id)::integer AS active_users
FROM all_activity
GROUP BY week_start
ORDER BY week_start DESC;

GRANT SELECT ON newsfeed_weekly_engagement TO authenticated;
