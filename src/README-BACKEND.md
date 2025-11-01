# Narfe Backend - Complete Documentation

**Premium Travel Platform Backend System**  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** October 20, 2025

---

## 🎯 Overview

This is the complete backend system for **Narfe** ("Next Adventure, Reimagined For Everyone"), a premium travel platform that combines TikTok-style video feeds with Airbnb-like discovery and Stripe-inspired checkout flows.

### Core Features
- ✅ **User Authentication** - Email/password + social auth ready
- ✅ **Itinerary Management** - Create, edit, publish travel itineraries
- ✅ **Payment Processing** - Stripe Connect with 10% platform fee
- ✅ **Hotel Integration** - Booking.com API for live availability
- ✅ **AI Search** - OpenAI embeddings + pgvector semantic search
- ✅ **Social Features** - Likes, saves, follows, comments
- ✅ **File Uploads** - Images & videos to Supabase Storage
- ✅ **Real-time** - Live updates via Supabase Realtime

---

## 📂 Documentation Index

### Quick Start
- **[QUICK-START-DEPLOYMENT.md](./QUICK-START-DEPLOYMENT.md)** - Deploy in 5 steps (15-20 min)
- **[DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md)** - Current deployment status & readiness

### Deployment
- **[BACKEND-DEPLOYMENT-READY.md](./BACKEND-DEPLOYMENT-READY.md)** - Complete deployment guide
- **[deploy.sh](./deploy.sh)** - Automated deployment script
- **[verify-backend.sh](./verify-backend.sh)** - Backend verification script

### API Documentation
- **[API-REFERENCE.md](./API-REFERENCE.md)** - Complete API endpoint reference

---

## 🏗️ Architecture

### Three-Tier Architecture
```
Frontend (React + Tailwind)
    ↓
Edge Functions (Hono + Supabase)
    ↓
Database (PostgreSQL + pgvector)
```

### Technology Stack
- **Runtime:** Deno (Edge Functions)
- **Web Framework:** Hono.js
- **Database:** PostgreSQL 15
- **Storage:** Supabase Storage
- **Auth:** Supabase Auth
- **Payments:** Stripe Connect
- **AI:** OpenAI Embeddings
- **External APIs:** Booking.com (via RapidAPI)

---

## 📊 Database Schema

### Tables (12 Total)

#### Core Tables
1. **profiles** - User profiles + Stripe Connect info
   - id, username, full_name, bio, avatar_url
   - stripe_account_id, stripe_account_verified
   - followers_count, following_count

2. **creators** - Extended creator information
   - id, is_founding_creator, bio_extended
   - social_links, verification_status

3. **itineraries** - Travel itineraries
   - id, creator_id, title, description
   - location, country, city, category
   - price, currency, duration
   - cover_image_url, video_url
   - likes_count, saves_count, views_count
   - status (draft/published/archived)

4. **itinerary_stops** - Detailed stop information
   - id, itinerary_id, day_number, stop_order
   - title, description, place_name, address
   - latitude, longitude, image_url
   - start_time, end_time, duration_minutes
   - **Enhanced fields:**
     - price_breakdown (JSONB) - Entry fees, activities
     - transport (JSONB) - Mode, cost, instructions
     - hotel (JSONB) - Booking.com integration

5. **itinerary_embeddings** - Vector embeddings
   - id, itinerary_id, embedding (vector(1536))
   - model_version

6. **media** - File upload tracking
   - id, owner_id, itinerary_id
   - file_path, file_name, file_size, mime_type
   - storage_bucket

#### Social Tables
7. **likes** - User likes
8. **saves** - Saved itineraries
9. **follows** - User follows
10. **comments** - Comments with threading

#### Transaction Tables
11. **purchases** - Payment transactions
    - id, user_id, itinerary_id
    - amount, currency, platform_fee, creator_payout
    - stripe_payment_intent_id, status

12. **activities** - User activity log
    - id, user_id, itinerary_id
    - activity_type (view/like/save/purchase/etc)
    - metadata (JSONB)

### Migrations
7 migration files in `/supabase/migrations/`:
1. Enable extensions (pgvector, uuid-ossp)
2. Create core tables
3. Create social tables
4. Create functions & triggers
5. Create RLS policies
6. Seed sample data
7. Add stop enhancements

---

## 🚀 Edge Functions (7 Total)

### 1. server (Main Hono Server)
**Path:** `/supabase/functions/server/index.tsx`

**Routes:**
- `GET /make-server-183d2340/health` - Health check
- `POST /make-server-183d2340/upload/image` - Direct file upload
- `POST /make-server-183d2340/hotels/search` - Search hotels
- `GET /make-server-183d2340/hotels/:hotelId` - Get hotel details

**Features:**
- CORS enabled for all origins
- Error logging with Hono logger
- Automatic bucket creation
- File validation (type, size)
- Booking.com API integration

**Dependencies:**
- `BOOKING_COM_API_KEY` (optional, for hotel search)

---

### 2. createItinerary
**Path:** `/supabase/functions/createItinerary/index.ts`

**Features:**
- Create itineraries with multiple stops
- Auto-generate embeddings on publish
- Support for pricing, transport, hotels
- JWT authentication required

**Example Request:**
```json
{
  "title": "5 Days in Tokyo",
  "location": "Tokyo, Japan",
  "price": 49.99,
  "status": "published",
  "stops": [...]
}
```

---

### 3. createPurchase
**Path:** `/supabase/functions/createPurchase/index.ts`

**Features:**
- Stripe Connect payment processing
- 10% platform fee automatic split
- Duplicate purchase prevention
- Creator payout via Stripe Connect

**Dependencies:**
- `STRIPE_SECRET_KEY` (required)

**Example Request:**
```json
{
  "itineraryId": "uuid",
  "paymentMethodId": "pm_xxx"
}
```

---

### 4. generateEmbedding
**Path:** `/supabase/functions/generateEmbedding/index.ts`

**Features:**
- Generate text embeddings for semantic search
- OpenAI text-embedding-ada-002 model
- Store in pgvector format
- Auto-called on itinerary publish

**Dependencies:**
- `OPENAI_API_KEY` (required)

---

### 5. getFeed
**Path:** `/supabase/functions/getFeed/index.ts`

**Features:**
- Personalized feed algorithm
- Trending itineraries (last 7 days)
- Following feed (creators you follow)
- User-specific enrichment (likes, saves)
- Automatic view tracking

**Query Parameters:**
- `type`: "personalized" | "trending" | "following"
- `page`: Page number
- `limit`: Items per page

---

### 6. stripeWebhook
**Path:** `/supabase/functions/stripeWebhook/index.ts`

**Features:**
- Stripe signature verification
- Handle payment events
- Update purchase status
- Track transfers to creators

**Handled Events:**
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
- account.updated
- transfer.created

**Dependencies:**
- `STRIPE_SECRET_KEY` (required)
- `STRIPE_WEBHOOK_SECRET` (required)

---

### 7. uploadSignedUrl
**Path:** `/supabase/functions/uploadSignedUrl/index.ts`

**Features:**
- Generate signed upload URLs
- Support images and videos
- 10-minute URL validity
- Automatic media record creation

**Allowed File Types:**
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, QuickTime, WebM

---

## 🔐 Security

### Authentication
- Email/password via Supabase Auth
- Social auth ready (Google, GitHub)
- JWT token validation on protected routes
- Session management

### Authorization
- Row Level Security on all tables
- Public read for published content
- User access to own data only
- Creator access to own itineraries

### Data Protection
- Service role key never exposed to frontend
- Signed URLs for private files
- Stripe webhook signature verification
- Input validation on all endpoints
- File type and size validation

### Network Security
- CORS properly configured
- HTTPS only in production
- Rate limiting (Supabase default)
- SQL injection prevention via parameterized queries

---

## 🔑 Environment Variables

### Required (User Must Set)
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
BOOKING_COM_API_KEY=your-rapidapi-key
OPENAI_API_KEY=sk-...
```

### Automatic (Provided by Supabase)
```bash
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
```

---

## 📡 API Endpoints

### Base URL
```
https://rdmsgtihqnpsobipnina.supabase.co/functions/v1
```

### Main Server Routes
```
GET  /make-server-183d2340/health
POST /make-server-183d2340/upload/image
POST /make-server-183d2340/hotels/search
GET  /make-server-183d2340/hotels/:hotelId
```

### Edge Functions
```
POST /createItinerary
POST /createPurchase
GET  /getFeed
POST /generateEmbedding
POST /uploadSignedUrl
POST /stripeWebhook
```

See [API-REFERENCE.md](./API-REFERENCE.md) for detailed documentation.

---

## 🧪 Testing

### Verification Script
```bash
chmod +x verify-backend.sh
./verify-backend.sh
```

Expected: **100% Pass Rate**

### Manual Testing
```bash
# Health check
curl https://rdmsgtihqnpsobipnina.supabase.co/functions/v1/make-server-183d2340/health

# Expected: {"status":"ok"}
```

### Test Data
Sample data available in migration `006_seed_data.sql`:
- 5 test users (creators and regular users)
- 10 sample itineraries
- Stops, likes, saves, follows

---

## 📈 Performance

### Database Optimizations
- ✅ Indexes on foreign keys
- ✅ Indexes on commonly queried columns
- ✅ Connection pooling (max 100 connections)
- ✅ Prepared statements

### Edge Function Optimizations
- ✅ Auto-scaling
- ✅ Global CDN distribution
- ✅ Cold start optimization
- ✅ Async operations

### Storage Optimizations
- ✅ Public buckets for images
- ✅ Signed URLs for private files
- ✅ CDN-backed delivery
- ✅ File size limits

---

## 🚀 Deployment

### Quick Deploy (5 Steps)

1. **Install CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link Project**
   ```bash
   supabase link --project-ref rdmsgtihqnpsobipnina
   ```

3. **Deploy Database**
   ```bash
   supabase db push
   ```

4. **Deploy Functions**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

5. **Set Secrets**
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   supabase secrets set BOOKING_COM_API_KEY=your-key
   supabase secrets set OPENAI_API_KEY=sk-...
   ```

See [QUICK-START-DEPLOYMENT.md](./QUICK-START-DEPLOYMENT.md) for detailed instructions.

---

## 🔄 CI/CD

### GitHub Actions (Optional)

Workflow files ready in `.github/workflows/`:
- `deploy-functions.yml` - Auto-deploy functions
- `deploy-migrations.yml` - Auto-run migrations

**Required Secrets:**
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_DB_PASSWORD`

---

## 📊 Monitoring

### Supabase Dashboard
- Function logs (real-time)
- Database performance metrics
- API usage statistics
- Storage usage

### Error Logging
All functions log errors with context:
```javascript
console.log(`Error in ${functionName}: ${error.message}`);
```

### Metrics to Monitor
- Function invocation count
- Database connection pool usage
- API rate limit consumption
- Storage quota
- Payment success rate

---

## 🆘 Troubleshooting

### Common Issues

**1. Functions fail to deploy**
- Update CLI: `npm install -g supabase@latest`
- Check syntax errors in function files

**2. Database migrations fail**
- Check if tables exist: `supabase db reset`
- Verify migration order

**3. "API key not configured"**
- Set environment variables
- Wait 1-2 minutes for propagation

**4. CORS errors**
- Update allowed origins in `server/index.tsx`
- Redeploy server function

**5. File uploads fail**
- Check bucket permissions
- Verify file size limits
- Ensure correct MIME types

**6. Stripe webhook failures**
- Verify webhook secret
- Check endpoint URL
- Ensure required events selected

See [BACKEND-DEPLOYMENT-READY.md](./BACKEND-DEPLOYMENT-READY.md) for more troubleshooting.

---

## 📞 Support Resources

### Documentation
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- OpenAI: https://platform.openai.com/docs
- Booking.com API: https://rapidapi.com/DataCrawler/api/booking-com15

### Dashboards
- Supabase: https://supabase.com/dashboard/project/rdmsgtihqnpsobipnina
- Stripe: https://dashboard.stripe.com
- OpenAI: https://platform.openai.com

---

## 📋 Project Structure

```
/
├── supabase/
│   ├── config.toml                    # Supabase configuration
│   ├── functions/
│   │   ├── server/
│   │   │   ├── index.tsx              # Main Hono server
│   │   │   └── kv_store.tsx           # KV utility (protected)
│   │   ├── createItinerary/index.ts
│   │   ├── createPurchase/index.ts
│   │   ├── generateEmbedding/index.ts
│   │   ├── getFeed/index.ts
│   │   ├── stripeWebhook/index.ts
│   │   └── uploadSignedUrl/index.ts
│   └── migrations/
│       ├── 001_enable_extensions.sql
│       ├── 002_create_core_tables.sql
│       ├── 003_create_social_tables.sql
│       ├── 004_create_functions_triggers.sql
│       ├── 005_create_rls_policies.sql
│       ├── 006_seed_data.sql
│       └── 007_add_stop_enhancements.sql
├── utils/
│   └── supabase/
│       └── info.tsx                   # Connection info (protected)
├── API-REFERENCE.md                   # API documentation
├── BACKEND-DEPLOYMENT-READY.md        # Deployment guide
├── DEPLOYMENT-STATUS.md               # Status & checklist
├── QUICK-START-DEPLOYMENT.md          # Quick start guide
├── README-BACKEND.md                  # This file
├── deploy.sh                          # Deployment script
└── verify-backend.sh                  # Verification script
```

---

## ✨ Features Summary

### For Users
- ✅ Browse travel itineraries
- ✅ Watch travel videos
- ✅ Search destinations
- ✅ Like, save, share
- ✅ Follow creators
- ✅ Purchase detailed itineraries
- ✅ Get hotel recommendations
- ✅ Personalized feed

### For Creators
- ✅ Create detailed itineraries
- ✅ Upload photos/videos
- ✅ Add pricing breakdowns
- ✅ Include transport info
- ✅ Integrate hotels
- ✅ Earn 90% of sales
- ✅ Stripe Connect payouts
- ✅ Analytics (coming soon)

### Platform Features
- ✅ Secure payments
- ✅ 10% platform fee
- ✅ Real-time tracking
- ✅ AI recommendations
- ✅ Semantic search
- ✅ Social engagement
- ✅ Scalable architecture

---

## 📊 Deployment Metrics

| Metric | Value |
|--------|-------|
| Edge Functions | 7 |
| Database Tables | 12 |
| Migrations | 7 |
| API Endpoints | 11+ |
| Required Secrets | 4 |
| Optional Features | 3 |
| Deployment Time | 15-20 min |
| Pass Rate | 100% |

---

## 🏆 Status

**Deployment Readiness:** ✅ **100% READY**

**Last Verification:** October 20, 2025  
**Verified By:** Automated backend verification script  
**Result:** All checks passed

---

## 🎯 Quick Links

- **Deploy Now:** [QUICK-START-DEPLOYMENT.md](./QUICK-START-DEPLOYMENT.md)
- **API Docs:** [API-REFERENCE.md](./API-REFERENCE.md)
- **Full Guide:** [BACKEND-DEPLOYMENT-READY.md](./BACKEND-DEPLOYMENT-READY.md)
- **Status:** [DEPLOYMENT-STATUS.md](./DEPLOYMENT-STATUS.md)

---

## 📜 License

Copyright © 2025 Narfe Platform. All rights reserved.

---

**Ready to deploy?** Start with [QUICK-START-DEPLOYMENT.md](./QUICK-START-DEPLOYMENT.md) 🚀
