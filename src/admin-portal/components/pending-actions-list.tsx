"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { PendingAction } from "@/admin-portal/types";

interface PendingActionsListProps {
  actions: PendingAction[];
}

export function PendingActionsList({ actions }: PendingActionsListProps) {
  return (
    <div className="card-base flex h-full flex-col p-5">
      <h3 className="mb-4 text-base font-semibold text-dark-text">
        Pending Actions
      </h3>
      <div className="flex flex-1 flex-col gap-3">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-light-border p-3"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  action.severity === "red" ? "bg-rider-red" : "bg-rider-amber"
                )}
              />
              <p className="text-sm leading-snug text-dark-text">
                {action.description}
              </p>
            </div>
            <Link
              href={action.href}
              className="inline-flex h-7 shrink-0 items-center rounded-lg border border-light-border bg-white px-2.5 text-xs font-medium text-dark-text transition-colors hover:bg-content"
            >
              {action.actionLabel}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
