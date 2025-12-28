import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { quickReframe } from '@/lib/ai/gemini';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/upstash-rate-limit';
import { z } from 'zod';

const inputSchema = z.object({
    text: z.string().min(3, 'Text must be at least 3 characters').max(500, 'Text too long (max 500 chars)'),
});

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting for AI endpoints
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

        const body = await request.json();
        const { text } = inputSchema.parse(body);

        // Call quick reframe
        const result = await quickReframe(text);

        // Track AI generation
        await supabase.from('ai_generations').insert({
            user_id: user.id,
            generation_type: 'quick_reframe',
            input_tokens: null,
            output_tokens: null,
            cost_usd: 0.0000,
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || 'Validation error' },
                { status: 400 }
            );
        }

        console.error('Error in quick reframe:', error);
        const message = error instanceof Error ? error.message : 'Failed to reframe text';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
