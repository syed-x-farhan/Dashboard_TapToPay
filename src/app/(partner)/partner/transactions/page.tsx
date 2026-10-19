"use client";

import * as React from "react";
import { Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { isWithinInterval } from "date-fns";
import { parseFlexibleDate } from "@/lib/format";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TransactionDrawer } from "@/components/transactions/transaction-drawer";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePartnerTransactions, usePartnerMerchants } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { formatDateTime } from "@/lib/format";
import type { PartnerTransaction } from "@/types/partner";
import type { Transaction } from "@/types";

const PAGE_SIZE = 10;

function toDrawerTx(tx: PartnerTransaction): Transaction {
  return {
    id: tx.id,
    date: tx.date,
    orderId: tx.orderId,
    merchantReference: tx.customerReference,
    customer: tx.customerReference,
    amount: tx.amount,
    rider: tx.rider,
    paymentMethod: tx.paymentMethod,
    platformFee: tx.platformFee,
    tax: tx.tax,
    netAmount: tx.netToMerchant,
    status: tx.status,
    nfcTagId: tx.nfcTagId,
    riderCut: tx.riderCut,
  };
}

export default function PartnerTransactionsPage() {
  const { data: transactions, isLoading, isError, refetch } = usePartnerTransactions();
  const { data: merchants } = usePartnerMerchants();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [merchant, setMerchant] = React.useState("all");
  const [method, setMethod] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<PartnerTransaction | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      if (merchant !== "all" && tx.merchantId !== merchant) return false;
      if (method !== "all" && tx.paymentMethod !== method) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (dateRange?.from && dateRange?.to) {
        const d = parseFlexibleDate(tx.date);
        if (!isWithinInterval(d, { start: dateRange.from, end: dateRange.to })) return false;
      }
      return true;
    });
  }, [transactions, merchant, method, status, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCsv() {
    const headers = ["Date", "Order ID", "Merchant", "Rider", "Amount", "Method", "Platform Fee", "Tax", "Net", "Status"];
    const rows = filtered.map((tx) => [formatDateTime(tx.date), tx.orderId, tx.merchant, tx.rider, tx.amount, tx.paymentMethod, tx.platformFee, tx.tax, tx.netToMerchant, tx.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "partner-transactions.csv";
    a.click();
  }

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          <Select value={merchant} onValueChange={(v) => setMerchant(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-44"><SelectValue placeholder="Merchant" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Merchants</SelectItem>
              {merchants?.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={method} onValueChange={(v) => setMethod(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-36"><SelectValue placeholder="Method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="NFC">NFC</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Can portal="partner" action="export_data">
          <Button variant="outline" className="rounded-xl" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </Can>
      </div>

      <div className="card-base overflow-hidden p-0">
        {isLoading ? <Skeleton className="m-4 h-96 rounded-xl" /> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Customer Ref</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Net to Merchant</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((tx) => (
                  <TableRow key={tx.id} className="cursor-pointer" onClick={() => { setSelected(tx); setDrawerOpen(true); }}>
                    <TableCell className="whitespace-nowrap text-medium-text">{formatDateTime(tx.date)}</TableCell>
                    <TableCell className="font-medium">{tx.orderId}</TableCell>
                    <TableCell>{tx.merchant}</TableCell>
                    <TableCell>{tx.rider}</TableCell>
                    <TableCell className="text-medium-text">{tx.customerReference}</TableCell>
                    <TableCell><AmountText amount={tx.amount} className="text-sm" /></TableCell>
                    <TableCell>{tx.paymentMethod}</TableCell>
                    <TableCell className="text-medium-text">{tx.platformFee.toLocaleString()}</TableCell>
                    <TableCell className="text-medium-text">{tx.tax.toLocaleString()}</TableCell>
                    <TableCell><AmountText amount={tx.netToMerchant} variant="positive" className="text-sm" /></TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-light-border px-4 py-3">
          <p className="text-sm text-medium-text">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <TransactionDrawer transaction={selected ? toDrawerTx(selected) : null} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
