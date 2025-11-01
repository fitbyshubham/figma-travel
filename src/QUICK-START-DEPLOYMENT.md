# 🚀 Quick Start: Deploy Narfe Backend in 5 Steps

**Estimated Time:** 15-20 minutes

---

## Before You Start

Make sure you have:
- ✅ A Supabase account (free tier works)
- ✅ Node.js installed (v16 or higher)
- ✅ Access to your project: `rdmsgtihqnpsobipnina`

---

## Step 1: Install Supabase CLI (2 minutes)

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

---

## Step 2: Link Your Project (1 minute)

```bash
supabase link --project-ref rdmsgtihqnpsobipnina
```

When prompted, enter your database password (found in Supabase dashboard under Settings > Database).

---

## Step 3: Deploy Database (3 minutes)

```bash
supabase db push
```

This creates all 12 tables and applies security policies.

**What this does:**
- ✅ Creates profiles, itineraries, stops tables
- ✅ Creates social tables (likes, saves, follows, comments)
- ✅ Creates payment tables (purchases)
- ✅ Enables pgvector for semantic search
- ✅ Applies Row Level Security policies
- ✅ Creates database functions and triggers

---

## Step 4: Deploy Edge Functions (5 minutes)

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy all functions
./deploy.sh
```

This deploys 7 edge functions:
- ✅ Main server (health, uploads, hotels)
- ✅ createItinerary
- ✅ createPurchase
- ✅ generateEmbedding
- ✅ getFeed
- ✅ stripeWebhook
- ✅ uploadSignedUrl

---

## Step 5: Set API Keys (5-10 minutes)

You need 4 API keys for full functionality:

### 5a. Stripe (Required for payments)

**Get Stripe Secret Key:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your Secret Key (starts with `sk_test_` or `sk_live_`)
3. Set it:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
```

**Get Stripe Webhook Secret:**
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://rdmsgtihqnpsobipnina.supabase.co/functions/v1/stripeWebhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `account.updated`
   - `transfer.created`
5. Copy the signing secret (starts with `whsec_`)
6. Set it:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 5b. Booking.com API (Required for hotel search)

1. Go to https://rapidapi.com/DataCrawler/api/booking-com15
2. Sign up for free (100 requests/month free tier)
3. Copy your RapidAPI key
4. Set it:
```bash
supabase secrets set BOOKING_COM_API_KEY=your_rapidapi_key_here
```

### 5c. OpenAI (Required for semantic search)

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-`)
4. Set it:
```bash
supabase secrets set OPENAI_API_KEY=sk-your_key_here
```

---

## Step 6: Test Deployment (2 minutes)

### Test Health Endpoint
```bash
curl https://rdmsgtihqnpsobipnina.supabase.co/functions/v1/make-server-183d2340/health
```

Expected response:
```json
{"status":"ok"}
```

### Run Verification Script
```bash
chmod +x verify-backend.sh
./verify-backend.sh
```

Expected: **100% Pass Rate**

---

## 🎉 You're Done!

Your backend is now fully deployed and ready to use!

### What You Can Do Now:

✅ **Create User Accounts**
- Sign up with email/password
- Authenticate users

✅ **Manage Itineraries**
- Create travel itineraries
- Add stops with pricing
- Upload photos/videos
- Search hotels for each stop

✅ **Process Payments**
- Purchase itineraries
- 10% platform fee automatically applied
- Creators receive 90% via Stripe Connect

✅ **Social Features**
- Like and save itineraries
- Follow creators
- Post comments
- Get personalized feeds

✅ **Advanced Features**
- Semantic search with AI
- Hotel recommendations
- Activity tracking
- Real-time updates

---

## 📱 Connect Frontend

In your frontend code, the Supabase client is already configured:

```javascript
import { projectId, publicAnonKey } from './utils/supabase/info';

// Connection info is already set:
// Project ID: rdmsgtihqnpsobipnina
// Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔍 API Endpoints Ready

All these endpoints are now live:

### Main Server
- `GET /make-server-183d2340/health` - Health check
- `POST /make-server-183d2340/upload/image` - Upload images
- `POST /make-server-183d2340/hotels/search` - Search hotels
- `GET /make-server-183d2340/hotels/:id` - Get hotel details

### Edge Functions
- `POST /functions/v1/createItinerary` - Create itinerary
- `GET /functions/v1/getFeed` - Get personalized feed
- `POST /functions/v1/createPurchase` - Process payment
- `POST /functions/v1/uploadSignedUrl` - Get upload URL
- `POST /functions/v1/generateEmbedding` - Generate AI embeddings
- `POST /functions/v1/stripeWebhook` - Stripe webhooks

See `API-REFERENCE.md` for detailed documentation.

---

## 🐛 Troubleshooting

### "Command not found: supabase"
```bash
npm install -g supabase
```

### "Failed to link project"
- Check project ref is correct: `rdmsgtihqnpsobipnina`
- Verify you have access to the project in Supabase dashboard
- Make sure you entered the correct database password

### "Migration failed"
```bash
# Reset and try again
supabase db reset
supabase db push
```

### "Function deployment failed"
- Update Supabase CLI: `npm install -g supabase@latest`
- Check function logs in Supabase dashboard
- Verify no syntax errors in function files

### "API key not configured" errors
- Double-check you set all 4 environment variables
- Verify no typos in secret names
- Wait 1-2 minutes after setting secrets for them to propagate

### "Health check returns 404"
- Wait 2-3 minutes after deployment for functions to be ready
- Verify function deployed successfully: `supabase functions list`

---

## 📊 Monitoring

### View Function Logs
1. Go to Supabase Dashboard
2. Click "Edge Functions" in sidebar
3. Select a function
4. View logs in real-time

### View Database Metrics
1. Go to Supabase Dashboard
2. Click "Database" in sidebar
3. View performance metrics

### View API Usage
1. Go to Supabase Dashboard
2. Click "Settings" > "API"
3. View request counts and rate limits

---

## 🔐 Security Checklist

After deployment, verify:

- [ ] All environment variables are set
- [ ] Database RLS policies are enabled
- [ ] Service role key is NOT in frontend code
- [ ] Stripe webhook endpoint is secured
- [ ] CORS is configured for your domain
- [ ] File upload size limits are set
- [ ] Rate limiting is enabled (default)

---

## 📈 Next Steps

### 1. Test Everything
- Create a test user account
- Create a test itinerary
- Upload a test image
- Search for hotels
- Make a test purchase (use Stripe test cards)

### 2. Configure Production Settings
- Update CORS for your production domain
- Set up custom domain
- Configure email templates
- Enable social auth (optional)

### 3. Add Monitoring
- Set up error alerts in Supabase
- Configure uptime monitoring
- Set up performance tracking

### 4. Go Live!
- Switch to Stripe live keys (when ready)
- Announce to users
- Monitor initial traffic

---

## 📞 Need Help?

### Documentation
- Full deployment guide: `BACKEND-DEPLOYMENT-READY.md`
- API reference: `API-REFERENCE.md`
- Deployment status: `DEPLOYMENT-STATUS.md`

### Resources
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- OpenAI Docs: https://platform.openai.com/docs

### Support
- Supabase Discord: https://discord.supabase.com
- Stripe Support: https://support.stripe.com

---

## ✨ Deployment Summary

```
✅ 7 Edge Functions Deployed
✅ 12 Database Tables Created
✅ Row Level Security Applied
✅ Stripe Connect Configured
✅ Hotel Search Enabled
✅ AI Semantic Search Ready
✅ File Upload System Active
✅ Social Features Enabled

🎉 Backend is 100% Ready!
```

---

**Total Time:** 15-20 minutes  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

---

*Start with Step 1 and work your way through. Each step takes just a few minutes!* 🚀
