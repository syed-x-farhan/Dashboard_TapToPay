"use client";

import { MapPin, Navigation, Package, Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AmountText } from "@/components/shared/amount-text";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/format";
import { normalizePartnerRider } from "@/lib/partner-mock-data";
import { cn } from "@/lib/utils";
import type { DeliveryStatus, PartnerRider } from "@/types/partner";

interface RiderDrawerProps {
  rider: PartnerRider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deliveryStatusStyles: Record<DeliveryStatus, string> = {
  Delivered: "bg-primary-green/10 text-primary-green border-primary-green/20",
  "In Transit": "bg-rider-blue/10 text-rider-blue border-rider-blue/20",
  Pending: "bg-rider-amber/10 text-rider-amber border-rider-amber/20",
  Failed: "bg-red-50 text-red-600 border-red-200",
};

export function RiderDrawer({ rider, open, onOpenChange }: RiderDrawerProps) {
  if (!rider) return null;

  const data = normalizePartnerRider(rider);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{data.name}</SheetTitle>
          <p className="text-sm text-medium-text">
            {data.city} · {data.phone}
          </p>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={data.status} />
            <Badge variant="outline" className="border-light-border text-xs font-normal">
              <Navigation className="mr-1 h-3 w-3" />
              Last seen {data.lastSeenAt}
            </Badge>
          </div>

          <div className="rounded-xl border border-light-border bg-content p-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-green" />
              <div>
                <p className="text-xs text-medium-text">Current location</p>
                <p className="text-sm font-medium text-dark-text">{data.lastSeenArea}</p>
                <p className="mt-1 text-xs text-medium-text">
                  Active zone: {data.activeZone}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">Deliveries Today</p>
              <p className="amount mt-1 text-sm">
                {data.completedDeliveriesToday}/{data.deliveriesToday}
              </p>
            </div>
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">Today&apos;s Collections</p>
              <AmountText amount={data.todayCollections} className="mt-1 text-sm" />
            </div>
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">NFC Payments</p>
              <p className="amount mt-1 text-sm">{data.nfcPaymentsCount}</p>
            </div>
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">Cash Collections</p>
              <p className="amount mt-1 text-sm">{data.cashCollections}</p>
            </div>
          </div>

          <div>
            <p className="label-text mb-2 flex items-center gap-1.5 text-sm">
              <Store className="h-3.5 w-3.5" />
              Pickup From
            </p>
            <div className="flex flex-wrap gap-2">
              {data.pickupMerchants.map((m) => (
                <span
                  key={m}
                  className="rounded-lg border border-light-border bg-white px-3 py-1.5 text-xs font-medium"
                >
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-medium-text">
              Orders are picked up from these merchants, then delivered to customer addresses across the active zone.
            </p>
          </div>

          <div>
            <p className="label-text mb-3 flex items-center gap-1.5 text-sm">
              <Package className="h-3.5 w-3.5" />
              Today&apos;s Deliveries ({data.recentDeliveries.length} shown)
            </p>
            {data.recentDeliveries.length === 0 ? (
              <p className="rounded-xl border border-dashed border-light-border px-4 py-6 text-center text-sm text-medium-text">
                No deliveries recorded
              </p>
            ) : (
              <div className="space-y-3">
                {data.recentDeliveries.map((stop) => (
                  <div
                    key={stop.id}
                    className="rounded-xl border border-light-border bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-dark-text">
                          {stop.customerName}
                        </p>
                        <p className="mt-0.5 text-xs text-medium-text">
                          {stop.orderId} · from {stop.pickupMerchant}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("shrink-0 text-[10px]", deliveryStatusStyles[stop.status])}
                      >
                        {stop.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-start gap-1.5">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs text-dark-text">{stop.deliveryAddress}</p>
                        <p className="text-xs text-medium-text">{stop.area}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-light-border pt-2 text-xs">
                      <span className="text-medium-text">
                        {stop.collectedAt} · {stop.paymentMethod}
                      </span>
                      <span className="amount font-medium">{formatPKR(stop.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="label-text mb-2 text-sm">Weekly Summary (Last 7 days)</p>
            {data.dailyEarnings.map((day) => (
              <div
                key={day.day}
                className="flex items-center justify-between border-b border-light-border py-2 text-sm"
              >
                <div>
                  <span className="text-medium-text">{day.day}</span>
                  <span className="ml-2 text-xs text-medium-text">
                    {day.deliveries} deliveries
                  </span>
                </div>
                <span className="amount">{formatPKR(day.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
