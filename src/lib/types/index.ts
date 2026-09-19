// Trimorva Core Domain Types

export type UserRole = 'customer' | 'salon_owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface SalonOpeningHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

export interface Salon {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  logo_url: string;
  cover_image_url: string;
  address: string;
  city: string;
  contact_phone: string;
  contact_email: string;
  instagram_url?: string;
  website_url?: string;
  opening_hours: SalonOpeningHours;
  rating: number;
  review_count: number;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Service {
  id: string;
  salon_id: string;
  name: string;
  description: string;
  category: 'Haircut' | 'Coloring' | 'Styling' | 'Hair Spa' | 'Beard & Grooming' | 'Treatment' | 'Facial & Skin Care' | 'Massage & Relaxation' | 'Hand & Foot Care' | 'Beauty Treatments' | 'Bridal & Special Care' | string;
  department?: 'salon' | 'spa';
  price: number;
  duration_minutes: number;
  is_active: boolean;
  image_url?: string;
  benefits?: string[];
  preparation?: string;
  aftercare?: string;
  created_at: string;
}

export interface Offer {
  id: string;
  salon_id: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  promo_code?: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  reference_code: string; // e.g. TRM-8921
  salon_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_id: string;
  service_name?: string;
  service_price?: number;
  preferred_date: string; // YYYY-MM-DD
  preferred_time: string; // HH:MM
  status: AppointmentStatus;
  notes?: string;
  internal_notes?: string;
  stylescan_reference?: {
    hairstyle_name: string;
    analysis_summary?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface KnowledgeDocument {
  id: string;
  salon_id: string;
  file_name: string;
  file_type: 'pdf' | 'txt' | 'docx' | 'md' | 'faq';
  file_size: number;
  content: string;
  storage_url?: string;
  chunk_count: number;
  processing_status: 'pending' | 'indexed' | 'failed';
  error_message?: string;
  created_at: string;
}

export interface KnowledgeChunk {
  id: string;
  document_id: string;
  salon_id: string;
  content: string;
  embedding?: number[]; // Vector embedding
  metadata: {
    section?: string;
    keywords?: string[];
    source_file: string;
  };
}

export interface ChatSession {
  id: string;
  salon_id: string;
  customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: string[]; // Referenced knowledge chunks
  action_cta?: {
    type: 'book_appointment' | 'view_service' | 'view_offer';
    label: string;
    data?: any;
  };
  created_at: string;
}

export type FaceShape = 'oval' | 'square' | 'round' | 'heart' | 'oblong' | 'diamond' | 'unknown';
export type HairLengthPreference = 'short' | 'medium' | 'long' | 'any';
export type StyleAesthetic = 'professional' | 'casual' | 'trendy' | 'traditional';
export type MaintenanceCommitment = 'low-maintenance' | 'medium' | 'styling-focused';
export type HairTexture = 'straight' | 'wavy' | 'curly' | 'coily' | 'unknown';

export interface StyleScanPreferences {
  length: HairLengthPreference;
  aesthetic: StyleAesthetic;
  maintenance: MaintenanceCommitment;
  texture: HairTexture;
  includeBeard?: boolean;
}

export interface FaceAnalysisResult {
  face_shape_guidance: FaceShape;
  face_shape_confidence: 'approximate' | 'moderate' | 'tentative';
  visible_hair_characteristics: {
    length?: string;
    texture?: string;
    density?: string;
  };
  facial_balance_notes: string;
  disclaimer: string;
}

export interface HairstyleCatalogItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'Short' | 'Medium' | 'Long' | 'Fade' | 'Classic' | 'Textured';
  length: HairLengthPreference;
  maintenance_level: MaintenanceCommitment;
  styling_effort: number; // 1 - 5
  best_suited_face_shapes: FaceShape[];
  aesthetic_vibes: StyleAesthetic[];
  suitable_hair_textures: HairTexture[];
  image_url: string;
  styling_tips: string[];
  maintenance_notes: string;
  recommended_products: string[];
  optional_beard_compatibility?: string;
}

export interface HairstyleRecommendation {
  hairstyle: HairstyleCatalogItem;
  match_score: number; // 0 - 100
  why_it_suits: string;
  styling_effort_text: string;
  recommended_length: string;
  maintenance_advice: string;
}

export interface StyleScanSession {
  id: string;
  user_id?: string;
  created_at: string;
  analysis: FaceAnalysisResult;
  preferences: StyleScanPreferences;
  recommendations: HairstyleRecommendation[];
  consent_given: boolean;
}

export interface SalonReview {
  id: string;
  salon_id: string;
  author_name: string;
  rating: number;
  comment: string;
  date: string;
}

// ---------------------------------------------------------------------------
// Trimora Customer Relationship Management (CRM) Domain Types
// ---------------------------------------------------------------------------

export type CustomerStatus = 'new' | 'active' | 'returning' | 'loyal' | 'vip' | 'inactive' | 'at_risk';

export type CustomerGender = 'male' | 'female' | 'non-binary' | 'other' | 'prefer_not_to_say';

export interface CustomerPreferences {
  preferred_stylist_id?: string;
  preferred_stylist_name?: string;
  preferred_days?: string[];
  preferred_time_slots?: string[];
  favorite_services?: string[];
  hair_type?: string;
  scalp_skin_type?: string;
  allergies?: string[];
  beverage_preference?: string;
  communication_channel?: 'whatsapp' | 'sms' | 'email' | 'call';
  formula_notes?: string;
  special_requests?: string;
}

export interface CustomerStats {
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  no_show_appointments: number;
  total_spent: number;
  average_order_value: number;
  first_visit_at?: string;
  last_visit_at?: string;
  next_appointment_at?: string;
  days_since_last_visit?: number;
}

export interface CustomerMarketing {
  accepts_sms: boolean;
  accepts_email: boolean;
  accepts_whatsapp: boolean;
  subscribed_at?: string;
}

export interface CustomerNote {
  id: string;
  customer_id: string;
  salon_id: string;
  author_id?: string;
  author_name: string;
  note_type: 'general' | 'formula' | 'preference' | 'complaint' | 'vip_request';
  content: string;
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerActivity {
  id: string;
  customer_id: string;
  salon_id: string;
  activity_type: 'appointment_booked' | 'appointment_completed' | 'appointment_cancelled' | 'note_added' | 'tag_added' | 'profile_updated' | 'offer_redeemed';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Customer {
  id: string;
  salon_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  normalized_phone: string;
  email?: string;
  gender?: CustomerGender;
  birthday?: string; // YYYY-MM-DD
  anniversary?: string; // YYYY-MM-DD
  avatar_url?: string;
  status: CustomerStatus;
  tags: string[];
  preferences?: CustomerPreferences;
  stats: CustomerStats;
  marketing: CustomerMarketing;
  notes_count: number;
  internal_notes?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMAnalytics {
  total_customers: number;
  active_customers: number;
  new_customers_30d: number;
  loyal_customers: number;
  vip_customers: number;
  at_risk_customers: number;
  churn_rate_pct: number;
  retention_rate_pct: number;
  total_revenue_generated: number;
  average_customer_lifetime_value: number;
  average_visit_frequency_days: number;
  status_breakdown: Record<CustomerStatus, number>;
  monthly_retention: { month: string; retained: number; total: number }[];
  top_spenders: Customer[];
}
