import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { generateLinkCode } from '@/lib/github/utils';

/**
 * POST /api/github/link
 * Generate a new GitHub linking code for the authenticated user
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                            });
                        } catch {
                            // Ignore - can't set cookies in API routes sometimes
                        }
                    },
                },
            }
        );

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Generate a new link code
        const linkCode = generateLinkCode();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Upsert the github_user_links record
        const { error: upsertError } = await supabase
            .from('github_user_links')
            .upsert(
                {
                    cbb_user_id: user.id,
                    github_user_id: 0, // Placeholder until actually linked
                    github_username: '', // Placeholder until actually linked
                    link_code: linkCode,
                    link_code_expires_at: expiresAt.toISOString(),
                    linked_at: null, // Clear any existing link
                },
                {
                    onConflict: 'cbb_user_id',
                }
            );

        if (upsertError) {
            console.error('Failed to create GitHub link code:', upsertError);
            return NextResponse.json(
                { error: 'Failed to generate link code' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            code: linkCode,
            expiresAt: expiresAt.toISOString(),
            expiresInMinutes: 15,
        });

    } catch (error) {
        console.error('GitHub link error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/github/link
 * Get the current GitHub link status for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                            });
                        } catch {
                            // Ignore
                        }
                    },
                },
            }
        );

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Check for existing link
        const { data: linkRecord } = await supabase
            .from('github_user_links')
            .select('*')
            .eq('cbb_user_id', user.id)
            .single();

        if (!linkRecord) {
            return NextResponse.json({
                linked: false,
                linkCode: null,
            });
        }

        return NextResponse.json({
            linked: !!linkRecord.linked_at,
            linkedAt: linkRecord.linked_at,
            githubUsername: linkRecord.github_username || null,
            linkCode: linkRecord.link_code || null,
            linkCodeExpiresAt: linkRecord.link_code_expires_at || null,
        });

    } catch (error) {
        console.error('GitHub link status error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/github/link
 * Unlink GitHub account
 */
export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                            });
                        } catch {
                            // Ignore
                        }
                    },
                },
            }
        );

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Delete the link record
        const { error: deleteError } = await supabase
            .from('github_user_links')
            .delete()
            .eq('cbb_user_id', user.id);

        if (deleteError) {
            console.error('Failed to delete GitHub link:', deleteError);
            return NextResponse.json(
                { error: 'Failed to unlink account' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('GitHub unlink error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
