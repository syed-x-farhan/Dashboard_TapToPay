"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSuspendMerchant } from "@/admin-portal/hooks/use-admin-entities";
import type { AdminMerchant } from "@/admin-portal/types/entities";

interface SuspendMerchantModalProps {
  merchant: AdminMerchant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuspendMerchantModal({ merchant, open, onOpenChange }: SuspendMerchantModalProps) {
  const suspend = useSuspendMerchant();
  if (!merchant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suspend Merchant</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-medium-text py-2">
          Suspend <strong>{merchant.name}</strong> ({merchant.partnerName})? They will not be able to process payments until reactivated.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={suspend.isPending}
            onClick={() => suspend.mutate(merchant.id, { onSuccess: () => onOpenChange(false) })}
          >
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
