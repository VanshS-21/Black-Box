import crypto from 'crypto';

/**
 * Verify that a request came from Slack by checking the signature
 * https://api.slack.com/authentication/verifying-requests-from-slack
 */
export function verifySlackSignature(
    signingSecret: string,
    signature: string,
    timestamp: string,
    body: string
): boolean {
    // Check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    const requestTimestamp = parseInt(timestamp, 10);
    if (Math.abs(now - requestTimestamp) > 60 * 5) {
        console.warn('Slack request timestamp too old');
        return false;
    }

    // Compute expected signature
    const sigBasestring = `v0:${timestamp}:${body}`;
    const mySignature = 'v0=' + crypto
        .createHmac('sha256', signingSecret)
        .update(sigBasestring, 'utf8')
        .digest('hex');

    // Compare signatures (timing-safe)
    try {
        return crypto.timingSafeEqual(
            Buffer.from(mySignature, 'utf8'),
            Buffer.from(signature, 'utf8')
        );
    } catch {
        return false;
    }
}

/**
 * Generate a random 6-character link code for manual Slack linking
 */
export function generateLinkCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Parse Slack slash command text
 */
export function parseSlackCommand(text: string): {
    command: 'link' | 'help' | 'log';
    args: string;
} {
    const trimmed = text.trim();

    if (trimmed.toLowerCase().startsWith('link ')) {
        return { command: 'link', args: trimmed.substring(5).trim() };
    }

    if (trimmed.toLowerCase() === 'help') {
        return { command: 'help', args: '' };
    }

    // Default: treat as decision to log
    return { command: 'log', args: trimmed };
}

/**
 * Format a Slack Block Kit message for decision confirmation
 */
export function formatDecisionConfirmation(title: string, coachingTip: string): object {
    return {
        response_type: 'ephemeral', // Only visible to user
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `✅ *Decision logged!*\n\n*${title}*`
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `💡 *Pro Tip:* ${coachingTip}`
                }
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: '<https://black-box-flax.vercel.app/dashboard|View in Dashboard>'
                    }
                ]
            }
        ]
    };
}

/**
 * Format error response for Slack
 */
export function formatSlackError(message: string): object {
    return {
        response_type: 'ephemeral',
        text: `❌ ${message}`
    };
}

/**
 * Format help message for Slack
 */
export function formatHelpMessage(): object {
    return {
        response_type: 'ephemeral',
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: '📦 Career Black Box Help'
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '*Commands:*'
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '`/logdecision <your decision>` - Log a new decision\n' +
                        '`/logdecision link ABC123` - Link to your Career Black Box account\n' +
                        '`/logdecision help` - Show this help message'
                }
            },
            {
                type: 'divider'
            },
            {
                type: 'context',
                elements: [
                    {
                        type: 'mrkdwn',
                        text: '🔗 <https://black-box-flax.vercel.app/dashboard/settings|Get your link code>'
                    }
                ]
            }
        ]
    };
}

/**
 * Format link success message
 */
export function formatLinkSuccess(): object {
    return {
        response_type: 'ephemeral',
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '🎉 *Success!* Your Slack account is now linked to Career Black Box.\n\nYou can now use `/logdecision <your decision>` to log decisions directly from Slack!'
                }
            }
        ]
    };
}
