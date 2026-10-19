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
import { useAddPartnerMerchant } from "@/hooks/use-partner-data";

interface AddMerchantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMerchantModal({ open, onOpenChange }: AddMerchantModalProps) {
  const addMerchant = useAddPartnerMerchant();
  const [city, setCity] = React.useState("Lahore");
  const [category, setCategory] = React.useState("Restaurant");
  const [formValues, setFormValues] = React.useState({
    name: "",
    ownerName: "",
    cnic: "",
    phone: "",
    jazzCashNumber: "",
    monthlyExpectedVolume: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (!open) {
      setCity("Lahore");
      setCategory("Restaurant");
      setFormValues({
        name: "",
        ownerName: "",
        cnic: "",
        phone: "",
        jazzCashNumber: "",
        monthlyExpectedVolume: "",
        email: "",
        password: "",
      });
      setMessage(null);
    }
  }, [open]);

  const hasAllRequiredFields = Object.values(formValues).every(
    (value) => value.trim().length > 0
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (!hasAllRequiredFields) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    const monthlyExpectedVolume = Number(formValues.monthlyExpectedVolume);
    if (!Number.isFinite(monthlyExpectedVolume) || monthlyExpectedVolume < 0) {
      setMessage({
        type: "error",
        text: "Monthly expected volume must be a valid positive number.",
      });
      return;
    }

    try {
      await addMerchant.mutateAsync({
        name: formValues.name.trim(),
        ownerName: formValues.ownerName.trim(),
        cnic: formValues.cnic.trim(),
        phone: formValues.phone.trim(),
        jazzCashNumber: formValues.jazzCashNumber.trim(),
        city,
        category,
        monthlyExpectedVolume,
        email: formValues.email.trim(),
        password: formValues.password,
      });
      setMessage({
        type: "success",
        text: "Merchant submitted for verification successfully.",
      });
      onOpenChange(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to create merchant.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Merchant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Business Name</Label>
            <Input
              required
              placeholder="KFC Gulberg"
              className="rounded-xl"
              value={formValues.name}
              onChange={(e) => {
                setMessage(null);
                setFormValues((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>Owner Name</Label>
            <Input
              required
              placeholder="Hassan Malik"
              className="rounded-xl"
              value={formValues.ownerName}
              onChange={(e) => {
                setMessage(null);
                setFormValues((prev) => ({ ...prev, ownerName: e.target.value }));
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>CNIC</Label>
              <Input
                required
                placeholder="35202-1234567-1"
                className="rounded-xl"
                value={formValues.cnic}
                onChange={(e) => {
                  setMessage(null);
                  setFormValues((prev) => ({ ...prev, cnic: e.target.value }));
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input
                required
                placeholder="0300-1234567"
                className="rounded-xl"
                value={formValues.phone}
                onChange={(e) => {
                  setMessage(null);
                  setFormValues((prev) => ({ ...prev, phone: e.target.value }));
                }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Jazz Cash Number</Label>
            <Input
              required
              placeholder="0300-1234567"
              className="rounded-xl"
              value={formValues.jazzCashNumber}
              onChange={(e) => {
                setMessage(null);
                setFormValues((prev) => ({
                  ...prev,
                  jazzCashNumber: e.target.value,
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>City</Label>
              <Select value={city} onValueChange={(value) => setCity(value ?? "Lahore")}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value ?? "Restaurant")}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Monthly Expected Volume (PKR)</Label>
            <Input
              required
              min={0}
              type="number"
              placeholder="3000000"
              className="rounded-xl"
              value={formValues.monthlyExpectedVolume}
              onChange={(e) => {
                setMessage(null);
                setFormValues((prev) => ({
                  ...prev,
                  monthlyExpectedVolume: e.target.value,
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                required
                type="email"
                className="rounded-xl"
                value={formValues.email}
                onChange={(e) => {
                  setMessage(null);
                  setFormValues((prev) => ({ ...prev, email: e.target.value }));
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                required
                type="password"
                className="rounded-xl"
                value={formValues.password}
                onChange={(e) => {
                  setMessage(null);
                  setFormValues((prev) => ({ ...prev, password: e.target.value }));
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary-green text-white hover:bg-primary-green/90"
              disabled={!hasAllRequiredFields || addMerchant.isPending}
            >
              Submit for Verification
            </Button>
          </DialogFooter>
          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-sm text-primary-green"
                  : "text-sm text-destructive"
              }
            >
              {message.text}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
