"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Tractor,
  Users,
  MessageSquare,
  LogOut,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/mapa", label: "Mapa Geográfico", icon: Map },
  { href: "/admin/fazendas", label: "Fazendas", icon: Tractor },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/chat", label: "Central de Chat", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-dark-base border-r border-white/5">
      {/* Logo com badge Embrapa */}
      <div className="flex h-14 items-center gap-2 px-6 border-b border-white/5">
        <Link href="/" className="font-display text-[22px] font-black text-lime-accent tracking-tight">
          EC.
        </Link>
        <span className="rounded-full bg-lime-accent/20 px-2 py-0.5 text-[10px] font-semibold text-lime-accent uppercase tracking-wider">
          Admin
        </span>
      </div>

      {/* Embrapa label */}
      <div className="px-6 py-3 flex items-center gap-2 border-b border-white/5">
        <Leaf className="h-3.5 w-3.5 text-lime-accent" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-light-muted/60">
          Painel Embrapa
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
                isActive
                  ? "bg-lime-accent/10 text-lime-accent"
                  : "text-light-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-light-muted transition-all hover:bg-red-500/10 hover:text-red-400">
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
