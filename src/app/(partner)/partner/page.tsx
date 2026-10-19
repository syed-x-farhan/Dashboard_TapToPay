"use client";

import {
  Store,
  Bike,
  TrendingUp,
  Clock,
  Receipt,
  Landmark,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PartnerVolumeChart } from "@/components/partner/charts/volume-chart";
import { TopMerchantsList } from "@/components/partner/top-merchants-list";
import { ActivityFeed } from "@/components/partner/activity-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { usePartnerDashboard } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { getSession } from "@/lib/auth";
import { formatPKR, formatCount } from "@/lib/format";

export default function PartnerDashboardPage() {
  const { data, isLoading, isError, refetch } = usePartnerDashboard();
  const session = getSession();

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-96 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data!.stats;
  const displayName = (session?.name ?? "Partner").replace(/ Services$/, "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-dark-text">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-sm text-medium-text">
          Here&apos;s your platform overview for today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Merchants" amount={formatCount(stats.totalMerchants)} subtitle={`${formatCount(stats.merchantsAddedThisMonth)} added this month`} icon={Store} borderColor="border-l-rider-blue" subtitleColor="text-rider-blue" />
        <StatCard title="Active Riders Today" amount={formatCount(stats.activeRidersToday)} subtitle={`Of ${formatCount(stats.totalRiders)} total riders`} icon={Bike} borderColor="border-l-primary-green" subtitleColor="text-primary-green" />
        <StatCard title="Today's Transaction Volume" amount={formatPKR(stats.todayVolume)} subtitle={`↑ ${stats.volumeChangePercent}% vs yesterday`} icon={TrendingUp} borderColor="border-l-primary-green" subtitleColor="text-primary-green" />
        <StatCard title="Pending Settlements" amount={formatPKR(stats.pendingSettlements)} subtitle={`Across ${stats.pendingMerchantsCount} merchants`} icon={Clock} borderColor="border-l-rider-amber" subtitleColor="text-rider-amber" />
        <StatCard title="Platform Fees Collected" amount={formatPKR(stats.platformFeesCollected)} subtitle="This month" icon={Receipt} borderColor="border-l-rider-blue" />
        <StatCard title="Tax Auto-Filed" amount={formatPKR(stats.taxAutoFiled)} subtitle="To FBR this month" icon={Landmark} borderColor="border-l-gray-400" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65%_35%] lg:items-stretch">
        <PartnerVolumeChart data={data!.volume} />
        <TopMerchantsList merchants={data!.topMerchants ?? []} />
      </div>

      <ActivityFeed events={data!.activity ?? []} />
    </div>
  );
}
