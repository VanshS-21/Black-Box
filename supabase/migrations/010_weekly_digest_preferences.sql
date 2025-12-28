-- User Preferences: Weekly Digest Settings
-- This adds settings for push-based weekly email summaries

-- Add digest preference columns to user_preferences
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS weekly_digest_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS digest_time TEXT DEFAULT 'friday_9am' CHECK (digest_time IN ('friday_9am', 'monday_9am', 'disabled')),
ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMPTZ DEFAULT NULL;

-- Index for efficient digest queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_digest 
ON user_preferences(weekly_digest_enabled, last_digest_sent_at) 
WHERE weekly_digest_enabled = true;

COMMENT ON COLUMN user_preferences.weekly_digest_enabled IS 'Whether to send weekly digest emails';
COMMENT ON COLUMN user_preferences.digest_time IS 'Preferred time slot for digest emails';
COMMENT ON COLUMN user_preferences.last_digest_sent_at IS 'Timestamp of last sent digest to prevent duplicates';
