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
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fileName, fileType, bucket = 'media', itineraryId } = await req.json();

    if (!fileName || !fileType) {
      return new Response(
        JSON.stringify({ error: 'fileName and fileType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'video/webm',
    ];

    if (!allowedTypes.includes(fileType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create unique file path
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`;

    // Check if bucket exists, create if not
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);

    if (!bucketExists) {
      const { error: createBucketError } = await supabaseAdmin.storage.createBucket(bucket, {
        public: false, // Private bucket, use signed URLs
        fileSizeLimit: 104857600, // 100MB
        allowedMimeTypes: allowedTypes,
      });

      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        return new Response(
          JSON.stringify({ error: 'Failed to create storage bucket' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Generate signed upload URL (valid for 10 minutes)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(filePath);

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      return new Response(
        JSON.stringify({ error: 'Failed to create signed URL', details: signedUrlError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create media record (will be updated after upload)
    const mediaType = fileType.startsWith('video/') ? 'video' : 'image';
    
    const { data: media, error: mediaError } = await supabaseAdmin
      .from('media')
      .insert({
        owner_id: user.id,
        itinerary_id: itineraryId || null,
        file_path: filePath,
        file_name: fileName,
        file_size: 0, // Will be updated after upload
        mime_type: fileType,
        media_type: mediaType,
        storage_bucket: bucket,
      })
      .select()
      .single();

    if (mediaError) {
      console.error('Error creating media record:', mediaError);
      // Don't fail the request, the upload URL is still valid
    }

    // Generate public URL for later retrieval
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl: signedUrlData.signedUrl,
        token: signedUrlData.token,
        path: signedUrlData.path,
        publicUrl: publicUrlData.publicUrl,
        mediaId: media?.id,
        // Instructions for upload
        instructions: {
          method: 'PUT',
          url: signedUrlData.signedUrl,
          headers: {
            'Content-Type': fileType,
            'x-upsert': 'true', // Allow overwriting
          },
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in uploadSignedUrl:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
