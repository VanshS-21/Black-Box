import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePromotionPackage } from '@/lib/ai/gemini';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting for AI endpoints
        const rateLimit = checkRateLimit(
            getRateLimitKey(user.id, 'ai:promotion'),
            RATE_LIMITS.ai.limit,
            RATE_LIMITS.ai.windowMs
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many AI requests. Please wait a moment before trying again.',
                    resetIn: Math.ceil(rateLimit.resetIn / 1000),
                },
                { status: 429 }
            );
        }

        // Fetch all user's decisions
        const { data: decisions, error: fetchError } = await supabase
            .from('decisions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (fetchError) {
            console.error('Error fetching decisions:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch decisions' },
                { status: 500 }
            );
        }

        // Check minimum decision count
        const minDecisions = 10;
        if (!decisions || decisions.length < minDecisions) {
            return NextResponse.json(
                {
                    error: `You need at least ${minDecisions} decisions to generate a promotion package. You currently have ${decisions?.length || 0}.`,
                    current_count: decisions?.length || 0,
                    required_count: minDecisions,
                },
                { status: 400 }
            );
        }

        // Generate promotion package using AI
        const promotionPackage = await generatePromotionPackage(decisions);

        // Track AI generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'promotion_package',
            input_tokens: null,
            output_tokens: null,
            cost_usd: 0.0000,
        });

        return NextResponse.json({
            package: promotionPackage,
            decisions_analyzed: decisions.length,
            generated_at: new Date().toISOString(),
        });
    } catch (error: unknown) {
        console.error('Error generating promotion package:', error);
        const message = error instanceof Error ? error.message : 'Failed to generate promotion package';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
