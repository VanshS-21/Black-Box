# Qstash Setup Guide - Weekly Email Digest

This guide explains how to configure Upstash Qstash to trigger the weekly digest emails.

## Prerequisites

1. **Upstash Account** - You already have one for rate limiting
2. **Deployed Application** - The `/api/cron/weekly-digest` endpoint must be accessible

## Setup Steps

### 1. Get Qstash Credentials

1. Go to [Upstash Console](https://console.upstash.com)
2. Navigate to **Qstash** section
3. Copy your **QSTASH_TOKEN** and **QSTASH_CURRENT_SIGNING_KEY**

### 2. Add Environment Variables

Add these to your Vercel environment (and `.env.local` for testing):

```env
QSTASH_TOKEN=your_qstash_token
QSTASH_CURRENT_SIGNING_KEY=your_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key
```

### 3. Create Scheduled Message

In Upstash Console → Qstash → Schedules → Create Schedule:

| Setting | Value |
|---------|-------|
| Destination | `https://your-app.vercel.app/api/cron/weekly-digest` |
| Schedule | `0 9 * * 5` (Every Friday at 9am UTC) |
| Body | `{}` (empty JSON) |
| Content-Type | `application/json` |

**Alternative schedule:** For IST (UTC+5:30), use `30 3 * * 5` to send at 9am IST.

### 4. Test the Endpoint

Use Qstash's "Publish Message" to manually trigger:

```bash
curl -X POST "https://qstash.upstash.io/v2/publish/https://your-app.vercel.app/api/cron/weekly-digest" \
  -H "Authorization: Bearer YOUR_QSTASH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{}"
```

### 5. Verify Signature Validation

The endpoint uses `verifySignatureAppRouter` from `@upstash/qstash/nextjs` to ensure only Qstash can trigger it.

If you get signature errors:
1. Check that signing keys are correctly set in environment
2. Ensure your app URL matches what's configured in Qstash

## How It Works

```
┌─────────────┐    Scheduled    ┌─────────────────┐
│   Qstash    │───────────────►│  Vercel Func    │
│  (9am Fri)  │   POST /api/   │ weekly-digest   │
└─────────────┘                └─────────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │   Supabase DB   │
                              │ - Get users     │
                              │ - Get decisions │
                              └─────────────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  Send Emails    │
                              │  (Resend/etc)   │
                              └─────────────────┘
```

## Database Migration

Run this migration to add digest preferences:

```sql
-- migrations/010_weekly_digest_preferences.sql
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS weekly_digest_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS digest_time TEXT DEFAULT 'friday_9am',
ADD COLUMN IF NOT EXISTS last_digest_sent_at TIMESTAMPTZ DEFAULT NULL;
```

## Email Service Integration

The endpoint generates email HTML but currently logs instead of sending. To enable actual sending:

1. Choose email provider (Resend, Postmark, SendGrid)
2. Add API key to environment
3. Update `route.ts` to call email service instead of logging

Example with Resend:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
    from: 'Career Black Box <digest@careerblackbox.app>',
    to: emailContent.to,
    subject: emailContent.subject,
    html: emailContent.html,
});
```

## Monitoring

View Qstash logs in the Upstash Console:
- Delivery attempts
- Response codes
- Retry status

---

*Last updated: December 2024*
