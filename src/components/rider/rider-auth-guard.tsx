"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getRiderSession } from "@/lib/rider-auth";

export function RiderAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!getRiderSession()) {
      router.replace("/rider/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
