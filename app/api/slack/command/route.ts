import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { structureDecision } from '@/lib/ai/gemini';
import {
    verifySlackSignature,
    parseSlackCommand,
    formatDecisionConfirmation,
    formatSlackError,
    formatHelpMessage,
    formatLinkSuccess
} from '@/lib/slack/utils';

// Use service role for Slack bot (no user session)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text();

        // Verify Slack signature
        const signingSecret = process.env.SLACK_SIGNING_SECRET;
        const signature = request.headers.get('x-slack-signature') || '';
        const timestamp = request.headers.get('x-slack-request-timestamp') || '';

        if (!signingSecret) {
            console.error('SLACK_SIGNING_SECRET not configured');
            return NextResponse.json(
                formatSlackError('Slack integration not configured'),
                { status: 200 } // Always return 200 to Slack
            );
        }

        if (!verifySlackSignature(signingSecret, signature, timestamp, rawBody)) {
            console.warn('Invalid Slack signature');
            return NextResponse.json(
                formatSlackError('Invalid request signature'),
                { status: 200 }
            );
        }

        // Parse form data
        const params = new URLSearchParams(rawBody);
        const slackUserId = params.get('user_id') || '';
        const slackTeamId = params.get('team_id') || '';
        const commandText = params.get('text') || '';
        const responseUrl = params.get('response_url') || '';

        // Parse command
        const { command, args } = parseSlackCommand(commandText);

        // Handle help command
        if (command === 'help') {
            return NextResponse.json(formatHelpMessage(), { status: 200 });
        }

        // Handle link command
        if (command === 'link') {
            return await handleLinkCommand(slackUserId, slackTeamId, args);
        }

        // Handle log command (default)
        return await handleLogCommand(slackUserId, slackTeamId, args, responseUrl);

    } catch (error) {
        console.error('Slack command error:', error);
        return NextResponse.json(
            formatSlackError('An unexpected error occurred'),
            { status: 200 }
        );
    }
}

async function handleLinkCommand(
    slackUserId: string,
    slackTeamId: string,
    linkCode: string
): Promise<NextResponse> {
    if (!linkCode || linkCode.length !== 6) {
        return NextResponse.json(
            formatSlackError('Invalid link code. Get your code from Settings at career-black-box.vercel.app'),
            { status: 200 }
        );
    }

    // Find the link record with this code
    const { data: linkRecord, error: findError } = await supabase
        .from('slack_user_links')
        .select('*')
        .eq('link_code', linkCode.toUpperCase())
        .gt('link_code_expires_at', new Date().toISOString())
        .is('linked_at', null)
        .single();

    if (findError || !linkRecord) {
        return NextResponse.json(
            formatSlackError('Link code not found or expired. Generate a new code in Settings.'),
            { status: 200 }
        );
    }

    // Update the link record with Slack user info
    const { error: updateError } = await supabase
        .from('slack_user_links')
        .update({
            slack_user_id: slackUserId,
            slack_team_id: slackTeamId,
            linked_at: new Date().toISOString(),
            link_code: null, // Clear the code after use
            link_code_expires_at: null
        })
        .eq('id', linkRecord.id);

    if (updateError) {
        console.error('Failed to update Slack link:', updateError);
        return NextResponse.json(
            formatSlackError('Failed to link account. Please try again.'),
            { status: 200 }
        );
    }

    return NextResponse.json(formatLinkSuccess(), { status: 200 });
}

async function handleLogCommand(
    slackUserId: string,
    slackTeamId: string,
    decisionText: string,
    responseUrl: string
): Promise<NextResponse> {
    // Check if user is linked
    const { data: linkRecord } = await supabase
        .from('slack_user_links')
        .select('cbb_user_id')
        .eq('slack_user_id', slackUserId)
        .eq('slack_team_id', slackTeamId)
        .not('linked_at', 'is', null)
        .single();

    if (!linkRecord) {
        return NextResponse.json(
            formatSlackError(
                'Your Slack account is not linked. Run `/logdecision link YOUR_CODE` to connect.\n' +
                'Get your code at: https://career-black-box.vercel.app/dashboard/settings'
            ),
            { status: 200 }
        );
    }

    const userId = linkRecord.cbb_user_id;

    // Validate decision text
    if (!decisionText || decisionText.length < 50) {
        return NextResponse.json(
            formatSlackError('Please provide at least 50 characters describing your decision.'),
            { status: 200 }
        );
    }

    // Acknowledge immediately (Slack expects response within 3 seconds)
    // We'll use the response_url for the actual result

    // Process asynchronously if we have a response URL
    if (responseUrl) {
        // Don't await - let it run in background
        processDecisionAsync(userId, decisionText, responseUrl);

        return NextResponse.json({
            response_type: 'ephemeral',
            text: '⏳ Processing your decision with AI...'
        }, { status: 200 });
    }

    // Fallback: process synchronously (may timeout)
    try {
        const structured = await structureDecision(decisionText);

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
                source: 'slack',
                source_url: null
            });

        if (saveError) {
            console.error('Failed to save decision:', saveError);
            return NextResponse.json(
                formatSlackError('Failed to save decision. Please try again.'),
                { status: 200 }
            );
        }

        return NextResponse.json(
            formatDecisionConfirmation(
                structured.title,
                structured.coaching?.coaching_tip || 'Decision logged successfully!'
            ),
            { status: 200 }
        );
    } catch (error) {
        console.error('AI structuring failed:', error);
        return NextResponse.json(
            formatSlackError('AI processing failed. Please try again.'),
            { status: 200 }
        );
    }
}

// Process decision asynchronously and respond via response_url
async function processDecisionAsync(
    userId: string,
    decisionText: string,
    responseUrl: string
): Promise<void> {
    try {
        const structured = await structureDecision(decisionText);

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
                source: 'slack',
                source_url: null
            });

        if (saveError) {
            await sendSlackResponse(responseUrl, formatSlackError('Failed to save decision.'));
            return;
        }

        await sendSlackResponse(
            responseUrl,
            formatDecisionConfirmation(
                structured.title,
                structured.coaching?.coaching_tip || 'Decision logged successfully!'
            )
        );
    } catch (error) {
        console.error('Async decision processing failed:', error);
        await sendSlackResponse(responseUrl, formatSlackError('AI processing failed.'));
    }
}

async function sendSlackResponse(responseUrl: string, payload: object): Promise<void> {
    try {
        await fetch(responseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error('Failed to send Slack response:', error);
    }
}
