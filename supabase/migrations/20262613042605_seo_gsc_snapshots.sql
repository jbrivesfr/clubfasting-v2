CREATE TABLE seo_gsc_snapshots (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  query TEXT,
  impressions INT NOT NULL DEFAULT 0,
  clics INT NOT NULL DEFAULT 0,
  ctr NUMERIC,
  position NUMERIC,
  snapshot_date DATE NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(url, snapshot_date)
);
CREATE INDEX idx_seo_gsc_url ON seo_gsc_snapshots(url);
CREATE INDEX idx_seo_gsc_date ON seo_gsc_snapshots(snapshot_date DESC);
