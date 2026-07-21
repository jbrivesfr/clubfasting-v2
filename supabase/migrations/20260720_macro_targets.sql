-- Journal du jour (JB 2026-07-20, ported from keto-v2): persist the daily
-- macro target so the journal can show progress ("X g / Y g objectif")
-- instead of just a running total with nothing to compare against.
CREATE TABLE IF NOT EXISTS public.macro_targets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  calories integer,
  protein_g integer,
  fat_g integer,
  net_carbs_g integer,
  mode text,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_macro_targets_user_id ON public.macro_targets(user_id);

ALTER TABLE public.macro_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own macro targets"
  ON public.macro_targets FOR ALL
  USING (auth.uid() = user_id);
