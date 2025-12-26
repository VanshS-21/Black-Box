import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { structureDecision } from '@/lib/ai/gemini';
import { rawInputSchema } from '@/lib/validations/decision';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/upstash-rate-limit';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting for AI endpoints (more restrictive)
        const rateLimit = await checkRateLimit(user.id, 'ai');

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many AI requests. Please wait a moment before trying again.',
                    resetIn: Math.ceil(rateLimit.resetIn / 1000),
                },
                {
                    status: 429,
                    headers: getRateLimitHeaders(rateLimit),
                }
            );
        }

        const body = await request.json();

        // Validate input
        const { rawInput } = rawInputSchema.parse(body);

        // Use Gemini to structure the decision
        const structured = await structureDecision(rawInput);

        // Track AI generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'structure',
            input_tokens: null,
            output_tokens: null,
            cost_usd: 0.0000,
        });

        return NextResponse.json({
            ...structured,
            original_input: rawInput,
        });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || 'Validation error' },
                { status: 400 }
            );
        }

        console.error('Error structuring decision:', error);
        const message = error instanceof Error ? error.message : 'Failed to structure decision';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
