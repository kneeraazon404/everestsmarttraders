import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTABand } from "@/components/public/home/cta-band";
import {
  getIndustries,
  getIndustryBySlug,
  getSiteSettings,
} from "@/lib/supabase/queries";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const industries = await getIndustries();
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);
  if (!industry) return {};

  return {
    title: `${industry.name} Solutions | Everest Smart Traders`,
    description:
      industry.description ??
      `Smart security and automation solutions for ${industry.name} — supplied and installed by Everest Smart Traders across Nepal.`,
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;

  const [industry, settings] = await Promise.all([
    getIndustryBySlug(slug),
    getSiteSettings(),
  ]);

  if (!industry) notFound();

  // solutions_summary is a text field; split by newlines/bullets for display
  const solutions = industry.solutions_summary
    ? industry.solutions_summary
        .split(/\n|•|-/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand text-white py-16 sm:py-20 overflow-hidden">
        {industry.cover_image_url && (
          <Image
            src={industry.cover_image_url}
            alt={industry.name}
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-est-amber mb-4 inline-block">
            Industry Solutions
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {industry.name}
          </h1>
          {industry.description && (
            <p className="text-white/75 text-lg max-w-2xl mx-auto">
              {industry.description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {solutions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-foreground mb-5">
                Our Solutions for {industry.name}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {solutions.map((solution, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-4 bg-muted/40 rounded-lg"
                  >
                    <CheckCircle2 className="size-5 text-brand shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-snug">
                      {solution}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="default">
              <Link href="/quote">Request a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/showcase#products">Browse Products</Link>
            </Button>
          </div>

          <div className="mt-8">
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-4" />
              All Industries
            </Link>
          </div>
        </div>
      </section>

      <CTABand settings={settings} />
    </>
  );
}
