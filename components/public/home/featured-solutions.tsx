import Link from "next/link";
import {
  ArrowRight,
  DoorOpen,
  Hotel,
  Lock,
  Camera,
  Fingerprint,
  Blinds,
} from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";

interface FeaturedSolutionsProps {
  categories: ProductCategory[];
}

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "gate-automation": DoorOpen,
  "hotel-lock-system": Hotel,
  "smart-door-lock": Lock,
  "video-door-phone": Camera,
  "access-control": Fingerprint,
  "shutter-curtain-motor": Blinds,
};

const categoryColors: Record<string, string> = {
  "gate-automation": "bg-blue-500/10 text-blue-600",
  "hotel-lock-system": "bg-purple-500/10 text-purple-600",
  "smart-door-lock": "bg-emerald-500/10 text-emerald-600",
  "video-door-phone": "bg-orange-500/10 text-orange-600",
  "access-control": "bg-red-500/10 text-red-600",
  "shutter-curtain-motor": "bg-teal-500/10 text-teal-600",
};

export function FeaturedSolutions({ categories }: FeaturedSolutionsProps) {
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Our Solutions"
          title="Complete Automation & Security"
          subtitle="From residential gates to enterprise access control — we supply, install, and maintain the full range of smart security systems."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCategories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Lock;
            const colorClass =
              categoryColors[category.slug] ?? "bg-brand/10 text-brand";

            return (
              <Link
                key={category.id}
                href={`/products/${category.slug}`}
                className="group relative flex gap-4 p-6 bg-card rounded-xl border border-border hover:border-brand/30 hover:shadow-md transition-all"
              >
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-lg",
                    colorClass,
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors leading-snug mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="size-4 text-muted-foreground/50 group-hover:text-brand group-hover:translate-x-1 transition-all shrink-0 self-center" />
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/showcase#products"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-est-amber transition-colors"
          >
            View all products
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
