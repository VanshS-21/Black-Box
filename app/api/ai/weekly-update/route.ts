import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWeeklyUpdate } from '@/lib/ai/gemini';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/upstash-rate-limit';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const rateLimit = await checkRateLimit(user.id, 'ai');

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many AI requests. Please wait a moment.',
                    resetIn: Math.ceil(rateLimit.resetIn / 1000),
                },
                {
                    status: 429,
                    headers: getRateLimitHeaders(rateLimit),
                }
            );
        }

        // Fetch recent decisions (last 7 days, or all if user has few)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: decisions, error: fetchError } = await supabase
            .from('decisions')
            .select('title, decision_made, context, created_at')
            .eq('user_id', user.id)
            .gte('created_at', oneWeekAgo.toISOString())
            .order('created_at', { ascending: false })
            .limit(10);

        if (fetchError) {
            throw new Error('Failed to fetch decisions');
        }

        if (!decisions || decisions.length === 0) {
            return NextResponse.json(
                { error: 'No decisions found in the past week. Log a decision first!' },
                { status: 400 }
            );
        }

        // Generate the weekly update
        const weeklyUpdate = await generateWeeklyUpdate(decisions);

        // Track AI generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'weekly_update',
            input_tokens: null,
            output_tokens: null,
            cost_usd: 0.0000,
        });

        return NextResponse.json({
            update: weeklyUpdate,
            decisionsCount: decisions.length,
        });
    } catch (error: unknown) {
        console.error('Error generating weekly update:', error);
        const message = error instanceof Error ? error.message : 'Failed to generate update';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
