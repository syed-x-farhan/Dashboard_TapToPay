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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApprovePartner } from "@/admin-portal/hooks/use-admin-entities";
import type { AdminPartner } from "@/admin-portal/types/entities";

interface ApprovePartnerModalProps {
  partner: AdminPartner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApprovePartnerModal({ partner, open, onOpenChange }: ApprovePartnerModalProps) {
  const approve = useApprovePartner();
  const [feeRate, setFeeRate] = React.useState("2.5");
  const [low, setLow] = React.useState("2");
  const [medium, setMedium] = React.useState("3.5");
  const [high, setHigh] = React.useState("5");

  React.useEffect(() => {
    if (partner) {
      setFeeRate(String(partner.feeRate));
      setLow(String(partner.discountTiers.low));
      setMedium(String(partner.discountTiers.medium));
      setHigh(String(partner.discountTiers.high));
    }
  }, [partner]);

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve Partner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-xl bg-content p-3 text-sm">
            <p className="font-medium text-dark-text">{partner.name}</p>
            <p className="text-medium-text">{partner.contactPerson} · {partner.email}</p>
            <p className="text-medium-text">{partner.type} · {partner.city} · NTN {partner.ntn}</p>
          </div>
          <div className="grid gap-2">
            <Label>Fee Rate (%)</Label>
            <Input type="number" step="0.1" value={feeRate} onChange={(e) => setFeeRate(e.target.value)} className="rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2"><Label className="text-xs">Low Risk %</Label><Input type="number" step="0.1" value={low} onChange={(e) => setLow(e.target.value)} className="rounded-xl" /></div>
            <div className="grid gap-2"><Label className="text-xs">Medium %</Label><Input type="number" step="0.1" value={medium} onChange={(e) => setMedium(e.target.value)} className="rounded-xl" /></div>
            <div className="grid gap-2"><Label className="text-xs">High %</Label><Input type="number" step="0.1" value={high} onChange={(e) => setHigh(e.target.value)} className="rounded-xl" /></div>
          </div>
          <p className="text-xs text-medium-text">Approval email will be sent to {partner.email} automatically.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-primary-green text-white hover:bg-primary-green/90"
            disabled={approve.isPending}
            onClick={() => {
              approve.mutate(
                { id: partner.id, feeRate: parseFloat(feeRate), tiers: { low: parseFloat(low), medium: parseFloat(medium), high: parseFloat(high) } },
                { onSuccess: () => onOpenChange(false) }
              );
            }}
          >
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
