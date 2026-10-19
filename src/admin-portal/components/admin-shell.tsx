"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { adminNavItems, getAdminNavItem } from "@/admin-portal/lib/nav-config";
import {
  adminLogout,
  getAdminRoleLabel,
  getAdminSession,
} from "@/admin-portal/lib/auth";

function AdminSidebarFooter() {
  const session = getAdminSession();

  if (!session) return null;

  return (
    <>
      <p className="truncate text-sm font-medium text-white">{session.name}</p>
      <Badge className="mt-1.5 border-white/20 bg-white/10 text-[10px] text-white">
        {getAdminRoleLabel(session.role)}
      </Badge>
      <Badge className="mt-1.5 border-rider-red/40 bg-rider-red/20 text-[10px] font-semibold text-rider-red">
        Admin
      </Badge>
    </>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const session = getAdminSession();
  const initials = session?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "AD";

  return (
    <AppShell
      navItems={adminNavItems}
      getNavItem={getAdminNavItem}
      sidebarFooter={<AdminSidebarFooter />}
      avatarFallback={initials}
      menuItems={[
        { label: session?.name ?? "Admin" },
        { label: session?.email ?? "" },
      ]}
      searchPlaceholder="Search partners, merchants, riders..."
      signOutPath="/admin/login"
      onSignOut={adminLogout}
    >
      {children}
    </AppShell>
  );
}
