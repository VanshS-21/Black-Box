import { NextRequest, NextResponse } from 'next/server';
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { sendEmail, isEmailConfigured } from '@/lib/email/resend';

// Force dynamic rendering to avoid build-time errors with Qstash signature verification
export const dynamic = 'force-dynamic';

interface UserPreference {
    user_id: string;
    weekly_digest_enabled: boolean;
    digest_time: string;
    last_digest_sent_at: string | null;
}

interface Decision {
    id: string;
    title: string;
    decision_made: string;
    confidence_level: number | null;
    created_at: string;
}

interface UserEmail {
    email: string;
}

/**
 * Weekly Digest Cron Endpoint
 * Called by Upstash Qstash on schedule (every Friday 9am IST)
 * 
 * Sends weekly email summaries to users who have opted in
 */
async function handler(request: NextRequest) {
    try {
        // Create admin client (bypasses RLS for batch operations)
        const supabaseAdmin = createSupabaseAdmin(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Get current day of week (0 = Sunday, 5 = Friday)
        const today = new Date();
        const dayOfWeek = today.getDay();

        // Determine which time slot to process
        const timeSlot = dayOfWeek === 5 ? 'friday_9am' : dayOfWeek === 1 ? 'monday_9am' : null;

        if (!timeSlot) {
            return NextResponse.json({
                message: 'No digest scheduled for today',
                dayOfWeek
            });
        }

        // Get users who want digest at this time
        const { data: users, error: usersError } = await supabaseAdmin
            .from('user_preferences')
            .select('user_id, weekly_digest_enabled, digest_time, last_digest_sent_at')
            .eq('weekly_digest_enabled', true)
            .eq('digest_time', timeSlot);

        if (usersError) {
            console.error('Error fetching users:', usersError);
            return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
        }

        if (!users || users.length === 0) {
            return NextResponse.json({ message: 'No users to email', processed: 0 });
        }

        // Calculate one week ago
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const results = {
            processed: 0,
            sent: 0,
            skipped: 0,
            errors: 0,
        };

        for (const userPref of users as UserPreference[]) {
            try {
                // Skip if already sent today
                if (userPref.last_digest_sent_at) {
                    const lastSent = new Date(userPref.last_digest_sent_at);
                    const hoursSinceLast = (today.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
                    if (hoursSinceLast < 24) {
                        results.skipped++;
                        continue;
                    }
                }

                // Get user's decisions from the past week
                const { data: decisions, error: decisionsError } = await supabaseAdmin
                    .from('decisions')
                    .select('id, title, decision_made, confidence_level, created_at')
                    .eq('user_id', userPref.user_id)
                    .gte('created_at', oneWeekAgo.toISOString())
                    .order('created_at', { ascending: false });

                if (decisionsError) {
                    console.error(`Error fetching decisions for ${userPref.user_id}:`, decisionsError);
                    results.errors++;
                    continue;
                }

                // Get user's email
                const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(
                    userPref.user_id
                );

                if (userError || !user?.email) {
                    console.error(`Error fetching user email for ${userPref.user_id}:`, userError);
                    results.errors++;
                    continue;
                }

                // Generate email content
                const emailContent = generateDigestEmail(
                    user.email,
                    decisions as Decision[] || [],
                    today
                );

                // Send email via Resend
                const emailResult = await sendEmail({
                    to: emailContent.to,
                    subject: emailContent.subject,
                    html: emailContent.html,
                });

                if (!emailResult.success) {
                    console.error(`Failed to send email to ${user.email}:`, emailResult.error);
                    results.errors++;
                    continue;
                }

                console.log(`📧 Sent digest to ${user.email} (ID: ${emailResult.messageId})`);

                // Update last_digest_sent_at
                await supabaseAdmin
                    .from('user_preferences')
                    .update({ last_digest_sent_at: today.toISOString() })
                    .eq('user_id', userPref.user_id);

                results.sent++;
                results.processed++;
            } catch (err) {
                console.error(`Error processing user ${userPref.user_id}:`, err);
                results.errors++;
            }
        }

        return NextResponse.json({
            message: 'Weekly digest processing complete',
            ...results,
            timeSlot,
        });
    } catch (error) {
        console.error('Weekly digest error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * Generate email content for the weekly digest
 */
function generateDigestEmail(
    email: string,
    decisions: Decision[],
    date: Date
): { to: string; subject: string; html: string } {
    const hasDecisions = decisions.length > 0;
    const weekOf = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (hasDecisions) {
        const decisionList = decisions
            .slice(0, 5)
            .map(d => `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #374151;">
                        <strong style="color: #ffffff;">${d.title}</strong>
                        <p style="margin: 4px 0 0; color: #9ca3af; font-size: 14px;">
                            ${d.decision_made.slice(0, 100)}...
                        </p>
                    </td>
                    <td style="padding: 12px; border-bottom: 1px solid #374151; color: #818cf8; text-align: right;">
                        ${d.confidence_level || '-'}/10
                    </td>
                </tr>
            `)
            .join('');

        return {
            to: email,
            subject: `🎯 Your Week in Decisions (${weekOf})`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Your Weekly Digest</h1>
                            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">Week of ${weekOf}</p>
                        </div>
                        
                        <div style="background-color: #1e293b; border-radius: 0 0 16px 16px; padding: 24px;">
                            <p style="color: #e2e8f0; font-size: 16px; margin-bottom: 20px;">
                                You logged <strong style="color: #818cf8;">${decisions.length} decision${decisions.length !== 1 ? 's' : ''}</strong> this week! 
                                Here's a quick recap:
                            </p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; padding: 12px; color: #64748b; font-size: 12px; text-transform: uppercase;">Decision</th>
                                        <th style="text-align: right; padding: 12px; color: #64748b; font-size: 12px; text-transform: uppercase;">Confidence</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${decisionList}
                                </tbody>
                            </table>
                            
                            <div style="text-align: center;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://careerblackbox.app'}/dashboard" 
                                   style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                                    View Full Dashboard
                                </a>
                            </div>
                        </div>
                        
                        <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">
                            You're receiving this because you enabled weekly digests in Career Black Box.
                            <br><a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://careerblackbox.app'}/dashboard/settings" style="color: #818cf8;">Manage preferences</a>
                        </p>
                    </div>
                </body>
                </html>
            `,
        };
    }

    // Empty week - send encouragement
    return {
        to: email,
        subject: `📝 Quick check-in from Career Black Box`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <div style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Hey there! 👋</h1>
                    </div>
                    
                    <div style="background-color: #1e293b; border-radius: 0 0 16px 16px; padding: 24px;">
                        <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                            Looks like it was a quiet week for logged decisions. That's okay!
                        </p>
                        
                        <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                            💡 <strong>Quick tip:</strong> Even small decisions matter. Tried a new debugging approach? 
                            Suggested a code improvement? Those count too!
                        </p>
                        
                        <div style="text-align: center; margin-top: 24px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://careerblackbox.app'}/dashboard/new" 
                               style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                                Log a Quick Decision
                            </a>
                        </div>
                    </div>
                    
                    <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 24px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://careerblackbox.app'}/dashboard/settings" style="color: #818cf8;">Manage email preferences</a>
                    </p>
                </div>
            </body>
            </html>
        `,
    };
}

// Export POST handler directly with manual signature verification
// This avoids build-time issues with the verifySignatureAppRouter wrapper
export async function POST(request: NextRequest) {
    // Manual Qstash signature verification at runtime
    const signature = request.headers.get('upstash-signature');
    const qstashToken = process.env.QSTASH_CURRENT_SIGNING_KEY;

    // In development or if no Qstash configured, allow direct calls
    if (process.env.NODE_ENV === 'development' || !qstashToken) {
        return handler(request);
    }

    // Verify signature in production
    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // If signature verification is needed, delegate to the wrapped handler
    try {
        const wrappedHandler = verifySignatureAppRouter(handler);
        return wrappedHandler(request);
    } catch (error) {
        console.error('Signature verification failed:', error);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
}
