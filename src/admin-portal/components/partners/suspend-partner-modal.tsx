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
import { useSuspendPartner } from "@/admin-portal/hooks/use-admin-entities";
import type { AdminPartner } from "@/admin-portal/types/entities";

interface SuspendPartnerModalProps {
  partner: AdminPartner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuspendPartnerModal({ partner, open, onOpenChange }: SuspendPartnerModalProps) {
  const suspend = useSuspendPartner();
  const [reason, setReason] = React.useState("");

  if (!partner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suspend Partner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-medium-text">
            Suspending <strong>{partner.name}</strong> will block all their merchants from processing payments.
          </p>
          <div className="grid gap-2">
            <Label>Reason for suspension</Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="rounded-xl border border-light-border px-3 py-2 text-sm outline-none focus:border-primary-green/40 focus:ring-2 focus:ring-primary-green/10"
              placeholder="Enter reason..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={!reason.trim() || suspend.isPending}
            onClick={() => {
              suspend.mutate({ id: partner.id, reason }, { onSuccess: () => { setReason(""); onOpenChange(false); } });
            }}
          >
            Suspend Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
