ALTER TABLE comments
ADD COLUMN IF NOT EXISTS last_reply_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'open',
ADD COLUMN IF NOT EXISTS no_reply BOOLEAN DEFAULT true;

CREATE OR REPLACE VIEW comments_needing_reply AS
SELECT *
FROM comments
WHERE status = 'open'
  AND created_at < (now() - interval '24 hours')
  AND no_reply = true;

CREATE OR REPLACE FUNCTION get_unanswered_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT count(*)::integer FROM comments_needing_reply;
$$;
