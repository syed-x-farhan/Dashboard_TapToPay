"use client";

import * as React from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkSettleModal } from "@/admin-portal/components/settlements/bulk-settle-modal";
import { FailedSettlementModal } from "@/admin-portal/components/settlements/failed-settlement-modal";
import { AmountText } from "@/components/shared/amount-text";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSettlements, useSettleMerchant } from "@/admin-portal/hooks/use-admin-finance";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { formatPKR } from "@/lib/format";
import type { AdminCompletedSettlement } from "@/admin-portal/types/finance";

function formatSettlementsDate(value: string): string {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function AdminSettlementsPage() {
  const { data, isLoading, isError, refetch } = useAdminSettlements();
  const settle = useSettleMerchant();
  const [bulkOpen, setBulkOpen] = React.useState(false);
  const [failedTarget, setFailedTarget] = React.useState<AdminCompletedSettlement | null>(null);

  const pendingByPartner = React.useMemo(() => {
    if (!data?.pending) return [];
    const groups = new Map<string, typeof data.pending>();
    data.pending.forEach((s) => {
      const list = groups.get(s.partnerName) ?? [];
      list.push(s);
      groups.set(s.partnerName, list);
    });
    return Array.from(groups.entries());
  }, [data]);

  if (isError) return <QueryError refetch={refetch} />;
  const pendingCount = data?.pending.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Pending</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {formatPKR(data?.summary.totalPending ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">Processed Today</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-700">
            {formatPKR(data?.summary.processedToday ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">Processed This Month</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatPKR(data?.summary.processedThisMonth ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">Failed Settlements</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-700">
            {data?.summary.failedCount ?? 0}
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-auto rounded-xl bg-gray-100 p-1">
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white">
              Pending
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                {pendingCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="processing" className="rounded-lg data-[state=active]:bg-white">Processing</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white">Completed</TabsTrigger>
          </TabsList>
          <Can portal="admin" action="bulk_settle">
            <Button
              className="bg-primary-green text-white hover:bg-primary-green/90"
              onClick={() => setBulkOpen(true)}
            >
              Bulk Settle by Partner
            </Button>
          </Can>
        </div>

        <TabsContent value="pending" className="mt-2 space-y-4">
          {isLoading ? (
            <Skeleton className="h-64 rounded-2xl" />
          ) : pendingByPartner.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              No pending settlements found.
            </div>
          ) : (
            pendingByPartner.map(([partnerName, items]) => (
              <div
                key={partnerName}
                className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-green/10">
                    <Building2 className="h-4 w-4 text-primary-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{partnerName}</p>
                    <p className="text-xs text-gray-500">
                      {items.length} merchants · {formatPKR(items.reduce((sum, item) => sum + item.netPayable, 0))} pending
                    </p>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Merchant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Orders</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Gross</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tax</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Net Payable</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Due</th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {items.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-3 text-sm font-medium">{s.merchantName}</td>
                        <td className="px-4 py-3 text-sm">{s.ordersCount}</td>
                        <td className="px-4 py-3 text-sm"><AmountText amount={s.grossAmount} className="text-sm" /></td>
                        <td className="px-4 py-3 text-sm">{s.platformFee.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{s.tax.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm"><AmountText amount={s.netPayable} variant="positive" className="text-sm" /></td>
                        <td className="px-4 py-3 text-xs">{formatSettlementsDate(s.dueDate)}</td>
                        <td className="px-4 py-3 text-right">
                          <Can portal="admin" action="bulk_settle">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-700 hover:border-green-300 hover:bg-green-50"
                              disabled={settle.isPending}
                              onClick={() => settle.mutate(s.id)}
                            >
                              Settle Now
                            </Button>
                          </Can>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="processing" className="mt-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Started</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {data?.processing.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 text-sm">{s.partnerName}</td>
                    <td className="px-4 py-3 text-sm font-medium">{s.merchantName}</td>
                    <td className="px-4 py-3 text-sm"><AmountText amount={s.amount} className="text-sm" /></td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-xs">{formatSettlementsDate(s.startedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-content">
                          <div className="h-full rounded-full bg-primary-green" style={{ width: `${s.progress}%` }} />
                        </div>
                        <span className="text-xs text-medium-text">{s.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-2">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Merchant</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reference</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {data?.completed.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 text-sm">{formatSettlementsDate(s.date)}</td>
                    <td className="px-4 py-3 text-xs">{s.partnerName}</td>
                    <td className="px-4 py-3 text-sm">{s.merchant}</td>
                    <td className="px-4 py-3 text-sm"><AmountText amount={s.amount} className="text-sm" /></td>
                    <td className="px-4 py-3 text-sm">{s.method}</td>
                    <td className="px-4 py-3 font-mono text-xs">{s.referenceId}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {s.status === "Failed" && (
                        <Can portal="admin" action="bulk_settle">
                          <Button size="sm" variant="outline" className="rounded-lg text-rider-red" onClick={() => setFailedTarget(s)}>
                            Retry
                          </Button>
                        </Can>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <BulkSettleModal open={bulkOpen} onOpenChange={setBulkOpen} pending={data?.pending ?? []} />
      <FailedSettlementModal settlement={failedTarget} open={!!failedTarget} onOpenChange={(o) => !o && setFailedTarget(null)} />
    </div>
  );
}
