"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAPI, unwrapData } from "@/lib/api";
import type {
  AdminSettingsData,
  NotificationSettings,
  PlatformSettings,
  RiskManagementData,
  RiskRule,
  SystemHealthData,
  TaxComplianceData,
  TeamData,
} from "@/admin-portal/types/ops";
import type { AdminRole } from "@/admin-portal/types";

export function useTaxCompliance() {
  return useQuery<TaxComplianceData>({
    queryKey: ["admin", "tax"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/tax-compliance");
      return unwrapData<TaxComplianceData>(res);
    },
  });
}

export function useFileTaxToFbr() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (monthKey: string) =>
      adminAPI.post("/api/v1/admin/tax-compliance/file", { monthKey }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "tax"] }),
  });
}

export function useRiskManagement() {
  return useQuery<RiskManagementData>({
    queryKey: ["admin", "risk"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/risk");
      return unwrapData<RiskManagementData>(res);
    },
  });
}

export function useDismissRiskAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/risk/alerts/${id}/dismiss`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "risk"] }),
  });
}

export function useClearRiskFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/risk/flags/${id}/clear`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "risk"] }),
  });
}

export function useSaveRiskRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rules: RiskRule[]) =>
      adminAPI.put("/api/v1/admin/risk/rules", { rules }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "risk"] }),
  });
}

export function useSystemHealth() {
  return useQuery<SystemHealthData>({
    queryKey: ["admin", "system-health"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/system-health");
      return unwrapData<SystemHealthData>(res);
    },
    refetchInterval: 60000,
  });
}

export function useTeamData() {
  return useQuery<TeamData>({
    queryKey: ["admin", "team"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/team");
      return unwrapData<TeamData>(res);
    },
  });
}

export function useInviteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; email: string; role: AdminRole }) =>
      adminAPI.post("/api/v1/admin/team/invite", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "team"] }),
  });
}

export function useUpdateTeamRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminRole }) =>
      adminAPI.patch(`/api/v1/admin/team/${id}/role`, { role }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "team"] }),
  });
}

export function useDeactivateTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminAPI.post(`/api/v1/admin/team/${id}/deactivate`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "team"] }),
  });
}

export function useAdminSettings() {
  return useQuery<AdminSettingsData>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const res = await adminAPI.get("/api/v1/admin/settings");
      return unwrapData<AdminSettingsData>(res);
    },
  });
}

export function useSavePlatformSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: PlatformSettings) =>
      adminAPI.put("/api/v1/admin/settings/platform", settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}

export function useSaveNotificationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: NotificationSettings) =>
      adminAPI.put("/api/v1/admin/settings/notifications", settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}

export function useTestIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (integrationId: string) =>
      adminAPI.post("/api/v1/admin/settings/integrations/test", {
        integrationId,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}
