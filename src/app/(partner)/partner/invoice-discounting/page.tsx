"use client";

import * as React from "react";
import { DiscountActionModals } from "@/components/partner/discount/discount-action-modals";
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
import { useDiscountRequests, usePartnerSettings } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { formatPKR } from "@/lib/format";
import type { DiscountRequest } from "@/types/partner";

export default function InvoiceDiscountingPage() {
  const { data: requests, isLoading, isError, refetch } = useDiscountRequests();
  const { data: settings } = usePartnerSettings();
  const discountRules = settings?.discountRules ?? { low: 2, medium: 3.5, high: 5 };
  const [selected, setSelected] = React.useState<DiscountRequest | null>(null);
  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const pendingCount = requests?.filter((r) => r.status === "Pending Approval").length ?? 0;
  const discountedMonth = requests?.filter((r) => r.status === "Paid Out").reduce((a, r) => a + r.amountToPayOut, 0) ?? 0;

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-base p-6">
          <p className="text-sm text-medium-text">Total Requests Pending</p>
          <p className="amount mt-2 text-3xl text-rider-amber">{pendingCount}</p>
        </div>
        <div className="card-base p-6">
          <p className="text-sm text-medium-text">Total Discounted This Month</p>
          <p className="amount mt-2 text-3xl text-primary-green">{formatPKR(discountedMonth)}</p>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        {isLoading ? <Skeleton className="m-4 h-64 rounded-xl" /> : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Request Date</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Invoice Amount</TableHead>
                <TableHead>Discount Fee</TableHead>
                <TableHead>Amount to Pay Out</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.requestDate}</TableCell>
                  <TableCell className="font-medium">{r.merchantName}</TableCell>
                  <TableCell><AmountText amount={r.invoiceAmount} className="text-sm" /></TableCell>
                  <TableCell><AmountText amount={r.discountFee} variant="negative" className="text-sm" /></TableCell>
                  <TableCell><AmountText amount={r.amountToPayOut} variant="positive" className="text-sm" /></TableCell>
                  <TableCell><RiskScoreBadge score={r.riskScore} /></TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="space-x-2 text-right">
                    {r.status === "Pending Approval" && (
                      <Can portal="partner" action="approve_discounting">
                        <Button size="sm" className="rounded-lg bg-primary-green text-white" onClick={() => { setSelected(r); setApproveOpen(true); }}>Approve</Button>
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { setSelected(r); setRejectOpen(true); }}>Reject</Button>
                      </Can>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="card-base p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-dark-text">Discounting Rules</h3>
          <Can portal="partner" action="manage_settings">
            <Button variant="outline" size="sm" className="rounded-xl">Edit</Button>
          </Can>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-content p-4 text-center">
            <RiskScoreBadge score="Low" />
            <p className="amount mt-2 text-lg">{discountRules.low}%</p>
          </div>
          <div className="rounded-xl bg-content p-4 text-center">
            <RiskScoreBadge score="Medium" />
            <p className="amount mt-2 text-lg">{discountRules.medium}%</p>
          </div>
          <div className="rounded-xl bg-content p-4 text-center">
            <RiskScoreBadge score="High" />
            <p className="amount mt-2 text-lg">{discountRules.high}%</p>
          </div>
        </div>
      </div>

      <DiscountActionModals
        request={selected}
        approveOpen={approveOpen}
        rejectOpen={rejectOpen}
        onApproveOpenChange={setApproveOpen}
        onRejectOpenChange={setRejectOpen}
      />
    </div>
  );
}
