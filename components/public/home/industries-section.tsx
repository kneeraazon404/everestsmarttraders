import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { pickFallbackImage } from "@/lib/image-fallbacks";
import { cn } from "@/lib/utils";
import type { Industry } from "@/types";

interface IndustriesSectionProps {
  industries: Industry[];
}

export function IndustriesSection({ industries }: IndustriesSectionProps) {
  if (!industries.length) return null;

  const featured = industries.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Industries We Serve"
          title="Solutions for Every Sector"
          subtitle="Whether you run a hotel, factory, residence, or commercial complex — we have the right security and automation system for you."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((industry) => (
            <Link
              key={industry.id}
              href={`/industries/${industry.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-4/3 block"
            >
              <Image
                src={
                  industry.cover_image_url ??
                  pickFallbackImage(industry.slug, 65)
                }
                alt={industry.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3 className="text-white font-semibold text-lg leading-snug mb-1">
                  {industry.name}
                </h3>
                {industry.description && (
                  <p className="text-white/85 text-sm line-clamp-1">
                    {industry.description}
                  </p>
                )}
                <div
                  className={cn(
                    "flex items-center gap-1 text-est-amber text-sm font-medium mt-2",
                    "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300",
                  )}
                >
                  View solutions <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-est-amber transition-colors"
          >
            View all industries
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
