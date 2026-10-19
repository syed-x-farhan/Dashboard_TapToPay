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
import { useFlagRider } from "@/admin-portal/hooks/use-admin-entities";
import type { AdminRider } from "@/admin-portal/types/entities";

interface FlagRiderModalProps {
  rider: AdminRider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FlagRiderModal({ rider, open, onOpenChange }: FlagRiderModalProps) {
  const flag = useFlagRider();
  const [reason, setReason] = React.useState("");

  if (!rider) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Flag Rider</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-medium-text">Flag <strong>{rider.name}</strong> for review by the risk team.</p>
          <div className="grid gap-2">
            <Label>Flag reason</Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="rounded-xl border border-light-border px-3 py-2 text-sm outline-none focus:border-primary-green/40 focus:ring-2 focus:ring-primary-green/10"
              placeholder="e.g. Multiple failed NFC attempts"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-rider-amber text-white hover:bg-rider-amber/90"
            disabled={!reason.trim() || flag.isPending}
            onClick={() => flag.mutate({ id: rider.id, reason }, { onSuccess: () => { setReason(""); onOpenChange(false); } })}
          >
            Flag Rider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
