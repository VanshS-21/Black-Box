import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
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

        const { data, error } = await supabase
            .from('decisions')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) {
            return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
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

        // Check if decision exists and is unlocked
        const { data: existing, error: fetchError } = await supabase
            .from('decisions')
            .select('is_locked')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !existing) {
            return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
        }

        if (existing.is_locked) {
            return NextResponse.json(
                { error: 'Cannot edit locked decision' },
                { status: 403 }
            );
        }

        const body = await request.json();

        const { data, error } = await supabase
            .from('decisions')
            .update({
                title: body.title,
                decision_made: body.decision_made,
                context: body.context,
                trade_offs: body.trade_offs,
                biggest_risk: body.biggest_risk,
                stakeholders: body.stakeholders,
                confidence_level: body.confidence_level,
                tags: body.tags,
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating decision:', error);
            return NextResponse.json({ error: 'Failed to update decision' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
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

        const { error } = await supabase
            .from('decisions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting decision:', error);
            return NextResponse.json({ error: 'Failed to delete decision' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
