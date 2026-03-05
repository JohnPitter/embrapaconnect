import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  headline: React.ReactNode;
  description?: string;
  center?: boolean;
  dark?: boolean;
  className?: string;
}

export function SectionHeader({
  label,
  headline,
  description,
  center = false,
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", center && "items-center text-center", className)}>
      {label && (
        <span
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.15em]",
            dark ? "text-light-muted" : "text-mid-green"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-[28px] font-bold leading-tight tracking-tight md:text-[36px]",
          dark ? "text-white" : "text-dark-base"
        )}
      >
        {headline}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl text-[15px] leading-relaxed",
            dark ? "text-light-muted" : "text-gray-600",
            center && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
