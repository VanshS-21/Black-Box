import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Personal Analytics API - Optimized
 * Uses database-level aggregation for better performance at scale
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Calculate date boundaries
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

        // Run optimized queries in parallel
        const [
            totalResult,
            thisMonthResult,
            lastMonthResult,
            recentDecisionsResult,
        ] = await Promise.all([
            // Total count
            supabase
                .from('decisions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id),

            // This month count
            supabase
                .from('decisions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('created_at', thisMonthStart),

            // Last month count
            supabase
                .from('decisions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('created_at', lastMonthStart)
                .lte('created_at', lastMonthEnd),

            // Only fetch minimal data needed for streak and tags (last 100 decisions max)
            supabase
                .from('decisions')
                .select('created_at, tags, confidence_level')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(100),
        ]);

        // Handle any query errors
        if (totalResult.error || thisMonthResult.error || lastMonthResult.error || recentDecisionsResult.error) {
            console.error('Analytics query error:', totalResult.error || thisMonthResult.error || lastMonthResult.error || recentDecisionsResult.error);
            return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
        }

        const totalDecisions = totalResult.count || 0;
        const thisMonthCount = thisMonthResult.count || 0;
        const lastMonthCount = lastMonthResult.count || 0;
        const recentDecisions = recentDecisionsResult.data || [];

        // Calculate streak (consecutive weeks with at least 1 decision)
        // Only uses recent decisions for efficiency
        let streak = 0;
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        let weekStart = new Date(now);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        while (streak < 52) { // Cap at 1 year to prevent infinite loops
            const weekEnd = new Date(weekStart.getTime() + oneWeekMs);
            const hasDecision = recentDecisions.some(d => {
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

        // Top tags (from recent decisions)
        const tagCounts: Record<string, number> = {};
        recentDecisions.forEach(d => {
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

        // Average confidence (from recent decisions)
        const withConfidence = recentDecisions.filter(d => d.confidence_level != null);
        const avgConfidence = withConfidence.length > 0
            ? Math.round(withConfidence.reduce((sum, d) => sum + d.confidence_level, 0) / withConfidence.length * 10) / 10
            : null;

        // Calculate month change percentage
        const monthChange = lastMonthCount > 0
            ? Math.round((thisMonthCount - lastMonthCount) / lastMonthCount * 100)
            : thisMonthCount > 0 ? 100 : 0;

        return NextResponse.json({
            totalDecisions,
            thisMonth: thisMonthCount,
            lastMonth: lastMonthCount,
            monthChange,
            weekStreak: streak,
            topTags,
            avgConfidence,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
