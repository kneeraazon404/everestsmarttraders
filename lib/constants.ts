export const SITE_NAME = "Everest Smart Traders";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://everestsmarttraders.com";

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "media";

// Folders within Supabase Storage bucket
export const STORAGE_FOLDERS = {
  products: "products",
  projects: "projects",
  blog: "blog",
  services: "services",
  general: "general",
  site: "site",
} as const;

// Admin page size defaults
export const ADMIN_PAGE_SIZE = 20;

// Inquiry status labels (must match DB enum: new | contacted | quoted | closed | spam)
export const INQUIRY_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  closed: "Closed",
  spam: "Spam",
};

// Nav links — these can later come from DB but are defined here as fallback
export const PUBLIC_NAV_LINKS = [
  { label: "Showcase", href: "/showcase" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
