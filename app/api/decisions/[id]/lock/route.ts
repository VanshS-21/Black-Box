import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current lock status
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('is_locked')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !decision) {
            return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
        }

        // Toggle lock status
        const newLockStatus = !decision.is_locked;
        const updateData: Record<string, unknown> = {
            is_locked: newLockStatus,
        };

        if (newLockStatus) {
            updateData.locked_at = new Date().toISOString();
        } else {
            updateData.locked_at = null;
        }

        const { data, error } = await supabase
            .from('decisions')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error toggling lock:', error);
            return NextResponse.json({ error: 'Failed to toggle lock' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

