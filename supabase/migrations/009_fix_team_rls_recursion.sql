-- Fix infinite recursion in team_members RLS policy
-- The issue: Multiple policies create circular references:
-- 1. team_members SELECT policy references team_members itself
-- 2. teams SELECT policy references team_members
-- 3. decisions SELECT policy references team_members

-- Solution: Use SECURITY DEFINER functions to bypass RLS during policy checks

-- Create a helper function to check team membership without RLS
-- This function runs with elevated privileges, bypassing RLS
CREATE OR REPLACE FUNCTION get_user_team_ids(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT team_id FROM team_members WHERE user_id = p_user_id
$$;

-- Create a helper function to check if user is a team owner
CREATE OR REPLACE FUNCTION is_team_owner(p_user_id UUID, p_team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (SELECT 1 FROM teams WHERE id = p_team_id AND owner_id = p_user_id)
$$;

-- Drop ALL problematic policies first (order matters!)
DROP POLICY IF EXISTS "Users can view team members" ON team_members;
DROP POLICY IF EXISTS "Users can view own teams" ON teams;
DROP POLICY IF EXISTS "Users can view their own and team decisions" ON decisions;
DROP POLICY IF EXISTS "Users can view their own decisions" ON decisions;

-- Recreate team_members SELECT policy using the helper function
-- Users can see their own memberships OR members of teams they own
CREATE POLICY "Users can view team members" ON team_members
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        is_team_owner(auth.uid(), team_id)
    );

-- Recreate teams SELECT policy using the helper function
-- Users can view teams they own OR are members of
CREATE POLICY "Users can view own teams" ON teams
    FOR SELECT
    USING (
        owner_id = auth.uid() OR
        id IN (SELECT get_user_team_ids(auth.uid()))
    );

-- Recreate decisions SELECT policy using the helper function
-- Users can view their own decisions OR decisions shared with their teams
CREATE POLICY "Users can view their own and team decisions" ON decisions
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        (team_id IS NOT NULL AND team_id IN (SELECT get_user_team_ids(auth.uid())))
    );

-- Grant execute permissions on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_team_ids(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_team_owner(UUID, UUID) TO authenticated;
