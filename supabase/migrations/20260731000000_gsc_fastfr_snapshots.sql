CREATE TABLE gsc_fastfr_snapshots (
    date DATE NOT NULL,
    page TEXT NOT NULL,
    impressions INT NOT NULL,
    clics INT NOT NULL,
    ctr NUMERIC NOT NULL,
    position NUMERIC NOT NULL,
    PRIMARY KEY (date, page)
);

ALTER TABLE gsc_fastfr_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read-only for service role"
    ON gsc_fastfr_snapshots
    FOR SELECT
    TO service_role
    USING (true);
