"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDiscountingRules, useSaveDiscountingRules } from "@/admin-portal/hooks/use-admin-finance";
import { QueryError } from "@/components/shared/query-error";
import type { DiscountingRulesEngine } from "@/admin-portal/types/finance";

const WEIGHT_FIELDS: { key: keyof DiscountingRulesEngine; label: string }[] = [
  { key: "merchantAgeWeight", label: "Merchant Age Weight" },
  { key: "volumeConsistencyWeight", label: "Volume Consistency Weight" },
  { key: "repaymentHistoryWeight", label: "Previous Discount Repayment Weight" },
  { key: "partnerReputationWeight", label: "Partner Reputation Weight" },
];

export function DiscountRulesEngine() {
  const { data: rules, isLoading, isError, refetch } = useDiscountingRules();
  const save = useSaveDiscountingRules();
  const [local, setLocal] = React.useState<DiscountingRulesEngine | null>(null);

  React.useEffect(() => {
    if (rules) setLocal(rules);
  }, [rules]);

  if (isError) return <QueryError refetch={refetch} />;
  if (isLoading || !local) return null;

  const totalWeight = Object.values(local).reduce((s, v) => s + v, 0);

  return (
    <div className="card-base p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-dark-text">Discounting Rules Engine</h3>
          <p className="text-xs text-medium-text">Configure risk scoring weights. Total: {totalWeight}%</p>
        </div>
        <Button
          size="sm"
          className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
          disabled={save.isPending}
          onClick={() => save.mutate(local)}
        >
          Save Rules
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {WEIGHT_FIELDS.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{label}</Label>
              <span className="amount text-sm">{local[key]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              value={local[key]}
              onChange={(e) => setLocal({ ...local, [key]: Number(e.target.value) })}
              className="h-2 w-full cursor-pointer accent-primary-green"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
