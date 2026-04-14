import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a URL-safe slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format a date string for display */
export function formatDate(
  dateStr: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string {
  if (!dateStr) return "";
  return new Intl.DateTimeFormat("en-NP", options).format(new Date(dateStr));
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Build a WhatsApp deep link */
export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/977${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Estimate reading time in minutes */
export function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Safely render HTML from CMS (sanitise in production via DOMPurify if needed) */
export function dangerousHtml(html: string | null | undefined) {
  return { __html: sanitizeRichHtml(html) };
}

/** Format price range for display */
export function formatPriceRange(range: string | null): string {
  if (!range) return "Contact for price";
  return range;
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/** Absolute URL helper for metadata */
export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://everestsmarttraders.com";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalizedPath}`;
}

/** Remove dangerous tags and attributes from CMS HTML before rendering. */
export function sanitizeRichHtml(html: string | null | undefined): string {
  if (!html) return "";

  return html
    .replace(
      /<\s*(script|style|iframe|object|embed|form|input|button)[^>]*>[\s\S]*?<\s*\/\s*\1>/gi,
      "",
    )
    .replace(
      /<\s*(script|style|iframe|object|embed|form|input|button)[^>]*\/?>/gi,
      "",
    )
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])\s*(javascript:|data:)[\s\S]*?\2/gi, "");
}
