import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { Separator } from "@/components/ui/separator";
import { whatsappLink } from "@/lib/utils";
import { SITE_NAME, PUBLIC_NAV_LINKS } from "@/lib/constants";
import type { SiteSettingsMap } from "@/types";

interface FooterProps {
  settings: Partial<SiteSettingsMap>;
}

const productLinks = [
  { label: "Gate Automation", href: "/products/gate-automation" },
  { label: "Door Access Systems", href: "/products/door-access" },
  { label: "Shutter & Roller Motors", href: "/products/shutter-motors" },
  { label: "Curtain Motors", href: "/products/curtain-motors" },
  { label: "Video Door Phone", href: "/products/video-door-phone" },
  { label: "Access Control", href: "/products/access-control" },
];

const serviceLinks = [
  { label: "Hotel Lock Systems", href: "/services" },
  { label: "Gate Automation", href: "/services" },
  { label: "Smart Door Lock Install", href: "/services" },
  { label: "Rolling Shutter Automation", href: "/services" },
  { label: "Curtain Motor Automation", href: "/services" },
];

export function Footer({ settings }: FooterProps) {
  const locationUrl = "https://maps.app.goo.gl/WXDSNh6swgonpxC17";
  const locationLabel =
    settings.address ?? "Kathmandu, Nepal";
  const phone = settings.phones?.primary ?? "9860819528";
  const phoneSecondary = settings.phones?.secondary;
  const email = settings.email ?? "everestsmarttraders@gmail.com";
  const whatsapp = settings.whatsapp ?? phone;
  const businessName = settings.business_name ?? SITE_NAME;
  const social = settings.social_links ?? {};
  const logo = settings.logo_url ?? "/images/brand-transparent.png";
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="bg-brand text-brand-foreground" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src={logo}
                alt={`${businessName} logo`}
                width={36}
                height={36}
                className="size-9 object-contain"
              />
              <span className="font-bold text-lg">{businessName}</span>
            </Link>
            <p className="text-sm text-brand-foreground/85 leading-relaxed mb-5">
              {settings.tagline ??
                "Smart Security & Automation Solutions — Nepal's trusted supplier and installer."}
            </p>
            <div className="flex gap-3">
              {social.facebook && (
                <a
                  href={social.facebook}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-lg bg-brand-foreground/10 flex items-center justify-center hover:bg-brand-foreground/20 transition-colors"
                >
                  <FacebookIcon className="size-4" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-9 rounded-lg bg-brand-foreground/10 flex items-center justify-center hover:bg-brand-foreground/20 transition-colors"
                >
                  <InstagramIcon className="size-4" />
                </a>
              )}
              <a
                href={whatsappLink(
                  whatsapp,
                  "Hello, I would like to enquire about your products.",
                )}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-lg bg-[#25D366]/20 flex items-center justify-center hover:bg-[#25D366]/30 transition-colors text-[#25D366]"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-brand-foreground/85">
              Products
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-foreground/90 hover:text-brand-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-brand-foreground/85">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-foreground/90 hover:text-brand-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-brand-foreground/85">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-start gap-2.5 text-sm text-brand-foreground/90 hover:text-brand-foreground transition-colors"
                >
                  <Phone className="size-4 mt-0.5 shrink-0" />
                  <span className="wrap-break-word">
                    {phone}
                    {phoneSecondary ? ` / ${phoneSecondary}` : ""}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-2.5 text-sm text-brand-foreground/90 hover:text-brand-foreground transition-colors"
                >
                  <Mail className="size-4 mt-0.5 shrink-0" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(whatsapp)}
                  className="flex items-start gap-2.5 text-sm text-brand-foreground/90 hover:text-brand-foreground transition-colors"
                >
                  <MessageCircle className="size-4 mt-0.5 shrink-0 text-[#25D366]" />
                  <span>WhatsApp: {whatsapp}</span>
                </a>
              </li>
              <li>
                <a
                  href={locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-brand-foreground/90 hover:text-brand-foreground transition-colors"
                >
                  <MapPin className="size-4 mt-0.5 shrink-0" />
                  <span>{locationLabel}</span>
                </a>
              </li>
              {settings.business_hours && (
                <li className="text-sm text-brand-foreground/85">
                  {settings.business_hours}
                </li>
              )}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-brand-foreground/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-foreground/80">
          <p>
            &copy; <span>{currentYear}</span> {businessName}. All rights
            reserved.
          </p>
          <nav className="flex gap-4" aria-label="Footer links">
            <Link
              href="/about"
              className="hover:text-brand-foreground/80 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-brand-foreground/80 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/faq"
              className="hover:text-brand-foreground/80 transition-colors"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
