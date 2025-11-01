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
    const { itineraryId } = await req.json();

    if (!itineraryId) {
      return new Response(
        JSON.stringify({ error: 'Itinerary ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get itinerary details
    const { data: itinerary, error: itineraryError } = await supabaseAdmin
      .from('itineraries')
      .select('id, title, description, location, category, tags')
      .eq('id', itineraryId)
      .single();

    if (itineraryError || !itinerary) {
      return new Response(
        JSON.stringify({ error: 'Itinerary not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create text for embedding
    const embeddingText = [
      itinerary.title,
      itinerary.description || '',
      itinerary.location,
      itinerary.category || '',
      (itinerary.tags || []).join(' '),
    ].filter(Boolean).join('. ');

    // Call OpenAI API for embeddings
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: embeddingText,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.text();
      console.error('OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to generate embedding', details: errorData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Store embedding in database
    const { error: insertError } = await supabaseAdmin
      .from('itinerary_embeddings')
      .upsert({
        itinerary_id: itineraryId,
        embedding,
        model_version: 'text-embedding-ada-002',
      });

    if (insertError) {
      console.error('Error storing embedding:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store embedding', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully generated embedding for itinerary: ${itineraryId}`);

    return new Response(
      JSON.stringify({ success: true, itineraryId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generateEmbedding:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
