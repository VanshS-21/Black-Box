import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail, isEmailConfigured } from '@/lib/email/resend';

/**
 * Test Email Endpoint
 * POST /api/test-email
 * 
 * Sends a test email to the authenticated user
 * This is only for development/testing purposes
 */
export async function POST(request: NextRequest) {
    try {
        // Check if email is configured
        if (!isEmailConfigured()) {
            return NextResponse.json({
                error: 'Email not configured',
                message: 'RESEND_API_KEY environment variable is not set. Add it to your .env.local file.',
                configured: false,
            }, { status: 503 });
        }

        // Get authenticated user
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Please log in first' }, { status: 401 });
        }

        if (!user.email) {
            return NextResponse.json({ error: 'No email address found for your account' }, { status: 400 });
        }

        // Send test email
        const result = await sendEmail({
            to: user.email,
            subject: '🧪 Career Black Box - Test Email',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">✅ Email Test Successful!</h1>
                        </div>
                        
                        <div style="background-color: #1e293b; border-radius: 0 0 16px 16px; padding: 24px;">
                            <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                                Congratulations! Your email configuration is working correctly.
                            </p>
                            
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                This email was sent to: <strong style="color: #818cf8;">${user.email}</strong>
                            </p>
                            
                            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                Your weekly digest emails will be sent to this address when enabled.
                            </p>
                            
                            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <p style="color: #64748b; font-size: 12px; margin: 0;">
                                    Sent from Career Black Box at ${new Date().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (!result.success) {
            return NextResponse.json({
                error: 'Failed to send email',
                details: result.error,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Test email sent to ${user.email}`,
            messageId: result.messageId,
        });
    } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
