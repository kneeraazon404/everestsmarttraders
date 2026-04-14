import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { CTABand } from "@/components/public/home/cta-band";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { getIndustries, getSiteSettings } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve | Everest Smart Traders",
  description:
    "Automation and security solutions for hotels, hospitals, apartments, factories, banks, offices, and more across Nepal.",
};

export default async function IndustriesPage() {
  const [industries, settings] = await Promise.all([
    getIndustries(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="bg-muted/40 border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Industries"
            title="Solutions for Every Sector"
            subtitle="From hotels and hospitals to factories and homes — we deliver tailored automation and security systems across all industries."
          />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {industries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {industries.map((industry) => (
                <Link
                  key={industry.id}
                  href={`/industries/${industry.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-card border border-border hover:shadow-md hover:border-brand/30 transition-all"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-muted">
                    <Image
                      src={
                        industry.cover_image_url ??
                        pickFallbackImage(industry.slug, 60)
                      }
                      alt={industry.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors mb-1.5">
                      {industry.name}
                    </h3>
                    {industry.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {industry.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-sm font-medium text-brand mt-3">
                      View solutions{" "}
                      <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              Industry pages coming soon.
            </div>
          )}
        </div>
      </section>

      <CTABand settings={settings} />
    </>
  );
}
