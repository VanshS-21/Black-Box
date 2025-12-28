import { Resend } from 'resend';

// Lazy initialization for Resend client
let resendClient: Resend | null = null;

/**
 * Get the Resend client instance (lazy loaded)
 * Returns null if RESEND_API_KEY is not configured
 */
export function getResendClient(): Resend | null {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured - emails will not be sent');
        return null;
    }

    if (!resendClient) {
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }

    return resendClient;
}

/**
 * Send an email using Resend
 * Returns true if sent successfully, false otherwise
 */
export async function sendEmail({
    to,
    subject,
    html,
    from = 'Career Black Box <onboarding@resend.dev>',
}: {
    to: string;
    subject: string;
    html: string;
    from?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const resend = getResendClient();

    if (!resend) {
        console.log('📧 [DRY RUN] Would send email to:', to);
        console.log('📧 [DRY RUN] Subject:', subject);
        return { success: true, messageId: 'dry-run' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error: error.message };
        }

        console.log('📧 Email sent successfully:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (err) {
        console.error('Failed to send email:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
        };
    }
}

/**
 * Check if email sending is configured
 */
export function isEmailConfigured(): boolean {
    return !!process.env.RESEND_API_KEY;
}
