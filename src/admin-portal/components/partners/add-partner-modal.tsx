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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddPartner } from "@/admin-portal/hooks/use-admin-entities";
import { ACCOUNT_MANAGERS } from "@/admin-portal/types/entities";
import type { PartnerType } from "@/admin-portal/types/entities";

interface AddPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPartnerModal({ open, onOpenChange }: AddPartnerModalProps) {
  const addPartner = useAddPartner();
  const [type, setType] = React.useState<PartnerType>("Courier");
  const [accountManager, setAccountManager] = React.useState<string>(ACCOUNT_MANAGERS[0]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    addPartner.mutate(
      {
        name: form.get("name") as string,
        contactPerson: form.get("contactPerson") as string,
        email: form.get("email") as string,
        phone: form.get("phone") as string,
        type,
        city: form.get("city") as string,
        ntn: form.get("ntn") as string,
        feeRate: parseFloat(form.get("feeRate") as string),
        accountManager,
        joinedDate: new Date().toLocaleDateString("en-GB"),
        discountTiers: { low: 2, medium: 3.5, high: 5 },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Partner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2"><Label>Company Name</Label><Input name="name" required className="rounded-xl" placeholder="QuickCart Logistics" /></div>
          <div className="grid gap-2"><Label>Contact Person</Label><Input name="contactPerson" required className="rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Email</Label><Input name="email" type="email" required className="rounded-xl" /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input name="phone" required className="rounded-xl" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as PartnerType)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food Delivery">Food Delivery</SelectItem>
                  <SelectItem value="Courier">Courier</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Direct Restaurant">Direct Restaurant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>City</Label><Input name="city" required className="rounded-xl" defaultValue="Karachi" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>NTN Number</Label><Input name="ntn" required className="rounded-xl" /></div>
            <div className="grid gap-2"><Label>Fee Rate (%)</Label><Input name="feeRate" type="number" step="0.1" defaultValue="2.5" required className="rounded-xl" /></div>
          </div>
          <div className="grid gap-2">
            <Label>Account Manager</Label>
            <Select value={accountManager} onValueChange={(v) => setAccountManager(v ?? ACCOUNT_MANAGERS[0])}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ACCOUNT_MANAGERS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary-green text-white hover:bg-primary-green/90" disabled={addPartner.isPending}>
              Add Partner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
