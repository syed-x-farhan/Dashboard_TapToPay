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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryError } from "@/components/shared/query-error";
import {
  useDeleteFeeConfigOverride,
  usePartnerFeeConfig,
  useUpsertPartnerFeeConfig,
} from "@/admin-portal/hooks/use-fee-configs";
import type { AdminPartner } from "@/admin-portal/types/entities";
import type { PlatformFeePayer } from "@/admin-portal/types/ops";

interface PartnerFeeOverrideModalProps {
  partner: AdminPartner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
}

function validatePartnerForm(
  platformFeePercent: number,
  partnerCommissionPercent: number,
  overrideReason: string
): string | null {
  if (platformFeePercent < 0 || platformFeePercent > 100) {
    return "Platform fee must be between 0 and 100.";
  }
  if (partnerCommissionPercent < 0 || partnerCommissionPercent > 100) {
    return "Partner commission must be between 0 and 100.";
  }
  if (!overrideReason.trim()) {
    return "Override reason is required.";
  }
  return null;
}

export function PartnerFeeOverrideModal({
  partner,
  open,
  onOpenChange,
  canEdit,
}: PartnerFeeOverrideModalProps) {
  const partnerId = partner?.id ?? "";
  const { data, isLoading, isError, refetch } = usePartnerFeeConfig(
    open ? partnerId : ""
  );
  const upsert = useUpsertPartnerFeeConfig();
  const removeOverride = useDeleteFeeConfigOverride();

  const [platformFeePercent, setPlatformFeePercent] = React.useState("");
  const [platformFeePayer, setPlatformFeePayer] =
    React.useState<PlatformFeePayer>("merchant");
  const [partnerCommissionPercent, setPartnerCommissionPercent] =
    React.useState("");
  const [overrideReason, setOverrideReason] = React.useState("");
  const [formMessage, setFormMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (!open) {
      setFormMessage(null);
      return;
    }
    if (data?.effectiveConfig) {
      const cfg = data.effectiveConfig;
      setPlatformFeePercent(String(cfg.platformFeePercent));
      setPlatformFeePayer(cfg.platformFeePayer);
      setPartnerCommissionPercent(
        String(cfg.partnerCommissionPercent ?? 0)
      );
      setOverrideReason("");
      setFormMessage(null);
    }
  }, [open, data]);

  const clearMessageOnEdit = () => setFormMessage(null);

  if (!partner) return null;

  const hasOverride = Boolean(data?.override?.id);
  const validationError = validatePartnerForm(
    parseFloat(platformFeePercent) || 0,
    parseFloat(partnerCommissionPercent) || 0,
    overrideReason
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partner Fee Override</DialogTitle>
        </DialogHeader>

        {isError ? (
          <QueryError refetch={refetch} />
        ) : isLoading ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="rounded-xl bg-content p-3 text-sm">
              <p className="font-medium text-dark-text">{partner.name}</p>
              <p className="text-medium-text">
                {partner.type} · {partner.city}
              </p>
              <p className="mt-1 text-xs text-medium-text">
                Currently using:{" "}
                <span className="font-medium text-dark-text">
                  {data?.resolvedFrom === "partner"
                    ? "Custom override"
                    : "Global default"}
                </span>
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Platform Fee (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={platformFeePercent}
                onChange={(e) => {
                  clearMessageOnEdit();
                  setPlatformFeePercent(e.target.value);
                }}
                className="rounded-xl"
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-2">
              <Label>Platform Fee Payer</Label>
              <Select
                value={platformFeePayer}
                onValueChange={(v) => {
                  clearMessageOnEdit();
                  setPlatformFeePayer((v ?? "merchant") as PlatformFeePayer);
                }}
                disabled={!canEdit}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="merchant">Merchant</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="split">Split</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Partner Commission (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={partnerCommissionPercent}
                onChange={(e) => {
                  clearMessageOnEdit();
                  setPartnerCommissionPercent(e.target.value);
                }}
                className="rounded-xl"
                disabled={!canEdit}
              />
            </div>

            <div className="grid gap-2">
              <Label>Override Reason (required)</Label>
              <Input
                value={overrideReason}
                onChange={(e) => {
                  clearMessageOnEdit();
                  setOverrideReason(e.target.value);
                }}
                placeholder="Why is this partner on a custom fee schedule?"
                className="rounded-xl"
                disabled={!canEdit}
              />
            </div>

            {formMessage && (
              <p
                className={
                  formMessage.type === "success"
                    ? "text-sm text-primary-green"
                    : "text-sm text-destructive"
                }
              >
                {formMessage.text}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          {canEdit && hasOverride && !isLoading && !isError && (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-rider-red/30 text-rider-red hover:bg-red-50"
              disabled={removeOverride.isPending || upsert.isPending}
              onClick={() => {
                const overrideId = data?.override?.id;
                if (!overrideId) return;
                setFormMessage(null);
                removeOverride.mutate(
                  { id: overrideId, partnerId: partner.id },
                  {
                    onSuccess: () => {
                      setFormMessage({
                        type: "success",
                        text: "Override removed. Partner reverted to global defaults.",
                      });
                    },
                    onError: (err) => {
                      setFormMessage({
                        type: "error",
                        text:
                          err instanceof Error
                            ? err.message
                            : "Failed to remove override.",
                      });
                    },
                  }
                );
              }}
            >
              Remove override / revert to global
            </Button>
          )}
          <div className="flex gap-2 sm:ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {canEdit && !isLoading && !isError && (
              <Button
                className="bg-primary-green text-white hover:bg-primary-green/90"
                disabled={
                  upsert.isPending ||
                  removeOverride.isPending ||
                  Boolean(validationError)
                }
                onClick={() => {
                  const error = validatePartnerForm(
                    parseFloat(platformFeePercent) || 0,
                    parseFloat(partnerCommissionPercent) || 0,
                    overrideReason
                  );
                  if (error) {
                    setFormMessage({ type: "error", text: error });
                    return;
                  }
                  setFormMessage(null);
                  upsert.mutate(
                    {
                      partnerId: partner.id,
                      body: {
                        platformFeePercent:
                          parseFloat(platformFeePercent) || 0,
                        platformFeePayer,
                        partnerCommissionPercent:
                          parseFloat(partnerCommissionPercent) || 0,
                        overrideReason: overrideReason.trim(),
                      },
                    },
                    {
                      onSuccess: () => {
                        setFormMessage({
                          type: "success",
                          text: "Partner fee override saved.",
                        });
                        setOverrideReason("");
                      },
                      onError: (err) => {
                        setFormMessage({
                          type: "error",
                          text:
                            err instanceof Error
                              ? err.message
                              : "Failed to save override.",
                        });
                      },
                    }
                  );
                }}
              >
                Save Override
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
