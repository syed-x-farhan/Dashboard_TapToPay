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
  ReferenceDot,
} from "recharts";
import { formatPKR } from "@/lib/format";
import type { AnomalyPoint } from "@/admin-portal/types/ops";

interface AnomaliesChartProps {
  data: AnomalyPoint[];
}

export function AnomaliesChart({ data }: AnomaliesChartProps) {
  const [hoverDetail, setHoverDetail] = React.useState<string | null>(null);
  const anomalies = data.filter((d) => d.isAnomaly);

  return (
    <div className="card-base p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-dark-text">Transaction Anomalies</h3>
          <p className="text-xs text-medium-text">Last 24 hours — red dots indicate flagged spikes</p>
        </div>
        {hoverDetail && (
          <p className="max-w-xs text-right text-xs text-rider-red">{hoverDetail}</p>
        )}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value) => formatPKR(Number(value ?? 0))}
              labelFormatter={(label) => `Hour: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#00C896"
              strokeWidth={2}
              dot={false}
            />
            {anomalies.map((a) => (
              <ReferenceDot
                key={a.hour}
                x={a.hour}
                y={a.volume}
                r={6}
                fill="#EF4444"
                stroke="#fff"
                strokeWidth={2}
                onMouseEnter={() => setHoverDetail(a.anomalyDetail ?? null)}
                onMouseLeave={() => setHoverDetail(null)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
