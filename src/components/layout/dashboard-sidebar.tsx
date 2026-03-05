"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  User,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/fazendas", label: "Minhas Fazendas", icon: MapPin },
  { href: "/dashboard/avatar", label: "Meu Avatar", icon: User },
  { href: "/dashboard/chat", label: "Chat Embrapa", icon: MessageSquare },
  { href: "/dashboard/perfil", label: "Perfil", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-dark-base border-r border-white/5">
      {/* Logo */}
      <div className="flex h-14 items-center px-6 border-b border-white/5">
        <Link href="/" className="font-display text-[22px] font-black text-lime-accent tracking-tight">
          EC.
        </Link>
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
