/**
 * Supabase data-fetching functions for the public site.
 * These functions are server-only and avoid request-bound APIs like cookies/headers.
 */
import type {
  Product,
  ProductCategory,
  Service,
  Industry,
  Project,
  BlogPost,
  Testimonial,
  FAQ,
  HomepageSection,
  SiteSetting,
  SiteSettingsMap,
  Announcement,
} from "@/types";

type SitemapProduct = {
  slug: string;
  updated_at: string;
  category: { slug: string }[] | null;
};

type SitemapProject = { slug: string; updated_at: string };
type SitemapBlogPost = { slug: string; updated_at: string | null };

// ── Client factory (lazy — avoids build-time errors if env not set) ───────
function getSupabaseUrl() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getSupabaseKey() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  }
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

async function getClient() {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(getSupabaseUrl(), getSupabaseKey());
}

// ── Site Settings ─────────────────────────────────────────────────────────
export async function getSiteSettings(): Promise<Partial<SiteSettingsMap>> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value");

  if (!data) return {};

  return Object.fromEntries(
    data.map((row: { key: string; value: unknown }) => [row.key, row.value])
  ) as Partial<SiteSettingsMap>;
}

// ── Homepage Sections ─────────────────────────────────────────────────────
export async function getHomepageSections(): Promise<HomepageSection[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_visible", true)
    .order("position");

  return (data as HomepageSection[]) ?? [];
}

// ── Product Categories ────────────────────────────────────────────────────
export async function getProductCategories(): Promise<ProductCategory[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .eq("is_active", true)
    .order("position");

  return (data as ProductCategory[]) ?? [];
}

export async function getProductCategoryBySlug(slug: string): Promise<ProductCategory | null> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("product_categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return (data as ProductCategory | null) ?? null;
}

// ── Products ──────────────────────────────────────────────────────────────
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("products")
    .select(`*, category:product_categories(*), images:product_images(*)`)
    .eq("is_published", true)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("position")
    .limit(limit);

  return (data as Product[]) ?? [];
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("products")
    .select(`*, category:product_categories!inner(*), images:product_images(*)`)
    .eq("product_categories.slug", categorySlug)
    .eq("is_published", true)
    .eq("is_active", true)
    .order("position");

  return (data as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("products")
    .select(`*, category:product_categories(*), images:product_images(*)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return (data as Product | null) ?? null;
}

export async function getAllPublishedProductSlugs(): Promise<string[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_published", true)
    .eq("is_active", true);

  return (data ?? []).map((p: { slug: string }) => p.slug);
}

export async function getAllPublishedProjectSlugs(): Promise<string[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("is_published", true);

  return (data ?? []).map((p: { slug: string }) => p.slug);
}

export async function getAllPublishedBlogSlugs(): Promise<string[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);

  return (data ?? []).map((p: { slug: string }) => p.slug);
}

export async function getAllPublishedProjects(limit = 50): Promise<Project[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("projects")
    .select(`*, industry:industries(*), images:project_images(*)`)
    .eq("is_published", true)
    .order("completed_at", { ascending: false })
    .limit(limit);

  return (data as Project[]) ?? [];
}

export async function getSitemapProducts(): Promise<SitemapProduct[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("products")
    .select("slug, updated_at, category:product_categories(slug)")
    .eq("is_published", true)
    .eq("is_active", true);

  return (data as SitemapProduct[]) ?? [];
}

// ── Services ──────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .eq("is_active", true)
    .order("position");

  return (data as Service[]) ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return (data as Service | null) ?? null;
}

// ── Industries ────────────────────────────────────────────────────────────
export async function getIndustries(): Promise<Industry[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("industries")
    .select("*")
    .eq("is_active", true)
    .order("position");

  return (data as Industry[]) ?? [];
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("industries")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return (data as Industry | null) ?? null;
}

// ── Projects ──────────────────────────────────────────────────────────────
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("projects")
    .select(`*, industry:industries(*), images:project_images(*)`)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("completed_at", { ascending: false })
    .limit(limit);

  return (data as Project[]) ?? [];
}

export async function getSitemapProjects(): Promise<SitemapProject[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("is_published", true);

  return (data as SitemapProject[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("projects")
    .select(`
      *,
      industry:industries(*),
      images:project_images(*),
      project_products(product_id)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return (data as Project | null) ?? null;
}

// ── Blog Posts ────────────────────────────────────────────────────────────
export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*)`)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  return (data as BlogPost[]) ?? [];
}

export async function getSitemapBlogPosts(): Promise<SitemapBlogPost[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  return (data as SitemapBlogPost[]) ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return (data as BlogPost | null) ?? null;
}

// ── Testimonials ──────────────────────────────────────────────────────────
export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {

  const supabase = await getClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .limit(limit);

  return (data as Testimonial[]) ?? [];
}

// ── FAQs ──────────────────────────────────────────────────────────────────
export async function getFAQs(category?: string): Promise<FAQ[]> {

  const supabase = await getClient();
  let query = supabase
    .from("faqs")
    .select("*")
    .eq("is_published", true)
    .order("position");

  if (category) {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return (data as FAQ[]) ?? [];
}

// ── Announcements ─────────────────────────────────────────────────────────
export async function getActiveAnnouncement(): Promise<Announcement | null> {

  const supabase = await getClient();
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .limit(1)
    .single();

  return (data as Announcement | null) ?? null;
}
