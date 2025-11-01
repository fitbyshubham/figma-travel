# Narfe Backend Quick Reference

## 🚀 Common Commands

### Supabase CLI

```bash
# Setup
supabase login
supabase link --project-ref <project-id>

# Database
supabase db push                    # Run migrations
supabase db pull                    # Pull remote schema
supabase db reset                   # Reset local DB
supabase db diff                    # Show schema differences
supabase migration new <name>       # Create new migration
supabase db dump -f backup.sql      # Backup database

# Functions
supabase functions deploy <name>    # Deploy function
supabase functions list             # List functions
supabase functions delete <name>    # Delete function

# Secrets
supabase secrets set KEY=value      # Set secret
supabase secrets list               # List secrets
supabase secrets unset KEY          # Remove secret

# Local Development
supabase start                      # Start local Supabase
supabase stop                       # Stop local Supabase
supabase status                     # Show status
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/my-feature
# ... make changes ...
supabase migration new my_feature
supabase db reset                   # Test migration
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Open PR on GitHub
```

## 📊 Useful SQL Queries

### Performance Monitoring

```sql
-- Slow queries
SELECT 
  query,
  calls,
  mean_time,
  max_time,
  total_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC
LIMIT 20;

-- Table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size('public.'||tablename)) AS table_size,
  pg_size_pretty(pg_indexes_size('public.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Unused indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE '%pkey';

-- Active connections
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query,
  query_start
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- Vacuum and analyze stats
SELECT 
  schemaname,
  tablename,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
ORDER BY last_vacuum DESC NULLS LAST;
```

### Data Analysis

```sql
-- User growth
SELECT 
  DATE_TRUNC('day', created_at) AS day,
  COUNT(*) AS new_users
FROM profiles
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;

-- Top creators by revenue
SELECT 
  p.username,
  p.full_name,
  COUNT(i.id) AS itineraries_count,
  SUM(pu.creator_payout) AS total_earnings
FROM profiles p
JOIN itineraries i ON i.creator_id = p.id
JOIN purchases pu ON pu.itinerary_id = i.id
WHERE pu.status = 'completed'
GROUP BY p.id
ORDER BY total_earnings DESC
LIMIT 20;

-- Popular itineraries
SELECT 
  i.title,
  i.location,
  i.price,
  i.likes_count,
  i.saves_count,
  i.purchases_count,
  p.username AS creator
FROM itineraries i
JOIN profiles p ON p.id = i.creator_id
WHERE i.status = 'published'
ORDER BY i.likes_count + i.saves_count DESC
LIMIT 20;

-- Daily active users
SELECT 
  DATE_TRUNC('day', created_at) AS day,
  COUNT(DISTINCT user_id) AS dau
FROM activities
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;

-- Conversion funnel
SELECT 
  'Views' AS stage,
  SUM(views_count) AS count
FROM itineraries
UNION ALL
SELECT 
  'Likes' AS stage,
  COUNT(*) AS count
FROM likes
UNION ALL
SELECT 
  'Saves' AS stage,
  COUNT(*) AS count
FROM saves
UNION ALL
SELECT 
  'Purchases' AS stage,
  COUNT(*) AS count
FROM purchases
WHERE status = 'completed';
```

### Maintenance

```sql
-- Reclaim space
VACUUM ANALYZE;

-- Update statistics
ANALYZE;

-- Rebuild index
REINDEX INDEX CONCURRENTLY itineraries_search_idx;

-- Check bloat
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_dead_tup,
  n_live_tup,
  ROUND(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

## 🔧 Edge Function Examples

### Call from Frontend

```typescript
// GET request
const response = await fetch(
  `https://[project-id].supabase.co/functions/v1/getFeed?page=1&limit=20`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  }
);
const data = await response.json();

// POST request
const response = await fetch(
  `https://[project-id].supabase.co/functions/v1/createItinerary`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: 'My Itinerary',
      location: 'Bali',
      price: 29.99,
    }),
  }
);
const result = await response.json();
```

### Test Locally

```bash
# Start local Supabase
supabase start

# Deploy function locally
supabase functions serve getFeed

# Call function
curl http://localhost:54321/functions/v1/getFeed?page=1&limit=10
```

### Debug Function

```typescript
// Add logging
console.log('Request received:', {
  method: req.method,
  url: req.url,
  headers: Object.fromEntries(req.headers),
});

// Check logs
supabase functions logs getFeed --tail
```

## 🎯 PostgREST API Examples

### Basic Queries

```bash
# List all published itineraries
curl "https://[project].supabase.co/rest/v1/itineraries?status=eq.published&select=*" \
  -H "apikey: [anon-key]"

# Get single itinerary with stops
curl "https://[project].supabase.co/rest/v1/itineraries?id=eq.[uuid]&select=*,itinerary_stops(*)" \
  -H "apikey: [anon-key]"

# Search by location
curl "https://[project].supabase.co/rest/v1/itineraries?location=ilike.*Bali*&select=*" \
  -H "apikey: [anon-key]"

# Order and limit
curl "https://[project].supabase.co/rest/v1/itineraries?select=*&order=likes_count.desc&limit=10" \
  -H "apikey: [anon-key]"

# Count
curl "https://[project].supabase.co/rest/v1/itineraries?select=*&status=eq.published" \
  -H "apikey: [anon-key]" \
  -H "Prefer: count=exact"
```

### Mutations

```bash
# Insert
curl -X POST "https://[project].supabase.co/rest/v1/likes" \
  -H "apikey: [anon-key]" \
  -H "Authorization: Bearer [access-token]" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"[uuid]","itinerary_id":"[uuid]"}'

# Update
curl -X PATCH "https://[project].supabase.co/rest/v1/profiles?id=eq.[uuid]" \
  -H "apikey: [anon-key]" \
  -H "Authorization: Bearer [access-token]" \
  -H "Content-Type: application/json" \
  -d '{"bio":"Updated bio"}'

# Delete
curl -X DELETE "https://[project].supabase.co/rest/v1/likes?id=eq.[uuid]" \
  -H "apikey: [anon-key]" \
  -H "Authorization: Bearer [access-token]"
```

## 🔐 Authentication Examples

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  options: {
    data: {
      full_name: 'John Doe',
      username: 'johndoe',
    },
  },
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePassword123!',
});

// Get session
const { data: { session } } = await supabase.auth.getSession();

// Refresh session
const { data, error } = await supabase.auth.refreshSession();

// Sign out
const { error } = await supabase.auth.signOut();

// OAuth (Google)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://narfe.world/auth/callback',
  },
});
```

## 💾 Storage Examples

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('media')
  .upload('user-id/image.jpg', file, {
    contentType: 'image/jpeg',
    upsert: true,
  });

// Get public URL
const { data } = supabase.storage
  .from('media')
  .getPublicUrl('user-id/image.jpg');

// Get signed URL (private)
const { data, error } = await supabase.storage
  .from('media')
  .createSignedUrl('user-id/image.jpg', 3600); // 1 hour

// Download file
const { data, error } = await supabase.storage
  .from('media')
  .download('user-id/image.jpg');

// Delete file
const { data, error } = await supabase.storage
  .from('media')
  .remove(['user-id/image.jpg']);

// List files
const { data, error } = await supabase.storage
  .from('media')
  .list('user-id', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' },
  });
```

## 🔍 Search Examples

```typescript
// Full-text search
const { data, error } = await supabase.rpc('search_itineraries', {
  p_query: 'beach paradise',
  p_limit: 20,
  p_offset: 0,
});

// Vector semantic search (requires embedding)
const { data, error } = await supabase
  .from('itinerary_embeddings')
  .select('itinerary_id, itineraries(*)')
  .order('embedding <=> [0.1, 0.2, ...]', { ascending: true })
  .limit(10);

// Filter search
const { data, error } = await supabase
  .from('itineraries')
  .select('*')
  .ilike('location', '%bali%')
  .gte('price', 0)
  .lte('price', 100)
  .order('likes_count', { ascending: false });
```

## ⚡ Realtime Examples

```typescript
// Subscribe to changes
const subscription = supabase
  .channel('itinerary-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'itineraries',
      filter: 'creator_id=eq.[user-id]',
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Unsubscribe
subscription.unsubscribe();

// Broadcast messages
const channel = supabase.channel('room-1');
channel.send({
  type: 'broadcast',
  event: 'message',
  payload: { text: 'Hello' },
});
```

## 📈 Optimization Tips

### Database
```sql
-- Add index for common queries
CREATE INDEX CONCURRENTLY idx_itineraries_creator_status 
  ON itineraries(creator_id, status);

-- Partial index for active records
CREATE INDEX CONCURRENTLY idx_published_itineraries 
  ON itineraries(published_at) 
  WHERE status = 'published';

-- Expression index
CREATE INDEX CONCURRENTLY idx_profiles_username_lower 
  ON profiles(LOWER(username));
```

### Edge Functions
```typescript
// Batch operations
const results = await Promise.all([
  supabase.from('itineraries').select('*').limit(10),
  supabase.from('profiles').select('*').limit(10),
]);

// Use connection pooler
const connectionString = Deno.env.get('DATABASE_URL_POOLER');

// Cache results (if using Redis)
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
// ... fetch from DB
await redis.setex(key, 300, JSON.stringify(data));
```

## 🆘 Emergency Commands

```sql
-- Kill long-running queries
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
AND query_start < NOW() - INTERVAL '5 minutes';

-- Disable RLS temporarily (testing only!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Force vacuum
VACUUM FULL ANALYZE;

-- Check replication lag (if using replicas)
SELECT 
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  flush_lsn,
  replay_lsn,
  sync_priority
FROM pg_stat_replication;
```

## 📞 Support

- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase
- Email: support@narfe.world
