import crypto from 'crypto';

/**
 * Verify that a webhook request came from GitHub
 * https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
export function verifyGitHubSignature(
    secret: string,
    signature: string,
    payload: string
): boolean {
    if (!signature || !signature.startsWith('sha256=')) {
        console.warn('Invalid GitHub signature format');
        return false;
    }

    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'utf8'),
            Buffer.from(signature, 'utf8')
        );
    } catch {
        return false;
    }
}

/**
 * Decision trigger pattern: @blackbox or /blackbox followed by decision text
 * Examples:
 *   @blackbox Decided to use Redis for caching...
 *   /blackbox Chose GraphQL over REST because...
 */
const DECISION_TRIGGERS = [
    /^@blackbox\s+(.+)/i,
    /^\/blackbox\s+(.+)/i,
];

/**
 * Parse a GitHub comment to extract a decision if triggered
 * Returns null if no decision trigger found
 */
export function parseDecisionComment(commentBody: string): string | null {
    // Normalize newlines to spaces for regex matching
    const normalized = commentBody.trim().replace(/\r?\n/g, ' ');

    for (const pattern of DECISION_TRIGGERS) {
        const match = normalized.match(pattern);
        if (match && match[1]) {
            // Return original text after trigger, preserving newlines
            const triggerMatch = commentBody.match(/@blackbox\s+/i) || commentBody.match(/\/blackbox\s+/i);
            if (triggerMatch) {
                return commentBody.substring(triggerMatch.index! + triggerMatch[0].length).trim();
            }
            return match[1].trim();
        }
    }

    return null;
}

/**
 * GitHub webhook event types we handle
 */
export type GitHubEventType =
    | 'issue_comment'
    | 'pull_request_review_comment'
    | 'pull_request_review';

/**
 * Parsed GitHub comment from webhook payload
 */
export interface GitHubComment {
    eventType: GitHubEventType;
    action: string;
    commentId: number;
    commentBody: string;
    userId: number;
    username: string;
    htmlUrl: string;
    repoFullName: string;
    issueOrPrNumber: number;
    isPullRequest: boolean;
}

/**
 * Parse GitHub webhook payload for comment events
 */
export function parseGitHubWebhook(
    eventType: string,
    payload: Record<string, unknown>
): GitHubComment | null {
    if (!['issue_comment', 'pull_request_review_comment', 'pull_request_review'].includes(eventType)) {
        return null;
    }

    const action = payload.action as string;

    // Only process created or edited comments
    if (!['created', 'edited', 'submitted'].includes(action)) {
        return null;
    }

    // Extract comment based on event type
    let comment: Record<string, unknown> | null = null;
    let htmlUrl = '';
    let issueOrPrNumber = 0;
    let isPullRequest = false;

    if (eventType === 'issue_comment') {
        comment = payload.comment as Record<string, unknown>;
        htmlUrl = (comment?.html_url as string) || '';
        const issue = payload.issue as Record<string, unknown>;
        issueOrPrNumber = (issue?.number as number) || 0;
        isPullRequest = !!(issue?.pull_request);
    } else if (eventType === 'pull_request_review_comment') {
        comment = payload.comment as Record<string, unknown>;
        htmlUrl = (comment?.html_url as string) || '';
        const pr = payload.pull_request as Record<string, unknown>;
        issueOrPrNumber = (pr?.number as number) || 0;
        isPullRequest = true;
    } else if (eventType === 'pull_request_review') {
        const review = payload.review as Record<string, unknown>;
        comment = review;
        htmlUrl = (review?.html_url as string) || '';
        const pr = payload.pull_request as Record<string, unknown>;
        issueOrPrNumber = (pr?.number as number) || 0;
        isPullRequest = true;
    }

    if (!comment) {
        return null;
    }

    const user = comment.user as Record<string, unknown>;
    const repo = payload.repository as Record<string, unknown>;

    return {
        eventType: eventType as GitHubEventType,
        action,
        commentId: (comment.id as number) || 0,
        commentBody: (comment.body as string) || '',
        userId: (user?.id as number) || 0,
        username: (user?.login as string) || '',
        htmlUrl,
        repoFullName: (repo?.full_name as string) || '',
        issueOrPrNumber,
        isPullRequest,
    };
}

/**
 * Generate a random 6-character link code for GitHub linking
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
 * Format decision confirmation message (for optional reply comment)
 */
export function formatDecisionConfirmation(
    title: string,
    coachingTip: string,
    dashboardUrl: string
): string {
    return `✅ **Decision logged!**

**${title}**

💡 **Pro Tip:** ${coachingTip}

[View in Dashboard](${dashboardUrl})

---
*Captured by [Career Black Box](${dashboardUrl})*`;
}

/**
 * Format error message (for optional reply comment)
 */
export function formatErrorMessage(error: string): string {
    return `❌ **Failed to log decision**

${error}

---
*Career Black Box*`;
}
