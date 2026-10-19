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
import { useReassignRider, useAdminPartners } from "@/admin-portal/hooks/use-admin-entities";
import type { AdminRider } from "@/admin-portal/types/entities";

interface ReassignRiderModalProps {
  rider: AdminRider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReassignRiderModal({ rider, open, onOpenChange }: ReassignRiderModalProps) {
  const { data: partners } = useAdminPartners();
  const reassign = useReassignRider();
  const [partnerId, setPartnerId] = React.useState("");

  React.useEffect(() => {
    if (rider) setPartnerId(rider.partnerId);
  }, [rider]);

  if (!rider) return null;

  const partnerName = partners?.find((p) => p.id === partnerId)?.name ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign Rider</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-medium-text">
            Move <strong>{rider.name}</strong> from {rider.partnerName} to another partner network.
          </p>
          <div className="grid gap-2">
            <Label>New Partner</Label>
            <Select value={partnerId} onValueChange={(v) => setPartnerId(v ?? "")}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select partner" /></SelectTrigger>
              <SelectContent>
                {partners?.filter((p) => p.status === "Active").map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-primary-green text-white hover:bg-primary-green/90"
            disabled={!partnerId || partnerId === rider.partnerId || reassign.isPending}
            onClick={() => reassign.mutate({ id: rider.id, partnerId, partnerName }, { onSuccess: () => onOpenChange(false) })}
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
