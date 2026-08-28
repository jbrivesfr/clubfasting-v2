-- phase3 engagement analytics

CREATE OR REPLACE VIEW public.newsfeed_top_engagers_30d WITH (security_invoker = true) AS
SELECT
    ni.user_id,
    COUNT(DISTINCT ni.id)::int AS posts_count,
    COUNT(nc.id)::int AS comments_received_count,
    MAX(ni.created_at) AS last_active_at
FROM public.newsfeed_items ni
LEFT JOIN public.newsfeed_comments nc ON nc.item_id = ni.id
WHERE ni.created_at >= NOW() - INTERVAL '30 days'
GROUP BY ni.user_id;

GRANT SELECT ON public.newsfeed_top_engagers_30d TO authenticated;
