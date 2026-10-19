"use client";

import { AppShell } from "./app-shell";
import { merchantNavItems, getMerchantNavItem } from "@/lib/merchant-nav-config";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getMerchantRoleLabel, isMerchantRole } from "@/lib/rbac/merchant";
import { merchant } from "@/lib/mock-data";

function MerchantSidebarFooter() {
  const session = getSession();
  const roleLabel =
    session?.accountType === "merchant" && isMerchantRole(session.role)
      ? getMerchantRoleLabel(session.role)
      : "Owner";

  return (
    <>
      <p className="truncate text-sm font-medium text-white">{merchant.name}</p>
      <p className="mt-0.5 text-xs text-gray-400">{merchant.jazzCashNumber}</p>
      <Badge className="mt-1.5 border-white/20 bg-white/10 text-[10px] text-white">
        {roleLabel}
      </Badge>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-primary-green" />
        <span className="text-xs text-primary-green">{merchant.status}</span>
      </div>
    </>
  );
}

export function MerchantShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      navItems={merchantNavItems}
      getNavItem={getMerchantNavItem}
      sidebarFooter={<MerchantSidebarFooter />}
      avatarFallback="KFC"
      menuItems={[
        { label: merchant.name },
        { label: merchant.jazzCashNumber },
      ]}
      searchPlaceholder="Search transactions..."
    >
      {children}
    </AppShell>
  );
}

export const DashboardShell = MerchantShell;
