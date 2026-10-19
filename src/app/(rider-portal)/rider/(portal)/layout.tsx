"use client";

import { RiderShell } from "@/components/layout/rider-shell";
import { RiderAuthGuard } from "@/components/rider/rider-auth-guard";

export default function RiderPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RiderAuthGuard>
      <RiderShell>{children}</RiderShell>
    </RiderAuthGuard>
  );
}
