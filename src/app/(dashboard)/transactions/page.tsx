"use client";

import * as React from "react";
import { Download } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { formatDateTime, parseFlexibleDate } from "@/lib/format";
import { isWithinInterval } from "date-fns";
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
import { useTransactions } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import type { Transaction } from "@/types";

const PAGE_SIZE = 10;

function exportToCsv(transactions: Transaction[]) {
  const headers = [
    "Date & Time",
    "Order ID",
    "Merchant Reference",
    "Amount",
    "Rider",
    "Payment Method",
    "Platform Fee",
    "Tax",
    "Net Amount",
    "Status",
  ];
  const rows = transactions.map((tx) => [
    formatDateTime(tx.date),
    tx.orderId,
    tx.merchantReference,
    tx.amount,
    tx.rider,
    tx.paymentMethod,
    tx.platformFee,
    tx.tax,
    tx.netAmount,
    tx.status,
  ]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "riderpay-transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function TransactionsPage() {
  const { data: transactions, isLoading, isError, refetch } = useTransactions();
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [method, setMethod] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      if (method !== "all" && tx.paymentMethod !== method) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (dateRange?.from && dateRange?.to) {
        const txDate = parseFlexibleDate(tx.date);
        if (
          !isWithinInterval(txDate, {
            start: dateRange.from,
            end: dateRange.to,
          })
        ) {
          return false;
        }
      }
      return true;
    });
  }, [transactions, method, status, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [method, status, dateRange]);

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <Select value={method} onValueChange={(v) => setMethod(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl border-light-border sm:w-[160px]">
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="NFC">NFC</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Wallet">Wallet</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl border-light-border sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Can portal="merchant" action="export_transactions">
          <Button
            variant="outline"
            className="rounded-xl border-light-border"
            onClick={() => exportToCsv(filtered)}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </Can>
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
                  <TableHead>Order ID</TableHead>
                  <TableHead>Merchant Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Rider</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelected(tx);
                      setDrawerOpen(true);
                    }}
                  >
                    <TableCell className="whitespace-nowrap text-medium-text">
                      {formatDateTime(tx.date)}
                    </TableCell>
                    <TableCell className="font-medium">{tx.orderId}</TableCell>
                    <TableCell className="text-medium-text">
                      {tx.merchantReference}
                    </TableCell>
                    <TableCell>
                      <AmountText amount={tx.amount} className="text-sm" />
                    </TableCell>
                    <TableCell>{tx.rider}</TableCell>
                    <TableCell>{tx.paymentMethod}</TableCell>
                    <TableCell className="text-medium-text">
                      {tx.platformFee.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-medium-text">
                      {tx.tax.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <AmountText
                        amount={tx.netAmount}
                        variant="positive"
                        className="text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={tx.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-light-border px-4 py-3">
          <p className="text-sm text-medium-text">
            Page {page} of {totalPages} ({filtered.length} transactions)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <TransactionDrawer
        transaction={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
