import {
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  FileText,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  breadcrumb: string;
}

export const merchantNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    breadcrumb: "Home",
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: Receipt,
    breadcrumb: "Transactions",
  },
  {
    label: "Menu & Costs",
    href: "/menu",
    icon: UtensilsCrossed,
    breadcrumb: "Menu & Costs",
  },
  {
    label: "Invoice Discounting",
    href: "/invoice-discounting",
    icon: FileText,
    breadcrumb: "Invoice Discounting",
  },
  {
    label: "Tax & Compliance",
    href: "/tax-compliance",
    icon: ShieldCheck,
    breadcrumb: "Tax & Compliance",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    breadcrumb: "Settings",
  },
];

export function getMerchantNavItem(pathname: string): NavItem {
  const item =
    merchantNavItems.find((nav) =>
      nav.href === "/" ? pathname === "/" : pathname.startsWith(nav.href)
    ) ?? merchantNavItems[0];
  return item;
}

// Backward compatibility
export const navItems = merchantNavItems;
export const getNavItem = getMerchantNavItem;
