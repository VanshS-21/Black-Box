-- Performance Optimization: Add missing indexes
-- These indexes improve search and filtering performance

-- Index for title search optimization (requires pg_trgm extension)
-- Note: Enable pg_trgm extension first if not already enabled
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_decisions_title_trigram ON decisions USING GIN (title gin_trgm_ops);

-- Index for date range filtering (common in analytics and dashboard)
CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON decisions(created_at);

-- Index for confidence level filtering
CREATE INDEX IF NOT EXISTS idx_decisions_confidence ON decisions(confidence_level) 
WHERE confidence_level IS NOT NULL;

-- Index for user + date range combination queries (more specific than composite)
-- This helps with monthly analytics queries
CREATE INDEX IF NOT EXISTS idx_decisions_user_date ON decisions(user_id, created_at DESC);

-- Add comment for documentation
COMMENT ON INDEX idx_decisions_created_at IS 'Improves date range filter performance';
COMMENT ON INDEX idx_decisions_confidence IS 'Partial index for confidence level filtering';
COMMENT ON INDEX idx_decisions_user_date IS 'Optimizes user-scoped date range queries like analytics';
