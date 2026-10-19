"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AmountText } from "@/components/shared/amount-text";
import type { EligibleInvoice } from "@/types";

interface DiscountConfirmModalProps {
  invoice: EligibleInvoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DiscountConfirmModal({
  invoice,
  open,
  onOpenChange,
  onConfirm,
}: DiscountConfirmModalProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Early Payout</DialogTitle>
          <DialogDescription>
            Review the discount fee breakdown before requesting your early payout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between rounded-xl bg-content p-4">
            <span className="text-sm text-medium-text">You receive</span>
            <AmountText
              amount={invoice.amountAfterDiscount}
              variant="positive"
              className="text-lg"
            />
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-medium-text">
              Discount fee ({invoice.discountFeePercent}%)
            </span>
            <AmountText amount={invoice.discountFee} variant="negative" />
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-medium-text">Invoice total</span>
            <AmountText amount={invoice.totalAmount} />
          </div>
          <p className="description-text text-xs">
            Funds will arrive in your Jazz Cash wallet within 2 hours of approval.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-primary-green text-white hover:bg-primary-green/90"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirm Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
