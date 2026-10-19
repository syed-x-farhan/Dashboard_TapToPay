"use client";

import { useAdminRole } from "@/admin-portal/hooks/use-admin-session";
import { getAdminRoleLabel } from "@/admin-portal/lib/auth";

export function AdminRoleBanner() {
  const role = useAdminRole();
  if (!role || role === "super_admin" || role === "admin") return null;

  return (
    <div className="rounded-xl border border-rider-amber/30 bg-amber-50/50 px-4 py-3 text-sm text-rider-amber">
      Signed in as <strong>{getAdminRoleLabel(role)}</strong> — you can view all pages and approve invoice discounting requests. Other actions are restricted.
    </div>
  );
}
