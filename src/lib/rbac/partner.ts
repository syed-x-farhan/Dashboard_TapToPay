export type PartnerRole = "owner" | "admin" | "manager" | "viewer";

export type PartnerAction =
  | "view_dashboard"
  | "manage_merchants"
  | "manage_riders"
  | "approve_discounting"
  | "manage_settlements"
  | "manage_webhooks"
  | "manage_settings"
  | "manage_reports"
  | "export_data";

const PERMISSIONS: Record<PartnerRole, PartnerAction[]> = {
  owner: [
    "view_dashboard",
    "manage_merchants",
    "manage_riders",
    "approve_discounting",
    "manage_settlements",
    "manage_webhooks",
    "manage_settings",
    "manage_reports",
    "export_data",
  ],
  admin: [
    "view_dashboard",
    "manage_merchants",
    "manage_riders",
    "approve_discounting",
    "manage_settlements",
    "manage_webhooks",
    "manage_settings",
    "manage_reports",
    "export_data",
  ],
  manager: [
    "view_dashboard",
    "manage_merchants",
    "manage_riders",
    "approve_discounting",
    "manage_settlements",
    "manage_reports",
    "export_data",
  ],
  viewer: ["view_dashboard", "export_data"],
};

export function canPartner(role: PartnerRole, action: PartnerAction): boolean {
  return PERMISSIONS[role].includes(action);
}

export function getPartnerRoleLabel(role: PartnerRole): string {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  if (role === "manager") return "Manager";
  return "Viewer";
}

export function isPartnerRole(role: string): role is PartnerRole {
  return role === "owner" || role === "admin" || role === "manager" || role === "viewer";
}
