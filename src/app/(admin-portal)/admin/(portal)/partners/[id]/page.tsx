"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { useAdminPartner, useAdminMerchants, useAdminRiders } from "@/admin-portal/hooks/use-admin-entities";
import { QueryError } from "@/components/shared/query-error";
import { formatPKR } from "@/lib/format";

export default function AdminPartnerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: partner, isLoading, isError, refetch } = useAdminPartner(id);
  const { data: allMerchants } = useAdminMerchants();
  const { data: allRiders } = useAdminRiders();

  if (isError) return <QueryError refetch={refetch} />;
  if (isLoading) return <Skeleton className="h-96 rounded-2xl" />;
  if (!partner) return <p>Partner not found</p>;

  const merchants = allMerchants?.filter((m) => partner.merchantIds.includes(m.id)) ?? [];
  const riders = allRiders?.filter((r) => partner.riderIds.includes(r.id)) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/partners" className="inline-flex items-center text-sm font-medium text-rider-blue hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark-text">{partner.name}</h1>
          <p className="text-sm text-medium-text">
            {partner.type} · {partner.city} · <StatusBadge status={partner.status === "Pending Approval" ? "Pending" : partner.status} />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-base p-4"><p className="text-xs text-medium-text">Merchants</p><p className="amount mt-1 text-2xl">{partner.totalMerchants}</p></div>
        <div className="card-base p-4"><p className="text-xs text-medium-text">Riders</p><p className="amount mt-1 text-2xl">{partner.totalRiders}</p></div>
        <div className="card-base p-4"><p className="text-xs text-medium-text">Monthly Volume</p><p className="amount mt-1 text-lg">{formatPKR(partner.monthlyVolume)}</p></div>
        <div className="card-base p-4"><p className="text-xs text-medium-text">Fee Rate</p><p className="amount mt-1 text-2xl">{partner.feeRate}%</p></div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-base p-5">
          <h2 className="mb-4 text-base font-semibold">Transaction Volume (6 months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={partner.volumeChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatPKR(Number(v ?? 0))} />
              <Bar dataKey="volume" fill="#00C896" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-base p-5">
          <h2 className="mb-4 text-base font-semibold">Partner Settings</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-medium-text">Contact</dt><dd>{partner.contactPerson}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Email</dt><dd>{partner.email}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Phone</dt><dd>{partner.phone}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">NTN</dt><dd>{partner.ntn}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Account Manager</dt><dd>{partner.accountManager}</dd></div>
            <div className="flex justify-between"><dt className="text-medium-text">Discount Tiers</dt><dd>Low {partner.discountTiers.low}% · Med {partner.discountTiers.medium}% · High {partner.discountTiers.high}%</dd></div>
            {partner.suspendReason && (
              <div className="rounded-lg bg-rider-red/5 p-2 text-rider-red">Suspended: {partner.suspendReason}</div>
            )}
          </dl>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <h2 className="border-b border-light-border px-5 py-4 text-base font-semibold">Fee Collection History</h2>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Merchants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partner.feeHistory.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.date}</TableCell>
                <TableCell><AmountText amount={f.amount} className="text-sm" /></TableCell>
                <TableCell>{f.merchantCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card-base overflow-hidden p-0">
          <h2 className="border-b border-light-border px-5 py-4 text-base font-semibold">Merchants ({merchants.length})</h2>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.map((m) => (
                <TableRow key={m.id}>
                  <TableCell><Link href={`/admin/merchants/${m.id}`} className="font-medium text-rider-blue hover:underline">{m.name}</Link></TableCell>
                  <TableCell>{m.city}</TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="card-base overflow-hidden p-0">
          <h2 className="border-b border-light-border px-5 py-4 text-base font-semibold">Riders ({riders.length})</h2>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riders.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
