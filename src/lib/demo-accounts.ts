import { listAdminDemoAccounts } from "@/admin-portal/lib/auth";
import { listPortalDemoAccounts } from "@/lib/auth";
import { listRiderDemoAccounts } from "@/lib/rider-auth";

export type DemoPortal = "Merchant" | "Partner" | "Admin" | "Rider";

export interface DemoAccount {
  portal: DemoPortal;
  email: string;
  password: string;
  name: string;
  role: string;
  loginHref: string;
}

const PORTAL_ORDER: DemoPortal[] = ["Merchant", "Partner", "Admin", "Rider"];

function formatRole(role: string) {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getDemoAccountGroups() {
  const accounts: DemoAccount[] = [
    ...listPortalDemoAccounts(),
    ...listAdminDemoAccounts(),
    ...listRiderDemoAccounts(),
  ].map((account) => ({
    ...account,
    role: formatRole(account.role),
  }));

  return PORTAL_ORDER.map((portal) => ({
    portal,
    loginHref: accounts.find((account) => account.portal === portal)?.loginHref ?? "/login",
    accounts: accounts.filter((account) => account.portal === portal),
  })).filter((group) => group.accounts.length > 0);
}
