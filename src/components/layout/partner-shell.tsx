"use client";

import { AppShell } from "./app-shell";
import { partnerNavItems, getPartnerNavItem } from "@/lib/partner-nav-config";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getPartnerRoleLabel, isPartnerRole } from "@/lib/rbac/partner";

function PartnerSidebarFooter() {
  const session = getSession();
  if (!session || session.accountType !== "partner") return null;

  const roleLabel = isPartnerRole(session.role)
    ? getPartnerRoleLabel(session.role)
    : "Admin";

  return (
    <>
      <p className="truncate text-sm font-medium text-white">{session.name}</p>
      <Badge className="mt-1.5 border-white/20 bg-white/10 text-[10px] text-white">
        {roleLabel}
      </Badge>
      <Badge className="mt-1.5 border-rider-amber/30 bg-rider-amber/10 text-[10px] text-rider-amber">
        Partner
      </Badge>
    </>
  );
}

export function PartnerShell({ children }: { children: React.ReactNode }) {
  const session = getSession();
  const initials = session?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "LC";

  return (
    <AppShell
      navItems={partnerNavItems}
      getNavItem={getPartnerNavItem}
      sidebarFooter={<PartnerSidebarFooter />}
      avatarFallback={initials}
      menuItems={[
        { label: session?.name ?? "Partner" },
        { label: session?.email ?? "" },
      ]}
      searchPlaceholder="Search merchants, riders..."
    >
      {children}
    </AppShell>
  );
}
