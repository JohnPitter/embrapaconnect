import { cn } from "@/lib/utils";

interface StatBlockProps {
  value: string;
  label: string;
  accent?: boolean;
  className?: string;
}

export function StatBlock({ value, label, accent = false, className }: StatBlockProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "font-display text-[56px] font-black leading-none tracking-tight",
          accent ? "text-lime-accent" : "text-white"
        )}
      >
        {value}
      </span>
      <span className="text-[13px] text-light-muted">{label}</span>
    </div>
  );
}
