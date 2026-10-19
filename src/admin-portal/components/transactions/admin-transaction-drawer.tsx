"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { formatDateTime } from "@/lib/format";
import type { AdminTransaction } from "@/admin-portal/types/finance";

interface AdminTransactionDrawerProps {
  transaction: AdminTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BreakdownRow({
  label,
  amount,
  variant = "default",
}: {
  label: string;
  amount: number;
  variant?: "default" | "positive" | "negative";
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-medium-text">{label}</span>
      <AmountText amount={amount} variant={variant} className="text-sm" />
    </div>
  );
}

export function AdminTransactionDrawer({
  transaction,
  open,
  onOpenChange,
}: AdminTransactionDrawerProps) {
  if (!transaction) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{transaction.orderId}</SheetTitle>
          <p className="text-sm text-medium-text">{formatDateTime(transaction.date)}</p>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-text">Status</span>
            <StatusBadge status={transaction.status} />
          </div>

          <div className="rounded-xl bg-content p-3 text-sm">
            <div className="flex justify-between"><span className="text-medium-text">Partner</span><span className="font-medium">{transaction.partnerName}</span></div>
            <div className="mt-1 flex justify-between"><span className="text-medium-text">Merchant</span><span>{transaction.merchant}</span></div>
          </div>

          <div>
            <h4 className="label-text mb-2 text-sm">Payment Breakdown</h4>
            <BreakdownRow label="Gross Amount" amount={transaction.amount} />
            <BreakdownRow label="Rider Cut" amount={transaction.riderCut} variant="negative" />
            <BreakdownRow label="Platform Fee" amount={transaction.platformFee} variant="negative" />
            <BreakdownRow label="Tax (WHT + GST)" amount={transaction.tax} variant="negative" />
            <Separator className="my-2" />
            <div className="flex items-center justify-between py-1">
              <span className="font-medium text-dark-text">Net to Merchant</span>
              <AmountText amount={transaction.netToMerchant} variant="positive" className="text-base" />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-medium-text">Rider</span><span>{transaction.rider}</span></div>
            <div className="flex justify-between"><span className="text-medium-text">Method</span><span>{transaction.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-medium-text">Customer Ref</span><span>{transaction.customerReference}</span></div>
            {transaction.nfcTagId && (
              <div className="flex justify-between"><span className="text-medium-text">NFC Tag</span><span className="font-mono text-xs">{transaction.nfcTagId}</span></div>
            )}
          </div>

          <div>
            <h4 className="label-text mb-3 text-sm">Audit Trail</h4>
            <div className="relative space-y-0">
              {transaction.auditTrail.map((event, i) => (
                <div key={`${event.state}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < transaction.auditTrail.length - 1 && (
                    <span className="absolute left-[5px] top-3 h-full w-px bg-light-border" />
                  )}
                  <span className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary-green" />
                  <div>
                    <p className="text-sm font-medium text-dark-text">{event.state}</p>
                    <p className="text-xs text-medium-text">{event.timestamp}</p>
                    {event.detail && <p className="mt-0.5 text-xs text-medium-text">{event.detail}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
