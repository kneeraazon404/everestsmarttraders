-- ============================================================
-- Row Level Security Policies
-- ============================================================
-- Public: read published/active content
-- Admin/Editor: full write access to content tables
-- Admin only: manage profiles, settings, inquiries

-- Enable RLS on all tables
alter table public.profiles           enable row level security;
alter table public.site_settings      enable row level security;
alter table public.homepage_sections  enable row level security;
alter table public.product_categories enable row level security;
alter table public.products           enable row level security;
alter table public.product_images     enable row level security;
alter table public.services           enable row level security;
alter table public.industries         enable row level security;
alter table public.projects           enable row level security;
alter table public.project_images     enable row level security;
alter table public.project_products   enable row level security;
alter table public.blog_categories    enable row level security;
alter table public.blog_posts         enable row level security;
alter table public.testimonials       enable row level security;
alter table public.faqs               enable row level security;
alter table public.inquiries          enable row level security;
alter table public.seo_overrides      enable row level security;
alter table public.media_assets       enable row level security;
alter table public.announcements      enable row level security;

-- ── Helper: check if current user has admin or editor role ──────────────
create or replace function public.is_admin_or_editor()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ── PROFILES ─────────────────────────────────────────────────────────────
create policy "Profiles: admins can read all"
  on public.profiles for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "Profiles: own profile readable"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "Profiles: own profile writable"
  on public.profiles for update
  to authenticated
  using (id = auth.uid());

create policy "Profiles: admin can manage all"
  on public.profiles for all
  to authenticated
  using (public.is_admin());

-- ── SITE SETTINGS ────────────────────────────────────────────────────────
-- Public read (needed for nav, contact info, etc.)
create policy "Site settings: public read"
  on public.site_settings for select
  using (true);

create policy "Site settings: admin/editor write"
  on public.site_settings for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── HOMEPAGE SECTIONS ────────────────────────────────────────────────────
create policy "Homepage sections: public read"
  on public.homepage_sections for select
  using (is_visible = true);

create policy "Homepage sections: admin/editor manage"
  on public.homepage_sections for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── PRODUCT CATEGORIES ───────────────────────────────────────────────────
create policy "Product categories: public read active"
  on public.product_categories for select
  using (is_active = true);

create policy "Product categories: admin/editor manage"
  on public.product_categories for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── PRODUCTS ─────────────────────────────────────────────────────────────
create policy "Products: public read published"
  on public.products for select
  using (is_published = true and is_active = true);

create policy "Products: admin/editor read all"
  on public.products for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "Products: admin/editor write"
  on public.products for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── PRODUCT IMAGES ───────────────────────────────────────────────────────
create policy "Product images: public read (via published product)"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id
        and p.is_published = true
        and p.is_active = true
    )
  );

create policy "Product images: admin/editor manage"
  on public.product_images for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── SERVICES ─────────────────────────────────────────────────────────────
create policy "Services: public read published"
  on public.services for select
  using (is_published = true and is_active = true);

create policy "Services: admin/editor read all"
  on public.services for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "Services: admin/editor write"
  on public.services for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── INDUSTRIES ───────────────────────────────────────────────────────────
create policy "Industries: public read active"
  on public.industries for select
  using (is_active = true);

create policy "Industries: admin/editor manage"
  on public.industries for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── PROJECTS ─────────────────────────────────────────────────────────────
create policy "Projects: public read published"
  on public.projects for select
  using (is_published = true);

create policy "Projects: admin/editor read all"
  on public.projects for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "Projects: admin/editor write"
  on public.projects for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── PROJECT IMAGES ───────────────────────────────────────────────────────
create policy "Project images: public read (via published project)"
  on public.project_images for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.is_published = true
    )
  );

create policy "Project images: admin/editor manage"
  on public.project_images for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── PROJECT PRODUCTS ─────────────────────────────────────────────────────
create policy "Project products: public read"
  on public.project_products for select
  using (true);

create policy "Project products: admin/editor manage"
  on public.project_products for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── BLOG CATEGORIES ──────────────────────────────────────────────────────
create policy "Blog categories: public read"
  on public.blog_categories for select
  using (true);

create policy "Blog categories: admin/editor manage"
  on public.blog_categories for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── BLOG POSTS ───────────────────────────────────────────────────────────
create policy "Blog posts: public read published"
  on public.blog_posts for select
  using (is_published = true);

create policy "Blog posts: admin/editor read all"
  on public.blog_posts for select
  to authenticated
  using (public.is_admin_or_editor());

create policy "Blog posts: admin/editor write"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── TESTIMONIALS ─────────────────────────────────────────────────────────
create policy "Testimonials: public read published"
  on public.testimonials for select
  using (is_published = true);

create policy "Testimonials: admin/editor manage"
  on public.testimonials for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── FAQs ─────────────────────────────────────────────────────────────────
create policy "FAQs: public read published"
  on public.faqs for select
  using (is_published = true);

create policy "FAQs: admin/editor manage"
  on public.faqs for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── INQUIRIES ────────────────────────────────────────────────────────────
-- Public INSERT (form submissions), no public read
create policy "Inquiries: public insert"
  on public.inquiries for insert
  with check (true);

create policy "Inquiries: admin/editor read and manage"
  on public.inquiries for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── SEO OVERRIDES ────────────────────────────────────────────────────────
create policy "SEO overrides: public read"
  on public.seo_overrides for select
  using (true);

create policy "SEO overrides: admin/editor manage"
  on public.seo_overrides for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── MEDIA ASSETS ─────────────────────────────────────────────────────────
create policy "Media assets: public read"
  on public.media_assets for select
  using (true);

create policy "Media assets: admin/editor manage"
  on public.media_assets for all
  to authenticated
  using (public.is_admin_or_editor());

-- ── ANNOUNCEMENTS ────────────────────────────────────────────────────────
create policy "Announcements: public read active"
  on public.announcements for select
  using (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

create policy "Announcements: admin/editor manage"
  on public.announcements for all
  to authenticated
  using (public.is_admin_or_editor());
