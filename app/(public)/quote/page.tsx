import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "./quote-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Free Quote | Everest Smart Traders",
  description:
    "Request a free quote for gate automation, smart locks, hotel security systems, access control, and more. We'll respond within 24 hours.",
};

const benefits = [
  "Free site assessment included",
  "Detailed itemized quotation",
  "Multiple solution options",
  "No obligation — compare freely",
  "Flexible installation scheduling",
  "Transparent pricing, no hidden fees",
];

export default async function QuotePage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-est-amber">
                Free Consultation
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Get a Free Quote Today
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Tell us about your project and we&apos;ll prepare a detailed,
                no-obligation quote tailored to your needs and budget.
              </p>
            </div>

            <div className="p-5 bg-brand/5 border border-brand/20 rounded-xl">
              <h2 className="font-semibold text-foreground mb-4 text-sm">
                What&apos;s Included
              </h2>
              <ul className="space-y-2.5">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="size-4 text-brand shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 bg-est-amber/10 border border-est-amber/30 rounded-xl">
              <p className="text-sm font-semibold text-foreground mb-1">
                Prefer to talk directly?
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Our team is available Mon–Sat, 9am–6pm.
              </p>
              <a
                href="tel:9860819528"
                className="text-brand font-semibold text-lg hover:text-est-amber transition-colors"
              >
                9860819528
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <div className="p-6 sm:p-8 bg-card border border-border rounded-xl shadow-sm">
              <h2 className="font-semibold text-foreground text-lg mb-6">
                Quote Request Form
              </h2>
              <QuoteForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
