import {
  LayoutDashboard,
  Store,
  Bike,
  Receipt,
  Banknote,
  FileText,
  BarChart3,
  Webhook,
  Settings,
} from "lucide-react";
import type { NavItem } from "./merchant-nav-config";

export const partnerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/partner", icon: LayoutDashboard, breadcrumb: "Dashboard" },
  { label: "Merchants", href: "/partner/merchants", icon: Store, breadcrumb: "Merchants" },
  { label: "Riders", href: "/partner/riders", icon: Bike, breadcrumb: "Riders" },
  { label: "Transactions", href: "/partner/transactions", icon: Receipt, breadcrumb: "Transactions" },
  { label: "Settlements", href: "/partner/settlements", icon: Banknote, breadcrumb: "Settlements" },
  { label: "Invoice Discounting", href: "/partner/invoice-discounting", icon: FileText, breadcrumb: "Invoice Discounting" },
  { label: "Reports", href: "/partner/reports", icon: BarChart3, breadcrumb: "Reports" },
  { label: "API & Webhooks", href: "/partner/api-webhooks", icon: Webhook, breadcrumb: "API & Webhooks" },
  { label: "Settings", href: "/partner/settings", icon: Settings, breadcrumb: "Settings" },
];

export function getPartnerNavItem(pathname: string): NavItem {
  const item =
    partnerNavItems.find((nav) =>
      nav.href === "/partner"
        ? pathname === "/partner"
        : pathname.startsWith(nav.href)
    ) ?? partnerNavItems[0];
  return item;
}
