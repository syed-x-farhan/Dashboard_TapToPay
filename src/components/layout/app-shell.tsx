"use client";

import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { MobileNav } from "./mobile-nav";
import type { NavItem } from "@/lib/merchant-nav-config";

interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  getNavItem: (pathname: string) => NavItem;
  sidebarFooter: React.ReactNode;
  avatarFallback: string;
  menuItems: { label: string; onClick?: () => void }[];
  searchPlaceholder?: string;
  signOutPath?: string;
  onSignOut?: () => void;
}

export function AppShell({
  children,
  navItems,
  getNavItem,
  sidebarFooter,
  avatarFallback,
  menuItems,
  searchPlaceholder,
  signOutPath,
  onSignOut,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-content">
      <Sidebar navItems={navItems} footer={sidebarFooter} />
      <div className="md:ml-[240px]">
        <TopNavbar
          getNavItem={getNavItem}
          avatarFallback={avatarFallback}
          menuItems={menuItems}
          searchPlaceholder={searchPlaceholder}
          signOutPath={signOutPath}
          onSignOut={onSignOut}
        />
        <main className="p-4 pb-24 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileNav navItems={navItems} />
    </div>
  );
}
