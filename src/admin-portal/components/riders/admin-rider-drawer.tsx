"use client";

import * as React from "react";
import { MapPin, Navigation, Package, Store, Flag, UserX, ArrowRightLeft } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/rbac/can";
import { Badge } from "@/components/ui/badge";
import { AmountText } from "@/components/shared/amount-text";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatPKR } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminRider } from "@/admin-portal/types/entities";
import type { DeliveryStatus } from "@/types/partner";

const deliveryStatusStyles: Record<DeliveryStatus, string> = {
  Delivered: "bg-primary-green/10 text-primary-green border-primary-green/20",
  "In Transit": "bg-rider-blue/10 text-rider-blue border-rider-blue/20",
  Pending: "bg-rider-amber/10 text-rider-amber border-rider-amber/20",
  Failed: "bg-red-50 text-red-600 border-red-200",
};

interface AdminRiderDrawerProps {
  rider: AdminRider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFlag: (rider: AdminRider) => void;
  onSuspend: (rider: AdminRider) => void;
  onReassign: (rider: AdminRider) => void;
}

export function AdminRiderDrawer({
  rider,
  open,
  onOpenChange,
  onFlag,
  onSuspend,
  onReassign,
}: AdminRiderDrawerProps) {
  if (!rider) return null;
  const pickupMerchants = rider.pickupMerchants ?? [];
  const recentDeliveries = rider.recentDeliveries ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{rider.name}</SheetTitle>
          <p className="text-sm text-medium-text">
            {rider.city} · {rider.phone} · {rider.partnerName}
          </p>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={rider.status} />
            {rider.flagged && (
              <Badge variant="outline" className="border-rider-red/30 bg-rider-red/10 text-rider-red">
                <Flag className="mr-1 h-3 w-3" /> Flagged
              </Badge>
            )}
            <Badge variant="outline" className="border-light-border text-xs font-normal">
              <Navigation className="mr-1 h-3 w-3" />
              Last seen {rider.lastSeenAt}
            </Badge>
          </div>

          {rider.flagReason && (
            <div className="rounded-xl border border-rider-red/20 bg-rider-red/5 p-3 text-sm text-rider-red">
              Flag reason: {rider.flagReason}
            </div>
          )}

          <Can portal="admin" action="manage_riders">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="rounded-lg" onClick={() => onFlag(rider)}>
                <Flag className="mr-1.5 h-3.5 w-3.5" /> Flag
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg text-rider-red hover:text-rider-red" onClick={() => onSuspend(rider)}>
                <UserX className="mr-1.5 h-3.5 w-3.5" /> Suspend
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg" onClick={() => onReassign(rider)}>
                <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" /> Reassign
              </Button>
            </div>
          </Can>

          <div className="rounded-xl border border-light-border bg-content p-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-green" />
              <div>
                <p className="text-xs text-medium-text">Current location</p>
                <p className="text-sm font-medium text-dark-text">{rider.lastSeenArea}</p>
                <p className="mt-1 text-xs text-medium-text">Active zone: {rider.activeZone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">Deliveries Today</p>
              <p className="amount mt-1 text-sm">{rider.completedDeliveriesToday}/{rider.deliveriesToday}</p>
            </div>
            <div className="rounded-xl bg-content p-3">
              <p className="text-xs text-medium-text">Today&apos;s Collections</p>
              <AmountText amount={rider.todayCollections} className="mt-1 text-sm" />
            </div>
          </div>

          <div>
            <p className="label-text mb-2 flex items-center gap-1.5 text-sm">
              <Store className="h-3.5 w-3.5" /> Pickup From
            </p>
            <div className="flex flex-wrap gap-2">
              {pickupMerchants.map((m) => (
                <span key={m} className="rounded-lg border border-light-border bg-white px-3 py-1.5 text-xs font-medium">{m}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="label-text mb-3 flex items-center gap-1.5 text-sm">
              <Package className="h-3.5 w-3.5" /> Recent Deliveries
            </p>
            {recentDeliveries.length === 0 ? (
              <p className="text-sm text-medium-text">No recent deliveries</p>
            ) : (
              <div className="space-y-3">
                {recentDeliveries.map((stop) => (
                  <div key={stop.id} className="rounded-xl border border-light-border bg-white p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{stop.customerName}</p>
                        <p className="text-xs text-medium-text">{stop.orderId} · {stop.area}</p>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px]", deliveryStatusStyles[stop.status])}>{stop.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-medium-text">{stop.deliveryAddress}</p>
                    <div className="mt-2 flex justify-between text-xs">
                      <span className="text-medium-text">{stop.collectedAt} · {stop.paymentMethod}</span>
                      <span className="amount">{formatPKR(stop.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
