"use client";

import { AppShell } from "./app-shell";
import { Badge } from "@/components/ui/badge";
import {
  filterRiderNavByRole,
  getRiderNavItem,
  riderNavItems,
} from "@/lib/rider-nav-config";
import { getRiderRoleLabel } from "@/lib/rbac/rider";
import { getRiderSession, riderLogout } from "@/lib/rider-auth";
import { useRiderCan } from "@/hooks/use-permission";

function RiderSidebarFooter() {
  const session = getRiderSession();
  if (!session) return null;

  return (
    <>
      <p className="truncate text-sm font-medium text-white">{session.name}</p>
      <Badge className="mt-1.5 border-white/20 bg-white/10 text-[10px] text-white">
        {getRiderRoleLabel(session.role)}
      </Badge>
      <Badge className="mt-1.5 border-rider-blue/40 bg-rider-blue/20 text-[10px] font-semibold text-rider-blue">
        Rider
      </Badge>
    </>
  );
}

export function RiderShell({ children }: { children: React.ReactNode }) {
  const session = getRiderSession();
  const canViewTeam = useRiderCan("view_team");
  const navItems = filterRiderNavByRole(riderNavItems, canViewTeam);
  const initials = session?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "RD";

  return (
    <AppShell
      navItems={navItems}
      getNavItem={getRiderNavItem}
      sidebarFooter={<RiderSidebarFooter />}
      avatarFallback={initials}
      menuItems={[
        { label: session?.name ?? "Rider" },
        { label: session?.partnerName ?? "" },
      ]}
      searchPlaceholder="Search deliveries..."
      signOutPath="/rider/login"
      onSignOut={riderLogout}
    >
      {children}
    </AppShell>
  );
}
