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
import type { Transaction } from "@/types";

interface TransactionDrawerProps {
  transaction: Transaction | null;
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

export function TransactionDrawer({
  transaction,
  open,
  onOpenChange,
}: TransactionDrawerProps) {
  if (!transaction) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-dark-text">{transaction.orderId}</SheetTitle>
          <p className="text-sm text-medium-text">
            {formatDateTime(transaction.date)}
          </p>
        </SheetHeader>

        <div className="px-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-medium-text">Status</span>
            <StatusBadge status={transaction.status} />
          </div>

          <Separator />

          <div className="py-2">
            <BreakdownRow label="Gross Amount" amount={transaction.amount} />
            <BreakdownRow
              label="Rider Cut"
              amount={transaction.riderCut}
              variant="negative"
            />
            <BreakdownRow
              label="Platform Fee"
              amount={transaction.platformFee}
              variant="negative"
            />
            <BreakdownRow
              label="Tax (WHT + GST)"
              amount={transaction.tax}
              variant="negative"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <span className="label-text text-dark-text">Net to Merchant</span>
            <AmountText
              amount={transaction.netAmount}
              variant="positive"
              className="text-lg"
            />
          </div>

          <Separator />

          <div className="space-y-3 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-medium-text">Customer</span>
              <span className="text-dark-text">{transaction.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium-text">Rider</span>
              <span className="text-dark-text">{transaction.rider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium-text">Payment Method</span>
              <span className="text-dark-text">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-medium-text">Merchant Reference</span>
              <span className="text-dark-text">{transaction.merchantReference}</span>
            </div>
            {transaction.nfcTagId && (
              <div className="flex justify-between">
                <span className="text-medium-text">NFC Tag ID</span>
                <span className="font-mono text-xs text-dark-text">
                  {transaction.nfcTagId}
                </span>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
