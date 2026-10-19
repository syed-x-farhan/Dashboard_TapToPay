"use client";

import * as React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPKR } from "@/lib/format";
import type { VolumeDataPoint } from "@/types/partner";

type Period = "daily" | "weekly" | "monthly";

interface PartnerVolumeChartProps {
  data?: VolumeDataPoint[];
}

export function PartnerVolumeChart({ data = [] }: PartnerVolumeChartProps) {
  const [period, setPeriod] = React.useState<Period>("daily");
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="card-base p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-dark-text">Transaction Volume</h3>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="daily" className="rounded-lg text-xs">Daily</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-lg text-xs">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg text-xs">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
          <Tooltip formatter={(value) => formatPKR(Number(value ?? 0))} />
          <Legend />
          <Line type="monotone" dataKey="volume" name="Volume" stroke="#00C896" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="settlements" name="Settlements" stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
