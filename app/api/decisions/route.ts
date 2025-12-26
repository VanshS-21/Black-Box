import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createDecisionSchema } from '@/lib/validations/decision';
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from '@/lib/rate-limit';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const rateLimit = checkRateLimit(
            getRateLimitKey(user.id, 'decisions:get'),
            RATE_LIMITS.api.limit,
            RATE_LIMITS.api.windowMs
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(Math.ceil(rateLimit.resetIn / 1000)),
                        'X-RateLimit-Remaining': String(rateLimit.remaining),
                    }
                }
            );
        }

        // Get query parameters with validation
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search')?.slice(0, 200) || '';
        const tags = searchParams.get('tags')?.split(',').filter(Boolean).slice(0, 10) || [];

        // Build query
        let query = supabase
            .from('decisions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // Apply search filter (escape special characters for safety)
        if (search) {
            const escapedSearch = search.replace(/[%_]/g, '\\$&');
            query = query.or(`title.ilike.%${escapedSearch}%,decision_made.ilike.%${escapedSearch}%`);
        }

        // Apply tag filter
        if (tags.length > 0) {
            query = query.contains('tags', tags);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching decisions:', error);
            return NextResponse.json({ error: 'Failed to fetch decisions' }, { status: 500 });
        }

        return NextResponse.json(data, {
            headers: {
                'X-RateLimit-Remaining': String(rateLimit.remaining),
            }
        });
    } catch (error: unknown) {
        console.error('Error:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const rateLimit = checkRateLimit(
            getRateLimitKey(user.id, 'decisions:create'),
            RATE_LIMITS.api.limit,
            RATE_LIMITS.api.windowMs
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await request.json();

        // Validate input
        const validatedData = createDecisionSchema.parse(body);

        const { data, error } = await supabase
            .from('decisions')
            .insert({
                user_id: user.id,
                title: validatedData.title,
                decision_made: validatedData.decision_made,
                context: validatedData.context,
                trade_offs: validatedData.trade_offs,
                biggest_risk: validatedData.biggest_risk,
                stakeholders: validatedData.stakeholders || null,
                confidence_level: validatedData.confidence_level || null,
                tags: validatedData.tags || [],
                original_input: validatedData.original_input || null,
                ai_structured: validatedData.ai_structured || false,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating decision:', error);
            return NextResponse.json({ error: 'Failed to create decision' }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || 'Validation error', field: firstError?.path?.join('.') },
                { status: 400 }
            );
        }

        console.error('Error:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
