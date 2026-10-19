"use client";

import { usePathname } from "next/navigation";
import { PartnerShell } from "@/components/layout/partner-shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ReadOnlyBanner } from "@/components/rbac/read-only-banner";

export default function PartnerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPendingApproval = pathname === "/partner/pending-approval";

  return (
    <AuthGuard>
      {isPendingApproval ? (
        children
      ) : (
        <PartnerShell>
          <div className="space-y-4">
            <ReadOnlyBanner />
            {children}
          </div>
        </PartnerShell>
      )}
    </AuthGuard>
  );
}
