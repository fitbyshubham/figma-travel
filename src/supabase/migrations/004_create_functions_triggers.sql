-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER creators_updated_at BEFORE UPDATE ON creators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER itineraries_updated_at BEFORE UPDATE ON itineraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- COUNTER CACHE FUNCTIONS
-- =============================================

-- Update itinerary likes count
CREATE OR REPLACE FUNCTION update_itinerary_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE itineraries 
    SET likes_count = likes_count + 1 
    WHERE id = NEW.itinerary_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE itineraries 
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.itinerary_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_count_trigger
  AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION update_itinerary_likes_count();

-- Update itinerary saves count
CREATE OR REPLACE FUNCTION update_itinerary_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE itineraries 
    SET saves_count = saves_count + 1 
    WHERE id = NEW.itinerary_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE itineraries 
    SET saves_count = GREATEST(0, saves_count - 1)
    WHERE id = OLD.itinerary_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saves_count_trigger
  AFTER INSERT OR DELETE ON saves
  FOR EACH ROW EXECUTE FUNCTION update_itinerary_saves_count();

-- Update itinerary comments count
CREATE OR REPLACE FUNCTION update_itinerary_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_deleted = false THEN
    UPDATE itineraries 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.itinerary_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.is_deleted != OLD.is_deleted THEN
    UPDATE itineraries 
    SET comments_count = comments_count + (CASE WHEN NEW.is_deleted THEN -1 ELSE 1 END)
    WHERE id = NEW.itinerary_id;
  ELSIF TG_OP = 'DELETE' AND OLD.is_deleted = false THEN
    UPDATE itineraries 
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.itinerary_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_itinerary_comments_count();

-- Update follower/following counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER follow_counts_trigger
  AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Update profile itineraries count
CREATE OR REPLACE FUNCTION update_profile_itineraries_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE profiles 
    SET itineraries_count = itineraries_count + 1 
    WHERE id = NEW.creator_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
    IF NEW.status = 'published' AND OLD.status != 'published' THEN
      UPDATE profiles 
      SET itineraries_count = itineraries_count + 1 
      WHERE id = NEW.creator_id;
    ELSIF OLD.status = 'published' AND NEW.status != 'published' THEN
      UPDATE profiles 
      SET itineraries_count = GREATEST(0, itineraries_count - 1)
      WHERE id = NEW.creator_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    UPDATE profiles 
    SET itineraries_count = GREATEST(0, itineraries_count - 1)
    WHERE id = OLD.creator_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER itineraries_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON itineraries
  FOR EACH ROW EXECUTE FUNCTION update_profile_itineraries_count();

-- Update purchases count
CREATE OR REPLACE FUNCTION update_purchases_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE itineraries 
    SET purchases_count = purchases_count + 1 
    WHERE id = NEW.itinerary_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      UPDATE itineraries 
      SET purchases_count = purchases_count + 1 
      WHERE id = NEW.itinerary_id;
    ELSIF OLD.status = 'completed' AND NEW.status != 'completed' THEN
      UPDATE itineraries 
      SET purchases_count = GREATEST(0, purchases_count - 1)
      WHERE id = NEW.itinerary_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchases_count_trigger
  AFTER INSERT OR UPDATE ON purchases
  FOR EACH ROW EXECUTE FUNCTION update_purchases_count();

-- =============================================
-- HELPER FUNCTIONS FOR QUERIES
-- =============================================

-- Get personalized feed (following + trending)
CREATE OR REPLACE FUNCTION get_personalized_feed(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  cover_image_url TEXT,
  video_url TEXT,
  creator_id UUID,
  creator_name TEXT,
  creator_avatar TEXT,
  likes_count INTEGER,
  saves_count INTEGER,
  price DECIMAL,
  is_liked BOOLEAN,
  is_saved BOOLEAN,
  published_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.description,
    i.cover_image_url,
    i.video_url,
    i.creator_id,
    p.full_name as creator_name,
    p.avatar_url as creator_avatar,
    i.likes_count,
    i.saves_count,
    i.price,
    EXISTS(SELECT 1 FROM likes l WHERE l.itinerary_id = i.id AND l.user_id = p_user_id) as is_liked,
    EXISTS(SELECT 1 FROM saves s WHERE s.itinerary_id = i.id AND s.user_id = p_user_id) as is_saved,
    i.published_at
  FROM itineraries i
  JOIN profiles p ON i.creator_id = p.id
  WHERE i.status = 'published'
    AND (
      -- Following creators
      EXISTS(SELECT 1 FROM follows f WHERE f.follower_id = p_user_id AND f.following_id = i.creator_id)
      -- OR trending (high engagement in last 7 days)
      OR (i.published_at >= NOW() - INTERVAL '7 days' AND i.likes_count + i.saves_count > 10)
    )
  ORDER BY i.published_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Search itineraries with full-text and semantic search
CREATE OR REPLACE FUNCTION search_itineraries(
  p_query TEXT,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  location TEXT,
  cover_image_url TEXT,
  price DECIMAL,
  likes_count INTEGER,
  saves_count INTEGER,
  creator_name TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.description,
    i.location,
    i.cover_image_url,
    i.price,
    i.likes_count,
    i.saves_count,
    p.full_name as creator_name,
    ts_rank(i.search_vector, websearch_to_tsquery('english', p_query)) as rank
  FROM itineraries i
  JOIN profiles p ON i.creator_id = p.id
  WHERE i.status = 'published'
    AND i.search_vector @@ websearch_to_tsquery('english', p_query)
  ORDER BY rank DESC, i.likes_count DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
