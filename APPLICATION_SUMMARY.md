# Career Black Box - Comprehensive Application Summary

> **Document Purpose**: Complete product analysis for Product Manager review and constructive feedback.  
> **Last Updated**: December 28, 2024  
> **Application Status**: Public Beta (Phase 2.2 Complete)

---

## Executive Summary

**Career Black Box** is an AI-powered decision journal designed specifically for software engineers to document, structure, and leverage their professional decisions for career advancement. The core value proposition addresses a common pain point: engineers make countless important technical decisions daily but lose credit for them during performance reviews and promotion cycles.

The application transforms unstructured "brain dumps" about decisions into structured, promotion-ready documentation using Google's Gemini AI, while also providing career coaching feedback to help engineers articulate their impact more effectively.

---

## Target Audience

| Segment | Description |
|---------|-------------|
| **Primary** | Individual software engineers (IC2-Staff level) who want to track their decisions for performance reviews |
| **Secondary** | Engineering managers seeking to preserve institutional knowledge |
| **Tertiary** | Teams wanting shared decision history that survives employee turnover |

---

## Core Value Propositions

1. **Stop losing credit for decisions** - Document decisions as they happen, not months later
2. **AI-powered structuring** - Natural language input → structured promotion-ready documentation
3. **Career coaching built-in** - Real-time feedback on how to articulate impact
4. **Generate promotion packages** - One-click creation of comprehensive self-review documents
5. **Privacy-first** - User-owned data with export capabilities, RLS security

---

## Feature Breakdown

### 1. AI-Powered Decision Structuring

**Location**: `app/dashboard/new/page.tsx`, `lib/ai/gemini.ts`

Users can write naturally about their decisions ("brain dump") and the AI extracts:

| Field | Description |
|-------|-------------|
| `title` | Concise, impactful title (max 200 chars) |
| `decision_made` | What was decided (1-2 sentences) |
| `context` | The situation and constraints |
| `trade_offs` | What was given up |
| `biggest_risk` | Main risk accepted |
| `stakeholders` | Who was involved |
| `confidence_level` | 1-10 scale |
| `tags` | Auto-generated categories |

**AI Model**: Google Gemini 2.5 Flash (free tier optimized)

**Rate Limiting**: Upstash Redis-based limiting for AI endpoints

---

### 2. AI Career Coaching Feedback

**Location**: `components/CoachingFeedback.tsx`

Each AI-structured decision includes coaching:

```typescript
interface CareerCoaching {
    impact_reframe: string;       // Decision rewritten for business impact
    weak_phrases: string[];       // Vague language to avoid
    power_phrases: string[];      // Better alternatives with metrics
    promotion_readiness: number;  // 1-10 score
    coaching_tip: string;         // Actionable advice
}
```

**Features**:
- **Promotion Readiness Score**: Visual 1-10 rating with progress bar
- **Impact Reframing**: AI rewrites the decision with business impact focus
- **Phrase Upgrades**: Shows weak → power phrase transformations
- **One-Click Accept**: Users can apply the reframed version directly

---

### 3. Promotion Package Generator

**Location**: `components/PromotionPackageGenerator.tsx`, `app/api/ai/promotion-package/`

Generates comprehensive self-review documents from accumulated decisions:

**Requirements**: Minimum 3 decisions to unlock

**Output Sections**:
1. Executive Summary
2. Decision-Making Patterns
3. Growth & Learning
4. Impact & Outcomes
5. Risk Management

**Export Options**:
- Copy to clipboard
- Download as Markdown (.md)
- Download as PDF (via jsPDF)

**Storage**: Last 10 packages saved per user in `promotion_packages` table

---

### 4. Quick Reframe (Lead Magnet - Phase 2.1)

**Location**: `components/QuickReframe.tsx`, `components/LandingQuickReframe.tsx`, `app/api/ai/quick-reframe/`

**Public Access**: Available on landing page WITHOUT login (rate-limited by IP)

- Paste any text (commit message, Slack update, brain dump)
- AI instantly reframes to promotion-ready language with business impact
- Shows weak phrases → power phrases transformation
- One-click copy for immediate use
- **Email capture gate** on "Copy Result" for lead generation
- **Rate Limited**: 5 uses/day per IP for anonymous users

**Use Case**: Get the "magic moment" in < 5 seconds without signup - converts visitors to users.

---

### 5. Weekly Update Generator

**Location**: `components/WeeklyUpdateGenerator.tsx`, `app/api/ai/weekly-update/`

**NEW** - Lower friction than Promotion Package:

- Works with just **1 decision** (vs 3 for promotion package)
- Generates Slack-ready weekly summary
- Pulls from decisions logged in past 7 days
- One-click copy for Slack/email

---

### 6. Demo Decisions for New Users

**Location**: `components/DemoDecisions.tsx`

**NEW** - Fixes "empty room" syndrome:

- Shows 3 sample decision cards when user has 0 real decisions
- Demonstrates what a populated dashboard looks like
- Clear "Create Your First Real Decision" CTA
- Sample cards disappear once user logs first real decision

---

### 7. Decision Management Dashboard

**Location**: `app/dashboard/page.tsx`

**Features**:
- Card-based display of all decisions
- **Analytics Widget**: Monthly stats, streak counter, top tags, average confidence (Phase 2.2)
- **Enhanced Filters**: Date range, confidence level slider, expandable filter panel (Phase 2.2)
- Search functionality (by title, tags, content)
- Lock/Preserve decisions (creates immutable record)
- Individual decision detail view
- Quick navigation to create new decisions
- **Loading Skeletons**: Polished loading states for better UX (Phase 2.2)

---

### 8. Decision Templates (Phase 2.2)

**Location**: `lib/templates/decision-templates.ts`, `app/dashboard/new/page.tsx`

**Pre-built templates for common engineering decisions**:

| Template | Use Case |
|----------|----------|
| Architecture Decision Record (ADR) | Document architectural choices |
| Tech Debt Decision | Log intentional shortcuts with payback plan |
| Feature Trade-off | Document product/engineering compromises |
| Incident Postmortem | Structure post-incident learnings |

**Features**:
- One-click template selection
- Pre-fills all form fields with structured prompts
- Template-specific tags auto-applied

---

### 9. Weekly Email Digest (Phase 2.1)

**Location**: `app/api/cron/weekly-digest/route.ts`, `lib/email/resend.ts`

**Scheduled push notifications for engagement**:

- Qstash-scheduled cron job (Friday 9am or Monday 9am IST)
- Beautiful HTML email template with decision summary
- Encouragement email for empty weeks
- User preference toggle in Settings
- **Email Provider**: Resend (100 emails/month free tier)

**Database**: `user_preferences` table with `weekly_digest_enabled`, `digest_time`

---

### 5. Integrations

#### 5.1 Slack Integration

**Location**: `app/api/slack/`, `lib/slack/`

**Authentication**: Link code-based linking (no OAuth dance required)

**Features**:
- `/logdecision` slash command to log decisions from Slack
- AI structures decisions asynchronously
- Sends confirmation back to Slack with coaching tips
- "View in Dashboard" link in confirmation

**Database Tables**: `slack_installations`, `slack_user_links`

---

#### 5.2 GitHub Integration

**Location**: `app/api/github/`, `lib/github/`, `chrome-extension/`

**How it works**:
1. User generates link code in dashboard settings
2. GitHub App webhook receives PR/issue comments
3. Comments starting with `@blackbox` trigger decision capture
4. AI structures and saves the decision

**Database Table**: `github_user_links`

---

#### 5.3 Team Token System (Manager Wedge)

**Location**: `components/TeamManager.tsx`, `app/api/teams/`, `supabase/migrations/008_teams.sql`

**NEW** - Team features for Engineering Managers:

| Feature | Description |
|---------|-------------|
| **Create Team** | Owners can create teams with auto-generated 8-char join token |
| **Share Token** | Easy-to-share code (e.g., `ABCD1234`) for team joining |
| **Join Team** | Members enter token to join team |
| **Team Decisions** | Decisions can optionally be shared with team (visible to all members) |

**Database Tables**: `teams`, `team_members`

**RLS Security**: SECURITY DEFINER functions to avoid recursion issues

---

#### 5.4 Team Pulse Dashboard (Phase 2.1)

**Location**: `components/TeamPulseDashboard.tsx`, `app/api/teams/[teamId]/pulse/route.ts`

**Manager-focused analytics for team owners**:

| Metric | Description |
|--------|-------------|
| Active Members | Who logged decisions this week |
| Silent Members | Who hasn't logged + days since last |
| Top Risks | Aggregated from `biggest_risk` fields |
| Weekly Trend | Decision count per week graph |

**Access**: "View Team Pulse" button in TeamManager for owners only

---

#### 5.5 Privacy UX - Team Mode Separation (Phase 2.1)

**Location**: `components/TeamVisibilityToggle.tsx`, `app/dashboard/new/page.tsx`

**Eliminates fear of manager surveillance**:

- Prominent "Private vs Team Visible" toggle (default: Private)
- Visual mode indicator (slate border = private, indigo border = team)
- Confirmation dialog when sharing to team
- Visibility badge on decision cards in dashboard
- Team selection for multi-team users

---

#### 5.6 Chrome Extension

**Location**: `chrome-extension/`

**Files**:
- `manifest.json` - Extension configuration
- `popup.html/js` - Extension popup interface
- `github-content.js` - GitHub page integration
- `background.js` - Service worker for API calls
- `CHROME_STORE_SUBMISSION.md` - Complete submission guide (Phase 2.1)

**Purpose**: Capture decisions directly from GitHub interface

---

### 6. Data Export & Privacy

**Location**: `app/api/export/`, `app/dashboard/settings/page.tsx`

**Export Format**: JSON file containing:
- All decisions
- User preferences
- Metadata

**Data Deletion**: Full account deletion with cascade delete of all data

---

### 7. Authentication System

**Location**: `app/auth/`, `lib/auth/`

**Provider**: Supabase Auth

**Features**:
- Email/Password signup & login
- Email verification flow
- Password reset capability
- Session management with cookies
- Middleware-based route protection

**Protected Routes**: All `/dashboard/*` routes

---

### 8. Payment System

**Location**: `app/api/payments/`, `lib/payments/`

**Provider**: Razorpay (configured for Indian market)

**Pricing Model**:
| Tier | Price | Features |
|------|-------|----------|
| Free Forever | ₹0/month | Unlimited decisions, search, tags, export, lock, PDF |
| Pro | ₹500/month (free during beta) | AI structuring, promotion packages, advanced analytics, priority support |
| **Team** | **₹2,500/month** | **5 seats, Team Pulse Dashboard, Shared Decisions, Priority Support** |

**Database Table**: `payments` (tracks payment intents and status)

---

## Database Schema

**Provider**: Supabase (PostgreSQL)

### Core Tables

| Table | Purpose |
|-------|---------|
| `decisions` | Core decision entries with structured fields |
| `user_preferences` | User settings (role, etc.) |
| `ai_generations` | Tracks AI usage for cost monitoring |
| `payments` | Payment records |
| `slack_installations` | Slack workspace configs |
| `slack_user_links` | Slack↔CBB user mapping |
| `github_user_links` | GitHub↔CBB user mapping |
| `promotion_packages` | Stored promotion packages (max 10/user) |
| `teams` | Team definitions with join tokens |
| `team_members` | Team membership and roles |
| `user_preferences` | User settings including weekly digest preferences |

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Locked decisions cannot be updated

---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom design system
- **Animations**: Framer Motion
- **UI Components**: Custom component library in `/components/ui/`
- **Icons**: Lucide React

### Backend Stack
- **Runtime**: Next.js API Routes (Vercel serverless)
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash
- **Rate Limiting**: Upstash Redis
- **Monitoring**: Sentry

### Integrations
- **Auth**: Supabase Auth
- **Payments**: Razorpay
- **Slack**: Custom app with slash commands
- **GitHub**: GitHub App with webhooks
- **Email**: Resend (weekly digest, notifications)
- **Scheduling**: Upstash Qstash (cron jobs)

---

## UI/UX Design

### Design System
- **Theme**: Premium dark mode (slate-950 base)
- **Accent Colors**: Indigo/Violet gradient
- **Typography**: Outfit font family
- **Effects**: Glassmorphism, gradient blurs, micro-animations

### Landing Page Sections
1. Hero with value proposition
2. Interactive demo card
3. Feature grid (6 cards)
4. "For Teams" section
5. How It Works (3 steps)
6. Beta announcement
7. User feedback CTA
8. Pricing cards
9. FAQ accordion
10. Final CTA

---

## Current State & Beta Features

### What's Working
- ✅ Full authentication flow
- ✅ Decision CRUD operations
- ✅ AI-powered structuring with coaching
- ✅ Promotion package generation
- ✅ Slack integration
- ✅ GitHub integration
- ✅ Data export (JSON)
- ✅ PDF generation for packages
- ✅ Settings management
- ✅ Chrome extension (basic) with store submission docs
- ✅ Quick Reframe (instant AI translation, public access)
- ✅ Weekly Update generator (1+ decisions)
- ✅ Demo decisions for new users
- ✅ Team Token system (create/join teams)
- ✅ Team Pulse Dashboard (manager analytics)
- ✅ Privacy UX (team visibility toggle + confirmation)
- ✅ Team Pricing Tier (₹2,500/mo)
- ✅ Weekly Email Digest (Qstash + Resend)
- ✅ Decision Templates (ADR, Tech Debt, Trade-off, Postmortem)
- ✅ Enhanced Filters (date range, confidence slider)
- ✅ Dashboard Analytics Widget (monthly stats, streak, top tags)
- ✅ Loading Skeletons (polished loading states)
- ✅ Sitemap for SEO

### Beta Limitations
- All Pro features free during beta
- Payment system implemented but not enforced
- Chrome extension not published to store

---

## Monetization Strategy

### Revenue Model
1. **Freemium** with AI features as premium
2. **Target Pricing**: ₹500/month (~$6 USD)
3. **Free during beta** to gather users and feedback

### Premium Features (Post-Beta)
- AI-powered decision structuring (limit TBD)
- Promotion package generation
- Advanced analytics
- Priority support

---

## Analytics & Tracking

### AI Usage Tracking
- `ai_generations` table logs every AI call
- Tracks generation type, tokens, cost
- Enables usage-based billing in future

### Decision Metrics
- Source tracking (web, slack, github, chrome_extension)
- AI-structured vs manual entry ratio
- Confidence level distribution

---

## Competitive Positioning

| Feature | Career Black Box | Generic Note Apps | Brag Docs |
|---------|-----------------|-------------------|-----------|
| AI Structuring | ✅ | ❌ | ❌ |
| Career Coaching | ✅ | ❌ | ❌ |
| Promotion Package Gen | ✅ | ❌ | Manual |
| Slack Integration | ✅ | Limited | ❌ |
| GitHub Integration | ✅ | ❌ | ❌ |
| Decision-Specific Schema | ✅ | ❌ | ❌ |

---

## Key Metrics to Track (Suggested)

### Engagement
- Daily/Weekly/Monthly Active Users
- Decisions logged per user per week
- AI structuring vs manual entry ratio
- Time spent in coaching feedback

### Conversion
- Signup → First Decision completion rate
- Free → Pro conversion rate (post-beta)
- Promotion package generation per user

### Retention
- 7-day, 30-day, 90-day retention
- Decision logging frequency over time
- Return rate after generating promotion package

---

## Areas for Product Review

### 1. User Acquisition
- How will engineers discover this product?
- SEO strategy for "promotion documentation", "brag doc", etc.
- Developer community marketing

### 2. Activation
- ~~Is 10-decision minimum for promotion package too high?~~ **Fixed: Lowered to 3**
- Should there be an onboarding flow?
- How to encourage first decision logging?

### 3. Retention Hooks
- Weekly digest emails of decisions?
- Reminder notifications for regular logging?
- Integration with calendar/standup tools?

### 4. Pricing Validation
- Is ₹500/month the right price point?
- Should there be annual pricing discount?
- Enterprise/Team pricing TBD

### 5. Feature Gaps
- ~~No team/sharing features yet~~ **Fixed: Team Token system + Team Pulse implemented**
- ~~No analytics dashboard for users~~ **Fixed: Dashboard Analytics Widget implemented**
- No mobile app
- ~~No browser extension published~~ **Fixed: Chrome Store submission docs created** (requires $5 dev account)

### 6. Content/Marketing
- FAQ mentions testimonials but none exist yet
- ~~Landing page mentions "thousands of engineers" (not accurate for beta)~~ **Fixed: Changed to "exclusive beta"**
- Need real user testimonials post-beta

---

## Technical Debt / Production Readiness

| Item | Status |
|------|--------|
| Rate limiting | ✅ Implemented (Upstash) |
| Error monitoring | ✅ Sentry integrated |
| Health check endpoint | ✅ Implemented |
| RLS policies | ✅ All tables secured |
| SSL/HTTPS | ✅ Via Vercel |
| Environment config | ✅ Properly separated |
| Password reset | ✅ Implemented |
| Loading skeletons | ✅ Dashboard + New Decision pages |
| Sitemap | ✅ Dynamic sitemap.ts |
| Email service | ✅ Resend integrated |
| Cron jobs | ✅ Upstash Qstash for weekly digest |

---

## Summary

Career Black Box is a well-architected, feature-complete MVP in public beta that solves a genuine pain point for software engineers. The AI-powered decision structuring and career coaching differentiators set it apart from generic note-taking or brag doc solutions.

**Strengths**:
- Clear value proposition and target audience
- Solid technical implementation
- Multiple capture channels (web, Slack, GitHub)
- Privacy-first architecture

**Opportunities**:
- ~~Team/enterprise features~~ **Now implemented (Phase 2.1)**
- ~~Analytics for users~~ **Now implemented (Phase 2.2)**
- Mobile experience
- Community building
- Multi-language support

**Risks**:
- AI costs at scale
- Competition from established players
- Engineering-specific niche may limit TAM

---

## Development Phases Completed

### Phase 2.1 - Strategic Improvements ✅
*Focus: Transform from "Passive Journal" to "Active Career Utility"*

- Quick Reframe as Lead Magnet (public access, rate-limited)
- Team Pricing Tier (₹2,500/mo for 5 seats)
- Team Pulse Dashboard (manager analytics)
- Privacy UX (visibility toggle + confirmation)
- Weekly Email Digest (Qstash scheduled)
- Chrome Store Documentation

### Phase 2.2 - Production Polish ✅
*Focus: Production readiness and user experience polish*

- Email Service Integration (Resend)
- Decision Templates (ADR, Tech Debt, Trade-off, Postmortem)
- Enhanced Search & Filters (date range, confidence)
- Dashboard Analytics Widget (monthly stats, streak, tags)
- Loading Skeletons & Sitemap

---

*This summary was last updated December 28, 2024 after Phase 2.2 completion.*
