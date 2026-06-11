-- ============================================================
-- INAMAAD v3.0 — Full Database Schema
-- Engine: PostgreSQL (Supabase)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('investor', 'landowner', 'developer', 'agent', 'admin');
CREATE TYPE verification_level AS ENUM ('unverified', 'verified', 'premium_verified', 'institutional_verified');
CREATE TYPE listing_type AS ENUM ('residential', 'commercial', 'land', 'joint_venture');
CREATE TYPE listing_status AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'archived');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE deal_stage AS ENUM (
  'new_lead',
  'contact_established',
  'discussion',
  'negotiation',
  'due_diligence',
  'agreement',
  'closed'
);
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');
CREATE TYPE report_target AS ENUM ('listing', 'user', 'message');
CREATE TYPE document_type AS ENUM (
  'certificate_of_occupancy',
  'right_of_occupancy',
  'survey_plan',
  'deed_of_assignment',
  'building_approval',
  'development_permit',
  'jv_summary',
  'ownership_document'
);
CREATE TYPE notification_type AS ENUM (
  'message',
  'listing_update',
  'verification_update',
  'saved_listing_change',
  'system',
  'deal_update'
);
CREATE TYPE land_use_type AS ENUM ('residential', 'commercial', 'agricultural', 'mixed_use', 'industrial');
CREATE TYPE title_type AS ENUM ('c_of_o', 'r_of_o', 'gazette', 'deed', 'other');
CREATE TYPE occupancy_status AS ENUM ('vacant', 'partially_occupied', 'fully_occupied');

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE profiles (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name          TEXT NOT NULL,
  company_name       TEXT,
  email              TEXT NOT NULL,
  phone              TEXT,
  profile_image      TEXT,
  bio                TEXT,
  role               user_role NOT NULL DEFAULT 'investor',
  verification_level verification_level NOT NULL DEFAULT 'unverified',
  is_verified        BOOLEAN NOT NULL DEFAULT FALSE,
  is_suspended       BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_verified ON profiles(is_verified);

-- ============================================================
-- LISTINGS
-- ============================================================

CREATE TABLE listings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id            UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  listing_type        listing_type NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT,
  price               NUMERIC(18,2),
  currency            TEXT NOT NULL DEFAULT 'NGN',
  country             TEXT NOT NULL DEFAULT 'Nigeria',
  state               TEXT NOT NULL,
  city                TEXT NOT NULL,
  address             TEXT,
  status              listing_status NOT NULL DEFAULT 'pending_review',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  featured            BOOLEAN NOT NULL DEFAULT FALSE,
  view_count          INTEGER NOT NULL DEFAULT 0,
  save_count          INTEGER NOT NULL DEFAULT 0,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listings_owner_id ON listings(owner_id);
CREATE INDEX idx_listings_type ON listings(listing_type);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_state ON listings(state);
CREATE INDEX idx_listings_featured ON listings(featured);
CREATE INDEX idx_listings_deleted_at ON listings(deleted_at);

-- ============================================================
-- RESIDENTIAL DETAILS
-- ============================================================

CREATE TABLE residential_details (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id     UUID NOT NULL UNIQUE REFERENCES listings(id) ON DELETE CASCADE,
  bedrooms       INTEGER,
  bathrooms      INTEGER,
  parking_spaces INTEGER,
  floor_area     NUMERIC(10,2),
  amenities      TEXT[],
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMMERCIAL DETAILS
-- ============================================================

CREATE TABLE commercial_details (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id       UUID NOT NULL UNIQUE REFERENCES listings(id) ON DELETE CASCADE,
  building_area    NUMERIC(10,2),
  land_area        NUMERIC(10,2),
  occupancy_status occupancy_status,
  property_class   TEXT,
  floors           INTEGER,
  amenities        TEXT[],
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LAND DETAILS
-- ============================================================

CREATE TABLE land_details (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id           UUID NOT NULL UNIQUE REFERENCES listings(id) ON DELETE CASCADE,
  land_size            NUMERIC(10,2),
  land_use_type        land_use_type,
  title_type           title_type,
  infrastructure_access TEXT[],
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- JV OPPORTUNITIES
-- ============================================================

CREATE TABLE jv_opportunities (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id              UUID NOT NULL UNIQUE REFERENCES listings(id) ON DELETE CASCADE,
  project_value           NUMERIC(18,2),
  capital_requirement     NUMERIC(18,2),
  equity_structure        TEXT,
  revenue_share_structure TEXT,
  development_potential   TEXT,
  timeline                TEXT,
  exit_strategy           TEXT,
  risk_summary            TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LISTING IMAGES (max 30)
-- ============================================================

CREATE TABLE listing_images (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_cover      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT max_images_per_listing CHECK (TRUE) -- enforced via trigger below
);

CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);

-- Trigger: max 30 images per listing
CREATE OR REPLACE FUNCTION check_max_images()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM listing_images WHERE listing_id = NEW.listing_id) >= 30 THEN
    RAISE EXCEPTION 'Maximum of 30 images allowed per listing';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_images
BEFORE INSERT ON listing_images
FOR EACH ROW EXECUTE FUNCTION check_max_images();

-- ============================================================
-- LISTING VIDEOS (max 3)
-- ============================================================

CREATE TABLE listing_videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  video_url     TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listing_videos_listing_id ON listing_videos(listing_id);

CREATE OR REPLACE FUNCTION check_max_videos()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM listing_videos WHERE listing_id = NEW.listing_id) >= 3 THEN
    RAISE EXCEPTION 'Maximum of 3 videos allowed per listing';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_videos
BEFORE INSERT ON listing_videos
FOR EACH ROW EXECUTE FUNCTION check_max_videos();

-- ============================================================
-- PROPERTY DOCUMENTS
-- ============================================================

CREATE TABLE property_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  document_url  TEXT NOT NULL,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at    TIMESTAMPTZ,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_documents_listing_id ON property_documents(listing_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id      UUID REFERENCES listings(id) ON DELETE SET NULL,
  participant_one UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_two UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message    TEXT,
  last_message_at TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT no_self_conversation CHECK (participant_one <> participant_two),
  CONSTRAINT unique_conversation UNIQUE (listing_id, participant_one, participant_two)
);

CREATE INDEX idx_conversations_participant_one ON conversations(participant_one);
CREATE INDEX idx_conversations_participant_two ON conversations(participant_two);
CREATE INDEX idx_conversations_listing_id ON conversations(listing_id);

-- ============================================================
-- MESSAGES
-- ============================================================

CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Update conversation last_message on insert
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message = NEW.message,
      last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_insert
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       notification_type NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================
-- SAVED LISTINGS
-- ============================================================

CREATE TABLE saved_listings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_saved_listing UNIQUE (user_id, listing_id)
);

CREATE INDEX idx_saved_listings_user_id ON saved_listings(user_id);

-- Update save_count on listings when saved/unsaved
CREATE OR REPLACE FUNCTION update_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE listings SET save_count = save_count + 1 WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE listings SET save_count = GREATEST(save_count - 1, 0) WHERE id = OLD.listing_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_saved_listing_change
AFTER INSERT OR DELETE ON saved_listings
FOR EACH ROW EXECUTE FUNCTION update_save_count();

-- ============================================================
-- VERIFICATION REQUESTS
-- ============================================================

CREATE TABLE verification_requests (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status               verification_status NOT NULL DEFAULT 'pending',
  submitted_documents  TEXT[],
  review_notes         TEXT,
  reviewed_by          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  deleted_at           TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_requests_user_id ON verification_requests(user_id);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);

-- ============================================================
-- DEAL PIPELINE
-- ============================================================

CREATE TABLE deal_pipeline (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  investor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stage       deal_stage NOT NULL DEFAULT 'new_lead',
  notes       TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_deal UNIQUE (listing_id, investor_id)
);

CREATE INDEX idx_deal_pipeline_listing_id ON deal_pipeline(listing_id);
CREATE INDEX idx_deal_pipeline_investor_id ON deal_pipeline(investor_id);
CREATE INDEX idx_deal_pipeline_stage ON deal_pipeline(stage);

-- ============================================================
-- REPORTS
-- ============================================================

CREATE TABLE reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type report_target NOT NULL,
  target_id   UUID NOT NULL,
  reason      TEXT NOT NULL,
  status      report_status NOT NULL DEFAULT 'pending',
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_target_id ON reports(target_id);
CREATE INDEX idx_reports_status ON reports(status);

-- ============================================================
-- ACTIVITY LOGS (audit)
-- ============================================================

CREATE TABLE activity_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  metadata   JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_listings BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_residential BEFORE UPDATE ON residential_details FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_commercial BEFORE UPDATE ON commercial_details FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_land BEFORE UPDATE ON land_details FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_jv BEFORE UPDATE ON jv_opportunities FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_verification BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at_deal BEFORE UPDATE ON deal_pipeline FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'investor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
