import { NextRequest, NextResponse } from 'next/server';
import { quickReframe } from '@/lib/ai/gemini';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/upstash-rate-limit';
import { z } from 'zod';

const inputSchema = z.object({
    text: z.string().min(3, 'Text must be at least 3 characters').max(500, 'Text too long (max 500 chars)'),
});

/**
 * Public Quick Reframe endpoint - No auth required
 * Rate limited by IP address (5 uses per day)
 * This is the lead generation magnet for the landing page
 */
export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            request.headers.get('x-real-ip') ||
            request.headers.get('cf-connecting-ip') ||
            'anonymous';

        // Rate limit by IP (5/day for anonymous users)
        const rateLimit = await checkRateLimit(`ip:${ip}`, 'ai_public');

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'You\'ve used all 5 free reframes for today. Sign up for unlimited access!',
                    resetIn: Math.ceil(rateLimit.resetIn / 1000),
                    remaining: 0,
                    signupRequired: true,
                },
                {
                    status: 429,
                    headers: getRateLimitHeaders(rateLimit),
                }
            );
        }

        const body = await request.json();
        const { text } = inputSchema.parse(body);

        // Call quick reframe (no user tracking for anonymous)
        const result = await quickReframe(text);

        return NextResponse.json({
            ...result,
            remaining: rateLimit.remaining,
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || 'Validation error' },
                { status: 400 }
            );
        }

        console.error('Error in public quick reframe:', error);
        const message = error instanceof Error ? error.message : 'Failed to reframe text';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
