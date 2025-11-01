# Narfe Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Next.js    │  │    React     │  │   Tailwind   │              │
│  │   App.tsx    │  │  Components  │  │     CSS      │              │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘              │
│         │                 │                                          │
│         └─────────┬───────┘                                          │
└───────────────────┼──────────────────────────────────────────────────┘
                    │
                    │ HTTPS / TLS 1.3
                    │
┌───────────────────▼──────────────────────────────────────────────────┐
│                     SUPABASE PLATFORM                                 │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    API GATEWAY LAYER                           │ │
│  │  ┌──────────────┐           ┌──────────────┐                  │ │
│  │  │   PostgREST  │           │     Auth     │                  │ │
│  │  │   Auto API   │           │   (GoTrue)   │                  │ │
│  │  └──────┬───────┘           └──────┬───────┘                  │ │
│  └─────────┼──────────────────────────┼──────────────────────────┘ │
│            │                          │                             │
│  ┌─────────▼──────────────────────────▼──────────────────────────┐ │
│  │              EDGE FUNCTIONS (Deno Runtime)                     │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │createPurchase│  │stripeWebhook │  │createItinerary        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │ │
│  │  │generateEmbed │  │   getFeed    │  │uploadSignedUrl        │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │ │
│  └────────────────────────────┬───────────────────────────────────┘ │
│                               │                                     │
│  ┌────────────────────────────▼───────────────────────────────────┐ │
│  │                   POSTGRESQL 15 DATABASE                       │ │
│  │                                                                 │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │
│  │  │ profiles │  │ creators │  │itineraries  │ purchases │      │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │
│  │  │  likes   │  │  saves   │  │ comments │  │ follows  │      │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │
│  │  │activities│  │  media   │  │itinerary_│  │itinerary_│      │ │
│  │  │          │  │          │  │  stops   │  │embeddings│      │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │ │
│  │                                                                 │ │
│  │  Extensions:  pgvector (ANN search) + pg_trgm (full-text)     │ │
│  │  Features:    RLS, Triggers, Functions, Indexes               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                   SUPABASE STORAGE                              │ │
│  │  ┌──────────────────────────────────────────────────┐          │ │
│  │  │  Bucket: media (Private)                         │          │ │
│  │  │  - User uploads (videos, images)                 │          │ │
│  │  │  - Signed URLs for secure access                 │          │ │
│  │  │  - 100MB file size limit                         │          │ │
│  │  └──────────────────────────────────────────────────┘          │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
                    │                          │
                    │                          │
┌───────────────────▼──────────┐  ┌───────────▼──────────────────────┐
│    EXTERNAL SERVICES          │  │     OPTIONAL SERVICES             │
│                               │  │                                   │
│  ┌──────────────────────┐    │  │  ┌──────────────────────┐        │
│  │   Stripe Connect     │    │  │  │   Cloudflare CDN     │        │
│  │  - Payment processing│    │  │  │  - Media delivery    │        │
│  │  - Platform fees     │    │  │  │  - Global caching    │        │
│  │  - Creator payouts   │    │  │  └──────────────────────┘        │
│  └──────────────────────┘    │  │                                   │
│                               │  │  ┌──────────────────────┐        │
│  ┌──────────────────────┐    │  │  │   Upstash Redis      │        │
│  │   OpenAI API         │    │  │  │  - Caching layer     │        │
│  │  - Embeddings        │    │  │  │  - Rate limiting     │        │
│  │  - text-ada-002      │    │  │  └──────────────────────┘        │
│  └──────────────────────┘    │  │                                   │
│                               │  │  ┌──────────────────────┐        │
│                               │  │  │   Sentry             │        │
│                               │  │  │  - Error tracking    │        │
│                               │  │  │  - Performance       │        │
│                               │  │  └──────────────────────┘        │
└───────────────────────────────┘  └───────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Sign up/Sign in
     ▼
┌─────────────────┐
│ Frontend (React)│
└────┬────────────┘
     │ 2. Call Supabase Auth
     ▼
┌─────────────────┐
│ Supabase Auth   │
│   (GoTrue)      │
└────┬────────────┘
     │ 3. Create user in auth.users
     ▼
┌─────────────────┐
│  Database       │
│  auth.users     │
└────┬────────────┘
     │ 4. Return JWT token
     ▼
┌─────────────────┐
│  Frontend       │
│  (Store token)  │
└────┬────────────┘
     │ 5. Create profile
     ▼
┌─────────────────┐
│  profiles table │
└─────────────────┘
```

### 2. Feed Retrieval Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. View home page
     ▼
┌─────────────────┐
│ Frontend        │
└────┬────────────┘
     │ 2. GET /functions/v1/getFeed?type=trending
     ▼
┌─────────────────┐
│ getFeed Function│
└────┬────────────┘
     │ 3. Query database
     ▼
┌─────────────────────────────────────┐
│  Database Query:                    │
│  - Join itineraries + profiles      │
│  - Filter by published status       │
│  - Order by likes/published_at      │
│  - Add user-specific data (likes,   │
│    saves, purchases)                │
└────┬────────────────────────────────┘
     │ 4. Return enriched data
     ▼
┌─────────────────┐
│  Frontend       │
│  Display feed   │
└─────────────────┘
```

### 3. Purchase Flow (Stripe Connect)

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Click "Purchase"
     ▼
┌─────────────────┐
│ Frontend        │
│ Stripe Elements │
└────┬────────────┘
     │ 2. Collect payment method
     ▼
┌─────────────────┐
│ Stripe.js       │
│ createPaymentMethod()
└────┬────────────┘
     │ 3. POST /functions/v1/createPurchase
     │    {paymentMethodId, itineraryId}
     ▼
┌─────────────────────────────────────┐
│ createPurchase Function             │
│  1. Verify user authenticated       │
│  2. Get itinerary details           │
│  3. Check not already purchased     │
│  4. Calculate platform fee (10%)    │
└────┬────────────────────────────────┘
     │ 5. Create Stripe Payment Intent
     ▼
┌─────────────────┐
│  Stripe API     │
│  PaymentIntent  │
└────┬────────────┘
     │ 6. Charge customer
     │ 7. Transfer to creator (90%)
     │ 8. Platform keeps fee (10%)
     ▼
┌─────────────────┐
│  Database       │
│  purchases table│
│  (status: completed)
└────┬────────────┘
     │ 9. Webhook confirms
     ▼
┌─────────────────┐
│ stripeWebhook   │
│ Function        │
│ (Update status) │
└────┬────────────┘
     │ 10. Success response
     ▼
┌─────────────────┐
│  Frontend       │
│  Show success   │
└─────────────────┘
```

### 4. Create Itinerary Flow

```
┌─────────┐
│ Creator │
└────┬────┘
     │ 1. Fill itinerary form
     ▼
┌─────────────────┐
│ Frontend        │
└────┬────────────┘
     │ 2. Upload cover image/video
     ▼
┌─────────────────┐
│ uploadSignedUrl │
│ Function        │
└────┬────────────┘
     │ 3. Get signed upload URL
     ▼
┌─────────────────┐
│ Supabase Storage│
│ PUT file        │
└────┬────────────┘
     │ 4. File uploaded
     │ 5. POST /functions/v1/createItinerary
     ▼
┌─────────────────────────────────────┐
│ createItinerary Function            │
│  1. Verify creator authenticated    │
│  2. Validate input data             │
│  3. Insert into itineraries table   │
│  4. Batch insert stops              │
└────┬────────────────────────────────┘
     │ 6. Trigger embedding generation
     ▼
┌─────────────────┐
│ generateEmbedding
│ Function        │
└────┬────────────┘
     │ 7. Extract text
     │ 8. Call OpenAI API
     ▼
┌─────────────────┐
│  OpenAI API     │
│  Embeddings     │
└────┬────────────┘
     │ 9. Return vector (1536 dims)
     ▼
┌─────────────────┐
│  Database       │
│itinerary_embeddings
│  (Store vector) │
└────┬────────────┘
     │ 10. Return success
     ▼
┌─────────────────┐
│  Frontend       │
│  Redirect to    │
│  itinerary page │
└─────────────────┘
```

### 5. Search Flow (Hybrid: Full-Text + Vector)

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Enter search query
     ▼
┌─────────────────┐
│ Frontend        │
└────┬────────────┘
     │ 2. Call search API
     ▼
┌─────────────────────────────────────┐
│  Parallel Search:                   │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │ Full-Text    │  │   Vector    │ │
│  │ Search       │  │   Search    │ │
│  │ (pg_trgm)    │  │ (pgvector)  │ │
│  └──────┬───────┘  └──────┬──────┘ │
└─────────┼──────────────────┼────────┘
          │                  │
          │ 3. tsvector      │ 4. <=> cosine
          │    ranking       │    similarity
          ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│  itineraries    │  │itinerary_       │
│  search_vector  │  │  embeddings     │
└────┬────────────┘  └────┬────────────┘
     │                    │
     └─────────┬──────────┘
               │ 5. Merge & rank results
               ▼
        ┌──────────────┐
        │  Frontend    │
        │  Display     │
        │  results     │
        └──────────────┘
```

---

## Database Schema Relationships

```
                    ┌──────────────┐
                    │   profiles   │
                    │  (users)     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
     creator_id      follower_id   following_id
             │             │             │
             ▼             ▼             ▼
    ┌──────────────┐  ┌──────────┐  ┌──────────┐
    │ itineraries  │  │ follows  │  │ creators │
    └──────┬───────┘  └──────────┘  └──────────┘
           │
           │ itinerary_id
           │
    ┌──────┼───────────┬─────────────┬──────────┬──────────┐
    │      │           │             │          │          │
    ▼      ▼           ▼             ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ likes  │ │ saves  │ │comments│ │purchases││itinerary│ │itinerary_
│        │ │        │ │        │ │        │ │ stops  │ │embeddings
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Network Security                              │
│  - HTTPS/TLS 1.3 encryption                             │
│  - CORS policies                                         │
│  - Rate limiting (1000 req/min per user)                │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 2: Authentication                                │
│  - JWT tokens with auto-refresh                         │
│  - OAuth support (Google, GitHub)                       │
│  - Session management                                    │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: Authorization (RLS)                           │
│  - Row Level Security on all tables                     │
│  - User can only access their own data                  │
│  - Creator can only edit their own itineraries          │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 4: Data Validation                               │
│  - Input validation in Edge Functions                   │
│  - Type checking (TypeScript)                           │
│  - Constraint checks in database                        │
└─────────────────────────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 5: Encryption                                    │
│  - Data encrypted at rest (AES-256)                     │
│  - Sensitive fields (emails, payments) protected        │
│  - Secrets management (not in code)                     │
└─────────────────────────────────────────────────────────┘
```

---

## Scaling Architecture

### Current (Free/Pro Tier)

```
         ┌─────────┐
         │ Users   │ (0-500K MAU)
         └────┬────┘
              │
              ▼
    ┌─────────────────┐
    │  Supabase Edge  │
    │   (Auto-scale)  │
    └────┬────────────┘
         │
         ▼
    ┌─────────────────┐
    │  PostgreSQL     │
    │  Single instance│
    └─────────────────┘
```

### Future (Enterprise)

```
         ┌─────────┐
         │ Users   │ (5M+ MAU)
         └────┬────┘
              │
              ▼
    ┌─────────────────┐
    │  Cloudflare CDN │
    │  (Media caching)│
    └────┬────────────┘
         │
         ▼
    ┌─────────────────┐
    │  Load Balancer  │
    └────┬────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Redis   │ │ Edge   │
│Cache   │ │Functions│
└────────┘ └───┬────┘
               │
          ┌────┴────┐
          │         │
          ▼         ▼
    ┌────────┐ ┌────────┐
    │Primary │ │Replica │
    │Database│ │Database│
    └────────┘ └────────┘
```

---

## Monitoring Stack

```
┌─────────────────────────────────────────────────────────┐
│                    OBSERVABILITY                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Metrics    │  │     Logs     │  │   Traces     │ │
│  │              │  │              │  │              │ │
│  │ - CPU usage  │  │ - Error logs │  │ - Request    │ │
│  │ - Memory     │  │ - Slow query │  │   duration   │ │
│  │ - Latency    │  │ - Auth logs  │  │ - Function   │ │
│  │              │  │              │  │   execution  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │  Supabase Dashboard      │
              │  + Optional: Sentry      │
              └──────────────────────────┘
```

---

This architecture provides:
- ✅ **Scalability**: Handles 0 → millions of users
- ✅ **Security**: Multiple layers of protection
- ✅ **Performance**: Optimized queries and caching
- ✅ **Reliability**: Automatic backups and failover
- ✅ **Observability**: Comprehensive monitoring

See `/docs/runbook-scaling.md` for scaling strategies.
