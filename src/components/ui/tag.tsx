import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-tag-bg px-3 py-1 text-[11px] font-medium text-tag-text",
        className
      )}
      {...props}
    />
  );
}
