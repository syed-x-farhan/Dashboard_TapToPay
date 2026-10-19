"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { QueryError } from "@/components/shared/query-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddMerchant, useAdminPartners } from "@/admin-portal/hooks/use-admin-entities";
import {
  useCreateMerchantPartnerRelationship,
  useMerchantPartnerRelationshipTypes,
} from "@/admin-portal/hooks/use-merchant-partners";

interface AddMerchantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettlementDestination = "merchant" | "platform" | "split";

interface AdditionalPlatformRow {
  id: string;
  relationshipType: string;
  commissionRate: string;
  platformFeeOverride: string;
  settlementDestination: SettlementDestination;
}

const CITIES = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"] as const;
const CATEGORIES = ["Restaurant", "Retail", "Other"] as const;

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function AddMerchantModal({ open, onOpenChange }: AddMerchantModalProps) {
  const addMerchant = useAddMerchant();
  const createRelationship = useCreateMerchantPartnerRelationship();
  const {
    data: partners,
    isLoading: partnersLoading,
    isError: partnersError,
    refetch: refetchPartners,
  } = useAdminPartners();
  const {
    data: relationshipTypes,
    isLoading: typesLoading,
    isError: typesError,
    refetch: refetchTypes,
  } = useMerchantPartnerRelationshipTypes();

  const [city, setCity] = React.useState<(typeof CITIES)[number]>("Lahore");
  const [category, setCategory] = React.useState<(typeof CATEGORIES)[number]>("Restaurant");
  const [partnerId, setPartnerId] = React.useState("");
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
  const [platformRows, setPlatformRows] = React.useState<AdditionalPlatformRow[]>([]);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const availableRelationshipTypes = React.useMemo(
    () => (relationshipTypes ?? []).filter((type) => type.toLowerCase() !== "direct"),
    [relationshipTypes]
  );

  React.useEffect(() => {
    if (!open) {
      setMessage(null);
      setPlatformRows([]);
      setCity("Lahore");
      setCategory("Restaurant");
      setPartnerId("");
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
    }
  }, [open]);

  const isBusy = addMerchant.isPending || createRelationship.isPending;

  const addPlatformRow = () => {
    setMessage(null);
    setPlatformRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        relationshipType: "",
        commissionRate: "",
        platformFeeOverride: "",
        settlementDestination: "merchant",
      },
    ]);
  };

  const updatePlatformRow = (
    rowId: string,
    patch: Partial<AdditionalPlatformRow>
  ) => {
    setMessage(null);
    setPlatformRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row))
    );
  };

  const removePlatformRow = (rowId: string) => {
    setMessage(null);
    setPlatformRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    const missing = Object.values(formValues).some((value) => !value.trim());
    if (missing || !partnerId) {
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

    const rowsToSave = platformRows.filter((row) => row.relationshipType);
    for (const row of rowsToSave) {
      const commissionRate = row.commissionRate ? Number(row.commissionRate) : undefined;
      const platformFeeOverride = row.platformFeeOverride
        ? Number(row.platformFeeOverride)
        : undefined;
      if (
        (commissionRate !== undefined &&
          (!Number.isFinite(commissionRate) ||
            commissionRate < 0 ||
            commissionRate > 100)) ||
        (platformFeeOverride !== undefined &&
          (!Number.isFinite(platformFeeOverride) ||
            platformFeeOverride < 0 ||
            platformFeeOverride > 100))
      ) {
        setMessage({
          type: "error",
          text: "Commission and platform fee override must be between 0 and 100.",
        });
        return;
      }
    }

    try {
      const createRes = (await addMerchant.mutateAsync({
        name: formValues.name.trim(),
        ownerName: formValues.ownerName.trim(),
        cnic: formValues.cnic.trim(),
        phone: formValues.phone.trim(),
        jazzCashNumber: formValues.jazzCashNumber.trim(),
        city,
        category,
        monthlyExpectedVolume,
        partnerId,
        email: formValues.email.trim(),
        password: formValues.password,
      })) as
        | { merchant?: { id?: string | number }; id?: string | number }
        | undefined;

      const merchantId = String(
        createRes?.merchant?.id ?? createRes?.id ?? ""
      ).trim();
      if (!merchantId) {
        setMessage({
          type: "error",
          text: "Merchant created but response did not include merchant ID.",
        });
        return;
      }

      if (rowsToSave.length === 0) {
        onOpenChange(false);
        return;
      }

      let failedCount = 0;
      for (const row of rowsToSave) {
        try {
          await createRelationship.mutateAsync({
            merchantId,
            partnerId,
            relationshipType: row.relationshipType,
            commissionRate: row.commissionRate
              ? Number(row.commissionRate)
              : undefined,
            platformFeeOverride: row.platformFeeOverride
              ? Number(row.platformFeeOverride)
              : undefined,
            settlementDestination: row.settlementDestination,
          });
        } catch {
          failedCount += 1;
        }
      }

      if (failedCount > 0) {
        setMessage({
          type: "error",
          text: `Merchant created, but ${failedCount} of ${rowsToSave.length} platform relationships failed to save - you can add them from the merchant detail page.`,
        });
        return;
      }

      onOpenChange(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: getErrorMessage(err, "Failed to create merchant."),
      });
    }
  }

  const hasAllRequiredFields =
    Object.values(formValues).every((value) => value.trim().length > 0) &&
    !!partnerId;

  const canSubmit =
    !isBusy &&
    !partnersLoading &&
    !typesLoading &&
    !partnersError &&
    !typesError &&
    hasAllRequiredFields;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Merchant</DialogTitle>
        </DialogHeader>

        {partnersError ? (
          <QueryError refetch={refetchPartners} />
        ) : typesError ? (
          <QueryError refetch={refetchTypes} />
        ) : partnersLoading || typesLoading ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Business Name</Label>
              <Input
                name="name"
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
                name="ownerName"
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
                  name="cnic"
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
                  name="phone"
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
                name="jazzCashNumber"
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
                <Select value={city} onValueChange={(value) => setCity(value as (typeof CITIES)[number])}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as (typeof CATEGORIES)[number])}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Monthly Expected Volume (PKR)</Label>
              <Input
                name="monthlyExpectedVolume"
                type="number"
                min={0}
                required
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
                  name="email"
                  type="email"
                  required
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
                  name="password"
                  type="password"
                  required
                  className="rounded-xl"
                  value={formValues.password}
                  onChange={(e) => {
                    setMessage(null);
                    setFormValues((prev) => ({ ...prev, password: e.target.value }));
                  }}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Primary Partner</Label>
              <Select value={partnerId} onValueChange={(value) => setPartnerId(value ?? "")}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners?.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 rounded-xl border border-light-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-dark-text">Additional Platforms</p>
                  <p className="text-xs text-medium-text">
                    Optional: add non-primary platform relationships for this merchant.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={addPlatformRow}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Platform
                </Button>
              </div>

              {platformRows.length === 0 ? (
                <p className="text-xs text-medium-text">No additional platforms added.</p>
              ) : (
                <div className="space-y-3">
                  {platformRows.map((row) => (
                    <div key={row.id} className="grid gap-3 rounded-xl border border-light-border p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <Label>Platform</Label>
                          <Select
                            value={row.relationshipType}
                            onValueChange={(value) =>
                              updatePlatformRow(row.id, { relationshipType: value ?? "" })
                            }
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableRelationshipTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Settlement Destination</Label>
                          <Select
                            value={row.settlementDestination}
                            onValueChange={(value) =>
                              updatePlatformRow(row.id, {
                                settlementDestination: value as SettlementDestination,
                              })
                            }
                          >
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="merchant">merchant</SelectItem>
                              <SelectItem value="platform">platform</SelectItem>
                              <SelectItem value="split">split</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                          <Label>Commission Rate (%)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            value={row.commissionRate}
                            onChange={(e) =>
                              updatePlatformRow(row.id, { commissionRate: e.target.value })
                            }
                            className="rounded-xl"
                            placeholder="Optional"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Platform Fee Override (%)</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step="0.1"
                            value={row.platformFeeOverride}
                            onChange={(e) =>
                              updatePlatformRow(row.id, {
                                platformFeeOverride: e.target.value,
                              })
                            }
                            className="rounded-xl"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-xl border-rider-red/30 text-rider-red hover:bg-red-50"
                          onClick={() => removePlatformRow(row.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-green text-white hover:bg-primary-green/90"
                disabled={!canSubmit}
              >
                Add Merchant
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
        )}
      </DialogContent>
    </Dialog>
  );
}
