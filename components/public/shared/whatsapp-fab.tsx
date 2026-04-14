"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import type { SiteSettingsMap } from "@/types";

interface WhatsappFabProps {
  settings: Partial<SiteSettingsMap>;
}

export function WhatsappFab({ settings }: WhatsappFabProps) {
  const whatsapp = settings.whatsapp ?? settings.phones?.primary ?? "9860819528";

  return (
    <a
      href={whatsappLink(
        whatsapp,
        "Hello Everest Smart Traders, I would like to enquire about your products."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20BA5C] active:scale-95 transition-all px-4 py-3 text-sm font-semibold md:px-5"
    >
      <MessageCircle className="size-5 shrink-0" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
