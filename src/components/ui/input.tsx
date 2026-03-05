import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export function Input({ className, label, error, dark = false, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-[12px] font-medium uppercase tracking-wider",
            dark ? "text-light-muted" : "text-gray-600"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "rounded-full px-6 py-3 text-[14px] outline-none transition-all duration-200",
          "focus:ring-2 focus:ring-lime-accent/50",
          dark
            ? "border border-white/20 bg-white/10 text-white placeholder:text-light-muted/60"
            : "border border-gray-200 bg-white text-dark-base placeholder:text-gray-400",
          error && "border-red-500 focus:ring-red-500/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
