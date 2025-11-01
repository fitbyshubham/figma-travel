# Narfe API Endpoints

## Base URL
```
https://[project-id].supabase.co
```

## Authentication
All authenticated endpoints require a Bearer token:
```
Authorization: Bearer <access_token>
```

---

## PostgREST Endpoints (Auto-generated)

### Profiles
- `GET /rest/v1/profiles` - List profiles
- `GET /rest/v1/profiles?id=eq.<uuid>` - Get specific profile
- `POST /rest/v1/profiles` - Create profile (auto on signup)
- `PATCH /rest/v1/profiles?id=eq.<uuid>` - Update profile
- `DELETE /rest/v1/profiles?id=eq.<uuid>` - Delete profile

### Itineraries
- `GET /rest/v1/itineraries` - List itineraries
  - Query params: `status=eq.published`, `category=eq.Adventure`, `order=published_at.desc`
- `GET /rest/v1/itineraries?id=eq.<uuid>` - Get specific itinerary
- `POST /rest/v1/itineraries` - Create itinerary
- `PATCH /rest/v1/itineraries?id=eq.<uuid>` - Update itinerary
- `DELETE /rest/v1/itineraries?id=eq.<uuid>` - Delete itinerary

### Itinerary Stops
- `GET /rest/v1/itinerary_stops?itinerary_id=eq.<uuid>` - Get stops for itinerary
- `POST /rest/v1/itinerary_stops` - Create stop
- `PATCH /rest/v1/itinerary_stops?id=eq.<uuid>` - Update stop
- `DELETE /rest/v1/itinerary_stops?id=eq.<uuid>` - Delete stop

### Social Actions
- `GET /rest/v1/likes?user_id=eq.<uuid>` - Get user's likes
- `POST /rest/v1/likes` - Like an itinerary
- `DELETE /rest/v1/likes?id=eq.<uuid>` - Unlike

- `GET /rest/v1/saves?user_id=eq.<uuid>` - Get user's saved itineraries
- `POST /rest/v1/saves` - Save an itinerary
- `DELETE /rest/v1/saves?id=eq.<uuid>` - Unsave

- `GET /rest/v1/comments?itinerary_id=eq.<uuid>` - Get comments
- `POST /rest/v1/comments` - Create comment
- `PATCH /rest/v1/comments?id=eq.<uuid>` - Update comment
- `DELETE /rest/v1/comments?id=eq.<uuid>` - Delete comment

- `GET /rest/v1/follows?follower_id=eq.<uuid>` - Get who user follows
- `POST /rest/v1/follows` - Follow a user
- `DELETE /rest/v1/follows?id=eq.<uuid>` - Unfollow

### Purchases
- `GET /rest/v1/purchases?user_id=eq.<uuid>` - Get user's purchases

---

## Edge Functions

### POST /functions/v1/createPurchase
Create a purchase and process payment via Stripe.

**Auth Required:** Yes

**Request:**
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
    "amount": 29.99,
    "status": "completed"
  },
  "paymentIntent": {
    "id": "pi_xxx",
    "status": "succeeded"
  }
}
```

### POST /functions/v1/stripeWebhook
Handle Stripe webhook events.

**Auth Required:** No (Signature verified)

**Headers:**
```
stripe-signature: xxx
```

### POST /functions/v1/createItinerary
Create a new itinerary with stops.

**Auth Required:** Yes

**Request:**
```json
{
  "title": "Ultimate Bali Adventure",
  "description": "7-day journey...",
  "location": "Bali, Indonesia",
  "country": "Indonesia",
  "city": "Ubud",
  "duration": "7 days",
  "category": "Adventure",
  "tags": ["beach", "temples", "hiking"],
  "price": 49.99,
  "currency": "EUR",
  "coverImageUrl": "https://...",
  "videoUrl": "https://...",
  "status": "published",
  "stops": [
    {
      "dayNumber": 1,
      "stopOrder": 1,
      "title": "Ubud Monkey Forest",
      "description": "...",
      "latitude": -8.519,
      "longitude": 115.258,
      "address": "Monkey Forest Rd",
      "placeName": "Sacred Monkey Forest Sanctuary"
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
    "title": "Ultimate Bali Adventure",
    ...
  }
}
```

### POST /functions/v1/generateEmbedding
Generate vector embedding for semantic search.

**Auth Required:** No (Internal use)

**Request:**
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

### GET /functions/v1/getFeed
Get personalized feed of itineraries.

**Auth Required:** Optional (Better with auth)

**Query Params:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `type` - Feed type: `personalized`, `trending`, `following`

**Response:**
```json
{
  "itineraries": [
    {
      "id": "uuid",
      "title": "...",
      "cover_image_url": "...",
      "creator_name": "Alex Thompson",
      "likes_count": 1234,
      "is_liked": true,
      "is_saved": false,
      ...
    }
  ],
  "page": 1,
  "hasMore": true
}
```

### POST /functions/v1/uploadSignedUrl
Get a signed URL for uploading media to Supabase Storage.

**Auth Required:** Yes

**Request:**
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
  "uploadUrl": "https://...?token=xxx",
  "token": "xxx",
  "path": "user-id/timestamp-video.mp4",
  "publicUrl": "https://...",
  "mediaId": "uuid",
  "instructions": {
    "method": "PUT",
    "url": "https://...",
    "headers": {
      "Content-Type": "video/mp4"
    }
  }
}
```

---

## Search Functions

### Full-Text Search
```sql
GET /rest/v1/rpc/search_itineraries
```

**Query Params:**
- `p_query` - Search query
- `p_limit` - Results limit
- `p_offset` - Offset
- `p_user_id` - User ID (optional)

### Semantic Search (Vector)
```sql
-- Custom query using pgvector
SELECT i.*, e.embedding <=> '[...]' AS distance
FROM itineraries i
JOIN itinerary_embeddings e ON e.itinerary_id = i.id
ORDER BY distance
LIMIT 20
```

---

## Hotel Search Integration (New)

### POST /functions/v1/make-server-183d2340/hotels/search
Search for hotels on Booking.com with availability and pricing.

**Auth Required:** No (uses server-side API key)

**Request:**
```json
{
  "query": "Eiffel Tower Paris",
  "checkIn": "2025-06-15",
  "checkOut": "2025-06-16",
  "latitude": 48.8584,
  "longitude": 2.2945
}
```

**Response:**
```json
{
  "hotels": [
    {
      "id": "123456",
      "name": "Hotel Eiffel Turenne",
      "bookingComUrl": "https://www.booking.com/hotel/...",
      "bookingComId": "123456",
      "pricePerNight": 185.00,
      "rating": 8.2,
      "address": "20 Avenue de Tourville, Paris",
      "imageUrl": "https://...",
      "available": true,
      "checkIn": "2025-06-15",
      "checkOut": "2025-06-16"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Booking.com API key not configured. Please add BOOKING_COM_API_KEY environment variable."
}
```

### GET /functions/v1/make-server-183d2340/hotels/:hotelId
Get detailed hotel information with availability for specific dates.

**Auth Required:** No

**Query Params:**
- `checkIn` - Check-in date (YYYY-MM-DD)
- `checkOut` - Check-out date (YYYY-MM-DD)

**Response:**
```json
{
  "hotel": {
    "id": "123456",
    "name": "Hotel Eiffel Turenne",
    "bookingComUrl": "https://www.booking.com/hotel/...",
    "pricePerNight": 185.00,
    "rating": 8.2,
    "address": "20 Avenue de Tourville, Paris",
    "available": true,
    "imageUrl": "https://...",
    "checkIn": "2025-06-15",
    "checkOut": "2025-06-16"
  }
}
```

**Setup Required:**
To enable hotel search, set the Booking.com API key:
```bash
supabase secrets set BOOKING_COM_API_KEY=<your-rapidapi-key>
```

Get your RapidAPI key at: https://rapidapi.com/DataCrawler/api/booking-com15/pricing

---

## Rate Limits

- PostgREST: 1000 requests/minute per user
- Edge Functions: 500 requests/minute per user
- Authenticated users: Higher limits
- Anonymous: Lower limits

## Error Responses

```json
{
  "error": "Error message",
  "details": "Additional context",
  "code": "ERROR_CODE"
}
```

Common status codes:
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 429 - Too Many Requests
- 500 - Internal Server Error
