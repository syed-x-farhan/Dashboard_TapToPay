"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wallet, Clock, TrendingUp, Receipt } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { RiskScoreBadge } from "@/components/shared/risk-score-badge";
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
import { useAdminMerchant, useUpdateMerchantNotes } from "@/admin-portal/hooks/use-admin-entities";
import { useAdminTransactions } from "@/admin-portal/hooks/use-admin-finance";
import { QueryError } from "@/components/shared/query-error";
import { formatDateTime, formatPKR } from "@/lib/format";

export default function AdminMerchantDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: merchant, isLoading, isError, refetch } = useAdminMerchant(id);
  const { data: allTx } = useAdminTransactions({ merchantId: id });
  const updateNotes = useUpdateMerchantNotes();
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (merchant) setNotes(merchant.opsNotes);
  }, [merchant]);

  if (isError) return <QueryError refetch={refetch} />;
  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (!merchant) return <p>Merchant not found</p>;

  const transactions = (allTx ?? []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/merchants" className="inline-flex items-center text-sm font-medium text-rider-blue hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark-text">{merchant.name}</h1>
          <p className="text-sm text-medium-text">
            {merchant.partnerName} · {merchant.city} · {merchant.category} · <StatusBadge status={merchant.status} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Volume This Month" amount={formatPKR(merchant.volumeThisMonth)} subtitle={merchant.city} icon={TrendingUp} borderColor="border-l-rider-blue" />
        <StatCard title="Pending Settlement" amount={formatPKR(merchant.pendingSettlement)} subtitle="Awaiting payout" icon={Clock} borderColor="border-l-rider-amber" subtitleColor="text-rider-amber" />
        <StatCard title="Active Riders" amount={String(merchant.activeRiders)} subtitle="Assigned to branch" icon={Wallet} borderColor="border-l-primary-green" />
        <StatCard title="Jazz Cash" amount={merchant.jazzCashNumber} subtitle={merchant.ownerName} icon={Receipt} borderColor="border-l-gray-400" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-base p-5">
          <h2 className="mb-4 text-base font-semibold text-rider-red">Admin Only</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-medium-text">Internal Risk Score</span>
              <RiskScoreBadge score={merchant.riskLevel} />
              <span className="amount text-sm">{merchant.internalRiskScore}/100</span>
            </div>
            <div>
              <p className="mb-2 text-sm text-medium-text">Account Flags</p>
              {merchant.accountFlags?.length === 0 ? (
                <p className="text-sm text-medium-text">No flags</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {merchant.accountFlags?.map((f) => (
                    <span key={f} className="rounded-full border border-rider-amber/30 bg-rider-amber/10 px-2.5 py-0.5 text-xs font-medium text-rider-amber">
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Ops Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-light-border px-3 py-2 text-sm outline-none focus:border-primary-green/40 focus:ring-2 focus:ring-primary-green/10"
                placeholder="Internal notes for ops team..."
              />
              <Button
                size="sm"
                className="mt-2 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
                disabled={updateNotes.isPending}
                onClick={() => updateNotes.mutate({ id: merchant.id, notes })}
              >
                Save Notes
              </Button>
            </div>
          </div>
        </div>

        <div className="card-base p-5">
          <h2 className="mb-4 text-base font-semibold">Business Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-medium-text">Owner</dt><dd>{merchant.ownerName}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">CNIC</dt><dd>{merchant.cnic}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Phone</dt><dd>{merchant.phone}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Partner</dt><dd><Link href={`/admin/partners/${merchant.partnerId}`} className="text-rider-blue hover:underline">{merchant.partnerName}</Link></dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Expected Volume</dt><dd>{formatPKR(merchant.monthlyExpectedVolume)}/mo</dd></div>
          </dl>
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="mb-4 text-base font-semibold">Recent Transactions</h2>
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
