"use client";

import * as React from "react";
import { AdminDiscountModals } from "@/admin-portal/components/discounting/admin-discount-modals";
import { DiscountRulesEngine } from "@/admin-portal/components/discounting/discount-rules-engine";
import { RiskScoreBadge } from "@/components/shared/risk-score-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminDiscountRequests, useBulkApproveDiscounts } from "@/admin-portal/hooks/use-admin-finance";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { formatPKR } from "@/lib/format";
import type { AdminDiscountRequest } from "@/admin-portal/types/finance";

export default function AdminInvoiceDiscountingPage() {
  const { data, isLoading, isError, refetch } = useAdminDiscountRequests();
  const bulkApprove = useBulkApproveDiscounts();
  const [selected, setSelected] = React.useState<AdminDiscountRequest | null>(null);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [checked, setChecked] = React.useState<Set<string>>(new Set());

  const requests = data?.requests ?? [];
  const stats = data?.stats;

  const pendingLowRisk = requests.filter(
    (r) => r.status === "Pending Approval" && r.riskLevel === "Low"
  );

  if (isError) return <QueryError refetch={refetch} />;

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllLowRisk() {
    if (checked.size === pendingLowRisk.length) {
      setChecked(new Set());
    } else {
      setChecked(new Set(pendingLowRisk.map((r) => r.id)));
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Pending Requests</p>
          <p className="amount mt-1 text-2xl text-rider-amber">{stats?.pendingRequests ?? 0}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Approved Today</p>
          <p className="amount mt-1 text-2xl text-primary-green">{stats?.approvedToday ?? 0}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Rejected Today</p>
          <p className="amount mt-1 text-2xl text-rider-red">{stats?.rejectedToday ?? 0}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Discounted This Month</p>
          <p className="amount mt-1 text-lg">{formatPKR(stats?.discountedThisMonth ?? 0)}</p>
        </div>
      </div>

      {pendingLowRisk.length > 0 && (
        <Can portal="admin" action="approve_discounting">
          <div className="flex items-center justify-between rounded-xl border border-light-border bg-white px-4 py-3">
            <p className="text-sm text-medium-text">
              {checked.size} low-risk request{checked.size !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-lg" onClick={toggleAllLowRisk}>
                {checked.size === pendingLowRisk.length ? "Deselect All" : "Select All Low-Risk"}
              </Button>
              <Button
                size="sm"
                className="rounded-lg bg-primary-green text-white hover:bg-primary-green/90"
                disabled={checked.size === 0 || bulkApprove.isPending}
                onClick={() => bulkApprove.mutate(Array.from(checked), { onSuccess: () => setChecked(new Set()) })}
              >
                Bulk Approve ({checked.size})
              </Button>
            </div>
          </div>
        </Can>
      )}

      <div className="card-base overflow-hidden p-0">
        {isLoading ? (
          <Skeleton className="m-4 h-64 rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10" />
                  <TableHead>Request Date</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Invoice Amount</TableHead>
                  <TableHead>Fee %</TableHead>
                  <TableHead>Payout Amount</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Risk Factors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.status === "Pending Approval" && r.riskLevel === "Low" && (
                        <input
                          type="checkbox"
                          checked={checked.has(r.id)}
                          onChange={() => toggleCheck(r.id)}
                          className="rounded border-light-border"
                        />
                      )}
                    </TableCell>
                    <TableCell>{r.requestDate}</TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs">{r.partnerName}</TableCell>
                    <TableCell className="font-medium">{r.merchantName}</TableCell>
                    <TableCell><AmountText amount={r.invoiceAmount} className="text-sm" /></TableCell>
                    <TableCell>{r.discountFeePercent}%</TableCell>
                    <TableCell><AmountText amount={r.payoutAmount} variant="positive" className="text-sm" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <RiskScoreBadge score={r.riskLevel} />
                        <span className="amount text-xs">{r.riskScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-[160px] flex-wrap gap-1">
                        {r.riskFactors.map((f) => (
                          <span key={f} className="rounded bg-content px-1.5 py-0.5 text-[10px]">{f}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-xs">{r.requestedBy}</TableCell>
                    <TableCell className="space-x-1 text-right">
                      {r.status === "Pending Approval" && (
                        <Can portal="admin" action="approve_discounting">
                          <Button size="sm" className="rounded-lg bg-primary-green text-white" onClick={() => { setSelected(r); setApproveOpen(true); }}>Approve</Button>
                          <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { setSelected(r); setRejectOpen(true); }}>Reject</Button>
                        </Can>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Can portal="admin" action="change_fee_rates">
        <DiscountRulesEngine />
      </Can>

      <AdminDiscountModals
        request={selected}
        approveOpen={approveOpen}
        rejectOpen={rejectOpen}
        onApproveOpenChange={setApproveOpen}
        onRejectOpenChange={setRejectOpen}
      />
    </div>
  );
}
