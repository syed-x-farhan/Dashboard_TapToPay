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
import type { PlatformVolumePoint } from "@/admin-portal/types";

type Period = "daily" | "weekly" | "monthly";

interface PlatformVolumeChartProps {
  data: PlatformVolumePoint[];
}

function aggregateWeekly(data: PlatformVolumePoint[]) {
  const weeks: PlatformVolumePoint[] = [];
  for (let i = 0; i < data.length; i += 7) {
    const chunk = data.slice(i, i + 7);
    weeks.push({
      date: chunk[0]?.date ?? "",
      label: `W${weeks.length + 1}`,
      volume: chunk.reduce((s, d) => s + d.volume, 0),
      settlements: chunk.reduce((s, d) => s + d.settlements, 0),
      fees: chunk.reduce((s, d) => s + d.fees, 0),
    });
  }
  return weeks;
}

function aggregateMonthly(data: PlatformVolumePoint[]) {
  return [
    {
      date: data[0]?.date ?? "",
      label: "Week 1–2",
      volume: data.slice(0, 15).reduce((s, d) => s + d.volume, 0),
      settlements: data.slice(0, 15).reduce((s, d) => s + d.settlements, 0),
      fees: data.slice(0, 15).reduce((s, d) => s + d.fees, 0),
    },
    {
      date: data[15]?.date ?? "",
      label: "Week 3–4",
      volume: data.slice(15).reduce((s, d) => s + d.volume, 0),
      settlements: data.slice(15).reduce((s, d) => s + d.settlements, 0),
      fees: data.slice(15).reduce((s, d) => s + d.fees, 0),
    },
  ];
}

export function PlatformVolumeChart({ data }: PlatformVolumeChartProps) {
  const [period, setPeriod] = React.useState<Period>("daily");

  const chartData =
    period === "daily"
      ? data
      : period === "weekly"
        ? aggregateWeekly(data)
        : aggregateMonthly(data);

  return (
    <div className="card-base h-full p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-dark-text">
          Platform Transaction Volume
        </h3>
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
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
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
            tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
          />
          <Tooltip formatter={(value) => formatPKR(Number(value ?? 0))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="volume"
            name="Total Volume"
            stroke="#00C896"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="settlements"
            name="Settlements Processed"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="fees"
            name="Fees Collected"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
