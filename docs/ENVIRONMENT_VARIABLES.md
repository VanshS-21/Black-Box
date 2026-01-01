# Career Black Box - Environment Variables Guide

## Required Variables

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations | Same (keep secret!) |
| `GOOGLE_GEMINI_API_KEY` | AI structuring | [Google AI Studio](https://makersuite.google.com/app/apikey) |

## Recommended Variables

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_SITE_URL` | Email links, callbacks | Your deployment URL |
| `UPSTASH_REDIS_REST_URL` | Rate limiting | [Upstash Console](https://console.upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting auth | Same as above |
| `RESEND_API_KEY` | Email notifications | [Resend Dashboard](https://resend.com/api-keys) |

## Optional Variables

| Variable | Purpose | Feature |
|----------|---------|---------|
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking | Monitoring |
| `SENTRY_AUTH_TOKEN` | Source maps | Monitoring |
| `RAZORPAY_KEY_ID` | Payments | Billing |
| `RAZORPAY_KEY_SECRET` | Payments | Billing |
| `SLACK_SIGNING_SECRET` | Slack integration | Slack commands |
| `GITHUB_WEBHOOK_SECRET` | GitHub integration | GitHub capture |
| `QSTASH_TOKEN` | Scheduled jobs | Weekly digest |
| `QSTASH_CURRENT_SIGNING_KEY` | Job verification | Weekly digest |
| `QSTASH_NEXT_SIGNING_KEY` | Key rotation | Weekly digest |

## Setup Steps

1. Copy variables to Vercel: Settings > Environment Variables
2. For local dev, create `.env.local` with same values
3. Never commit secrets to git

---

*Last updated: January 2026*
