import { LayoutDashboard, Package, Users } from "lucide-react";
import type { NavItem } from "@/lib/merchant-nav-config";

export const riderNavItems: NavItem[] = [
  { label: "Dashboard", href: "/rider", icon: LayoutDashboard, breadcrumb: "Dashboard" },
  { label: "Deliveries", href: "/rider/deliveries", icon: Package, breadcrumb: "Deliveries" },
  { label: "Team", href: "/rider/team", icon: Users, breadcrumb: "Team" },
];

export function getRiderNavItem(pathname: string): NavItem {
  const item =
    riderNavItems.find((nav) =>
      nav.href === "/rider" ? pathname === "/rider" : pathname.startsWith(nav.href)
    ) ?? riderNavItems[0];
  return item;
}

export function filterRiderNavByRole(
  items: NavItem[],
  canViewTeam: boolean
): NavItem[] {
  return items.filter((item) => item.href !== "/rider/team" || canViewTeam);
}
