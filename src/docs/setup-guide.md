# Narfe Backend Setup Guide

## Prerequisites

- Supabase account (https://supabase.com)
- Stripe account (https://stripe.com)
- OpenAI API key (https://openai.com)
- GitHub account (for CI/CD)
- Node.js 18+ and Deno installed locally

---

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit https://app.supabase.com
   - Click "New Project"

2. **Configure Project**
   - **Name**: Narfe Production
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free, upgrade to Pro when needed

3. **Save Credentials**
   ```bash
   # Save these from Project Settings → API
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Keep secret!
   SUPABASE_PROJECT_ID=xxxxx
   ```

---

## Step 2: Initialize Database

### Option A: Using Supabase Dashboard

1. Go to **SQL Editor** in Supabase Dashboard
2. Run each migration file in order:
   - `001_enable_extensions.sql`
   - `002_create_core_tables.sql`
   - `003_create_social_tables.sql`
   - `004_create_functions_triggers.sql`
   - `005_create_rls_policies.sql`
   - `006_seed_data.sql` (optional)

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref [your-project-id]

# Push migrations
supabase db push

# Verify
supabase db diff
```

### Verify Setup

Run this query in SQL Editor:
```sql
-- Should return all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should show: activities, comments, creators, follows, 
-- itineraries, itinerary_embeddings, itinerary_stops, 
-- likes, media, profiles, purchases, saves
```

---

## Step 3: Configure Stripe

### Create Stripe Account

1. **Sign up** at https://dashboard.stripe.com
2. **Enable** Stripe Connect
3. **Get API Keys** from Developers → API Keys

```bash
STRIPE_SECRET_KEY=sk_test_xxx  # For testing
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Set Up Stripe Connect

1. **Enable Connect**
   - Go to Connect → Settings
   - Choose "Platform or Marketplace"
   - Complete onboarding

2. **Configure Platform Settings**
   - **Platform Fee**: Set to 10%
   - **Payout Schedule**: Automatic
   - **Default Payout Method**: Bank account

3. **Create Webhook Endpoint**
   ```
   URL: https://[project-id].supabase.co/functions/v1/stripeWebhook
   Events to listen:
     - payment_intent.succeeded
     - payment_intent.payment_failed
     - charge.refunded
     - account.updated
     - transfer.created
   ```

4. **Save Webhook Secret**
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Test Stripe Integration

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:54321/functions/v1/stripeWebhook
```

---

## Step 4: Configure OpenAI

1. **Get API Key**
   - Visit https://platform.openai.com/api-keys
   - Create new secret key

2. **Save Key**
   ```bash
   OPENAI_API_KEY=sk-xxx
   ```

3. **Enable Billing**
   - Add payment method
   - Set spending limits

---

## Step 5: Deploy Edge Functions

### Set Function Secrets

```bash
# Using Supabase CLI
supabase secrets set STRIPE_SECRET_KEY=sk_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
supabase secrets set OPENAI_API_KEY=sk-xxx

# Verify
supabase secrets list
```

### Deploy Functions

```bash
# Deploy all functions
supabase functions deploy createPurchase
supabase functions deploy stripeWebhook
supabase functions deploy createItinerary
supabase functions deploy generateEmbedding
supabase functions deploy getFeed
supabase functions deploy uploadSignedUrl

# Verify deployment
supabase functions list
```

### Test Functions

```bash
# Test getFeed
curl https://[project-id].supabase.co/functions/v1/getFeed?page=1&limit=10

# Test with auth
curl https://[project-id].supabase.co/functions/v1/createItinerary \
  -H "Authorization: Bearer [access-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Itinerary",
    "location": "Bali",
    "price": 29.99
  }'
```

---

## Step 6: Configure Storage

### Create Storage Buckets

```sql
-- Run in SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', false);

-- Verify
SELECT * FROM storage.buckets;
```

### Set Storage Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow public read access to media (or keep private with signed URLs)
CREATE POLICY "Public can view media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');
```

### Test Upload

```typescript
// Frontend code
const { data, error } = await supabase.storage
  .from('media')
  .upload('test/image.jpg', file);
```

---

## Step 7: Set Up CI/CD with GitHub Actions

### Add Repository Secrets

Go to GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:
```
SUPABASE_ACCESS_TOKEN  # From Supabase Account → Access Tokens
SUPABASE_PROJECT_ID
SUPABASE_DB_PASSWORD
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
```

### Enable Workflows

The following workflows are already configured in `.github/workflows/`:
- `deploy-migrations.yml` - Deploys database changes
- `deploy-functions.yml` - Deploys Edge Functions

Push to `main` branch to trigger deployments.

### Manual Deployment

```bash
# Trigger manual deployment
gh workflow run deploy-migrations.yml
gh workflow run deploy-functions.yml
```

---

## Step 8: Configure Frontend

### Update Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

### Initialize Supabase Client

```typescript
// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Test Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@narfe.world',
  password: 'SecurePassword123!',
});

// Sign in
const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
  email: 'user@narfe.world',
  password: 'SecurePassword123!',
});
```

---

## Step 9: Set Up Monitoring

### Enable Supabase Logs

1. Go to **Project Settings → Logs**
2. Enable:
   - Postgres Logs
   - PostgREST Logs
   - Edge Function Logs
   - Auth Logs

### Configure Log Sinks (Optional)

```bash
# Export logs to external service
supabase logs config --add-sink \
  --project-ref [project-id] \
  --sink-name production-logs \
  --sink-type webhook \
  --webhook-url https://your-logging-service.com/webhook
```

### Set Up Sentry (Optional)

```typescript
// supabase/functions/_shared/sentry.ts
import * as Sentry from 'https://deno.land/x/sentry/index.mjs';

export function initSentry() {
  Sentry.init({
    dsn: Deno.env.get('SENTRY_DSN'),
    environment: 'production',
    tracesSampleRate: 0.1,
  });
}
```

---

## Step 10: Testing

### Run Integration Tests

```bash
# Set test environment variables
export SUPABASE_URL=https://[project-id].supabase.co
export SUPABASE_ANON_KEY=eyJxxx...

# Run tests
deno test --allow-net --allow-env tests/integration/api.test.ts
```

### Run Load Tests

```bash
# Install k6
brew install k6

# Set environment variables
export SUPABASE_URL=https://[project-id].supabase.co
export SUPABASE_ANON_KEY=eyJxxx...

# Run load test
k6 run tests/load/load-test.ts
```

### Expected Results

- ✅ All integration tests pass
- ✅ p95 latency < 2s
- ✅ Error rate < 5%
- ✅ No database connection errors

---

## Step 11: Go Live

### Pre-Launch Checklist

- [ ] All migrations applied successfully
- [ ] Edge Functions deployed and tested
- [ ] Stripe webhooks configured and verified
- [ ] Storage buckets created with correct policies
- [ ] RLS policies enabled and tested
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificates valid
- [ ] Rate limits configured appropriately

### Launch Steps

1. **Update Frontend**
   ```bash
   # Update to production URLs
   NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
   ```

2. **Enable Production Stripe Keys**
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_live_xxx
   ```

3. **Switch Stripe Webhook to Production**
   - Update webhook URL in Stripe Dashboard
   - Test with real payment (small amount)

4. **Monitor Launch**
   - Watch Supabase Dashboard → Logs
   - Check error rates
   - Monitor database performance

### Post-Launch

1. **Set Up Daily Backups**
   - Supabase Pro: Automatic daily backups
   - Download weekly backup manually
   ```bash
   supabase db dump -f backup-$(date +%Y%m%d).sql
   ```

2. **Review Metrics**
   - Daily active users
   - Error rates
   - API latency
   - Database performance

3. **Optimize**
   - Review slow queries
   - Add missing indexes
   - Adjust RLS policies if needed

---

## Troubleshooting

### Common Issues

**1. "relation does not exist" error**
```bash
# Verify migrations ran
supabase db remote commit

# If not, run migrations
supabase db push
```

**2. "JWT expired" error**
```typescript
// Refresh token
const { data, error } = await supabase.auth.refreshSession();
```

**3. RLS policy blocking query**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

**4. Stripe webhook not receiving events**
```bash
# Test webhook
stripe trigger payment_intent.succeeded

# Check Stripe Dashboard → Webhooks → [your-webhook] → Logs
```

**5. Edge Function timeout**
```typescript
// Increase timeout (max 60s)
// In function code, optimize queries
// Use connection pooler
```

---

## Support

- **Documentation**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com
- **Email**: support@supabase.io

---

## Next Steps

- Review [API Endpoints Documentation](./api-endpoints.md)
- Read [Scaling Runbook](./runbook-scaling.md)
- Check [OpenAPI Specification](./openapi.yaml)
- Set up monitoring dashboards
- Plan for scaling (see runbook)
