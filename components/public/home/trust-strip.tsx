import { CheckCircle2, Users, Wrench, Headphones } from "lucide-react";

const stats = [
  {
    icon: CheckCircle2,
    value: "500+",
    label: "Installations Completed",
  },
  {
    icon: Users,
    value: "300+",
    label: "Happy Clients",
  },
  {
    icon: Wrench,
    value: "6+",
    label: "Years in Business",
  },
  {
    icon: Headphones,
    value: "24/7",
    label: "After-Sales Support",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground tracking-tight">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground leading-snug">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
