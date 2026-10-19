"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI, unwrapData, unwrapList } from "@/lib/api";
import type {
  AdminMerchant,
  AdminPartner,
  AdminPartnerDetail,
  AdminRider,
} from "@/admin-portal/types/entities";

interface AddAdminMerchantBody {
  name: string;
  ownerName: string;
  cnic: string;
  phone: string;
  jazzCashNumber: string;
  city: string;
  category: string;
  monthlyExpectedVolume: number;
  partnerId: string;
  email: string;
  password: string;
}

export function useAdminPartners() {
  return useQuery<AdminPartner[]>({
    queryKey: ["admin", "partners"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/partners");
      return unwrapList<AdminPartner>(res);
    },
  });
}

export function useAdminPartner(id: string) {
  return useQuery<AdminPartnerDetail>({
    queryKey: ["admin", "partner", id],
    queryFn: async () => {
      const res = await adminAPI.get(`/api/v1/admin/partners/${id}`);
      const data = unwrapData<AdminPartnerDetail>(res);
      return {
        ...data,
        merchantIds:
          data.merchantIds ??
          (data as { merchants?: { id: string }[] }).merchants?.map(
            (m) => m.id
          ) ??
          [],
        riderIds:
          data.riderIds ??
          (data as { riders?: { id: string }[] }).riders?.map((r) => r.id) ??
          [],
      };
    },
    enabled: !!id,
  });
}

export function useAdminMerchants() {
  return useQuery<AdminMerchant[]>({
    queryKey: ["admin", "merchants"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/merchants");
      return unwrapList<AdminMerchant>(res);
    },
  });
}

export function useAdminMerchant(id: string) {
  return useQuery<AdminMerchant>({
    queryKey: ["admin", "merchant", id],
    queryFn: async () => {
      const res = await adminAPI.get(`/api/v1/admin/merchants/${id}`);
      const data = unwrapData<Record<string, unknown>>(res) as Record<
        string,
        unknown
      >;
      return {
        ...data,
        id: String(data.id ?? id),
        name: String(data.name ?? ""),
        partnerId: String(data.partnerId ?? data.partner_id ?? ""),
        partnerName: String(data.partnerName ?? data.partner_name ?? ""),
        city: String(data.city ?? ""),
        category: String(data.category ?? ""),
        volumeThisMonth: Number(
          data.volumeThisMonth ?? data.volume_this_month ?? 0
        ),
        pendingSettlement: Number(
          data.pendingSettlement ?? data.pending_settlement ?? 0
        ),
        activeRiders: Number(data.activeRiders ?? data.active_riders ?? 0),
        status: String(data.status ?? "Active"),
        ownerName: String(data.ownerName ?? data.owner_name ?? ""),
        cnic: String(data.cnic ?? ""),
        phone: String(data.phone ?? ""),
        jazzCashNumber: String(
          data.jazzCashNumber ?? data.jazz_cash_number ?? ""
        ),
        monthlyExpectedVolume: Number(
          data.monthlyExpectedVolume ?? data.monthly_expected_volume ?? 0
        ),
        internalRiskScore: Number(
          data.internalRiskScore ?? data.internal_risk_score ?? 0
        ),
        riskLevel: String(data.riskLevel ?? data.risk_level ?? "Low"),
        accountFlags: (data.accountFlags ??
          data.account_flags ??
          []) as AdminMerchant["accountFlags"],
        opsNotes: String(data.opsNotes ?? data.ops_notes ?? ""),
      } as AdminMerchant;
    },
    enabled: !!id,
  });
}

export function useAdminRiders() {
  return useQuery<AdminRider[]>({
    queryKey: ["admin", "riders"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/riders");
      return unwrapList(res).map((row) => {
        const rider = row as Record<string, unknown>;
        const nfcCount = Number(rider.nfcPaymentsCount || rider.nfc_count || 0);
        const cashCount = Number(rider.cashCollections || rider.cash_count || 0);
        const deliveriesToday = Number(
          rider.deliveriesToday || rider.deliveries_today || 0
        );

        return {
          id: String(rider.id ?? ""),
          partnerId: String(rider.partnerId || rider.partner_id || ""),
          partnerName: String(
            rider.partnerName || rider.partner_name || rider.partner || "-"
          ),
          name: String(rider.fullName || rider.full_name || rider.name || ""),
          phone: String(rider.phoneNumber || rider.phone_number || rider.phone || ""),
          cnic: "-",
          city: "-",
          pickupMerchants: [],
          activeZone: "-",
          deliveriesToday,
          completedDeliveriesToday: Number(
            rider.completedDeliveriesToday ||
              rider.completed_deliveries_today ||
              deliveriesToday
          ),
          lastSeenAt: String(rider.lastSeenAt || rider.createdAt || rider.created_at || "Unknown"),
          lastSeenArea: "-",
          todayCollections: Number(
            rider.todayCollections || rider.today_collections || 0
          ),
          totalThisMonth: Number(
            rider.totalThisMonth || rider.total_this_month || 0
          ),
          nfcPaymentsCount: nfcCount,
          cashCollections: cashCount,
          status: rider.isVerified || rider.is_verified ? "Active" : "Inactive",
          recentDeliveries: [],
          dailyEarnings: [],
          flagged: Boolean(rider.flagged ?? false),
          flagReason: rider.flag_reason
            ? String(rider.flag_reason)
            : rider.flagReason
              ? String(rider.flagReason)
              : undefined,
        } as AdminRider;
      });
    },
  });
}

export function useApprovePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      feeRate,
      tiers,
    }: {
      id: string;
      feeRate: number;
      tiers: { low: number; medium: number; high: number };
    }) =>
      adminAPI.post(`/api/v1/admin/partners/${id}/approve`, {
        feeRate,
        discountTiers: tiers,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "partners"] });
      qc.invalidateQueries({ queryKey: ["admin", "partner"] });
    },
  });
}

export function useSuspendPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminAPI.post(`/api/v1/admin/partners/${id}/suspend`, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "partners"] }),
  });
}

export function useAddPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Omit<
        AdminPartner,
        "id" | "totalMerchants" | "totalRiders" | "monthlyVolume" | "status"
      >
    ) => adminAPI.post("/api/v1/admin/partners", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "partners"] }),
  });
}

export function useSuspendMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/merchants/${id}/suspend`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "merchants"] }),
  });
}

export function useAddMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddAdminMerchantBody) =>
      adminAPI.post("/api/v1/admin/merchants", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "merchants"] }),
  });
}

export function useReassignMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      partnerId,
    }: {
      id: string;
      partnerId: string;
      partnerName: string;
    }) =>
      adminAPI.patch(`/api/v1/admin/merchants/${id}/partner`, { partnerId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "merchants"] }),
  });
}

export function useUpdateMerchantNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      adminAPI.patch(`/api/v1/admin/merchants/${id}/notes`, {
        opsNotes: notes,
      }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "merchants"] });
      qc.invalidateQueries({ queryKey: ["admin", "merchant", id] });
    },
  });
}

export function useSuspendRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/riders/${id}/suspend`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "riders"] }),
  });
}

export function useFlagRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminAPI.post(`/api/v1/admin/riders/${id}/flag`, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "riders"] }),
  });
}

export function useReassignRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      partnerId,
    }: {
      id: string;
      partnerId: string;
      partnerName: string;
    }) =>
      adminAPI.patch(`/api/v1/admin/riders/${id}/partner`, { partnerId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "riders"] }),
  });
}
