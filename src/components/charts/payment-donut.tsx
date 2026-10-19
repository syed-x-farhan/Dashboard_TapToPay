"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentBreakdown } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";

export function PaymentDonut() {
  const { data, isLoading, isError, refetch } = usePaymentBreakdown();

  return (
    <div className="card-base flex h-full w-full flex-col p-5">
      <h3 className="mb-4 flex min-h-8 items-center text-base font-semibold text-dark-text">
        Payment Breakdown
      </h3>

      {isError ? (
        <QueryError refetch={refetch} />
      ) : isLoading ? (
        <Skeleton className="min-h-[280px] flex-1 rounded-xl" />
      ) : (
        <div className="flex min-h-[280px] flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data?.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.color} />
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

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4">
            {data?.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-medium-text">{item.name}</span>
                <span className="amount text-dark-text">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
