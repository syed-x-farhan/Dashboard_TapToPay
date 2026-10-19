"use client";

import { useIsReadOnlyPortal } from "@/hooks/use-permission";

export function ReadOnlyBanner() {
  const readOnly = useIsReadOnlyPortal();
  if (!readOnly) return null;

  return (
    <div className="rounded-xl border border-rider-amber/30 bg-amber-50/50 px-4 py-3 text-sm text-rider-amber">
      You have view-only access. Contact your account admin to request changes.
    </div>
  );
}
