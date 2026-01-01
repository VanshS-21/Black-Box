import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { structureDecision } from '@/lib/ai/gemini';
import {
    verifyGitHubSignature,
    parseGitHubWebhook,
    parseDecisionComment,
} from '@/lib/github/utils';
import { waitUntil } from '@vercel/functions';
import { logger } from '@/lib/logger';

// Use service role for GitHub webhook (no user session)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DASHBOARD_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://black-box-flax.vercel.app';

export async function POST(request: NextRequest) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text();

        // Verify GitHub signature
        const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
        const signature = request.headers.get('x-hub-signature-256') || '';
        const eventType = request.headers.get('x-github-event') || '';
        const deliveryId = request.headers.get('x-github-delivery') || '';

        if (!webhookSecret) {
            logger.error('GitHub webhook secret not configured', { action: 'github_webhook' });
            return NextResponse.json(
                { error: 'GitHub integration not configured' },
                { status: 500 }
            );
        }

        if (!verifyGitHubSignature(webhookSecret, signature, rawBody)) {
            logger.warn('Invalid GitHub signature', { action: 'github_webhook', deliveryId });
            return NextResponse.json(
                { error: 'Invalid request signature' },
                { status: 401 }
            );
        }

        // Parse payload
        let payload: Record<string, unknown>;
        try {
            payload = JSON.parse(rawBody);
        } catch {
            logger.error('Failed to parse GitHub webhook payload', { deliveryId, eventType });
            return NextResponse.json(
                { error: 'Invalid JSON payload' },
                { status: 400 }
            );
        }

        // Handle ping event (GitHub sends this when webhook is first set up)
        if (eventType === 'ping') {
            logger.info('GitHub webhook ping received', { zen: payload.zen });
            return NextResponse.json({ message: 'pong' }, { status: 200 });
        }

        // Parse the webhook payload
        const comment = parseGitHubWebhook(eventType, payload);

        if (!comment) {
            // Not a comment event we care about
            return NextResponse.json(
                { message: 'Event type not handled' },
                { status: 200 }
            );
        }

        // Check if comment contains decision trigger
        const decisionText = parseDecisionComment(comment.commentBody);

        if (!decisionText) {
            // No @blackbox trigger found
            return NextResponse.json(
                { message: 'No decision trigger found' },
                { status: 200 }
            );
        }

        logger.info('Decision trigger found from GitHub', { username: comment.username, githubUserId: comment.userId, action: 'github_decision' });

        // Look up linked user
        const { data: linkRecord } = await supabase
            .from('github_user_links')
            .select('cbb_user_id')
            .eq('github_user_id', comment.userId)
            .not('linked_at', 'is', null)
            .single();

        if (!linkRecord) {
            logger.info('GitHub user not linked to CBB account', { username: comment.username });
            // Silently ignore - don't spam repos with "please sign up" messages
            return NextResponse.json(
                { message: 'User not linked' },
                { status: 200 }
            );
        }

        // Validate decision text length
        if (decisionText.length < 30) {
            logger.info('Decision text too short', { length: decisionText.length });
            return NextResponse.json(
                { message: 'Decision text too short' },
                { status: 200 }
            );
        }

        // Process decision asynchronously
        waitUntil(processDecisionAsync(
            linkRecord.cbb_user_id,
            decisionText,
            comment.htmlUrl,
            comment.username
        ));

        // Immediate response to GitHub
        return NextResponse.json(
            { message: 'Decision processing started' },
            { status: 200 }
        );

    } catch (error) {
        logger.error('GitHub webhook error', { action: 'github_webhook' }, error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Process decision asynchronously - runs after response is sent
 */
async function processDecisionAsync(
    userId: string,
    decisionText: string,
    sourceUrl: string,
    githubUsername: string
): Promise<void> {
    try {
        logger.info('Processing GitHub decision', { userId, githubUsername, action: 'github_ai_structure' });

        const structured = await structureDecision(decisionText);
        logger.info('AI processing complete, saving to database', { userId, title: structured.title });

        // Save to database
        const { error: saveError } = await supabase
            .from('decisions')
            .insert({
                user_id: userId,
                title: structured.title,
                decision_made: structured.decision_made,
                context: structured.context,
                trade_offs: structured.trade_offs,
                biggest_risk: structured.biggest_risk,
                stakeholders: structured.stakeholders,
                confidence_level: structured.confidence_level,
                tags: structured.tags,
                original_input: decisionText,
                ai_structured: true,
                source: 'github',
                source_url: sourceUrl
            });

        if (saveError) {
            logger.error('Failed to save GitHub decision', { userId, sourceUrl }, saveError);
            return;
        }

        logger.info('GitHub decision saved successfully', { userId, title: structured.title });

        // Note: Could optionally post a reply comment here using GitHub API
        // This would require GITHUB_APP_PRIVATE_KEY and additional setup

    } catch (error) {
        logger.error('GitHub decision processing failed', { userId, githubUsername }, error);
    }
}

// Handle GET for health checks
export async function GET() {
    return NextResponse.json(
        { status: 'ok', message: 'GitHub webhook endpoint' },
        { status: 200 }
    );
}
