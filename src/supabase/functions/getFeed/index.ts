import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const feedType = url.searchParams.get('type') || 'personalized'; // personalized, trending, following
    const offset = (page - 1) * limit;

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let query = supabaseAdmin
      .from('itineraries')
      .select(`
        id,
        title,
        description,
        location,
        category,
        tags,
        price,
        currency,
        cover_image_url,
        video_url,
        likes_count,
        saves_count,
        views_count,
        published_at,
        creator_id,
        profiles!creator_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters based on feed type
    if (feedType === 'trending') {
      // Trending: high engagement in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      query = query
        .gte('published_at', sevenDaysAgo.toISOString())
        .order('likes_count', { ascending: false });
    } else if (feedType === 'following' && user) {
      // Following: only from creators the user follows
      const { data: following } = await supabaseAdmin
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (following && following.length > 0) {
        const followingIds = following.map(f => f.following_id);
        query = query.in('creator_id', followingIds);
      } else {
        // User doesn't follow anyone, return empty
        return new Response(
          JSON.stringify({ itineraries: [], page, hasMore: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (feedType === 'personalized' && user) {
      // Personalized: mix of following + trending + based on interests
      // For now, use the stored function
      const { data, error } = await supabaseAdmin.rpc('get_personalized_feed', {
        p_user_id: user.id,
        p_limit: limit,
        p_offset: offset,
      });

      if (error) {
        console.error('Error getting personalized feed:', error);
        // Fall back to trending
      } else if (data) {
        // Add user-specific data (likes, saves)
        const enrichedData = user ? await enrichWithUserData(supabaseAdmin, data, user.id) : data;
        
        return new Response(
          JSON.stringify({
            itineraries: enrichedData,
            page,
            hasMore: data.length === limit,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching feed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch feed', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enrich with user-specific data if authenticated
    const enrichedData = user ? await enrichWithUserData(supabaseAdmin, data || [], user.id) : data;

    // Track views
    if (user && data) {
      const viewActivities = data.map(item => ({
        user_id: user.id,
        itinerary_id: item.id,
        activity_type: 'view',
      }));

      // Insert views asynchronously (don't wait)
      supabaseAdmin
        .from('activities')
        .insert(viewActivities)
        .then(() => console.log(`Tracked ${viewActivities.length} views`))
        .catch(err => console.error('Error tracking views:', err));
    }

    return new Response(
      JSON.stringify({
        itineraries: enrichedData,
        page,
        hasMore: (data || []).length === limit,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in getFeed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to enrich data with user-specific info
async function enrichWithUserData(supabase: any, itineraries: any[], userId: string) {
  const itineraryIds = itineraries.map(i => i.id);

  // Get user's likes
  const { data: likes } = await supabase
    .from('likes')
    .select('itinerary_id')
    .eq('user_id', userId)
    .in('itinerary_id', itineraryIds);

  // Get user's saves
  const { data: saves } = await supabase
    .from('saves')
    .select('itinerary_id')
    .eq('user_id', userId)
    .in('itinerary_id', itineraryIds);

  // Get user's purchases
  const { data: purchases } = await supabase
    .from('purchases')
    .select('itinerary_id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .in('itinerary_id', itineraryIds);

  const likedIds = new Set(likes?.map(l => l.itinerary_id) || []);
  const savedIds = new Set(saves?.map(s => s.itinerary_id) || []);
  const purchasedIds = new Set(purchases?.map(p => p.itinerary_id) || []);

  return itineraries.map(itinerary => ({
    ...itinerary,
    is_liked: likedIds.has(itinerary.id),
    is_saved: savedIds.has(itinerary.id),
    is_purchased: purchasedIds.has(itinerary.id),
  }));
}
