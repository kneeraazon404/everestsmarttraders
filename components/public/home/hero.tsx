import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Shield, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/utils";
import type { HomepageSection, SiteSettingsMap } from "@/types";

interface HeroProps {
  settings: Partial<SiteSettingsMap>;
  section?: HomepageSection;
}

const trustPoints = [
  { icon: Shield, label: "6+ Years Experience" },
  { icon: Zap, label: "Rapid Installation" },
  { icon: Lock, label: "24/7 Support" },
];

export function Hero({ settings, section }: HeroProps) {
  const phone = settings.phones?.primary ?? "9860819528";
  const whatsapp = settings.whatsapp ?? phone;
  const heroImage = "/images/home-automation/home-automation-098.jpg";
  const title = section?.title ?? "Smart Security & Automation for Every Space";
  const subtitle =
    section?.subtitle ??
    "From gate automation to smart door locks, hotel systems to access control — we deliver premium solutions backed by expert installation and lifetime support across Nepal.";

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-brand/95 via-brand to-brand/80 text-white">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/35 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="size-2 rounded-full bg-est-amber animate-pulse" />
              Nepal&apos;s Trusted Automation Specialists
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              {title}
            </h1>

            <p className="text-lg text-white/90 leading-relaxed mb-8">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Button asChild size="lg" variant="amber" className="shadow-lg">
                <Link href="/quote">
                  Get a Free Quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/60 text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/showcase#products">Browse Products</Link>
              </Button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6">
              {trustPoints.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-white/85"
                >
                  <Icon className="size-4 text-est-amber shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="relative mt-8 block lg:hidden">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImage}
                  alt="Gate automation installation by Everest Smart Traders"
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand/55 to-transparent" />
              </div>
            </div>
          </div>

          {/* Right: Hero image + floating card */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="Gate automation installation by Everest Smart Traders"
                fill
                sizes="(max-width: 1024px) 0px, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand/60 to-transparent" />
            </div>

            {/* Floating CTA card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-foreground rounded-xl shadow-xl p-5 w-64">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Call us directly
              </p>
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 text-brand font-bold text-lg hover:text-est-amber transition-colors"
              >
                <Phone className="size-5" />
                {phone}
              </a>
              <p className="text-xs text-muted-foreground mt-1">
                Mon–Sat, 9am–6pm
              </p>
              <div className="mt-3 pt-3 border-t border-border">
                <a
                  href={whatsappLink(
                    whatsapp,
                    "Hello, I would like to enquire about your automation products.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#25D366] hover:underline"
                >
                  Chat on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 bg-background"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
      />
    </section>
  );
}
