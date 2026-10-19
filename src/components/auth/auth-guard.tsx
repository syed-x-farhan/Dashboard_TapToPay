"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const session = getSession();
    const isPendingPage = pathname === "/partner/pending-approval";
    const isPartnerRoute = pathname.startsWith("/partner");

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.accountType === "partner" && session.status === "pending" && !isPendingPage) {
      router.replace("/partner/pending-approval");
      return;
    }

    // Keep each portal behind its own login: partners can't land on merchant routes
    // (and vice versa) without going through /login again.
    if (session.accountType === "merchant" && isPartnerRoute && !isPendingPage) {
      router.replace("/");
      return;
    }

    if (session.accountType === "partner" && !isPartnerRoute) {
      router.replace(session.status === "pending" ? "/partner/pending-approval" : "/partner");
      return;
    }

    setReady(true);
  }, [router, pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
