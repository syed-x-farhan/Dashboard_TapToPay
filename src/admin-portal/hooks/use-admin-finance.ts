"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI, unwrapData, unwrapList } from "@/lib/api";
import { normalizeAdminTransaction } from "@/lib/api-normalize";
import type {
  AdminDiscountRequestsData,
  AdminSettlementsData,
  AdminTransaction,
  DiscountingRulesEngine,
} from "@/admin-portal/types/finance";

export function useAdminTransactions(params?: { merchantId?: string }) {
  return useQuery<AdminTransaction[]>({
    queryKey: ["admin", "transactions", params?.merchantId],
    queryFn: async () => {
      const res: unknown = await adminAPI.get("/api/v1/admin/transactions");
      const list = unwrapList(res).map((row) =>
        normalizeAdminTransaction(row as Record<string, unknown>)
      );
      if (params?.merchantId) {
        return list.filter(
          (tx) =>
            tx.merchantId === params.merchantId ||
            tx.merchantId === String(params.merchantId)
        );
      }
      return list;
    },
  });
}

export function useAdminSettlements() {
  return useQuery<AdminSettlementsData>({
    queryKey: ["admin", "settlements"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/settlements");
      const data = unwrapData<Record<string, unknown>>(res) as Record<
        string,
        unknown
      >;
      const summary = (data.summary ?? {}) as Record<string, unknown>;
      const pending = (data.pending ?? []) as Record<string, unknown>[];
      const processing = (data.processing ?? []) as Record<string, unknown>[];
      const completed = (data.completed ?? []) as Record<string, unknown>[];

      return {
        summary: {
          totalPending: Number(summary.totalPending ?? summary.total_pending ?? 0),
          processedToday: Number(
            summary.processedToday ?? summary.processed_today ?? 0
          ),
          processedThisMonth: Number(
            summary.processedThisMonth ?? summary.processed_this_month ?? 0
          ),
          failedCount: Number(summary.failedCount ?? summary.failed_count ?? 0),
        },
        pending: pending.map((s) => ({
          id: String(s.id ?? ""),
          partnerId: String(s.partnerId ?? s.partner_id ?? ""),
          partnerName: String(s.partnerName ?? s.partner_name ?? ""),
          merchantId: String(s.merchantId ?? s.merchant_id ?? ""),
          merchantName: String(s.merchantName ?? s.merchant_name ?? s.merchant ?? ""),
          ordersCount: Number(s.ordersCount ?? s.orders_count ?? 0),
          grossAmount: Number(s.grossAmount ?? s.gross_amount ?? 0),
          platformFee: Number(s.platformFee ?? s.platform_fee ?? 0),
          tax: Number(s.tax ?? 0),
          netPayable: Number(s.netPayable ?? s.net_payable ?? 0),
          dueDate: String(s.dueDate ?? s.due_date ?? ""),
        })) as AdminSettlementsData["pending"],
        processing: processing.map((s) => ({
          id: String(s.id ?? ""),
          partnerName: String(s.partnerName ?? s.partner_name ?? ""),
          merchantName: String(s.merchantName ?? s.merchant_name ?? s.merchant ?? ""),
          amount: Number(s.amount ?? 0),
          status: String(s.status ?? "Processing") as AdminSettlementsData["processing"][0]["status"],
          startedAt: String(s.startedAt ?? s.started_at ?? ""),
          progress: Number(s.progress ?? 0),
        })) as AdminSettlementsData["processing"],
        completed: completed.map((s) => ({
          id: String(s.id ?? ""),
          date: String(s.date ?? ""),
          partnerName: String(s.partnerName ?? s.partner_name ?? ""),
          merchant: String(s.merchant ?? s.merchantName ?? s.merchant_name ?? ""),
          amount: Number(s.amount ?? 0),
          method: (String(s.method ?? "Jazz Cash") === "Bank"
            ? "Bank"
            : "Jazz Cash") as AdminSettlementsData["completed"][0]["method"],
          referenceId: String(s.referenceId ?? s.reference_id ?? ""),
          status: String(s.status ?? "Completed") as AdminSettlementsData["completed"][0]["status"],
          errorMessage: s.errorMessage
            ? String(s.errorMessage)
            : s.error_message
              ? String(s.error_message)
              : undefined,
        })) as AdminSettlementsData["completed"],
      };
    },
  });
}

export function useAdminDiscountRequests() {
  return useQuery<AdminDiscountRequestsData>({
    queryKey: ["admin", "discounting"],
    queryFn: async () => {
      const res = await adminAPI.get(
        "/api/v1/admin/invoice-discounting/requests"
      );
      const data = unwrapData<Record<string, unknown>>(res) as Record<
        string,
        unknown
      >;
      const requests = (data.requests ?? unwrapList(res)) as Record<
        string,
        unknown
      >[];
      const stats = (data.stats ?? {}) as Record<string, unknown>;
      return {
        requests: requests.map((r) => ({
          id: String(r.id ?? ""),
          requestDate: String(
            r.requestDate ?? r.request_date ?? r.createdAt ?? ""
          ),
          partnerId: String(r.partnerId ?? r.partner_id ?? ""),
          partnerName: String(r.partnerName ?? r.partner_name ?? ""),
          merchantName: String(r.merchantName ?? r.merchant_name ?? ""),
          invoiceAmount: Number(r.invoiceAmount ?? r.invoice_amount ?? 0),
          discountFeePercent: Number(
            r.discountFeePercent ?? r.discount_fee_percent ?? 0
          ),
          discountFee: Number(r.discountFee ?? r.discount_fee ?? 0),
          payoutAmount: Number(
            r.payoutAmount ?? r.payout_amount ?? r.amountToPayOut ?? 0
          ),
          riskLevel: String(r.riskLevel ?? r.risk_level ?? "Low"),
          riskScore: Number(r.riskScore ?? r.risk_score ?? 0),
          riskFactors: (r.riskFactors ?? r.risk_factors ?? []) as string[],
          status: String(r.status ?? "Pending Approval"),
          requestedBy: String(r.requestedBy ?? r.requested_by ?? ""),
        })) as AdminDiscountRequestsData["requests"],
        stats: {
          pendingRequests: Number(
            stats.pendingRequests ?? stats.pending_requests ?? 0
          ),
          approvedToday: Number(stats.approvedToday ?? stats.approved_today ?? 0),
          rejectedToday: Number(
            stats.rejectedToday ?? stats.rejected_today ?? 0
          ),
          discountedThisMonth: Number(
            stats.discountedThisMonth ?? stats.discounted_this_month ?? 0
          ),
        },
      };
    },
  });
}

export function useDiscountingRules() {
  return useQuery<DiscountingRulesEngine>({
    queryKey: ["admin", "discount-rules"],
    queryFn: async () => {
      const res = await adminAPI.get(
        "/api/v1/admin/invoice-discounting/rules"
      );
      return unwrapData<DiscountingRulesEngine>(res);
    },
  });
}

export function useSettleMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/settlements/${id}/settle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settlements"] }),
  });
}

export function useBulkSettlePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (partnerId: string) =>
      adminAPI.post("/api/v1/admin/settlements/bulk", { partnerId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settlements"] }),
  });
}

export function useRetrySettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/settlements/${id}/retry`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settlements"] }),
  });
}

export function useApproveDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(
        `/api/v1/admin/invoice-discounting/requests/${id}/approve`
      ),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "discounting"] }),
  });
}

export function useRejectDiscount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(
        `/api/v1/admin/invoice-discounting/requests/${id}/reject`,
        { reason: "Rejected" }
      ),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "discounting"] }),
  });
}

export function useBulkApproveDiscounts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      adminAPI.post(
        "/api/v1/admin/invoice-discounting/requests/bulk-approve",
        { ids }
      ),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "discounting"] }),
  });
}

export function useSaveDiscountingRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rules: DiscountingRulesEngine) =>
      adminAPI.put("/api/v1/admin/invoice-discounting/rules", rules),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin", "discount-rules"] }),
  });
}
