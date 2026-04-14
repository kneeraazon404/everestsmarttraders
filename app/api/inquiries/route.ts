import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin-client";
import {
  contactInquirySchema,
  getClientIp,
  sanitizePlainText,
} from "@/lib/validations/inquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// API route for programmatic inquiry submission (e.g., from third-party integrations)
// The primary path for form submissions uses server actions in lib/actions/inquiry.ts

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function pruneExpiredRateEntries(now: number) {
  for (const [key, value] of requestCounts) {
    if (value.resetAt < now) requestCounts.delete(key);
  }
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  pruneExpiredRateEntries(now);
  const current = requestCounts.get(ip);

  if (!current || current.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) return false;

  current.count += 1;
  requestCounts.set(ip, current);
  return true;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > 50_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const body = await request.json();
    const {
      full_name,
      phone,
      email,
      subject,
      message,
      inquiry_type,
      location,
      company,
    } = body as Record<string, unknown>;

    if (typeof company === "string" && company.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const parsed = contactInquirySchema.safeParse({
      full_name,
      phone,
      email,
      subject,
      message,
      inquiry_type,
      company: typeof company === "string" ? company : "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("inquiries").insert({
      full_name: sanitizePlainText(parsed.data.full_name),
      phone: sanitizePlainText(parsed.data.phone),
      email: parsed.data.email || null,
      subject: sanitizePlainText(parsed.data.subject),
      message: sanitizePlainText(parsed.data.message),
      inquiry_type: parsed.data.inquiry_type,
      location:
        typeof location === "string" ? sanitizePlainText(location) : null,
      status: "new",
    });

    if (error) {
      console.error("Inquiry API error");
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
