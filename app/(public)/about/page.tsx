import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTABand } from "@/components/public/home/cta-band";
import { getSiteSettings } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Everest Smart Traders",
  description:
    "Everest Smart Traders — Nepal's trusted automation and security specialists since 2021, supplying and installing gate motors, smart locks, access control, and more.",
};

const values = [
  {
    title: "Quality Assurance",
    description:
      "We only supply genuine, warranty-backed products from globally trusted manufacturers.",
  },
  {
    title: "Expert Team",
    description:
      "Our certified technicians bring years of hands-on installation and support experience.",
  },
  {
    title: "Customer First",
    description:
      "Every project starts with understanding your needs and ends with your complete satisfaction.",
  },
  {
    title: "Reliable Support",
    description:
      "We stand behind every installation with comprehensive after-sales service and maintenance.",
  },
];

const milestones = [
  {
    year: "2021",
    event: "Founded in Kathmandu with a focus on gate automation systems",
  },
  {
    year: "2022",
    event: "Expanded into hotel lock systems and smart door locks",
  },
  {
    year: "2023",
    event: "Became authorized dealer for international automation brands",
  },
  {
    year: "2024",
    event: "Launched access control and video door phone product lines",
  },
  { year: "2025", event: "Surpassed 500 completed installations across Nepal" },
  {
    year: "2026",
    event: "Expanded service coverage nationwide with dedicated support team",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      {/* Hero */}
      <section className="bg-brand text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-widest text-est-amber">
                About Everest Smart Traders
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
                Nepal&apos;s Trusted Automation &amp; Security Specialists
              </h1>
              <p className="text-white/75 text-lg leading-relaxed">
                Since 2021, we have been transforming how homes, hotels,
                offices, and industries across Nepal approach security and
                automation — delivering premium solutions with expert
                installation and unmatched after-sales support.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button asChild size="lg" variant="amber">
                  <Link href="/quote">Get a Quote</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={`tel:${settings.phones?.primary ?? "9860819528"}`}>
                    <Phone className="size-4" />
                    Call Us
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden hidden lg:block">
              <Image
                src="/images/home-automation/home-automation-012.jpg"
                alt="Everest Smart Traders team"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "2021", label: "Established" },
              { value: "6+", label: "Years in Business" },
              { value: "500+", label: "Installations" },
              { value: "350+", label: "Happy Clients" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-brand">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Our Story
          </h2>
          <div className="prose prose-est max-w-none">
            <p>
              Everest Smart Traders was founded with a simple mission: to make
              world-class automation and security technology accessible to every
              home, hotel, and business in Nepal. We recognized that Nepali
              consumers deserved access to the same reliable, intelligent
              systems that modern buildings across the world depend on.
            </p>
            <p>
              Since launching in 2021 with gate automation systems in Kathmandu,
              we quickly expanded our portfolio to include hotel lock systems,
              smart door locks, video door phones, access control systems, and
              motorized shutters and curtains. Today, we serve clients ranging
              from individual homeowners to large hotel chains and commercial
              complexes.
            </p>
            <p>
              Our commitment to quality is unwavering — we only deal in genuine
              products from authorized brands, and every installation is handled
              by our trained in-house technicians. We believe that security is
              not a luxury, and our pricing reflects our commitment to making
              these technologies affordable.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10 text-center">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ title, description }) => (
              <div
                key={title}
                className="p-5 bg-card border border-border rounded-xl"
              >
                <CheckCircle2 className="size-8 text-brand mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-10 text-center">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-16 sm:left-20 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-6 sm:gap-8 items-start">
                  <div className="w-16 sm:w-20 shrink-0 text-right">
                    <span className="text-sm font-bold text-brand">{year}</span>
                  </div>
                  <div className="relative flex items-start gap-4 flex-1 pb-2">
                    <div className="relative z-10 flex size-3 shrink-0 items-center justify-center rounded-full bg-brand mt-1.5" />
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTABand settings={settings} />
    </>
  );
}
