import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { formatDate } from "@/lib/utils";
import { InquiryActions } from "./inquiry-actions";

async function getInquiries() {
  await connection();
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

const statusVariants: Record<string, { label: string; class: string }> = {
  new: { label: "New", class: "bg-blue-500/15 text-blue-600" },
  contacted: { label: "Contacted", class: "bg-yellow-500/15 text-yellow-600" },
  quoted: { label: "Quoted", class: "bg-purple-500/15 text-purple-600" },
  closed: { label: "Closed", class: "bg-green-500/15 text-green-600" },
  spam: { label: "Spam", class: "bg-red-500/15 text-red-600" },
};

export default async function InquiriesPage() {
  await connection();
  const inquiries = await getInquiries();
  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
          <p className="text-muted-foreground mt-0.5">
            {newCount > 0 ? (
              <span className="text-amber-500 font-medium">{newCount} new</span>
            ) : (
              "All up to date"
            )}{" "}
            · {inquiries.length} total
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Subject
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Type
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => {
                  const status = statusVariants[inquiry.status] ?? { label: inquiry.status, class: "bg-muted text-muted-foreground" };
                  return (
                    <tr key={inquiry.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-foreground">{inquiry.full_name}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5">
                          <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand transition-colors">
                            <Phone className="size-3" /> {inquiry.phone}
                          </a>
                          {inquiry.email && (
                            <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand transition-colors">
                              <Mail className="size-3" /> {inquiry.email}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell max-w-[200px]">
                        <p className="truncate">{inquiry.subject}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs capitalize text-muted-foreground">
                          {inquiry.inquiry_type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.class}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-4 py-3.5">
                        <InquiryActions inquiryId={inquiry.id} currentStatus={inquiry.status} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No inquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
