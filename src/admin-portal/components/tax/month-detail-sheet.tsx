"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AmountText } from "@/components/shared/amount-text";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatPKR } from "@/lib/format";
import { can } from "@/admin-portal/lib/rbac";
import { useAdminRole } from "@/admin-portal/hooks/use-admin-session";
import type { MonthlyFiling } from "@/admin-portal/types/ops";

interface TaxMonthDetailSheetProps {
  month: MonthlyFiling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFile: (monthKey: string) => void;
  filing: boolean;
}

export function TaxMonthDetailSheet({
  month,
  open,
  onOpenChange,
  onFile,
  filing,
}: TaxMonthDetailSheetProps) {
  const role = useAdminRole();
  const canFile = role ? can(role, "file_taxes") : false;

  if (!month) return null;

  const monthKey = `${month.month}-${month.year}`;
  const canFileMonth = month.status !== "Filed" && month.totalTax > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {month.month} {month.year} — Tax Filing
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-text">Status</span>
            <StatusBadge status={month.status === "Filed" ? "Filed" : month.status === "Overdue" ? "Failed" : "Pending"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">WHT</p>
              <AmountText amount={month.wht} className="text-sm" />
            </div>
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">GST</p>
              <AmountText amount={month.gst} className="text-sm" />
            </div>
          </div>
          <div className="rounded-xl bg-content p-3">
            <p className="text-xs text-medium-text">Total Tax Collected</p>
            <p className="amount mt-1 text-lg">{formatPKR(month.totalTax)}</p>
          </div>
          {month.partnerBreakdown.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-dark-text">Breakdown by Partner</p>
              <div className="space-y-2">
                {month.partnerBreakdown.map((p) => (
                  <div
                    key={p.partnerName}
                    className="flex items-center justify-between rounded-xl border border-light-border px-3 py-2"
                  >
                    <span className="text-sm">{p.partnerName}</span>
                    <AmountText amount={p.tax} className="text-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {canFileMonth && canFile && (
            <Button
              className="w-full rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
              disabled={filing}
              onClick={() => onFile(monthKey)}
            >
              File to FBR
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
