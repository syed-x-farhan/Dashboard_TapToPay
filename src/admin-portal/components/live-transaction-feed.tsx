"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AmountText } from "@/components/shared/amount-text";
import { useLiveTransactionFeed } from "@/admin-portal/hooks/use-admin-data";
import { QueryError } from "@/components/shared/query-error";
import type { LiveTransaction } from "@/admin-portal/types";

interface LiveTransactionFeedProps {
  initialFeed: LiveTransaction[];
}

export function LiveTransactionFeed({ initialFeed }: LiveTransactionFeedProps) {
  const [paused, setPaused] = React.useState(false);
  const { data, isFetching, isError, refetch } = useLiveTransactionFeed(paused);
  const feed = data ?? initialFeed;

  return (
    <div className="card-base overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-light-border px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-dark-text">
            Live Transaction Feed
          </h3>
          <p className="text-xs text-medium-text">
            Real-time activity across the platform
            {!paused && " · refreshes every 30s"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <>
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Resume
            </>
          ) : (
            <>
              <Pause className="mr-1.5 h-3.5 w-3.5" />
              Pause
            </>
          )}
        </Button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isError ? (
          <QueryError refetch={refetch} />
        ) : isFetching && !data ? (
          <Skeleton className="m-4 h-48 rounded-xl" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-light-border bg-content/50 text-left text-xs text-medium-text">
                <th className="px-5 py-2.5 font-medium">Partner</th>
                <th className="px-5 py-2.5 font-medium">Merchant</th>
                <th className="px-5 py-2.5 font-medium">Amount</th>
                <th className="px-5 py-2.5 font-medium">Method</th>
                <th className="px-5 py-2.5 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {feed.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-light-border last:border-0 hover:bg-content/30"
                >
                  <td className="px-5 py-3 font-medium text-dark-text">
                    {tx.partner}
                  </td>
                  <td className="px-5 py-3 text-medium-text">{tx.merchant}</td>
                  <td className="px-5 py-3">
                    <AmountText amount={tx.amount} className="text-sm" />
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-md bg-content px-2 py-0.5 text-xs font-medium">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-medium-text">
                    {tx.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
