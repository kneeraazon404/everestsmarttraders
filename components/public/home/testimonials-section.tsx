import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "fill-est-amber text-est-amber"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  const display = testimonials.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Client Testimonials"
          title="What Our Clients Say"
          subtitle="Trusted by homeowners, hotel managers, and business owners across Nepal."
          className="mb-12"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {display.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col gap-4 p-6 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
            >
              <Quote className="size-8 text-est-amber/30 shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-semibold text-sm">
                  {testimonial.client_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {testimonial.client_name}
                  </p>
                  {(testimonial.client_title || testimonial.client_company) && (
                    <p className="text-xs text-muted-foreground truncate">
                      {[testimonial.client_title, testimonial.client_company]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
                {testimonial.rating && (
                  <div className="ml-auto shrink-0">
                    <StarRating rating={testimonial.rating} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
