import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-est-amber">
          {label}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
