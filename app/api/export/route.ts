import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/upstash-rate-limit';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting for export (infrequent operation)
        const rateLimit = await checkRateLimit(user.id, 'export');

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many export requests. Please try again later.' },
                { status: 429, headers: getRateLimitHeaders(rateLimit) }
            );
        }

        // Fetch all user data
        const [decisionsResult, preferencesResult, generationsResult] = await Promise.all([
            supabase
                .from('decisions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),
            supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', user.id)
                .single(),
            supabase
                .from('ai_generations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),
        ]);

        const decisions = decisionsResult.data || [];
        const preferences = preferencesResult.data || {};
        const generations = generationsResult.data || [];

        const exportData = {
            exported_at: new Date().toISOString(),
            version: '1.0',
            user: {
                id: user.id,
                email: user.email,
            },
            preferences,
            decisions,
            ai_generations: generations,
            metadata: {
                total_decisions: decisions.length,
                total_ai_generations: generations.length,
            },
        };

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="career-black-box-export-${new Date().toISOString().split('T')[0]}.json"`,
            },
        });
    } catch (error: unknown) {
        console.error('Error exporting data:', error);
        const message = error instanceof Error ? error.message : 'Failed to export data';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
