"use client";

import { Download, FileCheck, Landmark, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
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
import { useTaxData } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";
import { formatPKR } from "@/lib/format";

export default function TaxCompliancePage() {
  const { data, isLoading, isError, refetch } = useTaxData();

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  const { stats, months, summary, documents } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Total Tax Collected This Year"
          amount={formatPKR(stats.totalTaxCollectedYear)}
          subtitle="Jan – Jun 2025"
          icon={Landmark}
          borderColor="border-l-rider-blue"
        />
        <StatCard
          title="Total Tax Filed"
          amount={formatPKR(stats.totalTaxFiled)}
          subtitle="Submitted to FBR"
          icon={FileCheck}
          borderColor="border-l-primary-green"
        />
        <div className="card-base border-l-[3px] border-l-rider-amber p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label-text text-sm text-medium-text">Next Filing Date</p>
              <p className="amount mt-2 text-2xl tracking-tight text-dark-text">
                {stats.nextFilingDate}
              </p>
              <p className="mt-1 text-xs text-rider-amber">Upcoming deadline</p>
            </div>
            <CalendarDays
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-400"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="border-b border-light-border px-5 py-4">
          <h2 className="text-base font-semibold text-dark-text">
            Monthly Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Month</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell>
                    <AmountText amount={row.totalRevenue} className="text-sm" />
                  </TableCell>
                  <TableCell>{row.taxRate}%</TableCell>
                  <TableCell>
                    <AmountText amount={row.taxAmount} className="text-sm" />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rider-blue"
                      disabled={row.status === "Pending"}
                    >
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

      <div className="card-base p-5">
        <h2 className="mb-4 text-base font-semibold text-dark-text">
          Tax Summary — {summary.month}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-content p-4">
            <p className="text-xs text-medium-text">WHT (Withholding Tax)</p>
            <AmountText amount={summary.wht} className="mt-1 text-lg" />
          </div>
          <div className="rounded-xl bg-content p-4">
            <p className="text-xs text-medium-text">GST</p>
            <AmountText amount={summary.gst} className="mt-1 text-lg" />
          </div>
          <div className="rounded-xl bg-content p-4">
            <p className="text-xs text-medium-text">Total This Month</p>
            <AmountText
              amount={summary.total}
              variant="negative"
              className="mt-1 text-lg"
            />
          </div>
        </div>
        <p className="description-text mt-4 text-sm">
          Automatically deducted from each settlement.
        </p>
      </div>

      <div className="card-base p-5">
        <h2 className="mb-4 text-base font-semibold text-dark-text">Documents</h2>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded-xl border border-light-border px-4 py-3"
            >
              <div>
                <p className="label-text text-sm text-dark-text">{doc.month}</p>
                <p className="text-xs text-medium-text">
                  Generated: {doc.dateGenerated}
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Download className="mr-1 h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
