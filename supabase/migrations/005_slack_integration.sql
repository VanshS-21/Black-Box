-- Slack Bot Integration Schema
-- Migration: 005_slack_integration.sql

-- Slack workspace installations (for future team features)
CREATE TABLE IF NOT EXISTS slack_installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id VARCHAR(50) UNIQUE NOT NULL,
    team_name VARCHAR(255),
    access_token TEXT NOT NULL,
    bot_user_id VARCHAR(50),
    installed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link Slack users to Career Black Box accounts
CREATE TABLE IF NOT EXISTS slack_user_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slack_user_id VARCHAR(50) NOT NULL,
    slack_team_id VARCHAR(50) NOT NULL,
    cbb_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    slack_username VARCHAR(255),
    link_code VARCHAR(20),  -- For manual linking: user enters this in Slack
    link_code_expires_at TIMESTAMPTZ,
    linked_at TIMESTAMPTZ,  -- NULL until actually linked
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slack_user_id, slack_team_id),
    UNIQUE(cbb_user_id)  -- One CBB account = one Slack link
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_slack_user_links_slack_user 
    ON slack_user_links(slack_user_id, slack_team_id);
CREATE INDEX IF NOT EXISTS idx_slack_user_links_cbb_user 
    ON slack_user_links(cbb_user_id);
CREATE INDEX IF NOT EXISTS idx_slack_user_links_code 
    ON slack_user_links(link_code) WHERE link_code IS NOT NULL;

-- RLS Policies
ALTER TABLE slack_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE slack_user_links ENABLE ROW LEVEL SECURITY;

-- Users can only see their own Slack link
CREATE POLICY "Users can view own slack link"
    ON slack_user_links FOR SELECT
    USING (auth.uid() = cbb_user_id);

CREATE POLICY "Users can create own slack link"
    ON slack_user_links FOR INSERT
    WITH CHECK (auth.uid() = cbb_user_id);

CREATE POLICY "Users can update own slack link"
    ON slack_user_links FOR UPDATE
    USING (auth.uid() = cbb_user_id);

CREATE POLICY "Users can delete own slack link"
    ON slack_user_links FOR DELETE
    USING (auth.uid() = cbb_user_id);

-- Add 'slack' to source enum if using enum (we're using varchar, so just a comment)
-- Valid sources: 'web', 'chrome_extension', 'slack', 'github'
