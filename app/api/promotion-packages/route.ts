import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/promotion-packages
 * Fetch user's saved promotion packages (most recent first)
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: packages, error: fetchError } = await supabase
            .from('promotion_packages')
            .select('id, content, decisions_count, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (fetchError) {
            console.error('Error fetching promotion packages:', fetchError);
            return NextResponse.json(
                { error: 'Failed to fetch promotion packages' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            packages: packages || [],
            count: packages?.length || 0,
        });
    } catch (error: unknown) {
        console.error('Error in promotion packages GET:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
