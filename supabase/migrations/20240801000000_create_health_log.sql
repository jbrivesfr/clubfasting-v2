CREATE TABLE IF NOT EXISTS public.health_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  status text NOT NULL,
  summary jsonb NOT NULL
);

ALTER TABLE public.health_log ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert/select
CREATE POLICY "Service role can manage health_log"
  ON public.health_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
