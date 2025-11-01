# Narfe API Reference

Quick reference guide for all backend API endpoints.

---

## 🌐 Base URLs

### Main Hono Server
```
https://rdmsgtihqnpsobipnina.supabase.co/functions/v1/make-server-183d2340
```

### Edge Functions
```
https://rdmsgtihqnpsobipnina.supabase.co/functions/v1/{function-name}
```

---

## 🔑 Authentication

Most endpoints require authentication via JWT token:

```javascript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## 📡 Main Server Endpoints

### Health Check
```http
GET /make-server-183d2340/health
```

**Response:**
```json
{ "status": "ok" }
```

---

### Upload Image
```http
POST /make-server-183d2340/upload/image
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body (FormData):**
- `file`: Image file (max 5MB, JPEG/PNG/GIF/WebP)

**Response:**
```json
{
  "url": "https://...",
  "path": "stops/1234567890-abc123.jpg"
}
```

**Errors:**
- 400: No file provided, invalid file type, file too large
- 500: Upload failed

---

### Search Hotels
```http
POST /make-server-183d2340/hotels/search
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "query": "Tokyo",
  "checkIn": "2025-11-01",
  "checkOut": "2025-11-05",
  "latitude": 35.6762,
  "longitude": 139.6503
}
```

**Response:**
```json
{
  "hotels": [
    {
      "id": "123",
      "name": "Hotel Name",
      "bookingComId": "123",
      "bookingComUrl": "https://booking.com/hotel/...",
      "pricePerNight": 150.00,
      "rating": 8.5,
      "address": "123 Street, Tokyo",
      "imageUrl": "https://...",
      "available": true,
      "checkIn": "2025-11-01",
      "checkOut": "2025-11-05"
    }
  ]
}
```

**Errors:**
- 500: API key not configured, API error

---

### Get Hotel Details
```http
GET /make-server-183d2340/hotels/{hotelId}?checkIn=2025-11-01&checkOut=2025-11-05
Authorization: Bearer {token}
```

**Response:**
```json
{
  "hotel": {
    "id": "123",
    "name": "Hotel Name",
    "bookingComId": "123",
    "bookingComUrl": "https://...",
    "pricePerNight": 150.00,
    "rating": 8.5,
    "address": "123 Street, Tokyo",
    "imageUrl": "https://...",
    "available": true,
    "checkIn": "2025-11-01",
    "checkOut": "2025-11-05"
  }
}
```

**Errors:**
- 400: Missing checkIn or checkOut
- 404: Hotel not found
- 500: API error

---

## 📡 Edge Function Endpoints

### Create Itinerary
```http
POST /functions/v1/createItinerary
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "5 Days in Tokyo",
  "description": "Amazing Tokyo adventure",
  "location": "Tokyo, Japan",
  "country": "Japan",
  "city": "Tokyo",
  "duration": 5,
  "category": "city-exploration",
  "tags": ["urban", "food", "culture"],
  "price": 49.99,
  "currency": "USD",
  "coverImageUrl": "https://...",
  "videoUrl": "https://...",
  "status": "published",
  "stops": [
    {
      "dayNumber": 1,
      "stopOrder": 1,
      "title": "Senso-ji Temple",
      "description": "Visit the famous temple",
      "latitude": 35.7148,
      "longitude": 139.7967,
      "address": "2 Chome-3-1 Asakusa",
      "placeName": "Senso-ji Temple",
      "startTime": "09:00",
      "endTime": "11:00",
      "durationMinutes": 120,
      "imageUrl": "https://..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "itinerary": {
    "id": "uuid",
    "title": "5 Days in Tokyo",
    ...
  }
}
```

**Errors:**
- 401: Unauthorized
- 400: Missing required fields
- 500: Database error

---

### Get Feed
```http
GET /functions/v1/getFeed?type=personalized&page=1&limit=20
Authorization: Bearer {token} (optional)
```

**Query Parameters:**
- `type`: "personalized" | "trending" | "following"
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "itineraries": [
    {
      "id": "uuid",
      "title": "5 Days in Tokyo",
      "description": "...",
      "location": "Tokyo, Japan",
      "category": "city-exploration",
      "tags": ["urban", "food"],
      "price": 49.99,
      "currency": "USD",
      "cover_image_url": "https://...",
      "video_url": "https://...",
      "likes_count": 125,
      "saves_count": 43,
      "views_count": 890,
      "published_at": "2025-10-15T10:00:00Z",
      "creator_id": "uuid",
      "profiles": {
        "id": "uuid",
        "username": "traveler123",
        "full_name": "John Doe",
        "avatar_url": "https://..."
      },
      "is_liked": true,
      "is_saved": false,
      "is_purchased": false
    }
  ],
  "page": 1,
  "hasMore": true
}
```

---

### Create Purchase
```http
POST /functions/v1/createPurchase
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "itineraryId": "uuid",
  "paymentMethodId": "pm_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "purchase": {
    "id": "uuid",
    "user_id": "uuid",
    "itinerary_id": "uuid",
    "amount": 49.99,
    "currency": "USD",
    "platform_fee": 4.99,
    "creator_payout": 45.00,
    "stripe_payment_intent_id": "pi_xxx",
    "status": "completed",
    "created_at": "2025-10-20T..."
  },
  "paymentIntent": {
    "id": "pi_xxx",
    "status": "succeeded"
  }
}
```

**Errors:**
- 401: Unauthorized
- 400: Missing fields, already purchased, creator not setup
- 404: Itinerary not found
- 500: Payment failed

---

### Generate Embedding
```http
POST /functions/v1/generateEmbedding
Authorization: Bearer {serviceRoleKey}
Content-Type: application/json
```

**Body:**
```json
{
  "itineraryId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "itineraryId": "uuid"
}
```

**Note:** This is typically called automatically by createItinerary, not directly by frontend.

---

### Upload Signed URL
```http
POST /functions/v1/uploadSignedUrl
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "fileName": "video.mp4",
  "fileType": "video/mp4",
  "bucket": "media",
  "itineraryId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "uploadUrl": "https://...",
  "token": "...",
  "path": "user-id/123-video.mp4",
  "publicUrl": "https://...",
  "mediaId": "uuid",
  "instructions": {
    "method": "PUT",
    "url": "https://...",
    "headers": {
      "Content-Type": "video/mp4",
      "x-upsert": "true"
    }
  }
}
```

**Upload File:**
```javascript
// Step 1: Get signed URL
const { uploadUrl, publicUrl } = await getSignedUrl(fileName, fileType);

// Step 2: Upload file using signed URL
await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': fileType,
    'x-upsert': 'true',
  },
  body: file, // File object
});

// Step 3: Use publicUrl in your data
```

---

### Stripe Webhook
```http
POST /functions/v1/stripeWebhook
Stripe-Signature: t=...,v1=...
Content-Type: application/json
```

**Note:** This endpoint is called by Stripe, not your frontend.

**Handled Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `account.updated`
- `transfer.created`

---

## 📊 Database Operations

All database operations use Supabase client libraries. Here are common patterns:

### Get User Profile
```javascript
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### Like an Itinerary
```javascript
const { data } = await supabase
  .from('likes')
  .insert({ user_id: userId, itinerary_id: itineraryId });

// Also increment counter
await supabase.rpc('increment_likes_count', { itinerary_id: itineraryId });
```

### Save an Itinerary
```javascript
const { data } = await supabase
  .from('saves')
  .insert({ user_id: userId, itinerary_id: itineraryId });

// Also increment counter
await supabase.rpc('increment_saves_count', { itinerary_id: itineraryId });
```

### Get Itinerary Stops
```javascript
const { data: stops } = await supabase
  .from('itinerary_stops')
  .select('*')
  .eq('itinerary_id', itineraryId)
  .order('day_number', { ascending: true })
  .order('stop_order', { ascending: true });
```

### Search Itineraries (Semantic)
```javascript
const { data } = await supabase.rpc('search_itineraries', {
  query_text: 'beach vacation',
  match_threshold: 0.7,
  match_count: 20
});
```

---

## 🔐 Row Level Security (RLS)

All tables have RLS policies. Here are the key rules:

### Public Read
- ✅ Published itineraries
- ✅ Public profiles
- ✅ Likes/saves counts

### Authenticated Read
- ✅ Own likes/saves
- ✅ Own purchases
- ✅ Own follows
- ✅ Own comments

### Authenticated Write
- ✅ Like/unlike itineraries
- ✅ Save/unsave itineraries
- ✅ Follow/unfollow users
- ✅ Create comments
- ✅ Update own profile

### Creator Only
- ✅ Create itineraries
- ✅ Update own itineraries
- ✅ Delete own itineraries

---

## ⚡ Real-time Subscriptions

Subscribe to real-time updates:

```javascript
// Listen for new likes on an itinerary
const subscription = supabase
  .channel('itinerary-likes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'likes',
      filter: `itinerary_id=eq.${itineraryId}`
    },
    (payload) => {
      console.log('New like:', payload);
    }
  )
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

---

## 🐛 Error Handling

All endpoints return errors in this format:

```json
{
  "error": "Human-readable error message",
  "details": {
    // Optional detailed error info
  }
}
```

Common HTTP status codes:
- 200: Success
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (no permission)
- 404: Not Found
- 500: Internal Server Error

---

## 🚀 Rate Limits

Default Supabase rate limits apply:
- Anonymous: 60 requests/minute
- Authenticated: 300 requests/minute
- Service role: Unlimited

For higher limits, upgrade your Supabase plan.

---

## 📝 Example Usage

### Complete Purchase Flow

```javascript
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// 1. Get user session
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// 2. Create Stripe payment method (use Stripe.js)
const stripe = Stripe(publishableKey);
const { paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: cardElement,
});

// 3. Purchase itinerary
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/createPurchase`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      itineraryId: 'uuid',
      paymentMethodId: paymentMethod.id,
    }),
  }
);

const { purchase } = await response.json();
console.log('Purchase successful:', purchase);
```

### Complete Upload Flow

```javascript
// 1. Get signed upload URL
const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/uploadSignedUrl`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      bucket: 'media',
    }),
  }
);

const { uploadUrl, publicUrl } = await response.json();

// 2. Upload file
await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
    'x-upsert': 'true',
  },
  body: file,
});

// 3. Use publicUrl in your itinerary
console.log('File uploaded:', publicUrl);
```

---

## 📞 Support

- **Supabase Docs:** https://supabase.com/docs
- **Project ID:** `rdmsgtihqnpsobipnina`
- **Region:** US East

For deployment issues, see `BACKEND-DEPLOYMENT-READY.md`
