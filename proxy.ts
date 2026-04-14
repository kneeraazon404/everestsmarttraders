/**
 * proxy.ts — Next.js 16 network-boundary proxy (replaces middleware.ts)
 *
 * Responsibilities:
 *  1. Refresh Supabase session cookies on every request (required by @supabase/ssr)
 *  2. Protect /admin routes — redirect unauthenticated users to /login
 *  3. Redirect authenticated users away from /login
 *
 * Auth is defence-in-depth here; server-side checks in layouts/actions are the authoritative gate.
 */
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set({ name, value, ...options }),
          );
        },
      },
    },
  );

  // Refresh session — MUST be called before any redirects that depend on auth state.
  // Do not add code between createServerClient and this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Protect /admin/* routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role guard — only admin/editor may access the admin area
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || !["admin", "editor"].includes(profile.role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Redirect authenticated users away from /login ────────────────────────
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Apply to all paths except static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
