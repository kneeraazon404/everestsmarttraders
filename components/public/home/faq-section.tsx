"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/public/shared/section-header";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

interface FAQSectionProps {
  faqs: FAQ[];
}

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <Button
        type="button"
        variant="ghost"
        onClick={onToggle}
        className="flex h-auto w-full items-center justify-between gap-4 rounded-none p-5 text-left hover:bg-muted/50"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-foreground leading-snug">
          {faq.question}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </Button>
      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) return null;

  const display = faqs.slice(0, 6);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="FAQ"
          title="Common Questions"
          subtitle="Everything you need to know about our products, installation process, and after-sales service."
          className="mb-12"
        />

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {display.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-est-amber transition-colors"
          >
            View all FAQs
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
