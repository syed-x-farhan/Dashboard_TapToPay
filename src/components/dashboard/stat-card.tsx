"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: string;
  subtitle: string;
  icon: LucideIcon;
  borderColor: string;
  subtitleColor?: string;
  className?: string;
}

export function StatCard({
  title,
  amount,
  subtitle,
  icon: Icon,
  borderColor,
  subtitleColor = "text-medium-text",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "card-base relative overflow-hidden border-l-[3px] p-5",
        borderColor,
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label-text text-sm text-medium-text">{title}</p>
          <p className="amount mt-2 text-2xl tracking-tight text-dark-text">
            {amount}
          </p>
          <p className={cn("mt-1 text-xs", subtitleColor)}>{subtitle}</p>
        </div>
        <Icon
          className="mt-0.5 h-[18px] w-[18px] shrink-0 text-gray-400"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}
