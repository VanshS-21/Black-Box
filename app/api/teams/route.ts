import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createTeamSchema = z.object({
    name: z.string().min(1, 'Team name is required').max(100),
    description: z.string().max(500).optional(),
});

const joinTeamSchema = z.object({
    token: z.string().length(8, 'Token must be 8 characters'),
});

// GET /api/teams - Get user's teams
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get teams user owns
        const { data: ownedTeams } = await supabase
            .from('teams')
            .select('*, team_members(count)')
            .eq('owner_id', user.id);

        // Get teams user is member of
        const { data: memberTeams } = await supabase
            .from('team_members')
            .select('team_id, role, joined_at, teams(id, name, description, owner_id, join_token)')
            .eq('user_id', user.id);

        return NextResponse.json({
            owned: ownedTeams || [],
            member: memberTeams?.filter(m => m.teams) || [],
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
        return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
    }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Check if this is a create or join request
        if (body.token) {
            // Join team via token
            const { token } = joinTeamSchema.parse(body);

            // Find team by token
            const { data: team, error: teamError } = await supabase
                .from('teams')
                .select('id, name')
                .eq('join_token', token.toUpperCase())
                .single();

            if (teamError || !team) {
                return NextResponse.json({ error: 'Invalid team token' }, { status: 404 });
            }

            // Check if already a member
            const { data: existing } = await supabase
                .from('team_members')
                .select('team_id')
                .eq('team_id', team.id)
                .eq('user_id', user.id)
                .single();

            if (existing) {
                return NextResponse.json({ error: 'Already a member of this team' }, { status: 400 });
            }

            // Join team
            const { error: joinError } = await supabase
                .from('team_members')
                .insert({
                    team_id: team.id,
                    user_id: user.id,
                    role: 'member',
                });

            if (joinError) {
                console.error('Join error:', joinError);
                return NextResponse.json({ error: 'Failed to join team' }, { status: 500 });
            }

            return NextResponse.json({
                message: `Joined team "${team.name}" successfully!`,
                team: team,
            });
        } else {
            // Create new team
            const { name, description } = createTeamSchema.parse(body);

            // Create team
            const { data: newTeam, error: createError } = await supabase
                .from('teams')
                .insert({
                    name,
                    description,
                    owner_id: user.id,
                })
                .select()
                .single();

            if (createError) {
                console.error('Create error:', createError);
                return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
            }

            // Add owner as team member
            await supabase.from('team_members').insert({
                team_id: newTeam.id,
                user_id: user.id,
                role: 'owner',
            });

            return NextResponse.json(newTeam, { status: 201 });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
        }
        console.error('Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
