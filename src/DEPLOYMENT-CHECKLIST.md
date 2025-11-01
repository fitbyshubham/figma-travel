# 🚀 Narfe Backend Deployment Checklist

Use this checklist to ensure a smooth backend deployment.

---

## ✅ Phase 1: Pre-Deployment Setup

### 1.1 Accounts & Access
- [ ] Create Supabase account at https://app.supabase.com
- [ ] Create Stripe account at https://dashboard.stripe.com
- [ ] Get OpenAI API key from https://platform.openai.com/api-keys
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Install Deno (for tests): https://deno.land

### 1.2 Project Setup
- [ ] Create new Supabase project
- [ ] Note down:
  - Project ID (Reference ID)
  - Database Password
  - Region
- [ ] Get API credentials from Project Settings → API:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY (keep secret!)

---

## ✅ Phase 2: Database Setup

### 2.1 Link Project
```bash
supabase login
supabase link --project-ref <your-project-id>
```
- [ ] Successfully linked to project

### 2.2 Run Migrations
```bash
supabase db push
```
- [ ] Migration 001: Extensions enabled ✅
- [ ] Migration 002: Core tables created ✅
- [ ] Migration 003: Social tables created ✅
- [ ] Migration 004: Functions & triggers created ✅
- [ ] Migration 005: RLS policies enabled ✅
- [ ] Migration 006: Seed data (optional) ✅

### 2.3 Verify Database
```bash
supabase db diff
```
- [ ] No unexpected differences
- [ ] All 12 tables exist:
  - profiles
  - creators
  - itineraries
  - itinerary_stops
  - itinerary_embeddings
  - purchases
  - media
  - likes
  - saves
  - comments
  - follows
  - activities

### 2.4 Check in Dashboard
Go to Supabase Dashboard → Database → Tables
- [ ] All tables visible
- [ ] RLS enabled on all tables (green shield icon)
- [ ] Indexes created (check indexes tab)

---

## ✅ Phase 3: Stripe Setup

### 3.1 Enable Stripe Connect
- [ ] Go to Stripe Dashboard → Connect → Settings
- [ ] Choose "Platform or Marketplace"
- [ ] Complete onboarding
- [ ] Set platform fee to 10%

### 3.2 Get API Keys
Stripe Dashboard → Developers → API Keys
- [ ] Copy Publishable key (pk_test_...)
- [ ] Copy Secret key (sk_test_...)

### 3.3 Create Webhook
Stripe Dashboard → Developers → Webhooks → Add Endpoint

**Webhook URL:**
```
https://<project-id>.supabase.co/functions/v1/stripeWebhook
```

**Events to select:**
- [ ] payment_intent.succeeded
- [ ] payment_intent.payment_failed
- [ ] charge.refunded
- [ ] account.updated
- [ ] transfer.created

- [ ] Copy Webhook Signing Secret (whsec_...)

---

## ✅ Phase 4: Edge Functions Deployment

### 4.1 Set Secrets
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
supabase secrets set OPENAI_API_KEY=sk-xxxxx
```
- [ ] STRIPE_SECRET_KEY set
- [ ] STRIPE_WEBHOOK_SECRET set
- [ ] OPENAI_API_KEY set

Verify:
```bash
supabase secrets list
```

### 4.2 Deploy Functions
```bash
supabase functions deploy createPurchase --no-verify-jwt
supabase functions deploy stripeWebhook --no-verify-jwt
supabase functions deploy createItinerary --no-verify-jwt
supabase functions deploy generateEmbedding --no-verify-jwt
supabase functions deploy getFeed --no-verify-jwt
supabase functions deploy uploadSignedUrl --no-verify-jwt
```

- [ ] createPurchase deployed ✅
- [ ] stripeWebhook deployed ✅
- [ ] createItinerary deployed ✅
- [ ] generateEmbedding deployed ✅
- [ ] getFeed deployed ✅
- [ ] uploadSignedUrl deployed ✅

Verify:
```bash
supabase functions list
```

---

## ✅ Phase 5: Storage Setup

### 5.1 Create Storage Bucket
Go to Supabase Dashboard → Storage

- [ ] Create bucket named "media"
- [ ] Set to Private (use signed URLs)
- [ ] Set file size limit: 100MB
- [ ] Allowed MIME types:
  - image/jpeg
  - image/png
  - image/gif
  - image/webp
  - video/mp4
  - video/quicktime
  - video/webm

### 5.2 Storage Policies
Already created via migrations, but verify in Dashboard → Storage → Policies
- [ ] "Authenticated users can upload media" exists
- [ ] Policies are enabled

---

## ✅ Phase 6: Testing

### 6.1 Quick API Tests

**Test 1: API Health**
```bash
curl https://<project-id>.supabase.co/rest/v1/
```
Expected: HTTP 200

**Test 2: Get Feed**
```bash
curl "https://<project-id>.supabase.co/functions/v1/getFeed?page=1&limit=10"
```
Expected: JSON with `{"itineraries": []}`

**Test 3: Database Query**
```bash
curl "https://<project-id>.supabase.co/rest/v1/profiles?limit=1" \
  -H "apikey: <your-anon-key>"
```
Expected: HTTP 200 with JSON array

- [ ] All quick tests pass

### 6.2 Integration Tests (Optional)

If you have Deno installed:
```bash
export SUPABASE_URL=https://<project-id>.supabase.co
export SUPABASE_ANON_KEY=<your-anon-key>

deno test --allow-net --allow-env tests/integration/api.test.ts
```

- [ ] All integration tests pass

### 6.3 Manual Dashboard Checks

**Database → Logs**
- [ ] No error logs in Postgres Logs
- [ ] No error logs in PostgREST Logs

**Edge Functions → Logs**
- [ ] Functions show in list
- [ ] No deployment errors
- [ ] Can view individual function logs

---

## ✅ Phase 7: Frontend Integration

### 7.1 Update Frontend Environment Variables

Create/update `.env.local` in your frontend:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

- [ ] Environment variables updated

### 7.2 Update Supabase Client

See `/docs/frontend-integration.md` for examples

- [ ] Supabase client configured
- [ ] Authentication working
- [ ] Can fetch itineraries
- [ ] Can create/like/save itineraries

### 7.3 Test User Flows

- [ ] User can sign up
- [ ] User can sign in
- [ ] User can view feed
- [ ] User can search itineraries
- [ ] User can view itinerary details
- [ ] User can like/unlike
- [ ] User can save/unsave
- [ ] Creator can create itinerary
- [ ] User can purchase itinerary (test mode)

---

## ✅ Phase 8: Monitoring & Observability

### 8.1 Enable Logging

Supabase Dashboard → Project Settings → Logs
- [ ] Enable Postgres Logs
- [ ] Enable PostgREST Logs
- [ ] Enable Edge Function Logs
- [ ] Enable Auth Logs

### 8.2 Set Up Alerts (Optional)

Create alerts for:
- [ ] Database CPU > 80%
- [ ] Error rate > 5%
- [ ] Response time p95 > 2s

### 8.3 Monitoring Dashboard

Check daily:
- [ ] Database → Reports (CPU, Memory, Connections)
- [ ] Edge Functions → Metrics (Invocations, Errors)
- [ ] Storage → Usage
- [ ] API → Metrics

---

## ✅ Phase 9: Security Review

### 9.1 Verify RLS Policies

Test in SQL Editor:
```sql
-- Should return only your own profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Should return empty (can't see other users' purchases)
SELECT * FROM purchases WHERE user_id != auth.uid();
```

- [ ] RLS policies preventing unauthorized access
- [ ] Can only edit own data
- [ ] Public data accessible without auth

### 9.2 API Key Security

- [ ] SUPABASE_SERVICE_ROLE_KEY never in frontend code
- [ ] SUPABASE_SERVICE_ROLE_KEY not in public GitHub repo
- [ ] Only SUPABASE_ANON_KEY used in frontend
- [ ] All secrets in GitHub Secrets (for CI/CD)

### 9.3 Stripe Security

- [ ] Webhook signature verification working
- [ ] Only using test keys in development
- [ ] Production keys stored securely

---

## ✅ Phase 10: Production Readiness

### 10.1 Backups

- [ ] Automatic backups enabled (Pro plan)
- [ ] Manual backup taken: `supabase db dump -f backup.sql`
- [ ] Backup stored securely

### 10.2 Performance

Run load test (if k6 installed):
```bash
k6 run tests/load/load-test.ts
```

Check:
- [ ] p95 latency < 2s
- [ ] Error rate < 5%
- [ ] Handles 50+ concurrent users

### 10.3 Documentation

- [ ] Team has access to docs
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Runbook for incidents available

---

## ✅ Phase 11: Go Live

### 11.1 Switch to Production Stripe

- [ ] Get production Stripe keys (sk_live_, pk_live_)
- [ ] Update webhook to production URL
- [ ] Update secrets:
  ```bash
  supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxx
  ```
- [ ] Test with real payment (small amount)
- [ ] Verify webhook delivery in Stripe Dashboard

### 11.2 Update Frontend

- [ ] Update environment variables to production
- [ ] Deploy frontend to production
- [ ] Test end-to-end user flow

### 11.3 Monitor Launch

First 24 hours:
- [ ] Check error logs every hour
- [ ] Monitor database CPU
- [ ] Check Stripe webhook delivery
- [ ] Verify user signups working
- [ ] Verify purchases processing

---

## ✅ Phase 12: Post-Launch

### 12.1 Week 1

- [ ] Daily log review
- [ ] Monitor key metrics (DAU, signups, purchases)
- [ ] Fix any critical bugs
- [ ] Optimize slow queries

### 12.2 Week 2-4

- [ ] Review and optimize database queries
- [ ] Add missing indexes if needed
- [ ] Review user feedback
- [ ] Plan for scaling (if needed)

### 12.3 Ongoing

- [ ] Weekly metrics review
- [ ] Monthly security review
- [ ] Quarterly dependency updates
- [ ] Rotate API keys every 6 months

---

## 🆘 Troubleshooting

### Common Issues

**"Too many connections"**
→ Enable connection pooler (see `/docs/runbook-scaling.md`)

**"JWT expired"**
→ Implement token refresh in frontend

**"RLS policy violation"**
→ Check policy in Dashboard → Database → Policies

**Stripe webhook not working**
→ Verify URL and signature secret

**Function timeout**
→ Optimize query or increase timeout

---

## 📞 Support

If you encounter issues:

1. Check `/docs/quick-reference.md` for common commands
2. Review `/docs/setup-guide.md` for detailed setup
3. Check Supabase Dashboard logs
4. Visit Supabase Discord: https://discord.supabase.com
5. Check GitHub Issues: https://github.com/supabase/supabase/issues

---

## ✨ Success Criteria

Your backend is ready when:

- ✅ All migrations applied successfully
- ✅ All 6 Edge Functions deployed
- ✅ RLS policies enforced
- ✅ Stripe webhook receiving events
- ✅ Frontend can authenticate users
- ✅ Frontend can fetch and display data
- ✅ Test purchase completes successfully
- ✅ No errors in logs
- ✅ Performance meets targets (p95 < 2s)

---

## 🎉 Congratulations!

Once all checkboxes are marked, your Narfe backend is fully deployed and ready for production!

**Next Steps:**
- Monitor usage and performance
- Gather user feedback
- Iterate and improve
- Scale as needed (see `/docs/runbook-scaling.md`)

---

**Need help?** Contact: support@narfe.world
