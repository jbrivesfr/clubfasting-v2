-- Create user_analyses table for storing AI analysis results
-- Run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS user_analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL CHECK (type IN ('meal', 'cart')),
  image_url text,
  analysis jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_user_analyses_user_id ON user_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analyses_type ON user_analyses(type);
CREATE INDEX IF NOT EXISTS idx_user_analyses_created_at ON user_analyses(created_at DESC);

-- RLS: users can only see their own analyses
ALTER TABLE user_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analyses"
  ON user_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
  ON user_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
  ON user_analyses FOR DELETE
  USING (auth.uid() = user_id);
