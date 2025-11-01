# Narfe Security Documentation

## Overview

This document outlines the security measures implemented in the Narfe backend infrastructure.

---

## Authentication & Authorization

### Supabase Auth

- **JWT-based authentication** with automatic token refresh
- **Row Level Security (RLS)** enforced on all tables
- **Email/password authentication** with secure password hashing (bcrypt)
- **OAuth support** for Google, GitHub, Facebook (configurable)

### Access Control

#### User Roles
```sql
CREATE TYPE user_role AS ENUM ('user', 'creator', 'founding_creator', 'admin');
```

- **user**: Basic read access, can like/save/purchase
- **creator**: Can create itineraries, manage own content
- **founding_creator**: Early adopter benefits, priority features
- **admin**: Full access (use sparingly)

#### RLS Policies

**Key Principles:**
1. **Default deny**: All tables start with no access
2. **Explicit grants**: Only specific operations allowed
3. **User-scoped**: Users can only access their own data (unless public)

**Examples:**
```sql
-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only creators can edit their itineraries
CREATE POLICY "Creators can update their own itineraries"
  ON itineraries FOR UPDATE
  USING (auth.uid() = creator_id);
```

---

## API Security

### Edge Functions

#### Authentication
```typescript
// Verify user is authenticated
const {
  data: { user },
  error: userError,
} = await supabaseClient.auth.getUser();

if (userError || !user) {
  return new Response(
    JSON.stringify({ error: 'Unauthorized' }),
    { status: 401 }
  );
}
```

#### Input Validation
```typescript
// Validate and sanitize inputs
function validateItineraryInput(data: any) {
  if (!data.title || data.title.length > 200) {
    throw new Error('Invalid title');
  }
  
  if (data.price && (data.price < 0 || data.price > 10000)) {
    throw new Error('Invalid price');
  }
  
  // Sanitize HTML to prevent XSS
  data.description = sanitizeHtml(data.description);
  
  return data;
}
```

#### Rate Limiting

**Built-in Limits:**
- Anonymous: 100 requests/minute
- Authenticated: 1000 requests/minute per user

**Custom Rate Limiting:**
```typescript
// Implement per-user rate limiting
const rateLimiter = new Map<string, { count: number; reset: number }>();

function checkRateLimit(userId: string, limit: number = 60) {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);
  
  if (!userLimit || now > userLimit.reset) {
    rateLimiter.set(userId, { count: 1, reset: now + 60000 });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  return true;
}
```

---

## Payment Security

### Stripe Integration

#### PCI Compliance
- **No credit card data** stored in our database
- All payment processing handled by Stripe (PCI DSS Level 1)
- Use **Stripe Elements** for card input on frontend

#### Webhook Verification
```typescript
// Verify Stripe webhook signature
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno';

const signature = req.headers.get('stripe-signature');
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

const event = await stripe.webhooks.constructEventAsync(
  body,
  signature,
  webhookSecret
);
// Now safe to process event
```

#### Idempotency
```typescript
// Prevent duplicate purchases
const { data: existingPurchase } = await supabase
  .from('purchases')
  .select('id')
  .eq('user_id', userId)
  .eq('itinerary_id', itineraryId)
  .eq('status', 'completed')
  .single();

if (existingPurchase) {
  return { error: 'Already purchased' };
}
```

#### Stripe Connect Security
- Platform fee enforced at payment intent creation
- Direct transfers to creator accounts
- Automatic compliance with local regulations
- Secure onboarding flow for creators

---

## Data Protection

### Sensitive Data Handling

#### Secrets Management
```bash
# NEVER commit secrets to git
# Use Supabase secrets management
supabase secrets set STRIPE_SECRET_KEY=sk_xxx
supabase secrets set OPENAI_API_KEY=sk_xxx

# Access in Edge Functions
const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
```

#### Database Encryption
- Data encrypted at rest (AES-256)
- Data encrypted in transit (TLS 1.3)
- Automatic backups encrypted

#### PII Handling
```sql
-- Email addresses are sensitive
CREATE TABLE profiles (
  email TEXT, -- Only visible to profile owner via RLS
  ...
);

-- RLS ensures users can only see their own email
CREATE POLICY "Users can view their own email"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

### Data Retention

**Policies:**
- Active user data: Retained indefinitely
- Inactive users (2+ years): Account deactivation email sent
- Deleted accounts: Hard delete after 30 days
- Backups: Retained for 90 days

**Implementation:**
```sql
-- Soft delete with grace period
ALTER TABLE profiles ADD COLUMN deleted_at TIMESTAMPTZ;

-- Cleanup job (run monthly)
DELETE FROM profiles 
WHERE deleted_at < NOW() - INTERVAL '30 days';
```

---

## Infrastructure Security

### Network Security

#### CORS Configuration
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restrict in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Restrict to specific domains in production
const allowedOrigins = ['https://narfe.world', 'https://app.narfe.world'];
```

#### API Key Security
```typescript
// Never expose service_role_key to frontend
// Only use anon_key in frontend
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Safe for frontend
);

// Use service_role_key only in backend
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') // Backend only!
);
```

### Database Security

#### Connection Security
```bash
# Use SSL for all connections
postgresql://postgres:password@db.project.supabase.co:5432/postgres?sslmode=require

# Connection pooling to prevent exhaustion
postgresql://postgres:password@db.project.supabase.co:6543/postgres?pgbouncer=true
```

#### SQL Injection Prevention
```typescript
// ✅ GOOD: Parameterized query
const { data } = await supabase
  .from('itineraries')
  .select('*')
  .eq('id', userInput);

// ❌ BAD: String concatenation
// NEVER DO THIS:
const query = `SELECT * FROM itineraries WHERE id = '${userInput}'`;
```

#### Privilege Separation
```sql
-- Separate roles for different access levels
CREATE ROLE anon_role;
CREATE ROLE authenticated_role;
CREATE ROLE service_role;

-- Grant minimal permissions
GRANT SELECT ON itineraries TO anon_role;
GRANT ALL ON itineraries TO service_role;
```

---

## Monitoring & Incident Response

### Security Monitoring

#### Audit Logging
```sql
-- Log sensitive operations
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log important events
INSERT INTO audit_log (user_id, action, resource_type, resource_id)
VALUES (auth.uid(), 'delete_itinerary', 'itinerary', itinerary_id);
```

#### Failed Authentication Tracking
```typescript
// Track failed login attempts
async function trackFailedLogin(email: string, ip: string) {
  const key = `failed_login:${email}`;
  const attempts = await redis.incr(key);
  await redis.expire(key, 3600); // 1 hour window
  
  if (attempts > 5) {
    // Lock account temporarily
    await lockAccount(email, 3600);
    await sendSecurityAlert(email);
  }
}
```

### Incident Response Plan

**1. Detection**
- Monitor error rates, unusual patterns
- Set up alerts for anomalies
- Review logs daily

**2. Assessment**
- Determine severity (Low/Medium/High/Critical)
- Identify affected users/data
- Document timeline

**3. Containment**
- Disable compromised accounts
- Rotate exposed credentials
- Block malicious IPs

**4. Eradication**
- Patch vulnerabilities
- Remove malware/backdoors
- Update dependencies

**5. Recovery**
- Restore from backups if needed
- Verify system integrity
- Re-enable services gradually

**6. Post-Incident**
- Document lessons learned
- Update security procedures
- Notify affected users (if required)

---

## Compliance

### GDPR Compliance

#### User Rights
- **Right to access**: Users can export their data
- **Right to erasure**: Users can delete their account
- **Right to portability**: Data provided in JSON format

**Implementation:**
```typescript
// Export user data
async function exportUserData(userId: string) {
  const [profile, itineraries, purchases, activities] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('itineraries').select('*').eq('creator_id', userId),
    supabase.from('purchases').select('*').eq('user_id', userId),
    supabase.from('activities').select('*').eq('user_id', userId),
  ]);
  
  return {
    profile: profile.data,
    itineraries: itineraries.data,
    purchases: purchases.data,
    activities: activities.data,
    exported_at: new Date().toISOString(),
  };
}

// Delete user account
async function deleteUserAccount(userId: string) {
  // Cascade delete handles related records
  await supabase.auth.admin.deleteUser(userId);
  // Profile and related data deleted via ON DELETE CASCADE
}
```

### Data Processing Agreement
- Document what data is collected
- How data is used
- Who has access
- How long data is retained
- Third-party processors (Stripe, OpenAI)

---

## Security Checklist

### Pre-Production
- [ ] All RLS policies enabled and tested
- [ ] Service role key never exposed to frontend
- [ ] All Edge Functions validate inputs
- [ ] Stripe webhook signature verification enabled
- [ ] Rate limiting configured
- [ ] CORS restricted to production domains
- [ ] All secrets stored in Supabase secrets (not env files)
- [ ] SSL/TLS enabled for all connections
- [ ] Audit logging configured
- [ ] Backup strategy implemented

### Ongoing
- [ ] Review audit logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Security scan (OWASP ZAP) quarterly
- [ ] Penetration testing annually
- [ ] Review and update RLS policies as needed
- [ ] Monitor for suspicious activity daily
- [ ] Train team on security best practices

---

## Reporting Security Issues

**DO NOT** open public GitHub issues for security vulnerabilities.

**Instead:**
1. Email: security@narfe.world
2. Include detailed description
3. Steps to reproduce
4. Potential impact
5. Suggested fix (if any)

**Response Time:**
- Critical: 24 hours
- High: 72 hours
- Medium: 1 week
- Low: 2 weeks

---

## Security Updates

Subscribe to security notifications:
- Supabase: https://github.com/supabase/supabase/security/advisories
- Stripe: https://stripe.com/docs/security
- PostgreSQL: https://www.postgresql.org/support/security/

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Stripe Security Guide](https://stripe.com/docs/security/guide)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
