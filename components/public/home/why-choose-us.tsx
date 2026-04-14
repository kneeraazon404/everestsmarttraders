import {
  ShieldCheck,
  Wrench,
  Award,
  Clock,
  MapPin,
  Headphones,
} from "lucide-react";
import { SectionHeader } from "@/components/public/shared/section-header";
import type { HomepageSection } from "@/types";

const reasons = [
  {
    icon: Award,
    title: "Authorized Dealers",
    description:
      "Official distributors of CAME, BFT, Nice, and other globally recognized automation brands.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Products Only",
    description:
      "Every product comes with manufacturer warranty. We never compromise on quality or authenticity.",
  },
  {
    icon: Wrench,
    title: "Expert Installation",
    description:
      "Our certified technicians handle site assessment, professional installation, and thorough testing.",
  },
  {
    icon: Headphones,
    title: "After-Sales Support",
    description:
      "Dedicated support team available for maintenance, repair, and troubleshooting when you need us.",
  },
  {
    icon: MapPin,
    title: "Nepal-Wide Reach",
    description:
      "Based in Kathmandu with service coverage across major cities and districts throughout Nepal.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "We respect your timeline. From quotation to completion, we deliver on schedule every time.",
  },
];

type SectionReason = {
  title?: string;
  description?: string;
};

interface WhyChooseUsProps {
  section?: HomepageSection;
}

export function WhyChooseUs({ section }: WhyChooseUsProps) {
  const content = section?.content as { reasons?: SectionReason[] } | undefined;
  const fallbackReasons = reasons.map((reason) => ({
    title: reason.title,
    description: reason.description,
  }));
  const mergedReasons = (content?.reasons?.length ? content.reasons : fallbackReasons).map((reason, index) => ({
    ...reason,
    icon: reasons[index % reasons.length].icon,
  }));

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-brand text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Why Everest Smart Traders"
          title={section?.title ?? "The EST Difference"}
          subtitle={section?.subtitle ?? "Over a decade of experience delivering smart, reliable automation and security solutions across Nepal."}
          className="mb-14 [&_span]:text-est-amber [&_h2]:text-white [&_p]:text-white/90"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mergedReasons.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-xl bg-white/10 border border-white/25 hover:bg-white/15 transition-colors"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-est-amber/20 text-est-amber">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-sm text-white/85 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
