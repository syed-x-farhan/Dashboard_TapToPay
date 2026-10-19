"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AmountText } from "@/components/shared/amount-text";
import { StatusBadge } from "@/components/shared/status-badge";
import { useRetrySettlement } from "@/admin-portal/hooks/use-admin-finance";
import type { AdminCompletedSettlement } from "@/admin-portal/types/finance";

interface FailedSettlementModalProps {
  settlement: AdminCompletedSettlement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FailedSettlementModal({ settlement, open, onOpenChange }: FailedSettlementModalProps) {
  const retry = useRetrySettlement();
  if (!settlement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Failed Settlement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-medium-text">Status</span>
            <StatusBadge status="Failed" />
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-medium-text">Partner</span><span>{settlement.partnerName}</span></div>
            <div className="flex justify-between"><span className="text-medium-text">Merchant</span><span>{settlement.merchant}</span></div>
            <div className="flex justify-between"><span className="text-medium-text">Amount</span><AmountText amount={settlement.amount} className="text-sm" /></div>
            <div className="flex justify-between"><span className="text-medium-text">Reference</span><span className="font-mono text-xs">{settlement.referenceId}</span></div>
          </div>
          {settlement.errorMessage && (
            <div className="rounded-xl border border-rider-red/20 bg-rider-red/5 p-3 text-sm text-rider-red">
              <p className="font-medium">Jazz Cash API Error</p>
              <p className="mt-1 text-xs">{settlement.errorMessage}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button
            className="bg-primary-green text-white hover:bg-primary-green/90"
            disabled={retry.isPending}
            onClick={() => retry.mutate(settlement.id, { onSuccess: () => onOpenChange(false) })}
          >
            Retry Settlement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
