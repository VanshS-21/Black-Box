-- Add source tracking to decisions table
-- Enables tracking where decisions originated (web, chrome_extension, slack, github)

ALTER TABLE decisions ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'web';
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Index for filtering by source
CREATE INDEX IF NOT EXISTS idx_decisions_source ON decisions(source);

COMMENT ON COLUMN decisions.source IS 'Origin of the decision: web, chrome_extension, slack, github';
COMMENT ON COLUMN decisions.source_url IS 'URL where the decision was captured (for extensions/integrations)';
