-- Migration: Create newsfeed_activity_weekly view for blackboard retention panel
-- Aggregates posts (top-level comments), comments (replies), and reactions (likes) over the last 7 days per user.

CREATE OR REPLACE VIEW newsfeed_activity_weekly WITH (security_invoker = true) AS
SELECT
    user_id,
    SUM(posts_count)::integer AS posts_count,
    SUM(comments_count)::integer AS comments_count,
    SUM(reactions_count)::integer AS reactions_count,
    (SUM(posts_count) + SUM(comments_count) + SUM(reactions_count))::integer AS total_activity
FROM (
    SELECT
        user_id,
        COUNT(id) FILTER (WHERE parent_id IS NULL) AS posts_count,
        COUNT(id) FILTER (WHERE parent_id IS NOT NULL) AS comments_count,
        0 AS reactions_count
    FROM comments
    WHERE created_at >= NOW() - INTERVAL '7 days'
      AND user_id IS NOT NULL
    GROUP BY user_id

    UNION ALL

    SELECT
        user_id,
        0 AS posts_count,
        0 AS comments_count,
        COUNT(id) AS reactions_count
    FROM comment_likes
    WHERE created_at >= NOW() - INTERVAL '7 days'
      AND user_id IS NOT NULL
    GROUP BY user_id
) activity
GROUP BY user_id;
