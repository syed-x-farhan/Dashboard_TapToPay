"use client";

import * as React from "react";
import { getAdminSession } from "@/admin-portal/lib/auth";
import type { AdminRole } from "@/admin-portal/types";

export function useAdminSession() {
  const [session, setSession] = React.useState(() => getAdminSession());

  React.useEffect(() => {
    setSession(getAdminSession());
  }, []);

  return session;
}

export function useAdminRole(): AdminRole | null {
  const session = useAdminSession();
  return session?.role ?? null;
}
