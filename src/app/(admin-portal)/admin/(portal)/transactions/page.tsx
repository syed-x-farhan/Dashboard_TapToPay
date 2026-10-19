"use client";

import * as React from "react";
import { Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { isWithinInterval } from "date-fns";
import { parseFlexibleDate } from "@/lib/format";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { AdminTransactionDrawer } from "@/admin-portal/components/transactions/admin-transaction-drawer";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAdminTransactions } from "@/admin-portal/hooks/use-admin-finance";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { useAdminPartners, useAdminMerchants } from "@/admin-portal/hooks/use-admin-entities";
import { formatDateTime, formatPKR } from "@/lib/format";
import type { AdminTransaction } from "@/admin-portal/types/finance";

const PAGE_SIZE = 10;

export default function AdminTransactionsPage() {
  const { data: transactions, isLoading, isError, refetch } = useAdminTransactions();
  const { data: partners } = useAdminPartners();
  const { data: merchants } = useAdminMerchants();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [partner, setPartner] = React.useState("all");
  const [merchant, setMerchant] = React.useState("all");
  const [rider, setRider] = React.useState("all");
  const [method, setMethod] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [minAmount, setMinAmount] = React.useState("");
  const [maxAmount, setMaxAmount] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<AdminTransaction | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const riders = React.useMemo(
    () => Array.from(new Set(transactions?.map((t) => t.rider) ?? [])),
    [transactions]
  );

  const filtered = React.useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      if (partner !== "all" && tx.partnerId !== partner) return false;
      if (merchant !== "all" && tx.merchantId !== merchant) return false;
      if (rider !== "all" && tx.rider !== rider) return false;
      if (method !== "all" && tx.paymentMethod !== method) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (minAmount && tx.amount < Number(minAmount)) return false;
      if (maxAmount && tx.amount > Number(maxAmount)) return false;
      if (dateRange?.from && dateRange?.to) {
        const d = parseFlexibleDate(tx.date);
        if (!isWithinInterval(d, { start: dateRange.from, end: dateRange.to })) return false;
      }
      return true;
    });
  }, [transactions, partner, merchant, rider, method, status, minAmount, maxAmount, dateRange]);

  const totals = React.useMemo(() => ({
    volume: filtered.reduce((s, t) => s + t.amount, 0),
    fees: filtered.reduce((s, t) => s + t.platformFee, 0),
    tax: filtered.reduce((s, t) => s + t.tax, 0),
    settlements: filtered.filter((t) => t.status === "Completed").reduce((s, t) => s + t.netToMerchant, 0),
  }), [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function exportCsv() {
    const headers = ["Date", "Partner", "Merchant", "Rider", "Order ID", "Amount", "Method", "Platform Fee", "Tax", "Net", "Status"];
    const rows = filtered.map((tx) => [
      formatDateTime(tx.date), tx.partnerName, tx.merchant, tx.rider, tx.orderId,
      tx.amount, tx.paymentMethod, tx.platformFee, tx.tax, tx.netToMerchant, tx.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "platform-transactions.csv";
    a.click();
  }

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Total Volume</p>
          <p className="amount mt-1 text-lg">{formatPKR(totals.volume)}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Total Fees</p>
          <p className="amount mt-1 text-lg text-rider-blue">{formatPKR(totals.fees)}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Total Tax</p>
          <p className="amount mt-1 text-lg">{formatPKR(totals.tax)}</p>
        </div>
        <div className="card-base p-4">
          <p className="text-xs text-medium-text">Settlements Processed</p>
          <p className="amount mt-1 text-lg text-primary-green">{formatPKR(totals.settlements)}</p>
        </div>
      </div>

      <div className="card-base flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Select value={partner} onValueChange={(v) => setPartner(v ?? "all")}>
              <SelectTrigger className="w-full rounded-xl sm:w-44"><SelectValue placeholder="Partner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                {partners?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={merchant} onValueChange={(v) => setMerchant(v ?? "all")}>
              <SelectTrigger className="w-full rounded-xl sm:w-44"><SelectValue placeholder="Merchant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Merchants</SelectItem>
                {merchants?.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={rider} onValueChange={(v) => setRider(v ?? "all")}>
              <SelectTrigger className="w-full rounded-xl sm:w-36"><SelectValue placeholder="Rider" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Riders</SelectItem>
                {riders.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={method} onValueChange={(v) => setMethod(v ?? "all")}>
              <SelectTrigger className="w-full rounded-xl sm:w-32"><SelectValue placeholder="Method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="NFC">NFC</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
              <SelectTrigger className="w-full rounded-xl sm:w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Min amount" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} className="w-full rounded-xl sm:w-28" />
            <Input type="number" placeholder="Max amount" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} className="w-full rounded-xl sm:w-28" />
          </div>
          <Can portal="admin" action="export_data">
            <Button variant="outline" className="shrink-0 rounded-xl" onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </Can>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        {isLoading ? (
          <Skeleton className="m-4 h-96 rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Order ID</TableHead>
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
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer"
                    onClick={() => { setSelected(tx); setDrawerOpen(true); }}
                  >
                    <TableCell className="whitespace-nowrap text-medium-text">{formatDateTime(tx.date)}</TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs">{tx.partnerName}</TableCell>
                    <TableCell>{tx.merchant}</TableCell>
                    <TableCell>{tx.rider}</TableCell>
                    <TableCell className="font-medium">{tx.orderId}</TableCell>
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
          <p className="text-sm text-medium-text">{filtered.length} transactions · Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <AdminTransactionDrawer transaction={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
