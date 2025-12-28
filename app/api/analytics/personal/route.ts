import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Personal Analytics API
 * Returns aggregate stats for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current and previous month dates
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        // Fetch all user decisions
        const { data: allDecisions, error } = await supabase
            .from('decisions')
            .select('id, created_at, tags, confidence_level')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching decisions:', error);
            return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
        }

        const decisions = allDecisions || [];

        // Calculate this month vs last month
        const thisMonthCount = decisions.filter(d =>
            new Date(d.created_at) >= thisMonthStart
        ).length;

        const lastMonthCount = decisions.filter(d => {
            const date = new Date(d.created_at);
            return date >= lastMonthStart && date <= lastMonthEnd;
        }).length;

        // Calculate streak (consecutive weeks with at least 1 decision)
        let streak = 0;
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        let weekStart = new Date(now);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of this week

        while (true) {
            const weekEnd = new Date(weekStart.getTime() + oneWeekMs);
            const hasDecision = decisions.some(d => {
                const date = new Date(d.created_at);
                return date >= weekStart && date < weekEnd;
            });

            if (hasDecision) {
                streak++;
                weekStart = new Date(weekStart.getTime() - oneWeekMs);
            } else {
                break;
            }
        }

        // Top tags
        const tagCounts: Record<string, number> = {};
        decisions.forEach(d => {
            if (d.tags && Array.isArray(d.tags)) {
                d.tags.forEach((tag: string) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });

        const topTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag, count]) => ({ tag, count }));

        // Average confidence
        const withConfidence = decisions.filter(d => d.confidence_level != null);
        const avgConfidence = withConfidence.length > 0
            ? Math.round(withConfidence.reduce((sum, d) => sum + d.confidence_level, 0) / withConfidence.length * 10) / 10
            : null;

        return NextResponse.json({
            totalDecisions: decisions.length,
            thisMonth: thisMonthCount,
            lastMonth: lastMonthCount,
            monthChange: lastMonthCount > 0
                ? Math.round((thisMonthCount - lastMonthCount) / lastMonthCount * 100)
                : thisMonthCount > 0 ? 100 : 0,
            weekStreak: streak,
            topTags,
            avgConfidence,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
