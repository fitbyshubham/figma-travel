# Narfe Backend Scaling Runbook

## Overview
This runbook provides step-by-step guidance for scaling the Narfe backend infrastructure to handle increased load.

---

## Current Architecture

### Components
- **Database**: PostgreSQL 15 with pgvector and pg_trgm extensions
- **API**: PostgREST for automatic REST API
- **Edge Functions**: Deno-based serverless functions
- **Storage**: Supabase Storage with CDN
- **Auth**: Supabase Auth (based on GoTrue)

### Current Limits (Starter Plan)
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 5 GB
- Edge Function Invocations: 500K/month
- Monthly Active Users: Unlimited

---

## Scaling Stages

### Stage 1: Free → Pro ($25/month)
**When to upgrade:**
- Database size > 400 MB
- Consistent > 100 concurrent users
- Monthly active users > 50K

**Benefits:**
- 8 GB database
- 100 GB storage
- 250 GB bandwidth
- 2M Edge Function invocations
- Daily backups
- Compute optimizations

**Actions:**
1. Navigate to Supabase Dashboard → Settings → Billing
2. Select Pro plan
3. Update payment method
4. Verify resource limits increased

### Stage 2: Implement Connection Pooling
**When to implement:**
- Database connections > 50 concurrent
- Seeing "too many connections" errors

**Solution: PgBouncer (Built-in)**

```bash
# Update database connection string
# From direct connection:
postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# To pooled connection:
postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres?pgbouncer=true
```

**Configuration:**
```toml
# supabase/config.toml
[db.pooler]
enabled = true
port = 54329
pool_mode = "transaction"  # or "session" for compatibility
default_pool_size = 20
max_client_conn = 100
```

**Update Edge Functions:**
```typescript
// Use connection pooler for short-lived connections
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  {
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-connection-pool': 'true'
      }
    }
  }
);
```

### Stage 3: Database Optimization
**When to implement:**
- Query times > 500ms
- CPU usage consistently > 70%

**Actions:**

#### 1. Add Missing Indexes
```sql
-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- Add composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_itineraries_creator_status 
  ON itineraries(creator_id, status);

CREATE INDEX CONCURRENTLY idx_itineraries_location_price 
  ON itineraries(location, price) 
  WHERE status = 'published';

CREATE INDEX CONCURRENTLY idx_activities_user_created 
  ON activities(user_id, created_at DESC);
```

#### 2. Optimize Vector Search
```sql
-- Adjust HNSW index parameters for better performance
DROP INDEX itinerary_embeddings_vector_idx;

CREATE INDEX itinerary_embeddings_vector_idx 
  ON itinerary_embeddings 
  USING hnsw (embedding vector_cosine_ops)
  WITH (
    m = 32,              -- Higher for better recall (default: 16)
    ef_construction = 128 -- Higher for better quality (default: 64)
  );

-- Set runtime parameter for queries
SET hnsw.ef_search = 100; -- Balance between speed and accuracy
```

#### 3. Partition Large Tables
```sql
-- Partition activities table by month
CREATE TABLE activities_partitioned (
  LIKE activities INCLUDING ALL
) PARTITION BY RANGE (created_at);

CREATE TABLE activities_2024_01 
  PARTITION OF activities_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Create partitions for each month
-- Migrate data
-- Switch tables
```

### Stage 4: Read Replicas
**When to implement:**
- Read traffic >> Write traffic
- Database CPU > 80%

**Supabase Pro+ Feature:**
```typescript
// Configure read replica
const supabaseRead = createClient(
  Deno.env.get('SUPABASE_READ_REPLICA_URL'),
  Deno.env.get('SUPABASE_ANON_KEY')
);

// Use read replica for queries
const { data } = await supabaseRead
  .from('itineraries')
  .select('*')
  .eq('status', 'published');

// Use primary for writes
const { data: newItem } = await supabase
  .from('itineraries')
  .insert({ ... });
```

**Load Balancing Strategy:**
```typescript
// Round-robin between replicas
const replicas = [
  Deno.env.get('SUPABASE_READ_REPLICA_1'),
  Deno.env.get('SUPABASE_READ_REPLICA_2'),
];

let currentReplica = 0;

function getReadClient() {
  const url = replicas[currentReplica];
  currentReplica = (currentReplica + 1) % replicas.length;
  return createClient(url, Deno.env.get('SUPABASE_ANON_KEY'));
}
```

### Stage 5: CDN for Media Assets
**When to implement:**
- Storage bandwidth > 200 GB/month
- International users experiencing slow load times

**Solution: Cloudflare CDN**

1. **Setup Custom Domain**
```bash
# Add custom domain to Supabase Storage
# Supabase Dashboard → Storage → Settings → Custom Domains
```

2. **Configure Cloudflare**
```
# Cloudflare DNS
CNAME storage.narfe.world -> [project].supabase.co

# Page Rules
storage.narfe.world/*
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 day
```

3. **Update URLs**
```typescript
// Before
const publicUrl = supabase.storage
  .from('media')
  .getPublicUrl(filePath).data.publicUrl;

// After (with CDN)
const cdnUrl = publicUrl.replace(
  '[project].supabase.co',
  'storage.narfe.world'
);
```

### Stage 6: Caching Layer
**When to implement:**
- Same queries executed frequently
- Database read load > 1000 QPS

**Solution: Redis/Upstash**

```typescript
import { Redis } from 'https://deno.land/x/upstash_redis/mod.ts';

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_URL'),
  token: Deno.env.get('UPSTASH_REDIS_TOKEN'),
});

// Cache feed results
async function getCachedFeed(userId: string, page: number) {
  const cacheKey = `feed:${userId}:${page}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const feed = await fetchFeedFromDB(userId, page);
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(feed));
  
  return feed;
}

// Invalidate cache on write
async function invalidateFeedCache(userId: string) {
  const keys = await redis.keys(`feed:${userId}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

### Stage 7: Horizontal Scaling (Enterprise)
**When to implement:**
- Traffic > 10K concurrent users
- Need multi-region deployment

**Contact Supabase Enterprise:**
- Dedicated infrastructure
- Custom resource allocation
- Multi-region support
- SLA guarantees
- Priority support

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Database**
   - CPU usage
   - Memory usage
   - Connection count
   - Query performance (p95, p99)
   - Replication lag (if using replicas)

2. **Edge Functions**
   - Invocation count
   - Error rate
   - Execution duration
   - Cold start frequency

3. **Storage**
   - Bandwidth usage
   - Storage size
   - Upload/download latency

4. **API**
   - Request rate
   - Response times
   - Error rates (by endpoint)
   - Rate limit hits

### Setup Monitoring

**1. Supabase Dashboard**
- Navigate to Project → Database → Logs
- Set up log sinks for external monitoring

**2. Enable Slow Query Logging**
```sql
-- Log queries > 500ms
ALTER SYSTEM SET log_min_duration_statement = 500;
SELECT pg_reload_conf();

-- View slow queries
SELECT * FROM pg_stat_statements 
WHERE mean_time > 500 
ORDER BY mean_time DESC;
```

**3. Sentry Integration (Optional)**
```typescript
import * as Sentry from 'https://deno.land/x/sentry/index.mjs';

Sentry.init({
  dsn: Deno.env.get('SENTRY_DSN'),
  environment: 'production',
  tracesSampleRate: 0.1,
});

// Track errors in Edge Functions
try {
  // ... function code
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

**4. Set Up Alerts**
```yaml
# Example alert configuration (using Grafana/Prometheus)
alerts:
  - name: HighDatabaseCPU
    condition: cpu_usage > 80%
    duration: 5m
    severity: warning
    
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 2m
    severity: critical
    
  - name: SlowQueries
    condition: p95_latency > 2000ms
    duration: 5m
    severity: warning
```

---

## Emergency Procedures

### Database CPU at 100%
1. **Immediate**: Kill long-running queries
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE state = 'active'
   AND query_start < NOW() - INTERVAL '5 minutes';
   ```

2. **Short-term**: Enable connection pooler (see Stage 2)

3. **Long-term**: Upgrade compute size or add read replicas

### Storage Bandwidth Exceeded
1. **Immediate**: Enable CDN (see Stage 5)
2. **Short-term**: Implement lazy loading for images
3. **Long-term**: Use image optimization service (e.g., Cloudinary)

### Edge Function Timeout
1. **Check**: Function logs for errors
2. **Optimize**: Break into smaller functions
3. **Increase**: Timeout limit (max 60s)

### Rate Limit Hit
1. **Immediate**: Request rate limit increase
2. **Short-term**: Implement client-side caching
3. **Long-term**: Upgrade plan or optimize queries

---

## Rollback Procedures

### Database Migration Rollback
```bash
# List migrations
supabase db reset --dry-run

# Rollback specific migration
supabase migration revert <migration-name>

# Restore from backup
supabase db restore <backup-id>
```

### Edge Function Rollback
```bash
# Deploy previous version
git revert HEAD
supabase functions deploy <function-name>

# Or manually upload previous version
```

---

## Cost Optimization

### Tips
1. **Vacuum regularly** to reclaim space
   ```sql
   VACUUM ANALYZE;
   ```

2. **Archive old data** (> 1 year)
   ```sql
   -- Move to cold storage
   CREATE TABLE activities_archive AS
   SELECT * FROM activities 
   WHERE created_at < NOW() - INTERVAL '1 year';
   
   DELETE FROM activities 
   WHERE created_at < NOW() - INTERVAL '1 year';
   ```

3. **Compress media files** before upload
4. **Use signed URLs** instead of public URLs for private content
5. **Implement pagination** to reduce data transfer

---

## Support Contacts

- **Supabase Support**: support@supabase.io
- **Emergency**: Enterprise customers get 24/7 support
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com
