"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI, unwrapData } from "@/lib/api";
import type {
  FeeConfigRecord,
  GlobalFeeConfig,
  PartnerFeeConfigResponse,
  PlatformFeePayer,
  UpdateGlobalFeeConfigBody,
  UpsertPartnerFeeConfigBody,
} from "@/admin-portal/types/ops";

const FEE_CONFIG_KEYS = {
  global: ["admin", "fee-configs", "global"] as const,
  partner: (partnerId: string) =>
    ["admin", "fee-configs", "partner", partnerId] as const,
};

function num(v: unknown, fallback = 0): number {
  const n = Number(v ?? fallback);
  return Number.isFinite(n) ? n : fallback;
}

function normalizePayer(v: unknown): PlatformFeePayer {
  const raw = String(v ?? "merchant").toLowerCase();
  if (raw === "partner" || raw === "split") return raw;
  return "merchant";
}

function normalizeFeeConfigRecord(
  raw: Record<string, unknown>
): FeeConfigRecord {
  return {
    id: String(raw.id ?? ""),
    scope: String(raw.scope ?? "global") as FeeConfigRecord["scope"],
    platformFeePercent: num(
      raw.platformFeePercent ?? raw.platform_fee_percent
    ),
    platformFeePayer: normalizePayer(
      raw.platformFeePayer ?? raw.platform_fee_payer
    ),
    partnerCommissionPercent: num(
      raw.partnerCommissionPercent ?? raw.partner_commission_percent
    ),
    taxWhtPercent: num(raw.taxWhtPercent ?? raw.tax_wht_percent),
    invoiceDiscountLow: num(
      raw.invoiceDiscountLow ?? raw.invoice_discount_low
    ),
    invoiceDiscountMedium: num(
      raw.invoiceDiscountMedium ?? raw.invoice_discount_medium
    ),
    invoiceDiscountHigh: num(
      raw.invoiceDiscountHigh ?? raw.invoice_discount_high
    ),
  };
}

function normalizePartnerFeeConfigResponse(
  raw: Record<string, unknown>
): PartnerFeeConfigResponse {
  const overrideRaw = raw.override ?? raw.override_config;
  const effectiveRaw =
    raw.effectiveConfig ?? raw.effective_config ?? raw.effective ?? {};

  const override =
    overrideRaw && typeof overrideRaw === "object"
      ? normalizeFeeConfigRecord(overrideRaw as Record<string, unknown>)
      : null;

  const effectiveConfig = normalizeFeeConfigRecord(
    (effectiveRaw && typeof effectiveRaw === "object"
      ? effectiveRaw
      : raw) as Record<string, unknown>
  );

  const resolvedFromRaw = String(
    raw.resolvedFrom ?? raw.resolved_from ?? "global"
  ).toLowerCase();

  return {
    override,
    resolvedFrom: resolvedFromRaw === "partner" ? "partner" : "global",
    effectiveConfig,
  };
}

export function useGlobalFeeConfig() {
  return useQuery<GlobalFeeConfig>({
    queryKey: FEE_CONFIG_KEYS.global,
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/fee-configs/global");
      const data = unwrapData<Record<string, unknown>>(res);
      return normalizeFeeConfigRecord(data) as GlobalFeeConfig;
    },
  });
}

export function useUpdateGlobalFeeConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateGlobalFeeConfigBody) =>
      adminAPI.put("/api/v1/admin/fee-configs/global", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FEE_CONFIG_KEYS.global });
    },
  });
}

export function usePartnerFeeConfig(partnerId: string) {
  return useQuery<PartnerFeeConfigResponse>({
    queryKey: FEE_CONFIG_KEYS.partner(partnerId),
    queryFn: async () => {
      const res = await adminAPI.get(
        `/api/v1/admin/fee-configs/partner/${partnerId}`
      );
      const data = unwrapData<Record<string, unknown>>(res);
      return normalizePartnerFeeConfigResponse(data);
    },
    enabled: !!partnerId,
  });
}

export function useUpsertPartnerFeeConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      partnerId,
      body,
    }: {
      partnerId: string;
      body: UpsertPartnerFeeConfigBody;
    }) =>
      adminAPI.post(`/api/v1/admin/fee-configs/partner/${partnerId}`, body),
    onSuccess: (_, { partnerId }) => {
      qc.invalidateQueries({ queryKey: FEE_CONFIG_KEYS.partner(partnerId) });
    },
  });
}

export function useDeleteFeeConfigOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; partnerId: string }) =>
      adminAPI.delete(`/api/v1/admin/fee-configs/${id}`),
    onSuccess: (_, { partnerId }) => {
      qc.invalidateQueries({ queryKey: FEE_CONFIG_KEYS.partner(partnerId) });
    },
  });
}
