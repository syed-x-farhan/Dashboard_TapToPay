"use client";

import { MerchantShell } from "@/components/layout/merchant-shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ReadOnlyBanner } from "@/components/rbac/read-only-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <MerchantShell>
        <div className="space-y-4">
          <ReadOnlyBanner />
          {children}
        </div>
      </MerchantShell>
    </AuthGuard>
  );
}
