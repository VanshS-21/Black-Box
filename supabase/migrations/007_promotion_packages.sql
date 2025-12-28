-- Migration: Create promotion_packages table for storing generated packages
-- This table stores the last 10 promotion packages per user

-- Create promotion_packages table
CREATE TABLE promotion_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  decisions_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fetching user's packages ordered by date
CREATE INDEX idx_promotion_packages_user_created 
  ON promotion_packages(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE promotion_packages ENABLE ROW LEVEL SECURITY;

-- Users can view their own promotion packages
CREATE POLICY "Users can view their own promotion packages"
  ON promotion_packages FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own promotion packages
CREATE POLICY "Users can create their own promotion packages"
  ON promotion_packages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own promotion packages
CREATE POLICY "Users can delete their own promotion packages"
  ON promotion_packages FOR DELETE
  USING (auth.uid() = user_id);
