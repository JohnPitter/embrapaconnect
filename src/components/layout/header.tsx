import { Bell } from "lucide-react";

interface HeaderProps {
  title?: string;
  breadcrumb?: string[];
}

export function Header({ title, breadcrumb }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/5 bg-off-white/95 px-8 backdrop-blur-sm">
      <div>
        {breadcrumb && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            {breadcrumb.join(" / ")}
          </p>
        )}
        {title && (
          <h1 className="font-display text-[20px] font-bold text-dark-base leading-tight">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-black/5 transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-8 w-8 rounded-full bg-lime-accent/20 border-2 border-lime-accent flex items-center justify-center">
          <span className="text-[11px] font-black text-lime-accent">JF</span>
        </div>
      </div>
    </header>
  );
}
