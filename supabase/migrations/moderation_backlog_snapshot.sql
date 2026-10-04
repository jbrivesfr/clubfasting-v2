-- Snapshot backlog modération (1x/jour)
-- Retourne :
-- (1) total_pending, oldest_pending_at
-- (2) liste des 10 plus anciens (id, author_name, snippet, created_at, hours_pending)

-- Query 1: Metrics
SELECT
    COUNT(*) AS total_pending,
    MIN(created_at) AS oldest_pending_at
FROM comments c
WHERE c.parent_id IS NULL
AND c.created_at < NOW() - INTERVAL '24 hours'
AND NOT EXISTS (
    SELECT 1
    FROM comments r
    WHERE r.parent_id = c.id
    AND r.author_name ILIKE '%team%'
);

-- Query 2: Details
SELECT
    id,
    author_name,
    LEFT(content, 140) AS snippet,
    created_at,
    EXTRACT(EPOCH FROM (NOW() - created_at))/3600 AS hours_pending
FROM comments c
WHERE c.parent_id IS NULL
AND c.created_at < NOW() - INTERVAL '24 hours'
AND NOT EXISTS (
    SELECT 1
    FROM comments r
    WHERE r.parent_id = c.id
    AND r.author_name ILIKE '%team%'
)
ORDER BY created_at ASC
LIMIT 10;
