CREATE TABLE health_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checked_at timestamptz NOT NULL DEFAULT now(),
  url text NOT NULL,
  status_code int,
  response_time_ms int,
  is_healthy bool NOT NULL,
  error text
);

CREATE INDEX idx_health_logs_checked_at_desc ON health_logs (checked_at DESC);

ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role full access" ON health_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
