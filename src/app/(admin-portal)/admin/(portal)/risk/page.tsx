"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { AnomaliesChart } from "@/admin-portal/components/risk/anomalies-chart";
import { RiskScoreBadge } from "@/components/shared/risk-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useClearRiskFlag,
  useDismissRiskAlert,
  useRiskManagement,
  useSaveRiskRules,
} from "@/admin-portal/hooks/use-admin-ops";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import type { RiskRule } from "@/admin-portal/types/ops";

export default function AdminRiskPage() {
  const { data, isLoading, isError, refetch } = useRiskManagement();
  const dismiss = useDismissRiskAlert();
  const clearFlag = useClearRiskFlag();
  const saveRules = useSaveRiskRules();
  const [localRules, setLocalRules] = React.useState<RiskRule[]>([]);

  React.useEffect(() => {
    if (data?.rules) setLocalRules(data.rules);
  }, [data?.rules]);

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {data.alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-dark-text">Active Alerts</h2>
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className={`card-base border-l-[3px] p-4 ${
                alert.severity === "high" ? "border-l-rider-red bg-red-50/30" : "border-l-rider-amber bg-amber-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <AlertTriangle
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      alert.severity === "high" ? "text-rider-red" : "text-rider-amber"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-dark-text">
                      {alert.title} — {alert.entityName}
                    </p>
                    <p className="mt-0.5 text-sm text-medium-text">{alert.description}</p>
                    <p className="mt-1 text-xs text-medium-text">
                      {alert.entityType} · {alert.partnerName}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl">Investigate</Button>
                  <Can portal="admin" action="manage_risk">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl text-medium-text"
                      disabled={dismiss.isPending}
                      onClick={() => dismiss.mutate(alert.id)}
                    >
                      Dismiss
                    </Button>
                  </Can>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card-base overflow-hidden p-0">
        <div className="border-b border-light-border px-5 py-4">
          <h2 className="font-semibold text-dark-text">Risk Flags</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Flag Reason</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Flagged</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.flags.map((flag) => (
                <TableRow key={flag.id}>
                  <TableCell>{flag.entityType}</TableCell>
                  <TableCell className="font-medium">{flag.name}</TableCell>
                  <TableCell>{flag.partnerName}</TableCell>
                  <TableCell className="max-w-[200px] text-sm text-medium-text">{flag.flagReason}</TableCell>
                  <TableCell><RiskScoreBadge score={flag.riskLevel} /></TableCell>
                  <TableCell className="text-sm">{flag.flaggedDate}</TableCell>
                  <TableCell><StatusBadge status={flag.status === "Cleared" ? "Completed" : flag.status === "Under Review" ? "Processing" : "Pending"} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="text-rider-blue">Investigate</Button>
                      {flag.status !== "Cleared" && (
                        <Can portal="admin" action="manage_risk">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary-green"
                            disabled={clearFlag.isPending}
                            onClick={() => clearFlag.mutate(flag.id)}
                          >
                            Clear
                          </Button>
                          <Button size="sm" variant="ghost" className="text-rider-red">Suspend</Button>
                        </Can>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AnomaliesChart data={data.anomalies} />

      <div className="card-base p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-dark-text">Risk Rules</h3>
            <p className="text-xs text-medium-text">Automatic flag thresholds</p>
          </div>
          <Can portal="admin" action="manage_risk">
            <Button
              size="sm"
              className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
              disabled={saveRules.isPending}
              onClick={() => saveRules.mutate(localRules)}
            >
              Save Rules
            </Button>
          </Can>
        </div>
        <div className="space-y-4">
          {localRules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-light-border p-4"
            >
              <div className="flex items-center gap-3">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) =>
                    setLocalRules((prev) =>
                      prev.map((r) => (r.id === rule.id ? { ...r, enabled: checked } : r))
                    )
                  }
                />
                <Label className="text-sm">{rule.label}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={rule.threshold}
                  onChange={(e) =>
                    setLocalRules((prev) =>
                      prev.map((r) =>
                        r.id === rule.id ? { ...r, threshold: Number(e.target.value) } : r
                      )
                    )
                  }
                  className="w-28 rounded-xl"
                  disabled={!rule.enabled}
                />
                <span className="text-xs text-medium-text">
                  {rule.unit === "PKR" ? "PKR" : rule.unit === "percent" ? "%" : "count"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
