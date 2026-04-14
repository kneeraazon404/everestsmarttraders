"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";
import type { SiteSettingsMap } from "@/types";

interface HeaderProps {
  settings: Partial<SiteSettingsMap>;
}

export function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = "mobile-site-menu";

  const phone = settings.phones?.primary ?? "9860819528";
  const whatsapp = settings.whatsapp ?? phone;
  const businessName = settings.business_name ?? "Everest Smart Traders";
  const logo = settings.logo_url ?? "/images/brand-transparent.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-primary"
            aria-label={`${businessName} — Home`}
          >
            <Image
              src={logo}
              alt={`${businessName} logo`}
              width={34}
              height={34}
              className="size-8 object-contain"
              priority
            />
            <span className="hidden sm:block text-base leading-tight">
              {businessName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {PUBLIC_NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
            >
              <Phone className="size-3.5" />
              <span>{phone}</span>
            </a>
            <Button asChild variant="amber" size="sm">
              <Link href="/quote">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile: phone + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`https://wa.me/977${whatsapp}`}
              aria-label="WhatsApp"
              className="flex items-center justify-center size-9 rounded-lg text-[#25D366] hover:bg-muted transition-colors"
            >
              <MessageCircle className="size-5" />
            </a>
            <Button
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              variant="ghost"
              size="icon"
              className="size-9"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id={mobileMenuId}
          className="lg:hidden border-t border-border bg-background"
        >
          <nav
            className="mx-auto max-w-7xl px-4 py-4 space-y-1"
            aria-label="Mobile navigation"
          >
            {PUBLIC_NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 flex flex-col gap-2">
              <Button asChild variant="amber" className="w-full">
                <Link href="/quote" onClick={() => setMobileOpen(false)}>
                  Request a Quote
                </Link>
              </Button>
              <Button
                asChild
                type="button"
                variant="outline"
                className="w-full"
              >
                <a href={`tel:${phone}`}>
                  <Phone className="size-4" />
                  Call {phone}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
