import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Test configuration
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'http://localhost:54321';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Test user credentials
const TEST_EMAIL = 'test@narfe.world';
const TEST_PASSWORD = 'TestPassword123!';

let supabase: any;
let accessToken: string;
let userId: string;
let testItineraryId: string;

Deno.test('Setup: Initialize Supabase client', () => {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  assertExists(supabase);
});

Deno.test('Auth: Sign up new user', async () => {
  const { data, error } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  // User might already exist, that's okay
  if (error && !error.message.includes('already registered')) {
    throw error;
  }

  if (data.user) {
    userId = data.user.id;
    assertExists(userId);
  }
});

Deno.test('Auth: Sign in', async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (error) throw error;

  accessToken = data.session.access_token;
  userId = data.user.id;

  assertExists(accessToken);
  assertExists(userId);
});

Deno.test('Profile: Create profile', async () => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      username: 'testuser',
      full_name: 'Test User',
      bio: 'Integration test user',
    })
    .select()
    .single();

  if (error) throw error;

  assertEquals(data.username, 'testuser');
});

Deno.test('Profile: Get profile', async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;

  assertEquals(data.username, 'testuser');
  assertExists(data.full_name);
});

Deno.test('Itinerary: Create via Edge Function', async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/createItinerary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      title: 'Test Itinerary',
      description: 'Test description',
      location: 'Bali, Indonesia',
      country: 'Indonesia',
      city: 'Ubud',
      duration: '3 days',
      category: 'Adventure',
      tags: ['test', 'integration'],
      price: 29.99,
      status: 'published',
      stops: [
        {
          dayNumber: 1,
          stopOrder: 1,
          title: 'Test Stop',
          description: 'Test stop description',
          latitude: -8.5069,
          longitude: 115.2625,
        },
      ],
    }),
  });

  const result = await response.json();

  assertEquals(response.status, 200);
  assertEquals(result.success, true);
  assertExists(result.itinerary.id);

  testItineraryId = result.itinerary.id;
});

Deno.test('Itinerary: Get itinerary', async () => {
  const { data, error } = await supabase
    .from('itineraries')
    .select('*, itinerary_stops(*)')
    .eq('id', testItineraryId)
    .single();

  if (error) throw error;

  assertEquals(data.title, 'Test Itinerary');
  assertEquals(data.status, 'published');
  assertEquals(data.itinerary_stops.length, 1);
});

Deno.test('Social: Like itinerary', async () => {
  const { data, error } = await supabase
    .from('likes')
    .insert({
      user_id: userId,
      itinerary_id: testItineraryId,
    })
    .select()
    .single();

  if (error) throw error;

  assertExists(data.id);
});

Deno.test('Social: Check like count updated', async () => {
  const { data, error } = await supabase
    .from('itineraries')
    .select('likes_count')
    .eq('id', testItineraryId)
    .single();

  if (error) throw error;

  assertEquals(data.likes_count, 1);
});

Deno.test('Social: Save itinerary', async () => {
  const { data, error } = await supabase
    .from('saves')
    .insert({
      user_id: userId,
      itinerary_id: testItineraryId,
    })
    .select()
    .single();

  if (error) throw error;

  assertExists(data.id);
});

Deno.test('Feed: Get personalized feed', async () => {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/getFeed?page=1&limit=10&type=trending`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const result = await response.json();

  assertEquals(response.status, 200);
  assertExists(result.itineraries);
  assertEquals(Array.isArray(result.itineraries), true);
});

Deno.test('Search: Full-text search', async () => {
  const { data, error } = await supabase.rpc('search_itineraries', {
    p_query: 'Bali',
    p_limit: 10,
    p_offset: 0,
  });

  if (error) throw error;

  assertEquals(Array.isArray(data), true);
  // Should find our test itinerary
  const found = data.some((i: any) => i.id === testItineraryId);
  assertEquals(found, true);
});

Deno.test('Upload: Get signed URL', async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/uploadSignedUrl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      itineraryId: testItineraryId,
    }),
  });

  const result = await response.json();

  assertEquals(response.status, 200);
  assertEquals(result.success, true);
  assertExists(result.uploadUrl);
  assertExists(result.publicUrl);
});

Deno.test('Cleanup: Delete test itinerary', async () => {
  const { error } = await supabase
    .from('itineraries')
    .delete()
    .eq('id', testItineraryId);

  if (error) throw error;
});

Deno.test('Cleanup: Sign out', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

console.log('✅ All integration tests completed!');
