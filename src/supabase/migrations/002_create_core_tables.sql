-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  email TEXT,
  website TEXT,
  location TEXT,
  
  -- Creator-specific fields
  stripe_account_id TEXT,
  stripe_account_verified BOOLEAN DEFAULT false,
  
  -- Stats
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  itineraries_count INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30)
);

CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_created_at_idx ON profiles(created_at DESC);

-- =============================================
-- CREATORS TABLE (Extended creator info)
-- =============================================
CREATE TABLE creators (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  is_founding_creator BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending',
  total_views BIGINT DEFAULT 0,
  total_likes BIGINT DEFAULT 0,
  total_saves BIGINT DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  
  -- Payout info
  payout_schedule TEXT DEFAULT 'monthly',
  minimum_payout DECIMAL(10, 2) DEFAULT 100,
  pending_balance DECIMAL(10, 2) DEFAULT 0,
  available_balance DECIMAL(10, 2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX creators_founding_idx ON creators(is_founding_creator) WHERE is_founding_creator = true;
CREATE INDEX creators_total_views_idx ON creators(total_views DESC);

-- =============================================
-- ITINERARIES TABLE
-- =============================================
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  country TEXT,
  city TEXT,
  duration TEXT, -- e.g., "7 days", "weekend"
  category TEXT, -- e.g., "Adventure", "Luxury", "Budget"
  tags TEXT[], -- e.g., {"beach", "hiking", "food"}
  
  -- Pricing
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  is_free BOOLEAN GENERATED ALWAYS AS (price = 0) STORED,
  
  -- Media
  cover_image_url TEXT,
  video_url TEXT,
  
  -- Stats
  views_count BIGINT DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  purchases_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  
  -- Status
  status itinerary_status DEFAULT 'draft'::itinerary_status NOT NULL,
  published_at TIMESTAMPTZ,
  
  -- Search
  search_vector tsvector,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT price_positive CHECK (price >= 0)
);

-- Indexes for performance
CREATE INDEX itineraries_creator_idx ON itineraries(creator_id);
CREATE INDEX itineraries_status_idx ON itineraries(status);
CREATE INDEX itineraries_published_at_idx ON itineraries(published_at DESC NULLS LAST);
CREATE INDEX itineraries_location_idx ON itineraries(location);
CREATE INDEX itineraries_category_idx ON itineraries(category);
CREATE INDEX itineraries_price_idx ON itineraries(price);
CREATE INDEX itineraries_likes_idx ON itineraries(likes_count DESC);
CREATE INDEX itineraries_saves_idx ON itineraries(saves_count DESC);

-- Full-text search index
CREATE INDEX itineraries_search_idx ON itineraries USING GIN(search_vector);
CREATE INDEX itineraries_tags_idx ON itineraries USING GIN(tags);

-- Trigger to update search_vector
CREATE OR REPLACE FUNCTION update_itinerary_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER itinerary_search_vector_update
  BEFORE INSERT OR UPDATE OF title, description, location, tags
  ON itineraries
  FOR EACH ROW
  EXECUTE FUNCTION update_itinerary_search_vector();

-- =============================================
-- ITINERARY STOPS TABLE
-- =============================================
CREATE TABLE itinerary_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  
  -- Stop details
  day_number INTEGER NOT NULL,
  stop_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  
  -- Location
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  place_name TEXT,
  
  -- Time
  start_time TIME,
  end_time TIME,
  duration_minutes INTEGER,
  
  -- Media
  image_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT stop_order_positive CHECK (stop_order > 0),
  CONSTRAINT day_number_positive CHECK (day_number > 0)
);

CREATE INDEX itinerary_stops_itinerary_idx ON itinerary_stops(itinerary_id);
CREATE INDEX itinerary_stops_order_idx ON itinerary_stops(itinerary_id, day_number, stop_order);

-- =============================================
-- ITINERARY EMBEDDINGS TABLE (for semantic search)
-- =============================================
CREATE TABLE itinerary_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  embedding vector(1536), -- OpenAI ada-002 dimensions
  model_version TEXT DEFAULT 'text-embedding-ada-002',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  UNIQUE(itinerary_id)
);

-- Vector similarity search index (HNSW for better performance)
CREATE INDEX itinerary_embeddings_vector_idx ON itinerary_embeddings 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- =============================================
-- PURCHASES TABLE
-- =============================================
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  
  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  platform_fee DECIMAL(10, 2) NOT NULL, -- 10% platform fee
  creator_payout DECIMAL(10, 2) NOT NULL,
  
  -- Stripe details
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  
  -- Status
  status purchase_status DEFAULT 'pending'::purchase_status NOT NULL,
  
  -- Metadata
  purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  refunded_at TIMESTAMPTZ,
  
  CONSTRAINT amount_positive CHECK (amount > 0),
  CONSTRAINT unique_user_itinerary UNIQUE(user_id, itinerary_id)
);

CREATE INDEX purchases_user_idx ON purchases(user_id);
CREATE INDEX purchases_itinerary_idx ON purchases(itinerary_id);
CREATE INDEX purchases_status_idx ON purchases(status);
CREATE INDEX purchases_purchased_at_idx ON purchases(purchased_at DESC);

-- =============================================
-- MEDIA TABLE
-- =============================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  
  -- File info
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  media_type media_type NOT NULL,
  
  -- Media metadata
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER, -- for video/audio
  thumbnail_url TEXT,
  
  -- CDN/Storage
  storage_bucket TEXT DEFAULT 'media',
  public_url TEXT,
  
  -- Metadata
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT file_size_positive CHECK (file_size > 0)
);

CREATE INDEX media_owner_idx ON media(owner_id);
CREATE INDEX media_itinerary_idx ON media(itinerary_id);
CREATE INDEX media_type_idx ON media(media_type);
CREATE INDEX media_uploaded_at_idx ON media(uploaded_at DESC);
