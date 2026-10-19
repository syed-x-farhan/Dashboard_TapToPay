import type { AdminRole } from "../types";

export type AdminAction =
  | "view_all"
  | "manage_partners"
  | "delete_partners"
  | "manage_merchants"
  | "manage_riders"
  | "manage_settings"
  | "file_taxes"
  | "bulk_settle"
  | "approve_discounting"
  | "manage_team"
  | "change_fee_rates"
  | "test_integrations"
  | "manage_risk"
  | "export_data";

const PERMISSIONS: Record<AdminRole, AdminAction[]> = {
  super_admin: [
    "view_all",
    "manage_partners",
    "delete_partners",
    "manage_merchants",
    "manage_riders",
    "manage_settings",
    "file_taxes",
    "bulk_settle",
    "approve_discounting",
    "manage_team",
    "change_fee_rates",
    "test_integrations",
    "manage_risk",
    "export_data",
  ],
  admin: [
    "view_all",
    "manage_partners",
    "manage_merchants",
    "manage_riders",
    "file_taxes",
    "bulk_settle",
    "approve_discounting",
    "manage_risk",
    "export_data",
  ],
  ops: ["view_all", "approve_discounting"],
};

export function can(role: AdminRole, action: AdminAction): boolean {
  return PERMISSIONS[role].includes(action);
}
