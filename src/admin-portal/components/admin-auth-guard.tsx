"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "@/admin-portal/lib/auth";
import { getSession } from "@/lib/auth";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const adminSession = getAdminSession();
    const portalSession = getSession();

    if (!adminSession) {
      router.replace("/admin/login");
      return;
    }

    if (portalSession && !adminSession) {
      router.replace("/admin/login");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
