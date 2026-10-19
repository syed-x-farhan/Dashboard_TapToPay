"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettleConfirmModal } from "@/components/partner/settlements/settle-confirm-modal";
import { AmountText } from "@/components/shared/amount-text";
import { StatusBadge } from "@/components/shared/status-badge";
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
import { useSettlements, usePartnerDashboard } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { formatPKR } from "@/lib/format";
import type { PendingSettlement } from "@/types/partner";

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

export default function SettlementsPage() {
  const { data, isLoading, isError, refetch } = useSettlements();
  const { data: dashboard } = usePartnerDashboard();
  const [selected, setSelected] = React.useState<PendingSettlement | null>(null);
  const [settleAll, setSettleAll] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-medium-text">Total Pending Settlements</p>
          <p className="amount text-xl">
            {formatPKR(dashboard?.stats.pendingSettlements)}
          </p>
          <p className="text-xs text-medium-text">
            Across {dashboard?.stats.pendingMerchantsCount ?? 0} merchants
          </p>
        </div>
        <Can portal="partner" action="manage_settlements">
          <Button
            className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            onClick={() => { setSettleAll(true); setModalOpen(true); }}
          >
            Settle All
          </Button>
        </Can>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="rounded-xl">
          <TabsTrigger value="pending" className="rounded-lg">Pending</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <div className="card-base overflow-hidden p-0">
            {isLoading ? <Skeleton className="m-4 h-64 rounded-xl" /> : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Merchant</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.pending.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.merchantName}</TableCell>
                      <TableCell>{s.ordersCount}</TableCell>
                      <TableCell><AmountText amount={s.grossAmount} className="text-sm" /></TableCell>
                      <TableCell>{s.platformFee.toLocaleString()}</TableCell>
                      <TableCell>{s.tax.toLocaleString()}</TableCell>
                      <TableCell><AmountText amount={s.netPayable} variant="positive" className="text-sm" /></TableCell>
                      <TableCell>{formatSettlementsDate(s.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        <Can portal="partner" action="manage_settlements">
                          <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { setSelected(s); setSettleAll(false); setModalOpen(true); }}>
                            Settle Now
                          </Button>
                        </Can>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="card-base overflow-hidden p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.completed.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{formatSettlementsDate(s.date)}</TableCell>
                    <TableCell>{s.merchant}</TableCell>
                    <TableCell><AmountText amount={s.amount} className="text-sm" /></TableCell>
                    <TableCell>{s.method}</TableCell>
                    <TableCell className="font-mono text-xs">{s.referenceId}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <SettleConfirmModal
        settlement={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
        settleAll={settleAll}
        allSettlements={data?.pending}
      />
    </div>
  );
}
