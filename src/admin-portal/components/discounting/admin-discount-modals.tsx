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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AmountText } from "@/components/shared/amount-text";
import { RiskScoreBadge } from "@/components/shared/risk-score-badge";
import { useApproveDiscount, useRejectDiscount } from "@/admin-portal/hooks/use-admin-finance";
import type { AdminDiscountRequest } from "@/admin-portal/types/finance";

interface AdminDiscountModalsProps {
  request: AdminDiscountRequest | null;
  approveOpen: boolean;
  rejectOpen: boolean;
  onApproveOpenChange: (open: boolean) => void;
  onRejectOpenChange: (open: boolean) => void;
}

const REJECTION_REASONS = [
  "High risk score — insufficient merchant history",
  "Previous late repayment on discount",
  "Volume spike requires manual review",
  "Incomplete merchant verification documents",
  "Partner account flagged",
  "Other",
];

export function AdminDiscountModals({
  request,
  approveOpen,
  rejectOpen,
  onApproveOpenChange,
  onRejectOpenChange,
}: AdminDiscountModalsProps) {
  const approve = useApproveDiscount();
  const reject = useRejectDiscount();
  const [reason, setReason] = React.useState(REJECTION_REASONS[0]);
  const [note, setNote] = React.useState("");

  if (!request) return null;

  return (
    <>
      <Dialog open={approveOpen} onOpenChange={onApproveOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader><DialogTitle>Approve Discount Request</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="rounded-xl bg-content p-3">
              <div className="flex justify-between"><span className="text-medium-text">Partner</span><span className="font-medium">{request.partnerName}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-medium-text">Merchant</span><span>{request.merchantName}</span></div>
              <div className="mt-1 flex justify-between"><span className="text-medium-text">Requested by</span><span>{request.requestedBy}</span></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Risk Score</span>
              <div className="flex items-center gap-2">
                <RiskScoreBadge score={request.riskLevel} />
                <span className="amount text-sm">{request.riskScore}/100</span>
              </div>
            </div>
            {request.riskFactors.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {request.riskFactors.map((f) => (
                  <span key={f} className="rounded-md bg-content px-2 py-0.5 text-xs">{f}</span>
                ))}
              </div>
            )}
            <div className="flex justify-between"><span>Invoice Amount</span><AmountText amount={request.invoiceAmount} className="text-sm" /></div>
            <div className="flex justify-between"><span>Discount Fee ({request.discountFeePercent}%)</span><AmountText amount={request.discountFee} variant="negative" className="text-sm" /></div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Payout Amount</span>
              <AmountText amount={request.payoutAmount} variant="positive" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onApproveOpenChange(false)}>Cancel</Button>
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={approve.isPending}
              onClick={() => approve.mutate(request.id, { onSuccess: () => onApproveOpenChange(false) })}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={onRejectOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader><DialogTitle>Reject Discount Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-medium-text">
              Rejecting request from <strong>{request.merchantName}</strong> ({request.partnerName}). Notification will be sent to the merchant.
            </p>
            <div className="grid gap-2">
              <Label>Rejection reason</Label>
              <Select value={reason} onValueChange={(v) => setReason(v ?? REJECTION_REASONS[0])}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Additional note (optional)</Label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="rounded-xl border border-light-border px-3 py-2 text-sm outline-none focus:border-primary-green/40 focus:ring-2 focus:ring-primary-green/10"
                placeholder="Message sent to merchant..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onRejectOpenChange(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={reject.isPending}
              onClick={() => reject.mutate(request.id, { onSuccess: () => { setNote(""); onRejectOpenChange(false); } })}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
