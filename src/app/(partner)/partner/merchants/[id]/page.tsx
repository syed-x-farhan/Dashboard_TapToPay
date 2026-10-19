"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet, Clock, TrendingUp, Receipt } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePartnerMerchant, usePartnerTransactions } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { formatDateTime, formatPKR } from "@/lib/format";

export default function MerchantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: merchant, isLoading, isError, refetch } = usePartnerMerchant(id);
  const { data: allTx } = usePartnerTransactions();
  const transactions = allTx?.filter((t) => t.merchantId === id).slice(0, 8);

  if (isError) return <QueryError refetch={refetch} />;
  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (!merchant) return <p>Merchant not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/partner/merchants" className="inline-flex items-center text-sm font-medium text-rider-blue hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark-text">{merchant.name}</h1>
          <p className="text-sm text-medium-text">{merchant.city} · {merchant.category} · <StatusBadge status={merchant.status} /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Volume This Month" amount={formatPKR(merchant.volumeThisMonth)} subtitle={merchant.city} icon={TrendingUp} borderColor="border-l-rider-blue" />
        <StatCard title="Pending Settlement" amount={formatPKR(merchant.pendingSettlement)} subtitle="Awaiting payout" icon={Clock} borderColor="border-l-rider-amber" subtitleColor="text-rider-amber" />
        <StatCard title="Active Riders" amount={String(merchant.activeRiders)} subtitle="Assigned to branch" icon={Wallet} borderColor="border-l-primary-green" />
        <StatCard title="Jazz Cash" amount={merchant.jazzCashNumber} subtitle={merchant.ownerName} icon={Receipt} borderColor="border-l-gray-400" />
      </div>

      <div className="card-base p-5">
        <h2 className="mb-4 text-base font-semibold">Recent Transactions (Read-only)</h2>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Rider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="text-medium-text">{formatDateTime(tx.date)}</TableCell>
                <TableCell>{tx.orderId}</TableCell>
                <TableCell>{tx.rider}</TableCell>
                <TableCell><AmountText amount={tx.amount} className="text-sm" /></TableCell>
                <TableCell><StatusBadge status={tx.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
