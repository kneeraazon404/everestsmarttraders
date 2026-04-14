-- ============================================================
-- Everest Smart Traders — Initial Schema
-- ============================================================
-- Run in Supabase SQL editor or via: supabase db push

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text not null default 'viewer'
                check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Admin user profiles extending auth.users';

-- Trigger: auto-create profile when a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger: update updated_at timestamp
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- SITE SETTINGS  (key/value CMS config)
-- ============================================================
create table public.site_settings (
  id           uuid primary key default gen_random_uuid(),
  key          text unique not null,
  value        jsonb not null default '{}',
  description  text,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references public.profiles(id)
);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- HOMEPAGE SECTIONS
-- ============================================================
create table public.homepage_sections (
  id          uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title       text,
  subtitle    text,
  content     jsonb default '{}',
  is_visible  boolean not null default true,
  position    integer not null default 0,
  updated_at  timestamptz not null default now()
);

create trigger homepage_sections_updated_at before update on public.homepage_sections
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================
create table public.product_categories (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  name_ne          text,                       -- Nepali translation
  slug             text unique not null,
  description      text,
  description_ne   text,
  image_url        text,
  icon             text,                       -- lucide icon name or emoji
  position         integer not null default 0,
  is_active        boolean not null default true,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_product_categories_slug on public.product_categories(slug);
create index idx_product_categories_active on public.product_categories(is_active, position);

create trigger product_categories_updated_at before update on public.product_categories
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references public.product_categories(id) on delete set null,
  name              text not null,
  name_ne           text,
  slug              text unique not null,
  short_description text,
  description       text,                      -- rich HTML/markdown
  specifications    jsonb default '[]',        -- [{label, value}]
  features          jsonb default '[]',        -- [string]
  use_cases         text[] default '{}',
  price_range       text,                      -- e.g. "Rs. 15,000 – 35,000"
  cover_image_url   text,
  brochure_url      text,
  is_featured       boolean not null default false,
  is_active         boolean not null default true,
  is_published      boolean not null default false,
  position          integer not null default 0,
  seo_title         text,
  seo_description   text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references public.profiles(id),
  updated_by        uuid references public.profiles(id)
);

create index idx_products_category on public.products(category_id);
create index idx_products_slug on public.products(slug);
create index idx_products_published on public.products(is_published, is_active, position);
create index idx_products_featured on public.products(is_featured, is_published);

create trigger products_updated_at before update on public.products
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
create table public.product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references public.products(id) on delete cascade not null,
  url         text not null,
  alt         text,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_product_images_product on public.product_images(product_id, position);


-- ============================================================
-- SERVICES / SOLUTIONS
-- ============================================================
create table public.services (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  name_ne          text,
  slug             text unique not null,
  intro            text,
  description      text,                      -- rich HTML
  key_benefits     jsonb default '[]',        -- [string]
  ideal_use_cases  text[] default '{}',
  icon             text,
  cover_image_url  text,
  is_active        boolean not null default true,
  is_published     boolean not null default false,
  position         integer not null default 0,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_services_slug on public.services(slug);
create index idx_services_published on public.services(is_published, position);

create trigger services_updated_at before update on public.services
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- INDUSTRIES
-- ============================================================
create table public.industries (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text unique not null,
  icon                text,
  description         text,
  cover_image_url     text,
  solutions_summary   text,
  is_active           boolean not null default true,
  position            integer not null default 0,
  seo_title           text,
  seo_description     text,
  created_at          timestamptz not null default now()
);

create index idx_industries_slug on public.industries(slug);


-- ============================================================
-- PROJECTS / INSTALLATIONS
-- ============================================================
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text unique not null,
  location         text,
  industry_id      uuid references public.industries(id) on delete set null,
  summary          text,
  challenge        text,
  solution         text,
  result           text,
  cover_image_url  text,
  is_featured      boolean not null default false,
  is_published     boolean not null default false,
  completed_at     date,
  seo_title        text,
  seo_description  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_projects_slug on public.projects(slug);
create index idx_projects_published on public.projects(is_published, is_featured);
create index idx_projects_industry on public.projects(industry_id);

create trigger projects_updated_at before update on public.projects
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- PROJECT IMAGES
-- ============================================================
create table public.project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references public.projects(id) on delete cascade not null,
  url         text not null,
  alt         text,
  is_cover    boolean not null default false,
  position    integer not null default 0
);

create index idx_project_images_project on public.project_images(project_id, position);


-- ============================================================
-- PROJECT ↔ PRODUCT (many-to-many)
-- ============================================================
create table public.project_products (
  project_id  uuid references public.projects(id) on delete cascade,
  product_id  uuid references public.products(id) on delete cascade,
  primary key (project_id, product_id)
);


-- ============================================================
-- BLOG CATEGORIES
-- ============================================================
create table public.blog_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  description text,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- BLOG POSTS
-- ============================================================
create table public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid references public.blog_categories(id) on delete set null,
  title            text not null,
  title_ne         text,
  slug             text unique not null,
  excerpt          text,
  content          text,                      -- rich HTML
  cover_image_url  text,
  author_name      text,
  author_id        uuid references public.profiles(id) on delete set null,
  tags             text[] default '{}',
  is_featured      boolean not null default false,
  is_published     boolean not null default false,
  published_at     timestamptz,
  reading_time     integer,                   -- minutes
  seo_title        text,
  seo_description  text,
  canonical_url    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_blog_posts_slug on public.blog_posts(slug);
create index idx_blog_posts_published on public.blog_posts(is_published, published_at desc);
create index idx_blog_posts_tags on public.blog_posts using gin(tags);

create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  client_name     text not null,
  client_title    text,
  client_company  text,
  content         text not null,
  rating          integer check (rating between 1 and 5),
  project_id      uuid references public.projects(id) on delete set null,
  is_featured     boolean not null default false,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now()
);


-- ============================================================
-- FAQs
-- ============================================================
create table public.faqs (
  id           uuid primary key default gen_random_uuid(),
  question     text not null,
  question_ne  text,
  answer       text not null,
  answer_ne    text,
  category     text,
  service_id   uuid references public.services(id) on delete set null,
  is_published boolean not null default true,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

create index idx_faqs_published on public.faqs(is_published, position);


-- ============================================================
-- INQUIRIES / LEADS
-- ============================================================
create table public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  inquiry_type  text not null default 'general'
                  check (inquiry_type in ('general', 'quote', 'support', 'partnership', 'contact', 'product', 'project')),
  full_name     text not null,
  email         text,
  phone         text not null,
  company       text,
  subject       text,
  message       text,
  location      text,
  product_ids   uuid[] default '{}',
  service_id    uuid references public.services(id) on delete set null,
  status        text not null default 'new'
                  check (status in ('new', 'contacted', 'quoted', 'closed', 'spam')),
  notes         text,
  metadata      jsonb default '{}',
  ip_address    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_inquiries_status on public.inquiries(status, created_at desc);
create index idx_inquiries_type on public.inquiries(inquiry_type);

create trigger inquiries_updated_at before update on public.inquiries
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- SEO OVERRIDES
-- ============================================================
create table public.seo_overrides (
  id              uuid primary key default gen_random_uuid(),
  path            text unique not null,
  title           text,
  description     text,
  og_image        text,
  canonical       text,
  noindex         boolean not null default false,
  structured_data jsonb,
  updated_at      timestamptz not null default now()
);

create trigger seo_overrides_updated_at before update on public.seo_overrides
  for each row execute procedure public.touch_updated_at();


-- ============================================================
-- MEDIA ASSETS (Supabase Storage references)
-- ============================================================
create table public.media_assets (
  id            uuid primary key default gen_random_uuid(),
  filename      text not null,
  url           text not null,
  storage_path  text not null,
  mime_type     text,
  size          integer,
  alt           text,
  folder        text default 'general',
  uploaded_by   uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index idx_media_assets_folder on public.media_assets(folder, created_at desc);


-- ============================================================
-- ANNOUNCEMENTS (optional site-wide banner)
-- ============================================================
create table public.announcements (
  id         uuid primary key default gen_random_uuid(),
  message    text not null,
  link       text,
  link_label text,
  type       text not null default 'info'
               check (type in ('info', 'success', 'warning', 'error')),
  is_active  boolean not null default false,
  starts_at  timestamptz,
  ends_at    timestamptz,
  created_at timestamptz not null default now()
);
