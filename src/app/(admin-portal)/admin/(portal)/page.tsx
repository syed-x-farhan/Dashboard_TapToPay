"use client";

import { format } from "date-fns";
import {
  Building2,
  Store,
  Bike,
  TrendingUp,
  Clock,
  FileText,
  Landmark,
  Receipt,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformVolumeChart } from "@/admin-portal/components/charts/platform-volume-chart";
import { PartnerTypeDonut } from "@/admin-portal/components/charts/partner-type-donut";
import { PendingActionsList } from "@/admin-portal/components/pending-actions-list";
import { LiveTransactionFeed } from "@/admin-portal/components/live-transaction-feed";
import { useAdminDashboard } from "@/admin-portal/hooks/use-admin-data";
import { QueryError } from "@/components/shared/query-error";
import { formatPKR, formatCount } from "@/lib/format";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const today = format(new Date(), "dd/MM/yyyy");

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-96 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data!.stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-dark-text">
          Platform Overview
        </h1>
        <p className="text-sm text-medium-text">{today}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Partners"
          amount={formatCount(stats.totalPartners)}
          subtitle={`${formatCount(stats.partnersPendingApproval)} pending approval`}
          icon={Building2}
          borderColor="border-l-rider-blue"
          subtitleColor="text-rider-blue"
        />
        <StatCard
          title="Total Merchants"
          amount={formatCount(stats.totalMerchants)}
          subtitle={`${formatCount(stats.merchantsAddedThisWeek)} added this week`}
          icon={Store}
          borderColor="border-l-primary-green"
          subtitleColor="text-primary-green"
        />
        <StatCard
          title="Total Riders"
          amount={formatCount(stats.totalRiders)}
          subtitle={`${formatCount(stats.activeRidersToday)} active today`}
          icon={Bike}
          borderColor="border-l-primary-green"
          subtitleColor="text-primary-green"
        />
        <StatCard
          title="Today's Transaction Volume"
          amount={formatPKR(stats.todayVolume)}
          subtitle={`↑ ${stats.volumeChangePercent}% vs yesterday`}
          icon={TrendingUp}
          borderColor="border-l-primary-green"
          subtitleColor="text-primary-green"
        />
        <StatCard
          title="Pending Settlements"
          amount={formatPKR(stats.pendingSettlements)}
          subtitle="Across all partners"
          icon={Clock}
          borderColor="border-l-rider-amber"
          subtitleColor="text-rider-amber"
        />
        <StatCard
          title="Invoice Discounting Requests"
          amount={String(stats.discountingRequests)}
          subtitle={`${stats.discountingPendingApproval} pending approval`}
          icon={FileText}
          borderColor="border-l-rider-amber"
          subtitleColor="text-rider-amber"
        />
        <StatCard
          title="Total Tax Held"
          amount={formatPKR(stats.totalTaxHeld)}
          subtitle="Pending FBR filing"
          icon={Landmark}
          borderColor="border-l-rider-red"
          subtitleColor="text-rider-red"
        />
        <StatCard
          title="Platform Revenue Today"
          amount={formatPKR(stats.platformRevenueToday)}
          subtitle="Fees collected"
          icon={Receipt}
          borderColor="border-l-rider-blue"
          subtitleColor="text-rider-blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-stretch">
        <div className="lg:col-span-2">
          <PlatformVolumeChart data={data!.volume} />
        </div>
        <div className="lg:col-span-1">
          <PartnerTypeDonut data={data!.partnerTypes} />
        </div>
        <div className="lg:col-span-1">
          <PendingActionsList actions={data!.pendingActions} />
        </div>
      </div>

      <LiveTransactionFeed initialFeed={data!.liveFeed} />
    </div>
  );
}
