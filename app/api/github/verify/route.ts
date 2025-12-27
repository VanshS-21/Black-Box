import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for verifying links
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/github/verify
 * Verify a link code and complete the GitHub account linking
 * This is called from the Chrome extension or a future GitHub Action
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { linkCode, githubUserId, githubUsername } = body;

        if (!linkCode || !githubUserId || !githubUsername) {
            return NextResponse.json(
                { error: 'Missing required fields: linkCode, githubUserId, githubUsername' },
                { status: 400 }
            );
        }

        // Find the link record with valid code
        const { data: linkRecord, error: findError } = await supabase
            .from('github_user_links')
            .select('*')
            .eq('link_code', linkCode.toUpperCase())
            .gt('link_code_expires_at', new Date().toISOString())
            .is('linked_at', null)
            .single();

        if (findError || !linkRecord) {
            return NextResponse.json(
                { error: 'Link code not found or expired. Generate a new code in Settings.' },
                { status: 404 }
            );
        }

        // Check if this GitHub user is already linked to another account
        const { data: existingLink } = await supabase
            .from('github_user_links')
            .select('cbb_user_id')
            .eq('github_user_id', githubUserId)
            .not('linked_at', 'is', null)
            .single();

        if (existingLink && existingLink.cbb_user_id !== linkRecord.cbb_user_id) {
            return NextResponse.json(
                { error: 'This GitHub account is already linked to another user' },
                { status: 409 }
            );
        }

        // Complete the link
        const { error: updateError } = await supabase
            .from('github_user_links')
            .update({
                github_user_id: githubUserId,
                github_username: githubUsername,
                linked_at: new Date().toISOString(),
                link_code: null,
                link_code_expires_at: null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', linkRecord.id);

        if (updateError) {
            console.error('Failed to complete GitHub link:', updateError);
            return NextResponse.json(
                { error: 'Failed to link account. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Successfully linked GitHub account @${githubUsername}`,
        });

    } catch (error) {
        console.error('GitHub verify error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
