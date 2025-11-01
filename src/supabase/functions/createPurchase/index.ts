import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { itineraryId, paymentMethodId } = await req.json();

    if (!itineraryId || !paymentMethodId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get itinerary details
    const { data: itinerary, error: itineraryError } = await supabaseAdmin
      .from('itineraries')
      .select('id, title, price, currency, creator_id, profiles!creator_id(stripe_account_id)')
      .eq('id', itineraryId)
      .eq('status', 'published')
      .single();

    if (itineraryError || !itinerary) {
      return new Response(
        JSON.stringify({ error: 'Itinerary not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if already purchased
    const { data: existingPurchase } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('itinerary_id', itineraryId)
      .eq('status', 'completed')
      .single();

    if (existingPurchase) {
      return new Response(
        JSON.stringify({ error: 'Already purchased' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Calculate platform fee (10%)
    const amount = Math.round(itinerary.price * 100); // Convert to cents
    const platformFee = Math.round(amount * 0.1);
    const creatorPayout = amount - platformFee;

    // Get creator's Stripe account
    const creatorProfile = Array.isArray(itinerary.profiles) 
      ? itinerary.profiles[0] 
      : itinerary.profiles;

    if (!creatorProfile?.stripe_account_id) {
      return new Response(
        JSON.stringify({ error: 'Creator has not set up payouts' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Payment Intent with Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: itinerary.currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: creatorProfile.stripe_account_id,
      },
      metadata: {
        user_id: user.id,
        itinerary_id: itineraryId,
        itinerary_title: itinerary.title,
      },
    });

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('purchases')
      .insert({
        user_id: user.id,
        itinerary_id: itineraryId,
        amount: itinerary.price,
        currency: itinerary.currency,
        platform_fee: platformFee / 100,
        creator_payout: creatorPayout / 100,
        stripe_payment_intent_id: paymentIntent.id,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
      return new Response(
        JSON.stringify({ error: 'Failed to create purchase record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record activity
    await supabaseAdmin.from('activities').insert({
      user_id: user.id,
      itinerary_id: itineraryId,
      activity_type: 'purchase',
      metadata: { purchase_id: purchase.id },
    });

    return new Response(
      JSON.stringify({
        success: true,
        purchase,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in createPurchase:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
