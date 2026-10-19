"use client";

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
import type { ApiResponsePoint } from "@/admin-portal/types/ops";

interface ApiResponseChartProps {
  data: ApiResponsePoint[];
}

export function ApiResponseChart({ data }: ApiResponseChartProps) {
  return (
    <div className="card-base p-5">
      <h3 className="mb-4 font-semibold text-dark-text">API Response Times — Last 24 Hours</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
            <YAxis tick={{ fontSize: 10 }} unit="ms" />
            <Tooltip formatter={(value) => `${Math.round(Number(value ?? 0))} ms`} />
            <Legend />
            <Line type="monotone" dataKey="backend" name="Backend" stroke="#00C896" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="jazzCash" name="Jazz Cash" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="fbr" name="FBR" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="redis" name="Redis" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
