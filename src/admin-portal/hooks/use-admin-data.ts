"use client";

import { useQuery } from "@tanstack/react-query";
import { adminAPI, unwrapData, unwrapList } from "@/lib/api";
import type { AdminDashboardData, LiveTransaction } from "@/admin-portal/types";

function normalizeAdminDashboard(raw: Record<string, unknown>): AdminDashboardData {
  const stats = (raw.stats ?? {}) as Record<string, unknown>;
  const num = (v: unknown) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  const pendingActions = ((raw.pendingActions ?? raw.pending_actions ?? []) as Record<
    string,
    unknown
  >[]).map((a) => {
    const severity = String(a.severity ?? "amber").toLowerCase();
    return {
      id: String(a.id ?? ""),
      severity: (severity === "high" || severity === "red"
        ? "red"
        : "amber") as AdminDashboardData["pendingActions"][0]["severity"],
      description: String(a.description ?? ""),
      href: String(a.href ?? "#"),
      actionLabel: String(a.actionLabel ?? a.action_label ?? "View"),
    };
  });

  const liveFeed = ((raw.liveFeed ?? raw.live_feed ?? []) as Record<
    string,
    unknown
  >[]).map((tx) => ({
    id: String(tx.id ?? ""),
    partner: String(tx.partner ?? "—"),
    merchant: String(tx.merchant ?? "—"),
    amount: num(tx.amount),
    paymentMethod: (() => {
      const m = String(tx.paymentMethod ?? tx.payment_method ?? "NFC").toLowerCase();
      if (m === "cash") return "Cash" as const;
      if (m === "wallet") return "Wallet" as const;
      return "NFC" as const;
    })(),
    timestamp: String(tx.timestamp ?? ""),
  }));

  return {
    stats: {
      totalPartners: num(stats.totalPartners ?? stats.total_partners),
      partnersPendingApproval: num(
        stats.partnersPendingApproval ?? stats.partners_pending_approval
      ),
      totalMerchants: num(stats.totalMerchants ?? stats.total_merchants),
      merchantsAddedThisWeek: num(
        stats.merchantsAddedThisWeek ?? stats.merchants_added_this_week
      ),
      totalRiders: num(stats.totalRiders ?? stats.total_riders),
      activeRidersToday: num(stats.activeRidersToday ?? stats.active_riders_today),
      todayVolume: num(stats.todayVolume ?? stats.today_volume),
      volumeChangePercent: num(
        stats.volumeChangePercent ?? stats.volume_change_percent
      ),
      pendingSettlements: num(
        stats.pendingSettlements ?? stats.pending_settlements
      ),
      discountingRequests: num(
        stats.discountingRequests ?? stats.discounting_requests
      ),
      discountingPendingApproval: num(
        stats.discountingPendingApproval ?? stats.discounting_pending_approval
      ),
      totalTaxHeld: num(stats.totalTaxHeld ?? stats.total_tax_held),
      platformRevenueToday: num(
        stats.platformRevenueToday ?? stats.platform_revenue_today
      ),
    },
    volume: (raw.volume ?? []) as AdminDashboardData["volume"],
    partnerTypes: (
      (raw.partnerTypes ?? raw.partner_types ?? []) as Record<string, unknown>[]
    ).map((p) => ({
      name: String(p.name ?? ""),
      value: num(p.value),
      color: String(p.color ?? "#00C896"),
    })) as AdminDashboardData["partnerTypes"],
    pendingActions,
    liveFeed,
  };
}

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/dashboard");
      const data = unwrapData<Record<string, unknown>>(res) as Record<
        string,
        unknown
      >;
      return normalizeAdminDashboard(data);
    },
  });
}

export function useLiveTransactionFeed(paused: boolean) {
  return useQuery<LiveTransaction[]>({
    queryKey: ["admin", "live-feed"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/dashboard/live-feed");
      return unwrapList(res).map((tx) => {
        const row = tx as Record<string, unknown>;
        const m = String(
          row.paymentMethod ?? row.payment_method ?? "NFC"
        ).toLowerCase();
        return {
          id: String(row.id ?? ""),
          partner: String(row.partner ?? "—"),
          merchant: String(row.merchant ?? "—"),
          amount: Number(row.amount ?? 0),
          paymentMethod: (m === "cash"
            ? "Cash"
            : m === "wallet"
              ? "Wallet"
              : "NFC") as LiveTransaction["paymentMethod"],
          timestamp: String(row.timestamp ?? ""),
        };
      });
    },
    refetchInterval: paused ? false : 30000,
  });
}
