-- Comments in newsfeed without replies in the last 24 hours
-- Useful for 'En attente' moderation panel
SELECT
  c.author_name as auteur,
  LEFT(c.content, 150) as extrait,
  AGE(NOW(), c.created_at) as age
FROM comments c
WHERE
  -- No replies
  NOT EXISTS (
    SELECT 1 FROM comments r WHERE r.parent_id = c.id
  )
  -- Older than 24 hours
  AND c.created_at < NOW() - INTERVAL '24 hours'
ORDER BY c.created_at ASC;
