import {
  Banknote,
  FileText,
  Store,
  Receipt,
} from "lucide-react";
import { formatPKR } from "@/lib/format";
import type { ActivityEvent } from "@/types/partner";

const iconMap = {
  settlement: Banknote,
  discount: FileText,
  onboard: Store,
  transaction: Receipt,
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="card-base p-5">
      <h3 className="mb-4 text-base font-semibold text-dark-text">
        Recent Activity Feed
      </h3>
      <div className="space-y-3">
        {events.map((event) => {
          const Icon = iconMap[event.type];
          return (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-xl border border-light-border p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-content">
                <Icon className="h-4 w-4 text-medium-text" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-dark-text">
                  {event.description} for{" "}
                  <span className="font-medium">{event.merchant}</span>
                  {event.amount ? (
                    <> — <span className="amount">{formatPKR(event.amount)}</span></>
                  ) : null}
                </p>
                <p className="mt-0.5 text-xs text-medium-text">{event.timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
