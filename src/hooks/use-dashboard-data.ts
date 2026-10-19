"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { merchantAPI, unwrapData, unwrapList } from "@/lib/api";
import {
  normalizeDashboardStats,
  normalizeDiscountHistory,
  normalizeEligibleInvoice,
  normalizeInvoiceStats,
  normalizeMerchantProfile,
  normalizeMerchantTransaction,
  normalizePaymentBreakdown,
  normalizeTaxComplianceData,
} from "@/lib/api-normalize";
import type {
  DashboardStats,
  DiscountHistory,
  EarningsDataPoint,
  EligibleInvoice,
  InvoiceDiscountStats,
  Merchant,
  NotificationSettings,
  PaymentBreakdown,
  TaxComplianceData,
  Transaction,
} from "@/types";

const defaultInvoiceStats: InvoiceDiscountStats = {
  availableForDiscounting: 0,
  totalDiscountedThisMonth: 0,
};

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["merchant", "dashboard", "stats"],
    queryFn: async () => {
      const res = await merchantAPI.get("/api/v1/merchant/dashboard/stats");
      return normalizeDashboardStats(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });
}

export function useEarnings(
  period: "daily" | "weekly" | "monthly" = "daily"
) {
  return useQuery<EarningsDataPoint[]>({
    queryKey: ["merchant", "earnings", period],
    queryFn: async () => {
      const res = await merchantAPI.get(
        `/api/v1/merchant/earnings?period=${period}`
      );
      return unwrapList<EarningsDataPoint>(res);
    },
  });
}

export function usePaymentBreakdown() {
  return useQuery<PaymentBreakdown[]>({
    queryKey: ["merchant", "payment-breakdown"],
    queryFn: async () => {
      const res = await merchantAPI.get(
        "/api/v1/merchant/payment-breakdown"
      );
      return normalizePaymentBreakdown(unwrapList(res));
    },
  });
}

export function useTransactions(params?: {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  paymentMethod?: string;
  status?: string;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("pageSize", String(params.pageSize));
  if (params?.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params?.dateTo) query.set("dateTo", params.dateTo);
  if (params?.paymentMethod)
    query.set("paymentMethod", params.paymentMethod.toLowerCase());
  if (params?.status) query.set("status", params.status.toLowerCase());
  if (params?.limit) query.set("limit", String(params.limit));

  return useQuery<Transaction[]>({
    queryKey: ["merchant", "transactions", params],
    queryFn: async () => {
      const qs = query.toString();
      const res = await merchantAPI.get(
        `/api/v1/merchant/transactions${qs ? `?${qs}` : ""}`
      );
      return unwrapList(res).map((row) =>
        normalizeMerchantTransaction(row as Record<string, unknown>)
      );
    },
  });
}

export function useMerchant() {
  return useQuery<Merchant>({
    queryKey: ["merchant", "me"],
    queryFn: async () => {
      const res = await merchantAPI.get("/api/v1/merchant/me");
      return normalizeMerchantProfile(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });
}

export function useInvoiceDiscounting() {
  const queryClient = useQueryClient();

  const statsQuery = useQuery<InvoiceDiscountStats>({
    queryKey: ["merchant", "invoice", "stats"],
    queryFn: async () => {
      const res = await merchantAPI.get(
        "/api/v1/merchant/invoice-discounting/stats"
      );
      return normalizeInvoiceStats(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });

  const eligible = useQuery<EligibleInvoice[]>({
    queryKey: ["merchant", "invoice", "eligible"],
    queryFn: async () => {
      const res = await merchantAPI.get(
        "/api/v1/merchant/invoice-discounting/eligible"
      );
      return unwrapList(res).map((row) =>
        normalizeEligibleInvoice(row as Record<string, unknown>)
      );
    },
  });

  const history = useQuery<DiscountHistory[]>({
    queryKey: ["merchant", "invoice", "history"],
    queryFn: async () => {
      const res = await merchantAPI.get(
        "/api/v1/merchant/invoice-discounting/history"
      );
      return unwrapList(res).map((row) =>
        normalizeDiscountHistory(row as Record<string, unknown>)
      );
    },
  });

  const requestDiscount = useMutation({
    mutationFn: (invoiceId: string) =>
      merchantAPI.post("/api/v1/merchant/invoice-discounting/requests", {
        invoiceId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant", "invoice"] });
    },
  });

  return {
    stats: statsQuery.data ?? defaultInvoiceStats,
    eligible,
    history,
    isLoading:
      statsQuery.isLoading || eligible.isLoading || history.isLoading,
    isError:
      statsQuery.isError || eligible.isError || history.isError,
    refetch: () => {
      void statsQuery.refetch();
      void eligible.refetch();
      void history.refetch();
    },
    requestDiscount,
  };
}

export function useTaxData() {
  return useQuery<TaxComplianceData>({
    queryKey: ["merchant", "tax"],
    queryFn: async () => {
      const res = await merchantAPI.get("/api/v1/merchant/tax-compliance");
      return normalizeTaxComplianceData(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });
}

export function useNotificationSettings() {
  return useQuery<NotificationSettings>({
    queryKey: ["merchant", "notification-settings"],
    queryFn: async () => {
      const res = await merchantAPI.get(
        "/api/v1/merchant/notification-settings"
      );
      return unwrapData<NotificationSettings>(res);
    },
  });
}
