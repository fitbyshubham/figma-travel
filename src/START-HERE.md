# 🎯 START HERE: Narfe Backend Deployment

Welcome! This guide will help you deploy your Narfe backend in **under 30 minutes**.

---

## 📋 What You Need

Before starting, gather these:

1. **Supabase Account** - https://app.supabase.com (free)
2. **Stripe Account** - https://dashboard.stripe.com (free)
3. **OpenAI API Key** - https://platform.openai.com/api-keys ($)

---

## 🚀 Quick Deploy (Automated)

### Option 1: Using the Setup Script (Recommended)

```bash
# Make script executable
chmod +x setup-backend.sh

# Run setup
./setup-backend.sh
```

The script will:
- ✅ Link to your Supabase project
- ✅ Run all database migrations
- ✅ Configure secrets
- ✅ Deploy all Edge Functions

**Time: ~10 minutes**

---

### Option 2: Manual Setup

If you prefer manual setup or the script doesn't work:

#### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

#### Step 2: Login & Link
```bash
supabase login
supabase link --project-ref <your-project-id>
```

#### Step 3: Run Migrations
```bash
supabase db push
```

#### Step 4: Set Secrets
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
supabase secrets set OPENAI_API_KEY=sk-xxxxx
supabase secrets set BOOKING_COM_API_KEY=<your-rapidapi-key>  # Optional: For hotel search
```

**Note:** The `BOOKING_COM_API_KEY` is optional and only needed if you want to enable hotel search via Booking.com. Get your RapidAPI key at https://rapidapi.com/DataCrawler/api/booking-com15/pricing (free tier available).

#### Step 5: Deploy Functions
```bash
supabase functions deploy createPurchase --no-verify-jwt
supabase functions deploy stripeWebhook --no-verify-jwt
supabase functions deploy createItinerary --no-verify-jwt
supabase functions deploy generateEmbedding --no-verify-jwt
supabase functions deploy getFeed --no-verify-jwt
supabase functions deploy uploadSignedUrl --no-verify-jwt
```

**Time: ~15 minutes**

---

## ✅ Verify Installation

```bash
# Make test script executable
chmod +x test-backend.sh

# Run tests
./test-backend.sh
```

Or test manually:
```bash
curl https://<project-id>.supabase.co/functions/v1/getFeed?page=1&limit=10
```

Expected response:
```json
{
  "itineraries": [],
  "page": 1,
  "hasMore": false
}
```

---

## 🔧 Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter URL:
   ```
   https://<your-project-id>.supabase.co/functions/v1/stripeWebhook
   ```
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `account.updated`
   - `transfer.created`
5. Click "Add endpoint"
6. Copy the Signing Secret (whsec_...)
7. Update your secret:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## 🌐 Connect Your Frontend

### Step 1: Get Your Credentials

From Supabase Dashboard → Project Settings → API:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Update Frontend

Add to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

### Step 3: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 4: Use in Your App

See complete examples in:
- `/docs/frontend-integration.md`

Quick example:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Get trending itineraries
const response = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/getFeed?type=trending&limit=20`
);
const { itineraries } = await response.json();
```

---

## 📚 Documentation

Your complete backend documentation:

| File | Description |
|------|-------------|
| `DEPLOYMENT-CHECKLIST.md` | Complete deployment checklist |
| `/docs/setup-guide.md` | Detailed setup instructions |
| `/docs/frontend-integration.md` | Frontend integration examples |
| `/docs/api-endpoints.md` | Complete API reference |
| `/docs/openapi.yaml` | OpenAPI specification |
| `/docs/runbook-scaling.md` | Production scaling guide |
| `/docs/security.md` | Security best practices |
| `/docs/quick-reference.md` | Command cheatsheet |
| `README-BACKEND.md` | Backend architecture overview |

---

## 🎯 What's Included

Your backend includes:

### Database (PostgreSQL 15)
- ✅ 12 tables with relationships
- ✅ Row Level Security (RLS) on all tables
- ✅ Full-text search (pg_trgm)
- ✅ Vector search (pgvector + OpenAI)
- ✅ Automatic triggers & functions

### Edge Functions (6 total)
- ✅ `createPurchase` - Stripe payment processing
- ✅ `stripeWebhook` - Webhook handler
- ✅ `createItinerary` - Create itineraries
- ✅ `generateEmbedding` - AI embeddings
- ✅ `getFeed` - Personalized feed
- ✅ `uploadSignedUrl` - Secure uploads

### Features
- ✅ JWT Authentication
- ✅ Stripe Connect (10% platform fee)
- ✅ AI-powered search
- ✅ Social features (likes, saves, follows)
- ✅ Creator payouts
- ✅ Media storage

---

## 🔥 Quick Start Checklist

Follow this in order:

1. **Create Supabase project** ✓
   - Go to https://app.supabase.com
   - Click "New Project"
   - Save your credentials

2. **Run deployment script** ✓
   ```bash
   chmod +x setup-backend.sh
   ./setup-backend.sh
   ```

3. **Configure Stripe webhook** ✓
   - Add endpoint in Stripe Dashboard
   - Update webhook secret

4. **Test the backend** ✓
   ```bash
   ./test-backend.sh
   ```

5. **Connect frontend** ✓
   - Update `.env.local`
   - Install Supabase client
   - Use examples from docs

6. **Go live** 🚀
   - See `DEPLOYMENT-CHECKLIST.md`

---

## 💡 Pro Tips

1. **Start with Free Tier** - Upgrade to Pro ($25/mo) when you hit limits
2. **Use Test Stripe Keys** - Switch to live keys only when ready
3. **Enable Backups** - Pro plan includes automatic backups
4. **Monitor Logs** - Check Supabase Dashboard → Logs daily
5. **Optimize Later** - Get it working first, optimize as you scale

---

## ❓ Common Questions

**Q: Do I need a paid Supabase plan?**
A: No, start with Free. Upgrade to Pro ($25/mo) when you need more resources.

**Q: How much does OpenAI cost?**
A: Embeddings are ~$0.0001 per 1K tokens. Expect ~$10-50/month for moderate usage.

**Q: Can I test payments without real money?**
A: Yes! Use Stripe test mode and test cards: https://stripe.com/docs/testing

**Q: How do I scale to more users?**
A: See `/docs/runbook-scaling.md` for the complete scaling playbook.

**Q: Is my data secure?**
A: Yes! RLS policies ensure users can only access their own data. See `/docs/security.md`.

---

## 🆘 Need Help?

**Documentation:**
- Setup issues → `/docs/setup-guide.md`
- API questions → `/docs/api-endpoints.md`
- Scaling questions → `/docs/runbook-scaling.md`

**Community:**
- Supabase Discord: https://discord.supabase.com
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: https://github.com/supabase/supabase/issues

**Support:**
- Email: support@narfe.world

---

## 🎉 You're Ready!

Your backend is production-ready and includes:
- Complete database schema
- 6 serverless functions
- Payment processing
- AI-powered search
- Comprehensive documentation

**Time to build something amazing! 🚀**

---

**Next Step:** Run `./setup-backend.sh` to get started!
