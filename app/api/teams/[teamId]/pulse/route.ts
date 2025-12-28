import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface TeamMember {
    user_id: string;
    role: string;
    joined_at: string;
}

interface Decision {
    id: string;
    user_id: string;
    created_at: string;
    biggest_risk: string;
}

interface MemberActivity {
    userId: string;
    decisionsThisWeek: number;
    lastDecisionDate: string | null;
}

interface RiskSummary {
    risk: string;
    count: number;
}

/**
 * Team Pulse API - Manager visibility into team activity
 * GET /api/teams/[teamId]/pulse
 * 
 * Returns:
 * - Member activity (who is logging, who is silent)
 * - Top risks identified by team
 * - Weekly decision trends
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ teamId: string }> }
) {
    try {
        const { teamId } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is owner or admin of this team
        const { data: team, error: teamError } = await supabase
            .from('teams')
            .select('id, name, owner_id')
            .eq('id', teamId)
            .single();

        if (teamError || !team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        // Check if user is owner
        const isOwner = team.owner_id === user.id;

        // Or check if user is admin in team
        const { data: membership } = await supabase
            .from('team_members')
            .select('role')
            .eq('team_id', teamId)
            .eq('user_id', user.id)
            .single();

        const isAdmin = membership?.role === 'admin';

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ error: 'Access denied. Only team owners and admins can view pulse.' }, { status: 403 });
        }

        // Get all team members
        const { data: members, error: membersError } = await supabase
            .from('team_members')
            .select('user_id, role, joined_at')
            .eq('team_id', teamId);

        if (membersError) {
            console.error('Error fetching members:', membersError);
            return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
        }

        const memberIds = members?.map((m: TeamMember) => m.user_id) || [];

        // Get team decisions (decisions shared with this team)
        const { data: decisions, error: decisionsError } = await supabase
            .from('decisions')
            .select('id, user_id, created_at, biggest_risk')
            .eq('team_id', teamId)
            .order('created_at', { ascending: false });

        if (decisionsError) {
            console.error('Error fetching decisions:', decisionsError);
            return NextResponse.json({ error: 'Failed to fetch team decisions' }, { status: 500 });
        }

        // Calculate one week ago
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Calculate member activity
        const memberActivity: MemberActivity[] = memberIds.map(userId => {
            const userDecisions = (decisions || []).filter((d: Decision) => d.user_id === userId);
            const thisWeekDecisions = userDecisions.filter((d: Decision) => new Date(d.created_at) >= oneWeekAgo);
            const lastDecision = userDecisions[0]; // Already sorted by created_at desc

            return {
                userId,
                decisionsThisWeek: thisWeekDecisions.length,
                lastDecisionDate: lastDecision?.created_at || null,
            };
        });

        // Split into active and silent members
        const activeMembers = memberActivity.filter(m => m.decisionsThisWeek > 0);
        const silentMembers = memberActivity.filter(m => m.decisionsThisWeek === 0);

        // Calculate days since last decision for silent members
        const silentWithDays = silentMembers.map(m => ({
            ...m,
            daysSinceLastDecision: m.lastDecisionDate
                ? Math.floor((now.getTime() - new Date(m.lastDecisionDate).getTime()) / (24 * 60 * 60 * 1000))
                : null,
        }));

        // Aggregate top risks from decisions
        const riskCounts: { [key: string]: number } = {};
        (decisions || []).forEach((d: Decision) => {
            if (d.biggest_risk) {
                // Extract key phrases (simple approach - first 50 chars)
                const riskKey = d.biggest_risk.slice(0, 50).toLowerCase().trim();
                riskCounts[riskKey] = (riskCounts[riskKey] || 0) + 1;
            }
        });

        const topRisks: RiskSummary[] = Object.entries(riskCounts)
            .map(([risk, count]) => ({ risk, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Weekly trend (last 4 weeks)
        const weeklyTrend = [];
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            const count = (decisions || []).filter((d: Decision) => {
                const date = new Date(d.created_at);
                return date >= weekStart && date < weekEnd;
            }).length;

            weeklyTrend.push({
                week: `Week ${4 - i}`,
                weekStart: weekStart.toISOString(),
                decisionCount: count,
            });
        }

        return NextResponse.json({
            teamId,
            teamName: team.name,
            totalMembers: members?.length || 0,
            totalDecisions: decisions?.length || 0,
            activeMembers: activeMembers.map(m => ({
                userId: m.userId,
                decisionsThisWeek: m.decisionsThisWeek,
            })),
            silentMembers: silentWithDays.map(m => ({
                userId: m.userId,
                daysSinceLastDecision: m.daysSinceLastDecision,
            })),
            topRisks,
            weeklyTrend,
        });
    } catch (error) {
        console.error('Error in team pulse:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
