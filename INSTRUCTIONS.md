# Admin Instructions — Everest Smart Traders

Step-by-step guide for managing content, inquiries, and settings through the admin dashboard.

---

## Signing In

1. Navigate to `https://everestsmarttraders.com/admin` (or your domain)
2. You will be redirected to the login page at `/login`
3. Enter your admin email and password
4. Click **Sign In**

If you do not have an account, contact the system administrator. New accounts must be created in the Supabase dashboard and assigned the `admin` or `editor` role.

---

## Roles and Permissions

| Role       | Access                                                                |
| ---------- | --------------------------------------------------------------------- |
| **admin**  | Full access to all sections including settings and user management    |
| **editor** | Full access to content (products, blog, projects, etc.) and inquiries |
| **viewer** | Read-only access (not currently used in the UI)                       |

Important: user account creation and role assignment are managed in Supabase (Auth + profiles table), not in the admin UI.

---

## Dashboard Overview

After signing in you will see the main dashboard with:
- **Published Products** — count of live products
- **New Inquiries** — count of unread leads (highlighted in amber when non-zero)
- **Projects** — count of published case studies
- **Blog Posts** — count of published articles
- **Recent Inquiries** — last 5 leads received
- **Quick Actions** — shortcuts to add products, projects, blog posts, and settings

---

## Managing Products

### View products
Go to **Products** in the sidebar. All products are listed with their category, price range, and published status.

### Add a product
1. Click **Add Product** (top right)
2. Fill in the form:
   - **Product Name** — full product name (slug is auto-generated)
   - **Category** — select from existing categories
   - **Price Range** — optional (e.g., `NPR 25,000 – 45,000`)
   - **Cover Image URL** — paste a Supabase Storage URL or external URL
   - **Short Description** — 1–2 sentences for cards and SEO
   - **Full Description** — HTML allowed for rich formatting
   - **Key Features** — add bullet points (use + button to add more)
   - **Published** — toggle to make visible on the public site
   - **Featured** — toggle to show on the homepage featured section
3. Click **Create Product**

### Edit a product
Click **Edit** on any product row. All fields are editable. Click **Save Changes** when done.

### Delete a product
Currently, products can be set to **unpublished** (toggle off "Published") to hide them from the public site. Full deletion can be performed directly in the Supabase database if needed.

---

## Managing Product Categories

Go to **Categories** in the sidebar.

### Add a category
1. Click **Add Category**
2. Set name, slug, description, and icon
3. Toggle **Active** to make it visible
4. Set a **position** number to control display order (lower = first)

### Edit a category
Click **Edit** on any row. Update the fields and save.

---

## Managing Services

Go to **Services** in the sidebar.

Services are the installation/support offerings displayed on the `/services` page.

- **Name** — service display name
- **Intro** — short paragraph for the services list
- **Key Benefits** — bullet points shown on the page
- **Published** — controls visibility on the public site
- **Position** — display order (lower = first)

---

## Managing Industries

Go to **Industries** in the sidebar.

Industries appear on the `/industries` page and industry detail pages.

- **Name** — industry name (e.g., Hotels & Hospitality)
- **Icon** — icon name string (matches Lucide icon naming)
- **Description** — one paragraph about this industry
- **Solutions Summary** — comma or newline-separated list of solutions offered
- **Active** — controls visibility

---

## Managing Projects

Go to **Projects** in the sidebar.

Projects are case studies visible at `/showcase#projects` and individual `/projects/[slug]` pages.

### Add a project
1. Click **Add Project**
2. Fill in:
   - **Title** — project name
   - **Location** — city/area in Nepal
   - **Industry** — optional link to an industry
   - **Summary** — 1–2 sentence overview
   - **Challenge** — what problem the client faced
   - **Solution** — what was installed/done
   - **Result** — measurable outcome
   - **Cover Image URL** — main project photo
   - **Completed At** — date of completion
   - **Published / Featured** — controls visibility

### Edit a project
Click **Edit** on the projects list. All fields are editable.

---

## Managing Blog Posts

Go to **Blog** in the sidebar.

### Add a blog post
1. Click **New Post**
2. Fill in:
   - **Title** — article title
   - **Slug** — URL-safe identifier (auto-generated from title)
   - **Category** — select or leave blank
   - **Author Name** — display name for the article
   - **Excerpt** — 1–2 sentence summary shown on the blog list
   - **Content** — full article content (HTML supported)
   - **Cover Image URL** — header image for the post
   - **Tags** — comma-separated keywords
   - **Reading Time** — auto-calculated, or enter manually
   - **Published / Featured** — controls visibility
   - **SEO Title / Description** — optional overrides for search engines

### Edit a post
Click **Edit** on any post. Update content and save.

SEO note: `/blog/*` is the canonical indexed content path. `/tutorials/*` remains available for user experience but is intentionally set to noindex to avoid duplicate indexing.

---

## Managing Testimonials

Go to **Testimonials** in the sidebar.

Testimonials appear in the homepage testimonials section.

- **Client Name** — required
- **Client Title** — job title or role
- **Client Company** — company name
- **Content** — the testimonial text
- **Rating** — 1 to 5 stars
- **Project** — optionally link to a case study project
- **Featured** — show in homepage carousel
- **Published** — make visible

---

## Managing FAQs

Go to **FAQs** in the sidebar.

FAQs appear on the `/faq` page with structured data for Google rich results.

- **Question** — the question text
- **Answer** — the answer text
- **Category** — group label (e.g., General, Installation, Hotel, Gate)
- **Position** — display order (lower = first)
- **Published** — controls visibility

---

## Managing Inquiries (Leads)

Go to **Inquiries** in the sidebar.

All contact form and quote request submissions land here.

### View inquiries
The list shows: contact name, phone, email, subject, inquiry type, status, and date received.

### View inquiry details
Click any row to open the full inquiry detail page, which shows:
- Full contact information
- Company and location (if provided)
- Subject and full message
- Quick action buttons to call, email, or WhatsApp the contact

### Update inquiry status
Click the **Status** button on any inquiry row to change the status:
- **New** — just received, not yet actioned
- **Contacted** — you have reached out to the customer
- **Quoted** — a price quote has been sent
- **Closed** — deal completed or inquiry resolved
- **Spam** — mark as spam to filter out

---

## Managing Homepage Content

Go to **Content** in the sidebar.

This section lets you edit the text for each homepage section (hero, why us, solutions, etc.) and toggle sections on or off.

### Editing a section
1. Find the section you want to update (e.g., "Hero", "Why Us")
2. Update the **Title** and **Subtitle** fields
3. Toggle **Visible** to show or hide the section
4. Click **Save**

---

## Media Library

Go to **Media** in the sidebar.

The media library shows all images uploaded to Supabase Storage.

### Uploading images
1. Click **Upload** (or drag and drop)
2. Select one or more image files
3. Choose a **folder** (products, projects, blog, services, general, site)
4. The image URL will be available immediately to paste into content fields

### Using uploaded images
After uploading, copy the public URL and paste it into the appropriate image URL field when editing products, projects, blog posts, etc.

---

## Site Settings

Go to **Settings** in the sidebar.

Site settings control global business information displayed across the public site.

### Editable settings include:
- **Business Name** — shown in the header and footer
- **Tagline** — short brand description in the footer
- **Address** — human-readable address for the contact page and footer
- **Phone Numbers** — primary and secondary phone numbers
- **Email** — primary business email address
- **WhatsApp** — WhatsApp number (digits only, e.g., `9860819528`)
- **Social Links** — Facebook, Instagram, TikTok, YouTube URLs

## Safety and Operations

- Database reset for staging or QA: run `npm run db:reset-seed` from the project root.
- Reset mode clears application content and reseeds deterministic data, but preserves admin auth users and roles.
- Do not run reset in production unless you intentionally want to replace all managed content.
- After major content updates, verify `sitemap.xml` and key pages in an incognito browser session.
- **Business Hours** — shown in the footer and contact page
- **Service Area** — coverage description
- **Logo URL** — logo image URL (use Media to upload first)
- **Hero Image** — main hero background image URL
- **SEO Defaults** — fallback title and description for pages without custom SEO

After saving settings, changes appear immediately on the public site.

---

## SEO Management

Each content item (product, project, blog post, industry, category) has optional SEO fields:

- **SEO Title** — overrides the default page title in search results
- **SEO Description** — overrides the meta description in search results

If left blank, the system generates sensible defaults from the content name and description.

The homepage and key pages generate structured data (JSON-LD) automatically:
- FAQ page: FAQPage schema
- Root layout: Organization schema

---

## Important Cautions

1. **Do not delete the main product categories** — removing a category will orphan products and break public category pages.
2. **Unpublish instead of deleting** — to hide content, toggle the "Published" switch off rather than deleting records. This preserves data and prevents broken links.
3. **Slug changes break URLs** — changing a slug after content is published will create a new URL. Old URLs will 404. Update any internal links manually.
4. **Image URLs must be accessible** — pasting an image URL that is broken or private will show a fallback image. Test URLs before saving.
5. **Site settings apply globally** — changes to the business name, phone, or email appear everywhere. Double-check before saving.
6. **Inquiries are permanent** — there is no delete function for inquiries. Mark unwanted submissions as **Spam** to filter them.

---

## Support

For technical issues or questions about the platform, contact the developer or check the `README.md` for architecture details.
