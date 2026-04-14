import Link from "next/link";
import { Phone, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/utils";
import type { HomepageSection, SiteSettingsMap } from "@/types";

interface CTABandProps {
  settings: Partial<SiteSettingsMap>;
  section?: HomepageSection;
}

export function CTABand({ settings, section }: CTABandProps) {
  const phone = settings.phones?.primary ?? "9860819528";
  const whatsapp = settings.whatsapp ?? phone;
  const title = section?.title ?? "Ready to Secure & Automate Your Space?";
  const subtitle =
    section?.subtitle ??
    "Get a free site assessment and custom quote. Our team will help you choose the right solution within your budget.";

  return (
    <section className="py-16 sm:py-20 bg-linear-to-r from-brand via-brand/95 to-brand/90 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
              {title}
            </h2>
            <p className="text-white/90 text-lg">{subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
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
              <a
                href={whatsappLink(
                  whatsapp,
                  "Hello Everest Smart Traders, I would like a consultation for automation solutions.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="size-4" />
                WhatsApp Us
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white/60 text-white hover:bg-white/20 hover:text-white"
            >
              <a href={`tel:${phone}`}>
                <Phone className="size-4" />
                Call Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
