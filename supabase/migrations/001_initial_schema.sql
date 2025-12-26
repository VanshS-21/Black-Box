-- Career Black Box Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Decisions table (core feature)
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core decision fields
  title VARCHAR(200) NOT NULL,
  decision_made TEXT NOT NULL,
  context TEXT NOT NULL,
  trade_offs TEXT NOT NULL,
  biggest_risk TEXT NOT NULL,
  stakeholders TEXT,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 10),
  tags TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at TIMESTAMPTZ,
  
  -- AI assistance tracking
  original_input TEXT, -- Raw user dump before AI structuring
  ai_structured BOOLEAN DEFAULT FALSE
);

-- Indexes for performance
CREATE INDEX idx_decisions_user_created ON decisions(user_id, created_at DESC);
CREATE INDEX idx_decisions_tags ON decisions USING GIN(tags);

-- User Preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role VARCHAR(200),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Generations tracking (for cost and usage monitoring)
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generation_type VARCHAR(50) NOT NULL, -- 'structure' or 'promotion_package'
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost_usd DECIMAL(10, 4) DEFAULT 0.0000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_generations_user ON ai_generations(user_id, created_at DESC);

-- Payment tracking (one-time payments only for MVP)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
  amount_usd DECIMAL(10, 2) NOT NULL,
  product_type VARCHAR(50) NOT NULL, -- 'promotion_package'
  status VARCHAR(50) NOT NULL, -- 'succeeded', 'failed', 'pending'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id, created_at DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Decisions policies
CREATE POLICY "Users can view their own decisions"
  ON decisions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decisions"
  ON decisions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unlocked decisions"
  ON decisions FOR UPDATE
  USING (auth.uid() = user_id AND is_locked = FALSE);

CREATE POLICY "Users can delete their own decisions"
  ON decisions FOR DELETE
  USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);

-- AI generations policies (read-only for users)
CREATE POLICY "Users can view their own AI generations"
  ON ai_generations FOR SELECT
  USING (auth.uid() = user_id);

-- Payments policies (read-only for users)
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for decisions table
CREATE TRIGGER update_decisions_updated_at
  BEFORE UPDATE ON decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences table
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
