import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { getClientIp, searchQuerySchema } from "@/lib/validations/inquiry";

// Note: `new URL(request.url).searchParams` is synchronous Web API —
// async searchParams only applies to Next.js page component props, not route handlers.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateMap = new Map<string, { count: number; resetAt: number }>();

function pruneExpiredRateEntries(now: number) {
  for (const [key, value] of rateMap) {
    if (value.resetAt < now) rateMap.delete(key);
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();
  pruneExpiredRateEntries(now);
  const state = rateMap.get(ip);
  if (!state || state.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
  } else {
    if (state.count >= 90) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    state.count += 1;
    rateMap.set(ip, state);
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [], projects: [] });
    }

    const validated = searchQuerySchema.safeParse({ q: query });
    if (!validated.success) {
      return NextResponse.json({ products: [], projects: [] }, { status: 200 });
    }

    const supabase = createAdminClient();

    const q = `%${validated.data.q}%`;

    const [productsRes, projectsRes] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, slug, cover_image_url, price_range, category:product_categories(name, slug)")
        .eq("is_published", true)
        .or(`name.ilike.${q},short_description.ilike.${q}`)
        .limit(6),
      supabase
        .from("projects")
        .select("id, title, slug, cover_image_url, location, summary")
        .eq("is_published", true)
        .or(`title.ilike.${q},summary.ilike.${q},location.ilike.${q}`)
        .limit(4),
    ]);

    return NextResponse.json({
      products: productsRes.data ?? [],
      projects: projectsRes.data ?? [],
    });
  } catch {
    console.error("[/api/search] Error");
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
