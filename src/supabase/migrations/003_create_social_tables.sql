-- =============================================
-- LIKES TABLE
-- =============================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT unique_user_like UNIQUE(user_id, itinerary_id)
);

CREATE INDEX likes_user_idx ON likes(user_id);
CREATE INDEX likes_itinerary_idx ON likes(itinerary_id);
CREATE INDEX likes_created_at_idx ON likes(created_at DESC);

-- =============================================
-- SAVES TABLE
-- =============================================
CREATE TABLE saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT unique_user_save UNIQUE(user_id, itinerary_id)
);

CREATE INDEX saves_user_idx ON saves(user_id);
CREATE INDEX saves_itinerary_idx ON saves(itinerary_id);
CREATE INDEX saves_created_at_idx ON saves(created_at DESC);

-- =============================================
-- COMMENTS TABLE
-- =============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  
  -- Stats
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

CREATE INDEX comments_itinerary_idx ON comments(itinerary_id);
CREATE INDEX comments_user_idx ON comments(user_id);
CREATE INDEX comments_parent_idx ON comments(parent_comment_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);

-- =============================================
-- FOLLOWS TABLE
-- =============================================
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  CONSTRAINT no_self_follow CHECK (follower_id != following_id),
  CONSTRAINT unique_follow UNIQUE(follower_id, following_id)
);

CREATE INDEX follows_follower_idx ON follows(follower_id);
CREATE INDEX follows_following_idx ON follows(following_id);
CREATE INDEX follows_created_at_idx ON follows(created_at DESC);

-- =============================================
-- ACTIVITIES TABLE (for feed and analytics)
-- =============================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  
  -- Additional metadata (JSON for flexibility)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX activities_user_idx ON activities(user_id);
CREATE INDEX activities_itinerary_idx ON activities(itinerary_id);
CREATE INDEX activities_type_idx ON activities(activity_type);
CREATE INDEX activities_created_at_idx ON activities(created_at DESC);

-- Composite index for feed queries
CREATE INDEX activities_user_created_idx ON activities(user_id, created_at DESC);
