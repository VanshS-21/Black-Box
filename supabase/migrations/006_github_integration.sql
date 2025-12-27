-- GitHub Integration Schema
-- Migration: 006_github_integration.sql

-- Link GitHub users to Career Black Box accounts
CREATE TABLE IF NOT EXISTS github_user_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_user_id BIGINT NOT NULL,
    github_username VARCHAR(255) NOT NULL,
    cbb_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    link_code VARCHAR(20),  -- For manual linking: user enters this in dashboard
    link_code_expires_at TIMESTAMPTZ,
    linked_at TIMESTAMPTZ,  -- NULL until actually linked
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(github_user_id),
    UNIQUE(cbb_user_id)  -- One CBB account = one GitHub link
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_github_user_links_github_user 
    ON github_user_links(github_user_id);
CREATE INDEX IF NOT EXISTS idx_github_user_links_cbb_user 
    ON github_user_links(cbb_user_id);
CREATE INDEX IF NOT EXISTS idx_github_user_links_code 
    ON github_user_links(link_code) WHERE link_code IS NOT NULL;

-- RLS Policies
ALTER TABLE github_user_links ENABLE ROW LEVEL SECURITY;

-- Users can only see their own GitHub link
CREATE POLICY "Users can view own github link"
    ON github_user_links FOR SELECT
    USING (auth.uid() = cbb_user_id);

CREATE POLICY "Users can create own github link"
    ON github_user_links FOR INSERT
    WITH CHECK (auth.uid() = cbb_user_id);

CREATE POLICY "Users can update own github link"
    ON github_user_links FOR UPDATE
    USING (auth.uid() = cbb_user_id);

CREATE POLICY "Users can delete own github link"
    ON github_user_links FOR DELETE
    USING (auth.uid() = cbb_user_id);

-- Add 'github' to valid sources comment (we're using varchar check in app)
-- Valid sources: 'web', 'chrome_extension', 'slack', 'github'

COMMENT ON TABLE github_user_links IS 'Links GitHub accounts to Career Black Box users for PR/issue decision capture';
COMMENT ON COLUMN github_user_links.github_user_id IS 'GitHub user ID (numeric, from GitHub API)';
COMMENT ON COLUMN github_user_links.github_username IS 'GitHub username at time of linking';
COMMENT ON COLUMN github_user_links.link_code IS 'Manual linking code entered by user';
