"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nfc } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/merchant-nav-config";

interface SidebarProps {
  navItems: NavItem[];
  footer: React.ReactNode;
}

export function Sidebar({ navItems, footer }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <Nfc className="h-5 w-5 text-primary-green" strokeWidth={1.5} />
        <span className="text-lg font-semibold text-white">RiderPay</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" || item.href === "/partner"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-dark-text"
                  : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">{footer}</div>
    </aside>
  );
}
