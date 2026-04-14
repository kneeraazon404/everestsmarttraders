import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";
import { getSiteSettings } from "@/lib/supabase/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Everest Smart Traders",
  description:
    "Get in touch with Everest Smart Traders — call, email, or visit our showroom in Kathmandu. We're here to help with all your automation and security needs.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const locationUrl = "https://maps.app.goo.gl/WXDSNh6swgonpxC17";
  const mapEmbedSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.32024905902!2d85.31671451243716!3d27.676495226749722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19007624b50b%3A0x98e1a48a7ee6e870!2sEverest%20Smart%20Traders!5e0!3m2!1sen!2snp!4v1776147661054!5m2!1sen!2snp";
  const address = settings.address ?? "Kathmandu, Nepal";
  const phone1 = settings.phones?.primary ?? "9860819528";
  const phone2 = settings.phones?.secondary;
  const email = settings.email ?? "everestsmarttraders@gmail.com";
  const businessHours =
    settings.business_hours ?? "Sun–Fri: 9am–6pm, Sat: 10am–4pm";

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-est-amber">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Contact Everest Smart Traders
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            Have a question or ready to get started? Our team is here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-xl">
              <h2 className="font-semibold text-foreground mb-5">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${phone1}`}
                      className="text-sm font-medium text-foreground hover:text-brand transition-colors block"
                    >
                      {phone1}
                    </a>
                    {phone2 && (
                      <a
                        href={`tel:${phone2}`}
                        className="text-sm font-medium text-foreground hover:text-brand transition-colors block"
                      >
                        {phone2}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-medium text-foreground hover:text-brand transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <a
                      href={locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground hover:text-brand transition-colors"
                    >
                      {address}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Business Hours
                    </p>
                    <p className="text-sm text-foreground">{businessHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map embed */}
            <div className="relative aspect-4/3 bg-muted rounded-xl overflow-hidden border border-border">
              <iframe
                title="Everest Smart Traders location map"
                src={mapEmbedSrc}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="p-6 sm:p-8 bg-card border border-border rounded-xl">
              <h2 className="font-semibold text-foreground text-lg mb-6">
                Send us a Message
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
