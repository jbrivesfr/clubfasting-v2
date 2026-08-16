-- READ-ONLY snapshot for fasting-manager 15-min cycles; idempotent
SELECT count(*) AS pending_over_24h FROM comments WHERE status='pending' AND created_at < now() - interval '24 hours';
SELECT date_trunc('day', created_at) AS day, count(*) FILTER (WHERE entity_type='post') AS posts, count(*) FILTER (WHERE entity_type='comment') AS comments, count(DISTINCT user_id) AS active_users FROM activity_events WHERE created_at > now() - interval '7 days' GROUP BY 1 ORDER BY 1;
