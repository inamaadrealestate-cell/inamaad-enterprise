-- ============================================================
-- INAMAAD v3.0 — Row Level Security Policies
-- Run AFTER 001_schema.sql
-- ============================================================

-- Enable RLS on every table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE residential_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE commercial_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE jv_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get current user's profile id
CREATE OR REPLACE FUNCTION auth_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Check if current user owns a listing
CREATE OR REPLACE FUNCTION owns_listing(listing_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM listings
    WHERE id = listing_uuid AND owner_id = auth_profile_id()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Anyone can view non-suspended, non-deleted profiles
CREATE POLICY "Public profiles are viewable" ON profiles
  FOR SELECT USING (deleted_at IS NULL AND is_suspended = FALSE);

-- Users can view their own profile regardless
CREATE POLICY "Users view own profile" ON profiles
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can update any profile
CREATE POLICY "Admins update any profile" ON profiles
  FOR UPDATE USING (is_admin());

-- System inserts via trigger (SECURITY DEFINER)
CREATE POLICY "System inserts profiles" ON profiles
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- LISTINGS POLICIES
-- ============================================================

-- Public can see approved, non-deleted listings
CREATE POLICY "Public view approved listings" ON listings
  FOR SELECT USING (
    status = 'approved'
    AND deleted_at IS NULL
  );

-- Owners see their own listings regardless of status
CREATE POLICY "Owners view own listings" ON listings
  FOR SELECT USING (owner_id = auth_profile_id());

-- Admins see all listings
CREATE POLICY "Admins view all listings" ON listings
  FOR SELECT USING (is_admin());

-- Owners, developers, agents, landowners can create listings
CREATE POLICY "Authorized roles create listings" ON listings
  FOR INSERT WITH CHECK (
    owner_id = auth_profile_id()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth_profile_id()
      AND role IN ('developer', 'agent', 'landowner', 'admin')
    )
  );

-- Owners can update their own listings
CREATE POLICY "Owners update own listings" ON listings
  FOR UPDATE USING (owner_id = auth_profile_id())
  WITH CHECK (owner_id = auth_profile_id());

-- Admins can update any listing
CREATE POLICY "Admins update any listing" ON listings
  FOR UPDATE USING (is_admin());

-- Soft delete: owners can set deleted_at on own listings
CREATE POLICY "Owners soft delete own listings" ON listings
  FOR UPDATE USING (
    owner_id = auth_profile_id()
    AND deleted_at IS NULL
  );

-- ============================================================
-- LISTING DETAIL TABLES (residential, commercial, land, jv)
-- ============================================================

-- Residential details — same visibility as parent listing
CREATE POLICY "View residential details" ON residential_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND (l.status = 'approved' OR l.owner_id = auth_profile_id() OR is_admin())
      AND l.deleted_at IS NULL
    )
  );
CREATE POLICY "Manage residential details" ON residential_details
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

CREATE POLICY "View commercial details" ON commercial_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND (l.status = 'approved' OR l.owner_id = auth_profile_id() OR is_admin())
      AND l.deleted_at IS NULL
    )
  );
CREATE POLICY "Manage commercial details" ON commercial_details
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

CREATE POLICY "View land details" ON land_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND (l.status = 'approved' OR l.owner_id = auth_profile_id() OR is_admin())
      AND l.deleted_at IS NULL
    )
  );
CREATE POLICY "Manage land details" ON land_details
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

CREATE POLICY "View jv opportunities" ON jv_opportunities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND (l.status = 'approved' OR l.owner_id = auth_profile_id() OR is_admin())
      AND l.deleted_at IS NULL
    )
  );
CREATE POLICY "Manage jv opportunities" ON jv_opportunities
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

-- ============================================================
-- LISTING IMAGES & VIDEOS
-- ============================================================

CREATE POLICY "View listing images" ON listing_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND (l.status = 'approved' OR l.owner_id = auth_profile_id() OR is_admin())
    )
  );
CREATE POLICY "Manage listing images" ON listing_images
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

CREATE POLICY "View listing videos" ON listing_videos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings l
      WHERE l.id = listing_id
      AND (l.status = 'approved' OR l.owner_id = auth_profile_id() OR is_admin())
    )
  );
CREATE POLICY "Manage listing videos" ON listing_videos
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

-- ============================================================
-- PROPERTY DOCUMENTS (restricted access)
-- ============================================================

-- Admins see all
CREATE POLICY "Admins view all documents" ON property_documents
  FOR SELECT USING (is_admin());

-- Owners see their own listing's documents
CREATE POLICY "Owners view own documents" ON property_documents
  FOR SELECT USING (owns_listing(listing_id) AND deleted_at IS NULL);

-- Verified investors can view non-deed documents on approved listings
CREATE POLICY "Verified investors view documents" ON property_documents
  FOR SELECT USING (
    document_type != 'deed_of_assignment'
    AND deleted_at IS NULL
    AND EXISTS (
      SELECT 1 FROM listings l WHERE l.id = listing_id AND l.status = 'approved'
    )
    AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth_profile_id()
      AND p.role = 'investor'
      AND p.is_verified = TRUE
    )
  );

-- Owners manage their own listing documents
CREATE POLICY "Owners manage documents" ON property_documents
  FOR ALL USING (owns_listing(listing_id) OR is_admin());

-- ============================================================
-- CONVERSATIONS
-- ============================================================

-- Participants see their conversations
CREATE POLICY "Participants view conversations" ON conversations
  FOR SELECT USING (
    (participant_one = auth_profile_id() OR participant_two = auth_profile_id())
    AND deleted_at IS NULL
  );

-- Admins see all
CREATE POLICY "Admins view all conversations" ON conversations
  FOR SELECT USING (is_admin());

-- Any authenticated user can start a conversation
CREATE POLICY "Authenticated users create conversations" ON conversations
  FOR INSERT WITH CHECK (
    (participant_one = auth_profile_id() OR participant_two = auth_profile_id())
    AND auth.uid() IS NOT NULL
  );

-- Participants can update (e.g. last_message via trigger)
CREATE POLICY "System updates conversations" ON conversations
  FOR UPDATE USING (TRUE);

-- ============================================================
-- MESSAGES
-- ============================================================

CREATE POLICY "Participants view messages" ON messages
  FOR SELECT USING (
    (sender_id = auth_profile_id() OR receiver_id = auth_profile_id())
    AND deleted_at IS NULL
  );

CREATE POLICY "Admins view all messages" ON messages
  FOR SELECT USING (is_admin());

CREATE POLICY "Participants send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth_profile_id()
    AND EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = auth_profile_id() OR c.participant_two = auth_profile_id())
    )
  );

-- Mark as read: receiver can update
CREATE POLICY "Receiver marks messages read" ON messages
  FOR UPDATE USING (receiver_id = auth_profile_id())
  WITH CHECK (receiver_id = auth_profile_id());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (user_id = auth_profile_id());

CREATE POLICY "Admins view all notifications" ON notifications
  FOR SELECT USING (is_admin());

-- System can insert notifications (SECURITY DEFINER functions)
CREATE POLICY "System inserts notifications" ON notifications
  FOR INSERT WITH CHECK (TRUE);

-- Users can mark their notifications as read
CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth_profile_id())
  WITH CHECK (user_id = auth_profile_id());

-- ============================================================
-- SAVED LISTINGS
-- ============================================================

CREATE POLICY "Users view own saved listings" ON saved_listings
  FOR SELECT USING (user_id = auth_profile_id());

CREATE POLICY "Users save listings" ON saved_listings
  FOR INSERT WITH CHECK (user_id = auth_profile_id() AND auth.uid() IS NOT NULL);

CREATE POLICY "Users remove saved listings" ON saved_listings
  FOR DELETE USING (user_id = auth_profile_id());

-- ============================================================
-- VERIFICATION REQUESTS
-- ============================================================

CREATE POLICY "Users view own verification requests" ON verification_requests
  FOR SELECT USING (user_id = auth_profile_id() AND deleted_at IS NULL);

CREATE POLICY "Admins view all verification requests" ON verification_requests
  FOR SELECT USING (is_admin());

CREATE POLICY "Users submit verification requests" ON verification_requests
  FOR INSERT WITH CHECK (user_id = auth_profile_id() AND auth.uid() IS NOT NULL);

-- Admins update (review, approve, reject)
CREATE POLICY "Admins update verification requests" ON verification_requests
  FOR UPDATE USING (is_admin());

-- ============================================================
-- DEAL PIPELINE
-- ============================================================

-- Investors see their own pipeline
CREATE POLICY "Investors view own pipeline" ON deal_pipeline
  FOR SELECT USING (investor_id = auth_profile_id());

-- Listing owners see pipeline for their listings
CREATE POLICY "Owners view pipeline for their listings" ON deal_pipeline
  FOR SELECT USING (owns_listing(listing_id));

-- Admins see all
CREATE POLICY "Admins view all pipeline" ON deal_pipeline
  FOR SELECT USING (is_admin());

-- Investors create pipeline entries
CREATE POLICY "Investors create pipeline" ON deal_pipeline
  FOR INSERT WITH CHECK (
    investor_id = auth_profile_id()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth_profile_id() AND role = 'investor'
    )
  );

-- Investors and admins update stage
CREATE POLICY "Update pipeline stage" ON deal_pipeline
  FOR UPDATE USING (investor_id = auth_profile_id() OR is_admin());

-- ============================================================
-- REPORTS
-- ============================================================

CREATE POLICY "Users submit reports" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth_profile_id() AND auth.uid() IS NOT NULL);

CREATE POLICY "Users view own reports" ON reports
  FOR SELECT USING (reporter_id = auth_profile_id() AND deleted_at IS NULL);

CREATE POLICY "Admins manage reports" ON reports
  FOR ALL USING (is_admin());

-- ============================================================
-- ACTIVITY LOGS (audit — read only for admins)
-- ============================================================

CREATE POLICY "Admins view activity logs" ON activity_logs
  FOR SELECT USING (is_admin());

-- System inserts logs (via SECURITY DEFINER functions)
CREATE POLICY "System inserts logs" ON activity_logs
  FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- STORAGE BUCKET POLICIES (run in Supabase dashboard or via API)
-- ============================================================

-- NOTE: Apply these in Supabase Storage settings or via SQL:
--
-- Bucket: profile-images
--   SELECT: authenticated users can view
--   INSERT: owner can upload to their own folder (user_id/*)
--   DELETE: owner of the file
--
-- Bucket: listing-images
--   SELECT: public (images are public on approved listings)
--   INSERT: listing owner can upload (listing_id/*)
--   DELETE: listing owner or admin
--
-- Bucket: listing-videos
--   SELECT: public
--   INSERT: listing owner
--   DELETE: listing owner or admin
--
-- Bucket: property-documents
--   SELECT: listing owner + verified investors + admin only
--   INSERT: listing owner
--   DELETE: listing owner or admin
--
-- Bucket: verification-documents
--   SELECT: submitting user + admin only
--   INSERT: authenticated user
--   DELETE: admin only
--
-- Bucket: system-assets
--   SELECT: public
--   INSERT/DELETE: admin only
