"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

interface FAQClientProps {
  grouped: Record<string, FAQ[]>;
}

export function FAQClient({ grouped }: FAQClientProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = Object.keys(grouped);

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category}>
          {categories.length > 1 && (
            <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
              {category}
            </h2>
          )}
          <div className="space-y-2">
            {grouped[category].map((faq) => (
              <div
                key={faq.id}
                className="border border-border rounded-xl overflow-hidden"
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="flex h-auto w-full items-center justify-between gap-4 rounded-none p-5 text-left hover:bg-muted/50"
                  aria-expanded={openId === faq.id}
                >
                  <span className="font-medium text-foreground leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      openId === faq.id && "rotate-180",
                    )}
                  />
                </Button>
                <div
                  className={cn(
                    "grid transition-all duration-200",
                    openId === faq.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-0 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
