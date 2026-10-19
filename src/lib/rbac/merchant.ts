export type MerchantRole = "owner" | "manager" | "staff" | "viewer";

export type MerchantAction =
  | "view_dashboard"
  | "view_transactions"
  | "export_transactions"
  | "request_discounting"
  | "manage_settings";

const PERMISSIONS: Record<MerchantRole, MerchantAction[]> = {
  owner: [
    "view_dashboard",
    "view_transactions",
    "export_transactions",
    "request_discounting",
    "manage_settings",
  ],
  manager: [
    "view_dashboard",
    "view_transactions",
    "export_transactions",
    "request_discounting",
  ],
  staff: ["view_dashboard", "view_transactions", "request_discounting"],
  viewer: ["view_dashboard", "view_transactions"],
};

export function canMerchant(role: MerchantRole, action: MerchantAction): boolean {
  return PERMISSIONS[role].includes(action);
}

export function getMerchantRoleLabel(role: MerchantRole): string {
  if (role === "owner") return "Owner";
  if (role === "manager") return "Manager";
  if (role === "staff") return "Staff";
  return "Viewer";
}

export function isMerchantRole(role: string): role is MerchantRole {
  return role === "owner" || role === "manager" || role === "staff" || role === "viewer";
}
