"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AmountText } from "@/components/shared/amount-text";
import type { PendingSettlement } from "@/types/partner";

interface SettleConfirmModalProps {
  settlement: PendingSettlement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settleAll?: boolean;
  allSettlements?: PendingSettlement[];
}

export function SettleConfirmModal({
  settlement,
  open,
  onOpenChange,
  settleAll,
  allSettlements,
}: SettleConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{settleAll ? "Settle All Pending" : "Confirm Settlement"}</DialogTitle>
        </DialogHeader>
        {settleAll && allSettlements ? (
          <div className="max-h-60 space-y-2 overflow-y-auto py-2">
            {allSettlements.map((s) => (
              <div key={s.id} className="flex justify-between text-sm">
                <span>{s.merchantName}</span>
                <AmountText amount={s.netPayable} className="text-sm" />
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <AmountText amount={allSettlements.reduce((a, s) => a + s.netPayable, 0)} />
            </div>
          </div>
        ) : settlement ? (
          <div className="space-y-2 py-2 text-sm">
            <div className="flex justify-between"><span className="text-medium-text">Merchant</span><span>{settlement.merchantName}</span></div>
            <div className="flex justify-between"><span className="text-medium-text">Gross</span><AmountText amount={settlement.grossAmount} className="text-sm" /></div>
            <div className="flex justify-between"><span className="text-medium-text">Platform Fee</span><AmountText amount={settlement.platformFee} variant="negative" className="text-sm" /></div>
            <div className="flex justify-between"><span className="text-medium-text">Tax</span><AmountText amount={settlement.tax} variant="negative" className="text-sm" /></div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Net to Jazz Cash</span>
              <AmountText amount={settlement.netPayable} variant="positive" />
            </div>
          </div>
        ) : null}
        <p className="text-xs text-medium-text">Funds will be transferred to the merchant&apos;s Jazz Cash wallet.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-primary-green text-white hover:bg-primary-green/90" onClick={() => onOpenChange(false)}>
            Confirm Settlement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
