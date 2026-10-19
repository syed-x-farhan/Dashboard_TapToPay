"use client";

import {
  Wallet,
  Clock,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { EarningsChart } from "@/components/charts/earnings-chart";
import { PaymentDonut } from "@/components/charts/payment-donut";
import { PageHeader } from "@/components/shared/page-header";
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
import { useDashboardStats, useTransactions } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";
import { formatDate, formatPKR, formatSignedPKR } from "@/lib/format";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStats();
  const {
    data: transactions,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTx,
  } = useTransactions();

  if (statsError) return <QueryError refetch={refetchStats} />;
  if (txError) return <QueryError refetch={refetchTx} />;

  const recent = transactions?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))
        ) : stats ? (
          <>
            <StatCard
              title="Wallet Balance"
              amount={formatPKR(stats.walletBalance)}
              subtitle={formatSignedPKR(stats.walletChangeToday) + " today"}
              icon={Wallet}
              borderColor="border-l-primary-green"
              subtitleColor="text-primary-green"
            />
            <StatCard
              title="Pending Settlement"
              amount={formatPKR(stats.pendingSettlement)}
              subtitle={`Pays out in ${stats.pendingPayoutDays} days`}
              icon={Clock}
              borderColor="border-l-rider-amber"
              subtitleColor="text-rider-amber"
            />
            <StatCard
              title="This Month Earnings"
              amount={formatPKR(stats.monthEarnings)}
              subtitle={`↑ ${stats.monthEarningsChangePercent}% vs last month`}
              icon={TrendingUp}
              borderColor="border-l-rider-blue"
              subtitleColor="text-rider-blue"
            />
            <StatCard
              title="Tax Held"
              amount={formatPKR(stats.taxHeld)}
              subtitle="Auto-filed to FBR"
              icon={Receipt}
              borderColor="border-l-rider-red"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:items-stretch">
        <div className="flex lg:col-span-3">
          <EarningsChart />
        </div>
        <div className="flex lg:col-span-2">
          <PaymentDonut />
        </div>
      </div>

      <div className="card-base p-5">
        <PageHeader title="Recent Transactions" viewAllHref="/transactions" />
        {txLoading ? (
          <Skeleton className="h-48 w-full rounded-xl" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-medium-text">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell className="font-medium">{tx.orderId}</TableCell>
                  <TableCell>{tx.customer}</TableCell>
                  <TableCell>
                    <AmountText amount={tx.amount} className="text-sm" />
                  </TableCell>
                  <TableCell>{tx.paymentMethod}</TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-rider-blue">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
