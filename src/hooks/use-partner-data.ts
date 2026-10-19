"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { partnerAPI, unwrapData, unwrapList } from "@/lib/api";
import {
  normalizeDiscountRequest,
  normalizePartnerDashboard,
  normalizePartnerMerchant,
  normalizePartnerProfile,
  normalizePartnerTransaction,
} from "@/lib/api-normalize";
import type {
  CompletedSettlement,
  DiscountRequest,
  Partner,
  PartnerDashboardData,
  PartnerMerchant,
  PartnerRider,
  PartnerSettingsData,
  PartnerTransaction,
  PendingSettlement,
} from "@/types/partner";

export interface PartnerSettlementsData {
  pending: PendingSettlement[];
  completed: CompletedSettlement[];
}

interface AddPartnerMerchantBody {
  name: string;
  ownerName: string;
  cnic: string;
  phone: string;
  jazzCashNumber: string;
  city: string;
  category: string;
  monthlyExpectedVolume: number;
  email: string;
  password: string;
}

function normalizeSettlements(raw: Record<string, unknown>): PartnerSettlementsData {
  const pending = (raw.pending ?? []) as Record<string, unknown>[];
  const completed = (raw.completed ?? []) as Record<string, unknown>[];

  return {
    pending: pending.map((s) => ({
      id: String(s.id ?? ""),
      merchantId: String(s.merchantId ?? s.merchant_id ?? ""),
      merchantName: String(s.merchantName ?? s.merchant_name ?? s.merchant ?? ""),
      ordersCount: Number(s.ordersCount ?? s.orders_count ?? 0),
      grossAmount: Number(s.grossAmount ?? s.gross_amount ?? 0),
      platformFee: Number(s.platformFee ?? s.platform_fee ?? 0),
      tax: Number(s.tax ?? 0),
      netPayable: Number(s.netPayable ?? s.net_payable ?? 0),
      dueDate: String(s.dueDate ?? s.due_date ?? ""),
    })),
    completed: completed.map((s) => ({
      id: String(s.id ?? ""),
      date: String(s.date ?? ""),
      merchant: String(s.merchant ?? s.merchantName ?? s.merchant_name ?? ""),
      amount: Number(s.amount ?? 0),
      method: (String(s.method ?? "Jazz Cash") === "Bank"
        ? "Bank"
        : "Jazz Cash") as CompletedSettlement["method"],
      referenceId: String(s.referenceId ?? s.reference_id ?? ""),
      status: (String(s.status ?? "Completed") === "Processing"
        ? "Processing"
        : "Completed") as CompletedSettlement["status"],
    })),
  };
}

export function usePartnerDashboard() {
  return useQuery<PartnerDashboardData>({
    queryKey: ["partner", "dashboard"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/dashboard");
      return normalizePartnerDashboard(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });
}

export function usePartnerMerchants() {
  return useQuery<PartnerMerchant[]>({
    queryKey: ["partner", "merchants"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/merchants");
      return unwrapList(res).map((row) =>
        normalizePartnerMerchant(row as Record<string, unknown>)
      );
    },
  });
}

export function useAddPartnerMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddPartnerMerchantBody) =>
      partnerAPI.post("/api/v1/partner/merchants", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner", "merchants"] });
    },
  });
}

export function usePartnerMerchant(id: string) {
  return useQuery<PartnerMerchant>({
    queryKey: ["partner", "merchant", id],
    queryFn: async () => {
      const res = await partnerAPI.get(`/api/v1/partner/merchants/${id}`);
      return normalizePartnerMerchant(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
    enabled: !!id,
  });
}

export function usePartnerRiders() {
  return useQuery<PartnerRider[]>({
    queryKey: ["partner", "riders"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/riders");
      return unwrapList(res).map((row) => {
        const raw = row as Record<string, unknown>;
        const stats =
          (raw.stats as Record<string, unknown> | undefined) ?? {};
        const todayCollections = Number(
          raw.todayCollections ||
            raw.today_collections ||
            stats.todayCollections ||
            stats.today_collections ||
            0
        );
        const nfcCount = Number(
          raw.nfcPaymentsCount ||
            raw.nfcCount ||
            raw.nfc_count ||
            stats.nfcCount ||
            stats.nfc_count ||
            0
        );

        return {
          id: String(raw.id ?? ""),
          name: String(raw.fullName || raw.full_name || raw.name || ""),
          phone: String(raw.phoneNumber || raw.phone_number || raw.phone || ""),
          cnic: "-",
          city: "-",
          pickupMerchants: [],
          activeZone: "-",
          deliveriesToday: todayCollections,
          completedDeliveriesToday: nfcCount,
          lastSeenAt: String(raw.lastSeenAt || raw.createdAt || raw.created_at || "Unknown"),
          lastSeenArea: "-",
          todayCollections,
          totalThisMonth: Number(
            raw.totalThisMonth ||
              raw.total_this_month ||
              stats.totalThisMonth ||
              stats.total_this_month ||
              0
          ),
          nfcPaymentsCount: nfcCount,
          cashCollections: Number(
            raw.cashCollections ||
              raw.cash_count ||
              stats.cashCollections ||
              stats.cash_count ||
              0
          ),
          status: raw.isVerified || raw.is_verified ? "Active" : "Inactive",
          recentDeliveries: [],
          dailyEarnings: [],
        } as PartnerRider;
      });
    },
  });
}

export function usePartnerTransactions() {
  return useQuery<PartnerTransaction[]>({
    queryKey: ["partner", "transactions"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/transactions");
      return unwrapList(res).map((row) =>
        normalizePartnerTransaction(row as Record<string, unknown>)
      );
    },
  });
}

export function useSettlements() {
  return useQuery<PartnerSettlementsData>({
    queryKey: ["partner", "settlements"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/settlements");
      return normalizeSettlements(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });
}

export function useDiscountRequests() {
  return useQuery<DiscountRequest[]>({
    queryKey: ["partner", "discounting"],
    queryFn: async () => {
      const res = await partnerAPI.get(
        "/api/v1/partner/invoice-discounting/requests"
      );
      return unwrapList(res).map((row) =>
        normalizeDiscountRequest(row as Record<string, unknown>)
      );
    },
  });
}

export function usePartnerSettings() {
  return useQuery<PartnerSettingsData>({
    queryKey: ["partner", "settings"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/settings");
      const data = unwrapData<Record<string, unknown>>(res) as Record<
        string,
        unknown
      >;
      const partner = normalizePartnerProfile(
        (data.partner ?? data) as Record<string, unknown>
      );
      return {
        partner,
        webhooks: (data.webhooks ?? []) as PartnerSettingsData["webhooks"],
        teamMembers: (data.teamMembers ??
          data.team_members ??
          []) as PartnerSettingsData["teamMembers"],
        scheduledReports: (data.scheduledReports ??
          data.scheduled_reports ??
          []) as PartnerSettingsData["scheduledReports"],
        apiKeys: (data.apiKeys ??
          data.api_keys ?? { live: "", test: "" }) as PartnerSettingsData["apiKeys"],
        discountRules: (data.discountRules ??
          data.discount_rules ?? { low: 2, medium: 3.5, high: 5 }) as PartnerSettingsData["discountRules"],
      };
    },
  });
}

export function usePartnerMe() {
  return useQuery<Partner>({
    queryKey: ["partner", "me"],
    queryFn: async () => {
      const res = await partnerAPI.get("/api/v1/partner/me");
      return normalizePartnerProfile(
        unwrapData<Record<string, unknown>>(res) as Record<string, unknown>
      );
    },
  });
}
