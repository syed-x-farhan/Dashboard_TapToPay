"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueryError } from "@/components/shared/query-error";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAdminPartners } from "@/admin-portal/hooks/use-admin-entities";
import {
  useGlobalFeeConfig,
  usePartnerFeeConfig,
  useUpdateGlobalFeeConfig,
} from "@/admin-portal/hooks/use-fee-configs";
import { PartnerFeeOverrideModal } from "@/admin-portal/components/settings/partner-fee-override-modal";
import type { AdminPartner } from "@/admin-portal/types/entities";
import type { UpdateGlobalFeeConfigBody } from "@/admin-portal/types/ops";

interface FeeConfigurationSectionProps {
  canEditFees: boolean;
}

function validateGlobalFeeConfig(body: UpdateGlobalFeeConfigBody): string | null {
  const fields: { label: string; value: number }[] = [
    { label: "Platform fee", value: body.platformFeePercent },
    { label: "Tax WHT", value: body.taxWhtPercent },
    { label: "Invoice discount (low)", value: body.invoiceDiscountLow },
    { label: "Invoice discount (medium)", value: body.invoiceDiscountMedium },
    { label: "Invoice discount (high)", value: body.invoiceDiscountHigh },
  ];

  for (const { label, value } of fields) {
    if (value < 0 || value > 100) {
      return `${label} must be between 0 and 100.`;
    }
  }

  if (body.invoiceDiscountLow > body.invoiceDiscountMedium) {
    return "Low-risk discount must be less than or equal to medium-risk.";
  }
  if (body.invoiceDiscountMedium > body.invoiceDiscountHigh) {
    return "Medium-risk discount must be less than or equal to high-risk.";
  }

  return null;
}

function PartnerFeeSourceCell({ partnerId }: { partnerId: string }) {
  const { data, isLoading, isError } = usePartnerFeeConfig(partnerId);

  if (isLoading) {
    return <Skeleton className="h-6 w-28 rounded-md" />;
  }
  if (isError) {
    return <span className="text-xs text-medium-text">Unavailable</span>;
  }

  const isOverride = data?.resolvedFrom === "partner";
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
        isOverride
          ? "border-rider-amber/20 bg-amber-50 text-rider-amber"
          : "border-primary-green/20 bg-green-50 text-primary-green"
      )}
    >
      {isOverride ? "Custom override" : "Global default"}
    </Badge>
  );
}

export function FeeConfigurationSection({ canEditFees }: FeeConfigurationSectionProps) {
  const {
    data: globalConfig,
    isLoading: globalLoading,
    isError: globalError,
    refetch: refetchGlobal,
  } = useGlobalFeeConfig();
  const updateGlobal = useUpdateGlobalFeeConfig();
  const {
    data: partners,
    isLoading: partnersLoading,
    isError: partnersError,
    refetch: refetchPartners,
  } = useAdminPartners();

  const [platformFeePercent, setPlatformFeePercent] = React.useState("");
  const [taxWhtPercent, setTaxWhtPercent] = React.useState("");
  const [invoiceDiscountLow, setInvoiceDiscountLow] = React.useState("");
  const [invoiceDiscountMedium, setInvoiceDiscountMedium] = React.useState("");
  const [invoiceDiscountHigh, setInvoiceDiscountHigh] = React.useState("");
  const [globalMessage, setGlobalMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [overrideTarget, setOverrideTarget] =
    React.useState<AdminPartner | null>(null);
  const [overrideOpen, setOverrideOpen] = React.useState(false);

  React.useEffect(() => {
    if (globalConfig) {
      setPlatformFeePercent(String(globalConfig.platformFeePercent));
      setTaxWhtPercent(String(globalConfig.taxWhtPercent));
      setInvoiceDiscountLow(String(globalConfig.invoiceDiscountLow));
      setInvoiceDiscountMedium(String(globalConfig.invoiceDiscountMedium));
      setInvoiceDiscountHigh(String(globalConfig.invoiceDiscountHigh));
    }
  }, [globalConfig]);

  const clearGlobalMessage = () => setGlobalMessage(null);

  const handleSaveGlobal = () => {
    const body: UpdateGlobalFeeConfigBody = {
      platformFeePercent: parseFloat(platformFeePercent) || 0,
      taxWhtPercent: parseFloat(taxWhtPercent) || 0,
      invoiceDiscountLow: parseFloat(invoiceDiscountLow) || 0,
      invoiceDiscountMedium: parseFloat(invoiceDiscountMedium) || 0,
      invoiceDiscountHigh: parseFloat(invoiceDiscountHigh) || 0,
    };

    const validationError = validateGlobalFeeConfig(body);
    if (validationError) {
      setGlobalMessage({ type: "error", text: validationError });
      return;
    }

    setGlobalMessage(null);
    updateGlobal.mutate(body, {
      onSuccess: () => {
        setGlobalMessage({
          type: "success",
          text: "Global fee defaults saved.",
        });
      },
      onError: (err) => {
        setGlobalMessage({
          type: "error",
          text:
            err instanceof Error ? err.message : "Failed to save global fees.",
        });
      },
    });
  };

  const openPartnerModal = (partner: AdminPartner) => {
    setOverrideTarget(partner);
    setOverrideOpen(true);
  };

  return (
    <section className="card-base p-6">
      <h2 className="mb-4 font-semibold text-dark-text">Fee Configuration</h2>

      <div className="space-y-8">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-dark-text">
            Global Defaults
          </h3>
          {globalError ? (
            <QueryError refetch={refetchGlobal} />
          ) : globalLoading ? (
            <Skeleton className="h-48 rounded-xl" />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={platformFeePercent}
                    onChange={(e) => {
                      clearGlobalMessage();
                      setPlatformFeePercent(e.target.value);
                    }}
                    className="rounded-xl"
                    disabled={!canEditFees}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax WHT (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={taxWhtPercent}
                    onChange={(e) => {
                      clearGlobalMessage();
                      setTaxWhtPercent(e.target.value);
                    }}
                    className="rounded-xl"
                    disabled={!canEditFees}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Discount — Low Risk (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={invoiceDiscountLow}
                    onChange={(e) => {
                      clearGlobalMessage();
                      setInvoiceDiscountLow(e.target.value);
                    }}
                    className="rounded-xl"
                    disabled={!canEditFees}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Discount — Medium Risk (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={invoiceDiscountMedium}
                    onChange={(e) => {
                      clearGlobalMessage();
                      setInvoiceDiscountMedium(e.target.value);
                    }}
                    className="rounded-xl"
                    disabled={!canEditFees}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Discount — High Risk (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={invoiceDiscountHigh}
                    onChange={(e) => {
                      clearGlobalMessage();
                      setInvoiceDiscountHigh(e.target.value);
                    }}
                    className="rounded-xl"
                    disabled={!canEditFees}
                  />
                </div>
              </div>
              {canEditFees && (
                <div className="mt-4">
                  <Button
                    className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
                    disabled={updateGlobal.isPending}
                    onClick={handleSaveGlobal}
                  >
                    Save Global Defaults
                  </Button>
                  {globalMessage && (
                    <p
                      className={
                        globalMessage.type === "success"
                          ? "mt-2 text-sm text-primary-green"
                          : "mt-2 text-sm text-destructive"
                      }
                    >
                      {globalMessage.text}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-dark-text">
            Per-Partner Overrides
          </h3>
          {partnersError ? (
            <QueryError refetch={refetchPartners} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-light-border">
              {partnersLoading ? (
                <Skeleton className="m-4 h-48 rounded-xl" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Partner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Fee Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners?.map((partner) => (
                      <TableRow
                        key={partner.id}
                        className="cursor-pointer"
                        onClick={() => openPartnerModal(partner)}
                      >
                        <TableCell className="font-medium">
                          {partner.name}
                        </TableCell>
                        <TableCell>{partner.type}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <PartnerFeeSourceCell partnerId={partner.id} />
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            type="button"
                            className="text-sm font-medium text-rider-blue hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openPartnerModal(partner);
                            }}
                          >
                            Configure
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </div>

      <PartnerFeeOverrideModal
        partner={overrideTarget}
        open={overrideOpen}
        onOpenChange={(open) => {
          setOverrideOpen(open);
          if (!open) setOverrideTarget(null);
        }}
        canEdit={canEditFees}
      />
    </section>
  );
}
