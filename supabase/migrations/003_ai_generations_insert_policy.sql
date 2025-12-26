-- Migration: Add INSERT policy for ai_generations table
-- This allows users to insert their own AI generation records
-- REQUIRED: Run this on your Supabase production database

-- Create INSERT policy for ai_generations
CREATE POLICY "Users can insert their own AI generations"
  ON ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
