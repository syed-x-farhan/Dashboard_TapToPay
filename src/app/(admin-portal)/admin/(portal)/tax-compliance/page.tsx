"use client";

import * as React from "react";
import { Download, FileCheck, Landmark, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { TaxMonthDetailSheet } from "@/admin-portal/components/tax/month-detail-sheet";
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
import { useTaxCompliance, useFileTaxToFbr } from "@/admin-portal/hooks/use-admin-ops";
import { QueryError } from "@/components/shared/query-error";
import { formatPKR } from "@/lib/format";
import type { FilingStatus, MonthlyFiling } from "@/admin-portal/types/ops";

const DOT_COLORS: Record<FilingStatus, string> = {
  Filed: "bg-primary-green",
  "Due Soon": "bg-rider-amber",
  Overdue: "bg-rider-red",
  Pending: "bg-gray-300",
};

function useCountdown(deadline: string) {
  const [remaining, setRemaining] = React.useState("");

  React.useEffect(() => {
    const [day, month, year] = deadline.split("/").map(Number);
    const target = new Date(year, month - 1, day, 23, 59, 59);

    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Overdue");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setRemaining(`${days}d ${hours}h remaining`);
    }

    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [deadline]);

  return remaining;
}

export default function AdminTaxCompliancePage() {
  const { data, isLoading, isError, refetch } = useTaxCompliance();
  const fileTax = useFileTaxToFbr();
  const [selectedMonth, setSelectedMonth] = React.useState<MonthlyFiling | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const countdown = useCountdown(data?.stats.nextFilingDeadline ?? "15/07/2025");

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Total Tax Collected"
          amount={formatPKR(data.stats.totalTaxCollected)}
          subtitle="Platform-wide"
          icon={Landmark}
          borderColor="border-l-rider-blue"
        />
        <StatCard
          title="Total Filed to FBR"
          amount={formatPKR(data.stats.totalFiledToFbr)}
          subtitle="Submitted filings"
          icon={FileCheck}
          borderColor="border-l-primary-green"
        />
        <StatCard
          title="Pending Filing Amount"
          amount={formatPKR(data.stats.pendingFilingAmount)}
          subtitle="Awaiting submission"
          icon={Landmark}
          borderColor="border-l-rider-amber"
        />
        <div className="card-base border-l-[3px] border-l-rider-red p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-text text-sm text-medium-text">Next Filing Deadline</p>
              <p className="amount mt-2 text-2xl tracking-tight text-dark-text">
                {data.stats.nextFilingDeadline}
              </p>
              <p className="mt-1 text-xs text-rider-amber">{countdown}</p>
            </div>
            <Clock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-400" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="mb-4 font-semibold text-dark-text">Monthly Filing Calendar — 2025</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {data.monthlyFilings.map((m) => (
            <button
              key={`${m.month}-${m.year}`}
              type="button"
              onClick={() => {
                setSelectedMonth(m);
                setSheetOpen(true);
              }}
              className="flex flex-col items-center rounded-xl border border-light-border p-3 transition-colors hover:bg-content"
            >
              <span className={`mb-2 h-2.5 w-2.5 rounded-full ${DOT_COLORS[m.status]}`} />
              <span className="text-sm font-medium">{m.month}</span>
              <span className="mt-0.5 text-[10px] text-medium-text">{m.status}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-medium-text">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-green" /> Filed</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rider-amber" /> Due Soon</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rider-red" /> Overdue</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gray-300" /> Pending</span>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="border-b border-light-border px-5 py-4">
          <h2 className="font-semibold text-dark-text">Tax Breakdown by Partner</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Partner</TableHead>
                <TableHead>Merchants</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>WHT Collected</TableHead>
                <TableHead>GST Collected</TableHead>
                <TableHead>Total Tax</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.partnerTaxRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.partnerName}</TableCell>
                  <TableCell>{row.merchantsCount}</TableCell>
                  <TableCell><AmountText amount={row.totalRevenue} className="text-sm" /></TableCell>
                  <TableCell><AmountText amount={row.whtCollected} className="text-sm" /></TableCell>
                  <TableCell><AmountText amount={row.gstCollected} className="text-sm" /></TableCell>
                  <TableCell><AmountText amount={row.totalTax} className="text-sm" variant="negative" /></TableCell>
                  <TableCell>
                    <StatusBadge status={row.filingStatus === "Filed" ? "Filed" : "Pending"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="border-b border-light-border px-5 py-4">
          <h2 className="font-semibold text-dark-text">FBR Filing History</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>FBR Reference</TableHead>
                <TableHead className="text-right">Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.fbrHistory.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.period}</TableCell>
                  <TableCell><AmountText amount={row.amount} className="text-sm" /></TableCell>
                  <TableCell className="font-mono text-xs">{row.referenceNumber}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-rider-blue">
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TaxMonthDetailSheet
        month={selectedMonth}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filing={fileTax.isPending}
        onFile={(key) => fileTax.mutate(key, { onSuccess: () => setSheetOpen(false) })}
      />
    </div>
  );
}
