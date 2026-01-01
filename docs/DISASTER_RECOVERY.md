# Career Black Box - Disaster Recovery Runbook

## Service Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Vercel    │◄───│   Client    │───►│  Supabase   │
│  (Frontend) │    │   Browser   │    │ (Database)  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                                     │
       ▼                                     ▼
┌─────────────┐                      ┌─────────────┐
│   Upstash   │                      │   Resend    │
│   (Redis)   │                      │   (Email)   │
└─────────────┘                      └─────────────┘
```

---

## Recovery Objectives

| Metric | Target | Maximum |
|--------|--------|---------|
| **RTO** (Recovery Time) | 30 minutes | 4 hours |
| **RPO** (Data Loss) | 0 (real-time) | 24 hours |

---

## Incident Classification

| Severity | Impact | Response Time |
|----------|--------|---------------|
| **P1 - Critical** | Full outage, data loss | Immediate |
| **P2 - High** | Major feature broken | < 1 hour |
| **P3 - Medium** | Degraded performance | < 4 hours |
| **P4 - Low** | Minor issue | Next business day |

---

## Recovery Procedures

### 1. Application Down (Vercel)

**Symptoms**: 5xx errors, site unreachable

**Steps**:
1. Check [Vercel Status](https://www.vercel-status.com/)
2. Check Vercel Dashboard > Deployments
3. If bad deploy: **Instant Rollback**
   - Dashboard > Deployments > Select previous > "..." > Promote to Production
4. If Vercel outage: Wait for resolution (no action possible)

**Estimated Recovery**: 5-15 minutes

---

### 2. Database Down (Supabase)

**Symptoms**: API errors, data not loading

**Steps**:
1. Check [Supabase Status](https://status.supabase.com/)
2. Check Supabase Dashboard > Project > Health
3. If planned maintenance: Wait
4. If data corruption: **Restore from backup**
   - Dashboard > Settings > Database > Backups
   - Select backup point > Restore

**Estimated Recovery**: 1-4 hours (restore dependent on size)

---

### 3. Rate Limiting Down (Upstash)

**Symptoms**: Rate limits not enforced OR all requests blocked

**Steps**:
1. Check [Upstash Status](https://status.upstash.com/)
2. The app has in-memory fallback (automatic)
3. If persistent: Check Upstash Console for errors

**Estimated Recovery**: Automatic (in-memory fallback)

---

### 4. Email Delivery Failed (Resend)

**Symptoms**: No digest emails, no notifications

**Steps**:
1. Check [Resend Status](https://resend.com/status)
2. Check Resend Dashboard > Emails > Logs
3. Verify RESEND_API_KEY is valid
4. Check sending domain DNS records

**Estimated Recovery**: 15-60 minutes

---

### 5. AI Features Down (Gemini)

**Symptoms**: "Structure This" not working

**Steps**:
1. Check [Google AI Status](https://status.cloud.google.com/)
2. Verify GOOGLE_GEMINI_API_KEY quota
3. Check daily rate limits (free tier: 60 RPM)
4. Users can still create decisions manually (graceful degradation)

**Estimated Recovery**: Wait for quota reset or upgrade plan

---

## Emergency Contacts

| Service | Support |
|---------|---------|
| Vercel | support@vercel.com |
| Supabase | support@supabase.io |
| Upstash | support@upstash.com |
| Resend | support@resend.com |

---

## Post-Incident

1. Document incident in `/docs/incidents/YYYY-MM-DD-title.md`
2. Conduct blameless post-mortem
3. Update this runbook if needed
4. Implement preventive measures

---

*Last updated: January 2026*
