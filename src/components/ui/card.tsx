import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-dark-green p-7",
        hover && "transition-all duration-200 hover:border-lime-accent/30",
        className
      )}
      {...props}
    />
  );
}

export function CardLight({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-black/5 bg-white p-7 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
