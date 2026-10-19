"use client";

import { Package, Wallet, MapPin } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { getRiderSession } from "@/lib/rider-auth";
import { formatPKR } from "@/lib/format";

export default function RiderDashboardPage() {
  const session = getRiderSession();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-dark-text">Today&apos;s Overview</h1>
        <p className="text-sm text-medium-text">
          {session?.name} · {session?.partnerName} · {session?.city}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Deliveries Today"
          amount="48/50"
          subtitle="96% completion rate"
          icon={Package}
          borderColor="border-l-primary-green"
        />
        <StatCard
          title="Collections Today"
          amount={formatPKR(48200)}
          subtitle="NFC + Cash"
          icon={Wallet}
          borderColor="border-l-rider-blue"
        />
        <StatCard
          title="Active Zone"
          amount="Gulberg"
          subtitle="Model Town → Johar Town"
          icon={MapPin}
          borderColor="border-l-rider-amber"
        />
      </div>

      <div className="card-base p-5">
        <h2 className="mb-3 font-semibold text-dark-text">Recent Activity</h2>
        <div className="space-y-2 text-sm text-medium-text">
          <p>14:32 — ORD-5521 delivered · Rs. 2,450 · NFC</p>
          <p>14:18 — ORD-5518 delivered · Rs. 1,850 · Cash</p>
          <p>13:55 — ORD-5512 in transit · KFC Gulberg pickup</p>
        </div>
      </div>
    </div>
  );
}
