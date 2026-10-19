"use client";

import { cn } from "@/lib/utils";
import type { AccountType } from "@/lib/auth";

interface AuthPortalToggleProps {
  value: AccountType;
  onChange: (value: AccountType) => void;
}

export function AuthPortalToggle({ value, onChange }: AuthPortalToggleProps) {
  return (
    <div className="mb-6 flex rounded-xl border border-light-border bg-content p-1">
      {(["merchant", "partner"] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "flex-1 rounded-lg py-2 text-xs font-semibold transition-all",
            value === type
              ? "bg-white text-dark-text shadow-sm"
              : "text-medium-text hover:text-dark-text"
          )}
        >
          {type === "merchant" ? "Merchant Login" : "Partner Login"}
        </button>
      ))}
    </div>
  );
}
