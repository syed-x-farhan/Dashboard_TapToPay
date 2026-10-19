"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/merchant-nav-config";

interface MobileNavProps {
  navItems: NavItem[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const pathname = usePathname();
  const displayItems = navItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-light-border bg-white px-1 py-2 md:hidden">
      {displayItems.map((item) => {
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
              "flex flex-col items-center gap-0.5 rounded-lg px-1.5 py-1 text-[9px] font-medium",
              isActive ? "text-primary-green" : "text-medium-text"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="max-w-[52px] truncate">
              {item.label.split(" ")[0]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
