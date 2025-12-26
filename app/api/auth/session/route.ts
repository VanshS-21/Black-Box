import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
            return NextResponse.json({ error: 'No active session' }, { status: 401 });
        }

        return NextResponse.json({
            access_token: session.access_token,
            user: session.user,
        });
    } catch (error: any) {
        console.error('Error getting session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

