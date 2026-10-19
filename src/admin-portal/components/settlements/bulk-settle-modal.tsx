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
import { useBulkSettlePartner } from "@/admin-portal/hooks/use-admin-finance";
import { useAdminPartners } from "@/admin-portal/hooks/use-admin-entities";
import type { AdminPendingSettlement } from "@/admin-portal/types/finance";

interface BulkSettleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: AdminPendingSettlement[];
}

export function BulkSettleModal({ open, onOpenChange, pending }: BulkSettleModalProps) {
  const { data: partners } = useAdminPartners();
  const bulkSettle = useBulkSettlePartner();
  const [partnerId, setPartnerId] = React.useState("");

  const partnerPending = pending.filter((s) => s.partnerId === partnerId);
  const total = partnerPending.reduce((s, p) => s + p.netPayable, 0);
  const totalFees = partnerPending.reduce((s, p) => s + p.platformFee, 0);
  const totalTax = partnerPending.reduce((s, p) => s + p.tax, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Settle by Partner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label>Select Partner</Label>
            <Select value={partnerId} onValueChange={(v) => setPartnerId(v ?? "")}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose partner" /></SelectTrigger>
              <SelectContent>
                {partners?.filter((p) => p.status === "Active").map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {partnerId && (
            <>
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-light-border p-3">
                {partnerPending.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span>{s.merchantName}</span>
                    <AmountText amount={s.netPayable} className="text-sm" />
                  </div>
                ))}
              </div>
              <div className="space-y-1 rounded-xl bg-content p-3 text-sm">
                <div className="flex justify-between"><span className="text-medium-text">Merchants</span><span>{partnerPending.length}</span></div>
                <div className="flex justify-between"><span className="text-medium-text">Total Fees</span><AmountText amount={totalFees} variant="negative" className="text-sm" /></div>
                <div className="flex justify-between"><span className="text-medium-text">Total Tax</span><AmountText amount={totalTax} variant="negative" className="text-sm" /></div>
                <div className="flex justify-between border-t border-light-border pt-2 font-semibold">
                  <span>Net Payable</span>
                  <AmountText amount={total} variant="positive" />
                </div>
              </div>
              <p className="text-xs text-medium-text">All settlements will be processed simultaneously via Jazz Cash API.</p>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-primary-green text-white hover:bg-primary-green/90"
            disabled={!partnerId || partnerPending.length === 0 || bulkSettle.isPending}
            onClick={() => bulkSettle.mutate(partnerId, { onSuccess: () => { setPartnerId(""); onOpenChange(false); } })}
          >
            Confirm Bulk Settlement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
