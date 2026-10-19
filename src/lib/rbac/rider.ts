export type RiderRole = "field_rider" | "supervisor" | "rider_ops";

export type RiderAction =
  | "view_dashboard"
  | "view_deliveries"
  | "view_collections"
  | "view_team"
  | "manage_riders";

const PERMISSIONS: Record<RiderRole, RiderAction[]> = {
  field_rider: ["view_dashboard", "view_deliveries", "view_collections"],
  supervisor: [
    "view_dashboard",
    "view_deliveries",
    "view_collections",
    "view_team",
  ],
  rider_ops: [
    "view_dashboard",
    "view_deliveries",
    "view_collections",
    "view_team",
    "manage_riders",
  ],
};

export function canRider(role: RiderRole, action: RiderAction): boolean {
  return PERMISSIONS[role].includes(action);
}

export function getRiderRoleLabel(role: RiderRole): string {
  if (role === "field_rider") return "Field Rider";
  if (role === "supervisor") return "Supervisor";
  return "Rider Ops";
}

export function isRiderRole(role: string): role is RiderRole {
  return role === "field_rider" || role === "supervisor" || role === "rider_ops";
}
