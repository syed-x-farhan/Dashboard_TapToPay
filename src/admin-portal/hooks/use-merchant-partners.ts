"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI, unwrapList } from "@/lib/api";

interface CreateMerchantPartnerBody {
  merchantId: string;
  partnerId: string;
  relationshipType: string;
  commissionRate?: number;
  platformFeeOverride?: number;
  settlementDestination: "merchant" | "platform" | "split";
}

export function useMerchantPartnerRelationshipTypes() {
  return useQuery<string[]>({
    queryKey: ["admin", "merchant-partners", "relationship-types"],
    queryFn: async () => {
      const res = await adminAPI.get(
        "/api/v1/admin/merchant-partners/relationship-types"
      );
      return unwrapList<string>(res);
    },
  });
}

export function useCreateMerchantPartnerRelationship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMerchantPartnerBody) =>
      adminAPI.post("/api/v1/admin/merchant-partners", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "merchant"] });
      qc.invalidateQueries({ queryKey: ["admin", "merchants"] });
    },
  });
}
