"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useEarnings } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";
import { formatPKR } from "@/lib/format";

type Period = "daily" | "weekly" | "monthly";

export function EarningsChart() {
  const [period, setPeriod] = React.useState<Period>("daily");
  const { data, isLoading, isError, refetch } = useEarnings(period);

  return (
    <div className="card-base flex h-full w-full flex-col p-5">
      <div className="mb-4 flex min-h-8 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-dark-text">Earnings Overview</h3>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="daily" className="rounded-lg text-xs">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg text-xs">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg text-xs">
              Monthly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isError ? (
        <QueryError refetch={refetch} />
      ) : isLoading ? (
        <Skeleton className="min-h-[280px] flex-1 rounded-xl" />
      ) : (
        <div className="min-h-[280px] flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00C896" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [
                formatPKR(Number(value ?? 0)),
                "Earnings",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#00C896"
              strokeWidth={2}
              fill="url(#earningsFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
