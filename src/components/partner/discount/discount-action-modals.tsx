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
import { Label } from "@/components/ui/label";
import { AmountText } from "@/components/shared/amount-text";
import type { DiscountRequest } from "@/types/partner";

interface DiscountActionModalsProps {
  request: DiscountRequest | null;
  approveOpen: boolean;
  rejectOpen: boolean;
  onApproveOpenChange: (open: boolean) => void;
  onRejectOpenChange: (open: boolean) => void;
}

export function DiscountActionModals({
  request,
  approveOpen,
  rejectOpen,
  onApproveOpenChange,
  onRejectOpenChange,
}: DiscountActionModalsProps) {
  if (!request) return null;

  return (
    <>
      <Dialog open={approveOpen} onOpenChange={onApproveOpenChange}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Approve Discount Request</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2 text-sm">
            <div className="flex justify-between"><span>Merchant</span><span className="font-medium">{request.merchantName}</span></div>
            <div className="flex justify-between"><span>Payout amount</span><AmountText amount={request.amountToPayOut} variant="positive" className="text-sm" /></div>
            <div className="flex justify-between"><span>Discount fee</span><AmountText amount={request.discountFee} variant="negative" className="text-sm" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onApproveOpenChange(false)}>Cancel</Button>
            <Button className="bg-primary-green text-white" onClick={() => onApproveOpenChange(false)}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={onRejectOpenChange}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Reject Discount Request</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Rejection reason</Label>
            <textarea placeholder="Provide a reason for the merchant..." className="min-h-[80px] w-full rounded-xl border border-light-border p-3 text-sm outline-none focus:border-primary-green/40 focus:ring-2 focus:ring-primary-green/10" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onRejectOpenChange(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => onRejectOpenChange(false)}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
