-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- =============================================
-- CREATORS POLICIES
-- =============================================

-- Anyone can view creator profiles
CREATE POLICY "Creator profiles are viewable by everyone"
  ON creators FOR SELECT
  USING (true);

-- Only the creator can update their creator profile
CREATE POLICY "Creators can update their own profile"
  ON creators FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- ITINERARIES POLICIES
-- =============================================

-- Published itineraries are viewable by everyone
CREATE POLICY "Published itineraries are viewable by everyone"
  ON itineraries FOR SELECT
  USING (status = 'published' OR creator_id = auth.uid());

-- Creators can insert their own itineraries
CREATE POLICY "Creators can insert their own itineraries"
  ON itineraries FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own itineraries
CREATE POLICY "Creators can update their own itineraries"
  ON itineraries FOR UPDATE
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Creators can delete their own itineraries
CREATE POLICY "Creators can delete their own itineraries"
  ON itineraries FOR DELETE
  USING (auth.uid() = creator_id);

-- =============================================
-- ITINERARY STOPS POLICIES
-- =============================================

-- Stops are viewable if the itinerary is published or user is creator
CREATE POLICY "Itinerary stops are viewable based on itinerary access"
  ON itinerary_stops FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_stops.itinerary_id 
      AND (itineraries.status = 'published' OR itineraries.creator_id = auth.uid())
    )
  );

-- Creators can manage stops for their itineraries
CREATE POLICY "Creators can manage their itinerary stops"
  ON itinerary_stops FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = itinerary_stops.itinerary_id 
      AND itineraries.creator_id = auth.uid()
    )
  );

-- =============================================
-- ITINERARY EMBEDDINGS POLICIES
-- =============================================

-- Embeddings are viewable by everyone (for search)
CREATE POLICY "Embeddings are viewable by everyone"
  ON itinerary_embeddings FOR SELECT
  USING (true);

-- Only service role can manage embeddings (via Edge Functions)
CREATE POLICY "Service role can manage embeddings"
  ON itinerary_embeddings FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =============================================
-- PURCHASES POLICIES
-- =============================================

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Creators can view purchases of their itineraries
CREATE POLICY "Creators can view purchases of their itineraries"
  ON purchases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM itineraries 
      WHERE itineraries.id = purchases.itinerary_id 
      AND itineraries.creator_id = auth.uid()
    )
  );

-- Only service role can insert/update purchases (via Edge Functions)
CREATE POLICY "Service role can manage purchases"
  ON purchases FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =============================================
-- MEDIA POLICIES
-- =============================================

-- Media is viewable by everyone
CREATE POLICY "Media is viewable by everyone"
  ON media FOR SELECT
  USING (true);

-- Users can insert their own media
CREATE POLICY "Users can insert their own media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update their own media
CREATE POLICY "Users can update their own media"
  ON media FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Users can delete their own media
CREATE POLICY "Users can delete their own media"
  ON media FOR DELETE
  USING (auth.uid() = owner_id);

-- =============================================
-- LIKES POLICIES
-- =============================================

-- Likes are viewable by everyone
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

-- Users can insert their own likes
CREATE POLICY "Users can insert their own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- SAVES POLICIES
-- =============================================

-- Users can view their own saves
CREATE POLICY "Users can view their own saves"
  ON saves FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saves
CREATE POLICY "Users can insert their own saves"
  ON saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saves
CREATE POLICY "Users can delete their own saves"
  ON saves FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- COMMENTS POLICIES
-- =============================================

-- Comments are viewable by everyone
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- FOLLOWS POLICIES
-- =============================================

-- Follows are viewable by everyone
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

-- Users can follow others
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- =============================================
-- ACTIVITIES POLICIES
-- =============================================

-- Users can view their own activities
CREATE POLICY "Users can view their own activities"
  ON activities FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can insert their own activities"
  ON activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);
