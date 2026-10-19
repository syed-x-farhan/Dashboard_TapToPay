"use client";

import { AdminShell } from "@/admin-portal/components/admin-shell";
import { AdminAuthGuard } from "@/admin-portal/components/admin-auth-guard";
import { AdminRoleBanner } from "@/components/rbac/admin-role-banner";

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <AdminShell>
        <div className="space-y-4">
          <AdminRoleBanner />
          {children}
        </div>
      </AdminShell>
    </AdminAuthGuard>
  );
}
