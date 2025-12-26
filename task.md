# Career Black Box - MVP Development

## Week 1: Foundation (Days 1-7)

### Setup & Infrastructure
- [ ] Create Next.js 14 project with TypeScript and Tailwind
- [ ] Set up Supabase project and configuration
- [ ] Create database schema and RLS policies
- [ ] Deploy to Vercel
- [ ] Test deployment and connectivity

### Authentication
- [ ] Implement email/password signup
- [ ] Implement login functionality
- [ ] Set up protected routes
- [ ] Create auth context/provider
- [ ] Test auth flow end-to-end

### Dashboard Shell
- [ ] Create dashboard layout with navigation
- [ ] Build empty state UI
- [ ] Create decision list page structure
- [ ] Create decision detail page structure
- [ ] Test navigation between pages

## Week 2: AI Magic & Core Features

### AI-Powered Decision Entry
- [ ] Create "Vibe Input" form component (textarea)
- [ ] Set up Google Gemini API integration
- [ ] Implement AI structuring endpoint
- [ ] Create AI output review/edit interface
- [ ] Test AI extraction with various inputs
- [ ] Create manual structured form (backup)
- [ ] Add validation and error handling

### API Routes
- [ ] POST /api/decisions (create)
- [ ] GET /api/decisions (list with search)
- [ ] GET /api/decisions/:id (get one)
- [ ] PUT /api/decisions/:id (update)
- [ ] DELETE /api/decisions/:id
- [ ] POST /api/decisions/:id/lock
- [ ] POST /api/ai/structure
- [ ] Test all endpoints

### Decision Management
- [ ] Build decision list with cards
- [ ] Implement search functionality
- [ ] Add date range and tag filters
- [ ] Create decision detail view
- [ ] Add edit mode (if unlocked)
- [ ] Implement manual lock/unlock
- [ ] Add delete with confirmation
- [ ] Implement print-to-PDF CSS
- [ ] Add loading and error states

## Week 3: Monetization & Settings

### AI Promotion Package Generator
- [ ] Create promotion package endpoint
- [ ] Design specialized AI prompt
- [ ] Implement decision aggregation logic
- [ ] Build result display component
- [ ] Add copy to clipboard
- [ ] Add download as .txt
- [ ] Track usage in database

### Stripe Integration
- [ ] Create Stripe account
- [ ] Set up $5 payment link
- [ ] Implement webhook endpoint
- [ ] Create payment confirmation flow
- [ ] Send email after generation
- [ ] Test full payment → AI generation flow

### Settings & Export
- [ ] Create settings page
- [ ] Add profile management
- [ ] Implement password change
- [ ] Add account deletion with export prompt
- [ ] Implement JSON export
- [ ] Test export/import

## Week 4: Launch Prep

### Polish & Testing
- [ ] Fix critical bugs
- [ ] Test all flows end-to-end
- [ ] Test payment flow multiple times
- [ ] Test AI with diverse inputs
- [ ] Add helpful tooltips
- [ ] Improve empty states
- [ ] Mobile responsive testing
- [ ] Optimize print CSS

### Security & Performance
- [ ] Verify RLS policies
- [ ] Add rate limiting on AI endpoints
- [ ] Input sanitization
- [ ] SQL injection checks
- [ ] Lighthouse audit (80+ score)
- [ ] Image optimization
- [ ] Add loading states everywhere

### Launch Materials
- [ ] Create simple landing page
- [ ] Write launch announcement
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Set up Vercel analytics
- [ ] Prepare marketing posts
