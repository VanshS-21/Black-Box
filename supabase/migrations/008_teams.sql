-- Team Token Feature - Manager Wedge for Enterprise
-- This enables Engineering Managers to create teams and share decisions

-- Generate random join tokens
CREATE OR REPLACE FUNCTION generate_team_token()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- No I,O,0,1 for readability
    result TEXT := '';
    i INT;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    join_token TEXT UNIQUE DEFAULT generate_team_token(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- Add team reference to decisions (optional - decisions can be shared to team)
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_decisions_team_id ON decisions(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_join_token ON teams(join_token);

-- RLS Policies for Teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Teams: Users can view teams they own or are members of
CREATE POLICY "Users can view own teams" ON teams
    FOR SELECT
    USING (
        owner_id = auth.uid() OR
        id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    );

-- Teams: Only owners can create teams
CREATE POLICY "Users can create teams" ON teams
    FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- Teams: Only owners can update teams
CREATE POLICY "Owners can update teams" ON teams
    FOR UPDATE
    USING (owner_id = auth.uid());

-- Teams: Only owners can delete teams
CREATE POLICY "Owners can delete teams" ON teams
    FOR DELETE
    USING (owner_id = auth.uid());

-- Team Members: Users can view members of their teams
CREATE POLICY "Users can view team members" ON team_members
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()) OR
        team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
    );

-- Team Members: Owners can add members
CREATE POLICY "Owners can add members" ON team_members
    FOR INSERT
    WITH CHECK (
        team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid()) OR
        user_id = auth.uid() -- Users can join teams themselves via token
    );

-- Team Members: Owners can remove members, users can leave
CREATE POLICY "Owners can remove members" ON team_members
    FOR DELETE
    USING (
        user_id = auth.uid() OR
        team_id IN (SELECT id FROM teams WHERE owner_id = auth.uid())
    );

-- Decisions: Allow team members to view shared decisions
DROP POLICY IF EXISTS "Users can view their own decisions" ON decisions;
CREATE POLICY "Users can view their own and team decisions" ON decisions
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        (team_id IS NOT NULL AND team_id IN (
            SELECT team_id FROM team_members WHERE user_id = auth.uid()
        ))
    );

COMMENT ON TABLE teams IS 'Teams for Engineering Managers to group decision tracking';
COMMENT ON COLUMN teams.join_token IS '8-character token for easy team joining';
COMMENT ON COLUMN decisions.team_id IS 'Optional team to share this decision with';
