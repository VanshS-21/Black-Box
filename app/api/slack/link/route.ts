import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateLinkCode } from '@/lib/slack/utils';

// GET: Get current Slack link status and generate new code
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check for existing link
        const { data: existingLink } = await supabase
            .from('slack_user_links')
            .select('*')
            .eq('cbb_user_id', user.id)
            .single();

        if (existingLink?.linked_at) {
            // Already linked
            return NextResponse.json({
                status: 'linked',
                slack_username: existingLink.slack_username,
                linked_at: existingLink.linked_at
            });
        }

        // Check for existing pending code
        if (existingLink?.link_code &&
            existingLink.link_code_expires_at &&
            new Date(existingLink.link_code_expires_at) > new Date()) {
            return NextResponse.json({
                status: 'pending',
                link_code: existingLink.link_code,
                expires_at: existingLink.link_code_expires_at
            });
        }

        // No link exists or code expired - return unlinked status
        return NextResponse.json({
            status: 'unlinked'
        });

    } catch (error) {
        console.error('Error getting Slack link status:', error);
        return NextResponse.json({ error: 'Failed to get link status' }, { status: 500 });
    }
}

// POST: Generate a new link code
export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const linkCode = generateLinkCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Upsert link record
        const { data, error } = await supabase
            .from('slack_user_links')
            .upsert({
                cbb_user_id: user.id,
                slack_user_id: '', // Will be filled when linked
                slack_team_id: '', // Will be filled when linked
                link_code: linkCode,
                link_code_expires_at: expiresAt.toISOString(),
                linked_at: null
            }, {
                onConflict: 'cbb_user_id'
            })
            .select()
            .single();

        if (error) {
            console.error('Error generating link code:', error);
            return NextResponse.json({ error: 'Failed to generate link code' }, { status: 500 });
        }

        return NextResponse.json({
            status: 'pending',
            link_code: data.link_code,
            expires_at: data.link_code_expires_at
        });

    } catch (error) {
        console.error('Error generating Slack link code:', error);
        return NextResponse.json({ error: 'Failed to generate link code' }, { status: 500 });
    }
}

// DELETE: Unlink Slack account
export async function DELETE() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { error } = await supabase
            .from('slack_user_links')
            .delete()
            .eq('cbb_user_id', user.id);

        if (error) {
            console.error('Error unlinking Slack:', error);
            return NextResponse.json({ error: 'Failed to unlink Slack' }, { status: 500 });
        }

        return NextResponse.json({ status: 'unlinked' });

    } catch (error) {
        console.error('Error unlinking Slack:', error);
        return NextResponse.json({ error: 'Failed to unlink' }, { status: 500 });
    }
}
