// ============================================================
// INAMAAD v3.0 — TypeScript Types
// Auto-maps to Supabase schema
// ============================================================

export type UserRole = 'investor' | 'landowner' | 'developer' | 'agent' | 'admin'
export type VerificationLevel = 'unverified' | 'verified' | 'premium_verified' | 'institutional_verified'
export type ListingType = 'residential' | 'commercial' | 'land' | 'joint_venture'
export type ListingStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived'
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'
export type DealStage =
  | 'new_lead'
  | 'contact_established'
  | 'discussion'
  | 'negotiation'
  | 'due_diligence'
  | 'agreement'
  | 'closed'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'
export type ReportTarget = 'listing' | 'user' | 'message'
export type DocumentType =
  | 'certificate_of_occupancy'
  | 'right_of_occupancy'
  | 'survey_plan'
  | 'deed_of_assignment'
  | 'building_approval'
  | 'development_permit'
  | 'jv_summary'
  | 'ownership_document'
export type NotificationType =
  | 'message'
  | 'listing_update'
  | 'verification_update'
  | 'saved_listing_change'
  | 'system'
  | 'deal_update'
export type LandUseType = 'residential' | 'commercial' | 'agricultural' | 'mixed_use' | 'industrial'
export type TitleType = 'c_of_o' | 'r_of_o' | 'gazette' | 'deed' | 'other'
export type OccupancyStatus = 'vacant' | 'partially_occupied' | 'fully_occupied'

// ============================================================
// DATABASE MODELS
// ============================================================

export interface Profile {
  id: string
  user_id: string
  full_name: string
  company_name: string | null
  email: string
  phone: string | null
  profile_image: string | null
  bio: string | null
  role: UserRole
  verification_level: VerificationLevel
  is_verified: boolean
  is_suspended: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  owner_id: string
  listing_type: ListingType
  title: string
  description: string | null
  price: number | null
  currency: string
  country: string
  state: string
  city: string
  address: string | null
  status: ListingStatus
  verification_status: VerificationStatus
  featured: boolean
  view_count: number
  save_count: number
  deleted_at: string | null
  created_at: string
  updated_at: string
  // Joined
  owner?: Profile
  images?: ListingImage[]
  videos?: ListingVideo[]
  documents?: PropertyDocument[]
  residential_details?: ResidentialDetails
  commercial_details?: CommercialDetails
  land_details?: LandDetails
  jv_opportunity?: JvOpportunity
}

export interface ResidentialDetails {
  id: string
  listing_id: string
  bedrooms: number | null
  bathrooms: number | null
  parking_spaces: number | null
  floor_area: number | null
  amenities: string[] | null
  created_at: string
  updated_at: string
}

export interface CommercialDetails {
  id: string
  listing_id: string
  building_area: number | null
  land_area: number | null
  occupancy_status: OccupancyStatus | null
  property_class: string | null
  floors: number | null
  amenities: string[] | null
  created_at: string
  updated_at: string
}

export interface LandDetails {
  id: string
  listing_id: string
  land_size: number | null
  land_use_type: LandUseType | null
  title_type: TitleType | null
  infrastructure_access: string[] | null
  created_at: string
  updated_at: string
}

export interface JvOpportunity {
  id: string
  listing_id: string
  project_value: number | null
  capital_requirement: number | null
  equity_structure: string | null
  revenue_share_structure: string | null
  development_potential: string | null
  timeline: string | null
  exit_strategy: string | null
  risk_summary: string | null
  created_at: string
  updated_at: string
}

export interface ListingImage {
  id: string
  listing_id: string
  image_url: string
  display_order: number
  is_cover: boolean
  created_at: string
}

export interface ListingVideo {
  id: string
  listing_id: string
  video_url: string
  thumbnail_url: string | null
  created_at: string
}

export interface PropertyDocument {
  id: string
  listing_id: string
  document_type: DocumentType
  document_url: string
  verified: boolean
  deleted_at: string | null
  uploaded_at: string
}

export interface Conversation {
  id: string
  listing_id: string | null
  participant_one: string
  participant_two: string
  last_message: string | null
  last_message_at: string | null
  deleted_at: string | null
  created_at: string
  // Joined
  listing?: Pick<Listing, 'id' | 'title' | 'listing_type'>
  other_participant?: Profile
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  message: string
  is_read: boolean
  deleted_at: string | null
  created_at: string
  sender?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  is_read: boolean
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface SavedListing {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listing?: Listing
}

export interface VerificationRequest {
  id: string
  user_id: string
  status: VerificationStatus
  submitted_documents: string[] | null
  review_notes: string | null
  reviewed_by: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  user?: Profile
  reviewer?: Profile
}

export interface DealPipeline {
  id: string
  listing_id: string
  investor_id: string
  stage: DealStage
  notes: string | null
  updated_at: string
  created_at: string
  listing?: Pick<Listing, 'id' | 'title' | 'listing_type' | 'price' | 'currency'>
  investor?: Profile
}

export interface Report {
  id: string
  reporter_id: string
  target_type: ReportTarget
  target_id: string
  reason: string
  status: ReportStatus
  deleted_at: string | null
  created_at: string
  reporter?: Profile
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  user?: Pick<Profile, 'id' | 'full_name' | 'email'>
}

// ============================================================
// FORM / INPUT TYPES
// ============================================================

export interface CreateListingInput {
  listing_type: ListingType
  title: string
  description?: string
  price?: number
  currency?: string
  country?: string
  state: string
  city: string
  address?: string
}

export interface CreateJvInput extends CreateListingInput {
  project_value?: number
  capital_requirement?: number
  equity_structure?: string
  revenue_share_structure?: string
  development_potential?: string
  timeline?: string
  exit_strategy?: string
  risk_summary?: string
}

export interface SearchFilters {
  keyword?: string
  state?: string
  city?: string
  listing_type?: ListingType
  min_price?: number
  max_price?: number
  verification_status?: VerificationStatus
  featured?: boolean
  sort_by?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'most_viewed' | 'most_saved'
}

// ============================================================
// SUPABASE DATABASE TYPE (for createClient generic)
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Profile> }
      listings: { Row: Listing; Insert: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'save_count'>; Update: Partial<Listing> }
      conversations: { Row: Conversation; Insert: Omit<Conversation, 'id' | 'created_at'>; Update: Partial<Conversation> }
      messages: { Row: Message; Insert: Omit<Message, 'id' | 'created_at'>; Update: Partial<Message> }
      notifications: { Row: Notification; Insert: Omit<Notification, 'id' | 'created_at'>; Update: Partial<Notification> }
      saved_listings: { Row: SavedListing; Insert: Omit<SavedListing, 'id' | 'created_at'>; Update: Partial<SavedListing> }
      deal_pipeline: { Row: DealPipeline; Insert: Omit<DealPipeline, 'id' | 'created_at' | 'updated_at'>; Update: Partial<DealPipeline> }
      reports: { Row: Report; Insert: Omit<Report, 'id' | 'created_at'>; Update: Partial<Report> }
      activity_logs: { Row: ActivityLog; Insert: Omit<ActivityLog, 'id' | 'created_at'>; Update: never }
    }
  }
}
