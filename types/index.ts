// ============================================================
// Everest Smart Traders — TypeScript Types
// Mirrors the Supabase database schema exactly
// ============================================================

export type UserRole = "admin" | "editor" | "viewer";
export type InquiryType = "general" | "quote" | "support" | "partnership" | "contact" | "product" | "project";
export type InquiryStatus = "new" | "contacted" | "quoted" | "closed" | "spam";
export type AnnouncementType = "info" | "success" | "warning" | "error";

// ── Profiles ──────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ── Site Settings ─────────────────────────────────────────────────────────
export interface SiteSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface SiteSettingsMap {
  site_name: string;
  business_name: string;
  tagline: string;
  address: string; // Human-readable address for display
  phones: { primary: string; secondary?: string };
  email: string;
  whatsapp: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  locations: Array<{
    label: string;
    address: string;
    map_embed?: string;
  }>;
  business_hours: string;
  service_area: string;
  logo_url: string;
  favicon_url: string;
  hero_image_url: string;
  seo_defaults: {
    title: string;
    description: string;
    og_image?: string;
  };
  hero_ctas: Array<{
    label: string;
    href: string;
    variant: "primary" | "outline" | "whatsapp";
  }>;
}

// ── Homepage Sections ─────────────────────────────────────────────────────
export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  is_visible: boolean;
  position: number;
  updated_at: string;
}

// ── Product Categories ────────────────────────────────────────────────────
export interface ProductCategory {
  id: string;
  name: string;
  name_ne: string | null;
  slug: string;
  description: string | null;
  description_ne: string | null;
  image_url: string | null;
  icon: string | null;
  position: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

// ── Products ──────────────────────────────────────────────────────────────
export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  name_ne: string | null;
  slug: string;
  short_description: string | null;
  description: string | null;
  specifications: ProductSpecification[];
  features: string[];
  use_cases: string[];
  price_range: string | null;
  cover_image_url: string | null;
  brochure_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  is_published: boolean;
  position: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  // Joined
  category?: ProductCategory;
  images?: ProductImage[];
}

// ── Product Images ────────────────────────────────────────────────────────
export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number;
  created_at: string;
}

// ── Services ──────────────────────────────────────────────────────────────
export interface Service {
  id: string;
  name: string;
  name_ne: string | null;
  slug: string;
  intro: string | null;
  description: string | null;
  key_benefits: string[];
  ideal_use_cases: string[];
  icon: string | null;
  cover_image_url: string | null;
  is_active: boolean;
  is_published: boolean;
  position: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

// ── Industries ────────────────────────────────────────────────────────────
export interface Industry {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  cover_image_url: string | null;
  solutions_summary: string | null;
  is_active: boolean;
  position: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

// ── Projects ──────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  industry_id: string | null;
  summary: string | null;
  challenge: string | null;
  solution: string | null;
  result: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  completed_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  industry?: Industry;
  images?: ProjectImage[];
  products?: Product[];
  testimonial?: Testimonial;
}

// ── Project Images ────────────────────────────────────────────────────────
export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  alt: string | null;
  is_cover: boolean;
  position: number;
}

// ── Blog ──────────────────────────────────────────────────────────────────
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  category_id: string | null;
  title: string;
  title_ne: string | null;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null; // thumbnail / poster for video
  video_url: string | null;
  author_name: string | null;
  author_id: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  reading_time: number | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: BlogCategory;
  author?: Profile;
}

// ── Testimonials ──────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  content: string;
  rating: number | null;
  project_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}

// ── FAQs ──────────────────────────────────────────────────────────────────
export interface FAQ {
  id: string;
  question: string;
  question_ne: string | null;
  answer: string;
  answer_ne: string | null;
  category: string | null;
  service_id: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
}

// ── Inquiries ─────────────────────────────────────────────────────────────
export interface Inquiry {
  id: string;
  inquiry_type: InquiryType;
  full_name: string;
  email: string | null;
  phone: string;
  company: string | null;
  subject: string | null;
  message: string | null;
  location: string | null;
  product_ids: string[];
  service_id: string | null;
  status: InquiryStatus;
  notes: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

// ── Media Assets ──────────────────────────────────────────────────────────
export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  storage_path: string;
  mime_type: string | null;
  size: number | null;
  alt: string | null;
  folder: string;
  uploaded_by: string | null;
  created_at: string;
}

// ── Announcements ─────────────────────────────────────────────────────────
export interface Announcement {
  id: string;
  message: string;
  link: string | null;
  link_label: string | null;
  type: AnnouncementType;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

// ── SEO ───────────────────────────────────────────────────────────────────
export interface SeoOverride {
  id: string;
  path: string;
  title: string | null;
  description: string | null;
  og_image: string | null;
  canonical: string | null;
  noindex: boolean;
  structured_data: Record<string, unknown> | null;
  updated_at: string;
}

// ── Form input types ──────────────────────────────────────────────────────
export interface InquiryFormData {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  type: InquiryType;
  product_ids?: string[];
  service_id?: string;
}

// ── Admin pagination/filter ────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface AdminListResult<T> {
  data: T[];
  meta: PaginationMeta;
}
