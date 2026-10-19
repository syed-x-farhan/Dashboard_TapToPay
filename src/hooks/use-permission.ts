"use client";

import * as React from "react";
import { useAdminRole } from "@/admin-portal/hooks/use-admin-session";
import { can as canAdmin, type AdminAction } from "@/admin-portal/lib/rbac";
import { getSession } from "@/lib/auth";
import {
  canPartner,
  canMerchant,
  canRider,
  isPartnerRole,
  isMerchantRole,
  type PartnerAction,
  type MerchantAction,
  type RiderAction,
} from "@/lib/rbac";
import { getRiderSession } from "@/lib/rider-auth";

export function useAdminCan(action: AdminAction): boolean {
  const role = useAdminRole();
  return role ? canAdmin(role, action) : false;
}

export function usePartnerCan(action: PartnerAction): boolean {
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const session = getSession();
    if (session?.accountType === "partner" && isPartnerRole(session.role)) {
      setAllowed(canPartner(session.role, action));
    } else {
      setAllowed(false);
    }
  }, [action]);

  return allowed;
}

export function useMerchantCan(action: MerchantAction): boolean {
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const session = getSession();
    if (session?.accountType === "merchant" && isMerchantRole(session.role)) {
      setAllowed(canMerchant(session.role, action));
    } else {
      setAllowed(false);
    }
  }, [action]);

  return allowed;
}

export function useRiderCan(action: RiderAction): boolean {
  const [allowed, setAllowed] = React.useState(false);

  React.useEffect(() => {
    const session = getRiderSession();
    if (session) {
      setAllowed(canRider(session.role, action));
    } else {
      setAllowed(false);
    }
  }, [action]);

  return allowed;
}

export function useIsReadOnlyPortal(): boolean {
  const [readOnly, setReadOnly] = React.useState(false);

  React.useEffect(() => {
    const session = getSession();
    if (session?.accountType === "partner" && session.role === "viewer") {
      setReadOnly(true);
      return;
    }
    if (session?.accountType === "merchant" && session.role === "viewer") {
      setReadOnly(true);
      return;
    }
    setReadOnly(false);
  }, []);

  return readOnly;
}
