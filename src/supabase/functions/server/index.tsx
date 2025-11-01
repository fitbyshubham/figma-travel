import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-183d2340/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload endpoint - Direct file upload
app.post("/make-server-183d2340/upload/image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: "Only image files are allowed" }, 400);
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: "File size must be less than 5MB" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Ensure bucket exists
    const bucketName = "make-183d2340-uploads";
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      });
      
      if (bucketError) {
        console.log(`Error creating bucket: ${bucketError.message}`);
      }
    }

    // Generate unique file path
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `stops/${timestamp}-${randomStr}.${ext}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileData, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.log(`Error uploading file: ${error.message}`);
      return c.json({ error: `Failed to upload file: ${error.message}` }, 500);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return c.json({
      url: urlData.publicUrl,
      path: fileName,
    });
  } catch (error: any) {
    console.log(`Error in upload endpoint: ${error.message}`);
    return c.json({ error: `Upload failed: ${error.message}` }, 500);
  }
});

// Booking.com hotel search endpoint
app.post("/make-server-183d2340/hotels/search", async (c) => {
  try {
    const { query, checkIn, checkOut, latitude, longitude } = await c.json();

    const bookingApiKey = Deno.env.get("BOOKING_COM_API_KEY");
    if (!bookingApiKey) {
      console.log("Booking.com API search error: API key not configured");
      return c.json({ error: "Booking.com API key not configured. Please add BOOKING_COM_API_KEY environment variable." }, 500);
    }

    // Booking.com API endpoint (using RapidAPI)
    const searchParams = new URLSearchParams({
      query: query,
      checkin_date: checkIn,
      checkout_date: checkOut,
      ...(latitude && longitude && {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }),
      units: "metric",
      page_number: "1",
      adults_number: "2",
    });

    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?${searchParams}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": bookingApiKey,
          "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Booking.com API error during hotel search: ${response.status} - ${errorText}`);
      return c.json({ error: `Booking.com API error: ${response.status}` }, response.status);
    }

    const data = await response.json();
    
    // Transform the response to our format
    const hotels = (data.data?.hotels || []).map((hotel: any) => ({
      id: hotel.hotel_id?.toString(),
      name: hotel.property?.name || "Unknown Hotel",
      bookingComId: hotel.hotel_id?.toString(),
      bookingComUrl: `https://www.booking.com/hotel/${hotel.property?.slug || ""}`,
      pricePerNight: hotel.property?.priceBreakdown?.grossPrice?.value || 0,
      rating: hotel.property?.reviewScore || 0,
      address: hotel.property?.address || "",
      imageUrl: hotel.property?.photoUrls?.[0] || "",
      available: hotel.property?.isAvailable !== false,
      checkIn,
      checkOut,
    }));

    return c.json({ hotels });
  } catch (error: any) {
    console.log(`Error in hotel search endpoint: ${error.message}`);
    return c.json({ error: `Hotel search failed: ${error.message}` }, 500);
  }
});

// Get hotel availability and details
app.get("/make-server-183d2340/hotels/:hotelId", async (c) => {
  try {
    const hotelId = c.req.param("hotelId");
    const checkIn = c.req.query("checkIn");
    const checkOut = c.req.query("checkOut");

    if (!checkIn || !checkOut) {
      return c.json({ error: "checkIn and checkOut dates are required" }, 400);
    }

    const bookingApiKey = Deno.env.get("BOOKING_COM_API_KEY");
    if (!bookingApiKey) {
      console.log("Booking.com API details error: API key not configured");
      return c.json({ error: "Booking.com API key not configured" }, 500);
    }

    const searchParams = new URLSearchParams({
      hotel_id: hotelId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      adults_number: "2",
      units: "metric",
    });

    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelDetails?${searchParams}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": bookingApiKey,
          "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Booking.com API error during hotel details fetch: ${response.status} - ${errorText}`);
      return c.json({ error: `Failed to fetch hotel details: ${response.status}` }, response.status);
    }

    const data = await response.json();
    const hotel = data.data;

    return c.json({
      hotel: {
        id: hotel.hotel_id?.toString(),
        name: hotel.hotel_name || "Unknown Hotel",
        bookingComId: hotel.hotel_id?.toString(),
        bookingComUrl: hotel.url || `https://www.booking.com/hotel/${hotel.hotel_id}`,
        pricePerNight: hotel.composite_price_breakdown?.gross_amount_per_night?.value || 0,
        rating: hotel.review_score || 0,
        address: hotel.address || "",
        imageUrl: hotel.main_photo_url || "",
        available: hotel.is_available !== false,
        checkIn,
        checkOut,
      },
    });
  } catch (error: any) {
    console.log(`Error in hotel details endpoint: ${error.message}`);
    return c.json({ error: `Failed to fetch hotel details: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);