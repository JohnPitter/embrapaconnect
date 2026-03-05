import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-accent/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary: "bg-lime-accent text-dark-base hover:brightness-110 hover:scale-[1.02]",
        outlined: "border-2 border-white text-white hover:bg-lime-accent hover:text-dark-base hover:border-lime-accent",
        ghost: "text-light-muted hover:text-white",
        danger: "bg-red-500 text-white hover:bg-red-600",
        secondary: "bg-white/10 text-white hover:bg-white/20",
      },
      size: {
        sm: "px-4 py-2 text-[12px]",
        md: "px-6 py-2.5 text-[13px]",
        lg: "px-8 py-3 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  arrow?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  arrow,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
      {arrow && !loading && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
