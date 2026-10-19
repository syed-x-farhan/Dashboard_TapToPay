import { formatPKR } from "@/lib/format";
import type { TopMerchant } from "@/types/partner";

export function TopMerchantsList({ merchants }: { merchants: TopMerchant[] }) {
  return (
    <div className="card-base flex h-full flex-col p-5">
      <h3 className="mb-4 text-base font-semibold text-dark-text">
        Top Merchants by Volume
      </h3>
      <div className="flex flex-1 flex-col gap-4">
        {merchants.map((m, i) => (
          <div key={m.id}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-dark-text">
                {i + 1}. {m.name}
              </span>
              <span className="amount text-xs">{formatPKR(m.todayVolume)}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-content">
              <div
                className="h-full rounded-full bg-primary-green"
                style={{ width: `${m.sharePercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
