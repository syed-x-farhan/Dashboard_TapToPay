"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PartnerTypeVolume } from "@/admin-portal/types";

interface PartnerTypeDonutProps {
  data: PartnerTypeVolume[];
}

export function PartnerTypeDonut({ data }: PartnerTypeDonutProps) {
  return (
    <div className="card-base flex h-full flex-col p-5">
      <h3 className="mb-4 text-base font-semibold text-dark-text">
        Volume by Partner Type
      </h3>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value ?? 0}%`, "Share"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-medium-text">{item.name}</span>
              </div>
              <span className="amount text-dark-text">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
