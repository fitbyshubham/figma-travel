# Frontend Integration Guide

## Quick Start: Connect Your Frontend to the Backend

### Step 1: Install Supabase Client

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### Step 2: Create Supabase Client

Create a file `/utils/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 3: Update Environment Variables

Add to your `.env.local`:

```bash
# Get these from Supabase Dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (for checkout)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

## Usage Examples

### 1. Authentication

```typescript
import { supabase } from './utils/supabase/client';

// Sign up
async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: '',
      },
    },
  });
  
  if (error) {
    console.error('Sign up error:', error);
    return;
  }
  
  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user!.id,
      username,
      email,
    });
  
  return data;
}

// Sign in
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Sign in error:', error);
    return;
  }
  
  return data;
}

// Sign out
async function signOut() {
  const { error } = await supabase.auth.signOut();
}

// Get current user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Get session
async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
```

### 2. Fetch Feed (Home Page)

```typescript
async function getFeed(page = 1, limit = 20, type = 'trending') {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/getFeed?page=${page}&limit=${limit}&type=${type}`,
    {
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
      },
    }
  );
  
  const data = await response.json();
  return data;
}

// Usage in React component
function HomePage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadFeed() {
      const data = await getFeed(1, 20, 'trending');
      setItineraries(data.itineraries);
      setLoading(false);
    }
    loadFeed();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {itineraries.map(itinerary => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
```

### 3. Search Itineraries

```typescript
async function searchItineraries(query: string, page = 1, limit = 20) {
  const { data, error } = await supabase.rpc('search_itineraries', {
    p_query: query,
    p_limit: limit,
    p_offset: (page - 1) * limit,
  });
  
  if (error) {
    console.error('Search error:', error);
    return [];
  }
  
  return data;
}

// Usage
function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  async function handleSearch() {
    const data = await searchItineraries(query);
    setResults(data);
  }
  
  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search destinations..."
      />
      <button onClick={handleSearch}>Search</button>
      
      {results.map(itinerary => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
```

### 4. Get Itinerary Details

```typescript
async function getItinerary(id: string) {
  const { data, error } = await supabase
    .from('itineraries')
    .select(`
      *,
      itinerary_stops (*),
      profiles:creator_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching itinerary:', error);
    return null;
  }
  
  return data;
}
```

### 5. Like/Unlike Itinerary

```typescript
async function toggleLike(itineraryId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  
  // Check if already liked
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('itinerary_id', itineraryId)
    .single();
  
  if (existing) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existing.id);
    
    return !error;
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        itinerary_id: itineraryId,
      });
    
    return !error;
  }
}
```

### 6. Save/Unsave Itinerary

```typescript
async function toggleSave(itineraryId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  
  const { data: existing } = await supabase
    .from('saves')
    .select('id')
    .eq('user_id', user.id)
    .eq('itinerary_id', itineraryId)
    .single();
  
  if (existing) {
    // Unsave
    await supabase.from('saves').delete().eq('id', existing.id);
  } else {
    // Save
    await supabase.from('saves').insert({
      user_id: user.id,
      itinerary_id: itineraryId,
    });
  }
}
```

### 7. Create Itinerary

```typescript
async function createItinerary(itineraryData: any) {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/createItinerary`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: itineraryData.title,
        description: itineraryData.description,
        location: itineraryData.location,
        country: itineraryData.country,
        city: itineraryData.city,
        duration: itineraryData.duration,
        category: itineraryData.category,
        tags: itineraryData.tags,
        price: itineraryData.price,
        coverImageUrl: itineraryData.coverImageUrl,
        videoUrl: itineraryData.videoUrl,
        status: 'published',
        stops: itineraryData.stops,
      }),
    }
  );
  
  const result = await response.json();
  return result.itinerary;
}
```

### 8. Purchase Itinerary

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ itineraryId }: { itineraryId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    // Create payment method
    const cardElement = elements.getElement(CardElement)!;
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (pmError) {
      console.error(pmError);
      setLoading(false);
      return;
    }
    
    // Call backend to process purchase
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/createPurchase`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          itineraryId,
          paymentMethodId: paymentMethod.id,
        }),
      }
    );
    
    const result = await response.json();
    
    if (result.success) {
      alert('Purchase successful!');
    } else {
      alert('Purchase failed: ' + result.error);
    }
    
    setLoading(false);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Purchase'}
      </button>
    </form>
  );
}

// Wrapper component
function PurchasePage({ itineraryId }: { itineraryId: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm itineraryId={itineraryId} />
    </Elements>
  );
}
```

### 9. Upload Media

```typescript
async function uploadMedia(file: File, itineraryId?: string) {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }
  
  // Step 1: Get signed upload URL
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/uploadSignedUrl`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        itineraryId,
      }),
    }
  );
  
  const { uploadUrl, publicUrl, mediaId } = await response.json();
  
  // Step 2: Upload file to signed URL
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });
  
  return { publicUrl, mediaId };
}
```

### 10. Get User Profile

```typescript
async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      creators (*)
    `)
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
}

async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data;
}
```

---

## React Hooks (Recommended)

Create custom hooks for common operations:

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { user, loading };
}

// hooks/useFeed.ts
export function useFeed(type = 'trending') {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadFeed() {
      const data = await getFeed(1, 20, type);
      setItineraries(data.itineraries);
      setLoading(false);
    }
    loadFeed();
  }, [type]);
  
  return { itineraries, loading };
}
```

---

## Error Handling

```typescript
async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error(errorMessage, error);
    // You can add toast notification here
    return null;
  }
}

// Usage
const itinerary = await safeApiCall(
  () => getItinerary(id),
  'Failed to load itinerary'
);
```

---

## TypeScript Types

Create types for your data:

```typescript
// types/database.ts
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'creator' | 'founding_creator' | 'admin';
  followers_count: number;
  following_count: number;
  itineraries_count: number;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  location: string;
  country: string | null;
  city: string | null;
  duration: string | null;
  category: string | null;
  tags: string[];
  price: number;
  currency: string;
  cover_image_url: string | null;
  video_url: string | null;
  likes_count: number;
  saves_count: number;
  views_count: number;
  purchases_count: number;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  
  // Joined data
  profiles?: Profile;
  itinerary_stops?: ItineraryStop[];
  is_liked?: boolean;
  is_saved?: boolean;
  is_purchased?: boolean;
}

export interface ItineraryStop {
  id: string;
  itinerary_id: string;
  day_number: number;
  stop_order: number;
  title: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  place_name: string | null;
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  image_url: string | null;
}
```

---

## Next Steps

1. Copy the code examples above into your frontend
2. Update your environment variables
3. Test authentication flow
4. Test fetching and displaying itineraries
5. Implement like/save functionality
6. Add Stripe checkout
7. Deploy your frontend

For complete examples, see the existing Narfe frontend components and adapt them to use these new backend endpoints.
