import {
  LayoutDashboard,
  Building2,
  Store,
  Bike,
  Receipt,
  Banknote,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Users,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/lib/merchant-nav-config";

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, breadcrumb: "Dashboard" },
  { label: "Partners", href: "/admin/partners", icon: Building2, breadcrumb: "Partners" },
  { label: "Merchants", href: "/admin/merchants", icon: Store, breadcrumb: "Merchants" },
  { label: "Riders", href: "/admin/riders", icon: Bike, breadcrumb: "Riders" },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt, breadcrumb: "Transactions" },
  { label: "Settlements", href: "/admin/settlements", icon: Banknote, breadcrumb: "Settlements" },
  { label: "Invoice Discounting", href: "/admin/invoice-discounting", icon: FileText, breadcrumb: "Invoice Discounting" },
  { label: "Tax & Compliance", href: "/admin/tax-compliance", icon: ShieldCheck, breadcrumb: "Tax & Compliance" },
  { label: "Risk Management", href: "/admin/risk", icon: AlertTriangle, breadcrumb: "Risk Management" },
  { label: "System Health", href: "/admin/system-health", icon: Activity, breadcrumb: "System Health" },
  { label: "Team & Roles", href: "/admin/team", icon: Users, breadcrumb: "Team & Roles" },
  { label: "Settings", href: "/admin/settings", icon: Settings, breadcrumb: "Settings" },
];

export function getAdminNavItem(pathname: string): NavItem {
  const item =
    adminNavItems.find((nav) =>
      nav.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(nav.href)
    ) ?? adminNavItems[0];
  return item;
}
