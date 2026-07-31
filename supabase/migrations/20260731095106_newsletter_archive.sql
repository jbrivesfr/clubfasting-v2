CREATE TABLE IF NOT EXISTS newsletter_issues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject text,
  sent_at timestamptz,
  open_rate numeric,
  click_rate numeric,
  vouvoiement_check boolean
);
