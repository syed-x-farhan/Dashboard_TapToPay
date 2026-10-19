"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";
import type { NavItem } from "@/lib/merchant-nav-config";

interface TopNavbarProps {
  getNavItem: (pathname: string) => NavItem;
  avatarFallback: string;
  menuItems: { label: string; onClick?: () => void }[];
  searchPlaceholder?: string;
  signOutPath?: string;
  onSignOut?: () => void;
}

export function TopNavbar({
  getNavItem,
  avatarFallback,
  menuItems,
  searchPlaceholder = "Search...",
  signOutPath = "/login",
  onSignOut,
}: TopNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItem = getNavItem(pathname);

  function handleSignOut() {
    if (onSignOut) {
      onSignOut();
    } else {
      logout();
    }
    router.push(signOutPath);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-light-border bg-white px-4 md:px-6">
      <div>
        <h1 className="text-lg font-semibold text-dark-text">{navItem.label}</h1>
        <div className="flex items-center gap-1 text-xs text-medium-text">
          <span>Home</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-dark-text">{navItem.breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-text" />
          <Input
            placeholder={searchPlaceholder}
            className="w-56 rounded-xl border-light-border pl-9 md:w-64"
          />
        </div>

        <button
          type="button"
          className="relative rounded-xl p-2 hover:bg-content"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-dark-text" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rider-red" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-green">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-sidebar text-xs text-white">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.label} onClick={item.onClick}>
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              className="text-rider-red focus:text-rider-red"
              onClick={handleSignOut}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
