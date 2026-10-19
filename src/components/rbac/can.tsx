"use client";

import { useAdminCan, useMerchantCan, usePartnerCan, useRiderCan } from "@/hooks/use-permission";
import type { AdminAction } from "@/admin-portal/lib/rbac";
import type { MerchantAction, PartnerAction, RiderAction } from "@/lib/rbac";

type CanProps =
  | { portal: "admin"; action: AdminAction; children: React.ReactNode; fallback?: React.ReactNode }
  | { portal: "partner"; action: PartnerAction; children: React.ReactNode; fallback?: React.ReactNode }
  | { portal: "merchant"; action: MerchantAction; children: React.ReactNode; fallback?: React.ReactNode }
  | { portal: "rider"; action: RiderAction; children: React.ReactNode; fallback?: React.ReactNode };

function AdminCan({ action, children, fallback }: { action: AdminAction; children: React.ReactNode; fallback?: React.ReactNode }) {
  const allowed = useAdminCan(action);
  return allowed ? <>{children}</> : <>{fallback ?? null}</>;
}

function PartnerCan({ action, children, fallback }: { action: PartnerAction; children: React.ReactNode; fallback?: React.ReactNode }) {
  const allowed = usePartnerCan(action);
  return allowed ? <>{children}</> : <>{fallback ?? null}</>;
}

function MerchantCan({ action, children, fallback }: { action: MerchantAction; children: React.ReactNode; fallback?: React.ReactNode }) {
  const allowed = useMerchantCan(action);
  return allowed ? <>{children}</> : <>{fallback ?? null}</>;
}

function RiderCanGate({ action, children, fallback }: { action: RiderAction; children: React.ReactNode; fallback?: React.ReactNode }) {
  const allowed = useRiderCan(action);
  return allowed ? <>{children}</> : <>{fallback ?? null}</>;
}

export function Can(props: CanProps) {
  if (props.portal === "admin") {
    return <AdminCan action={props.action} fallback={props.fallback}>{props.children}</AdminCan>;
  }
  if (props.portal === "partner") {
    return <PartnerCan action={props.action} fallback={props.fallback}>{props.children}</PartnerCan>;
  }
  if (props.portal === "merchant") {
    return <MerchantCan action={props.action} fallback={props.fallback}>{props.children}</MerchantCan>;
  }
  return <RiderCanGate action={props.action} fallback={props.fallback}>{props.children}</RiderCanGate>;
}
