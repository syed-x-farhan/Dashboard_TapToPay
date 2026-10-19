"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMerchant } from "@/hooks/use-dashboard-data";
import { QueryError } from "@/components/shared/query-error";
import { useMerchantCan } from "@/hooks/use-permission";
import { defaultNotifications } from "@/lib/mock-data";
import type { NotificationSettings, SettlementFrequency } from "@/types";

export default function SettingsPage() {
  const { data: merchant, isLoading, isError, refetch } = useMerchant();
  const canManageSettings = useMerchantCan("manage_settings");
  const [notifications, setNotifications] =
    React.useState<NotificationSettings>(defaultNotifications);
  const [settlementFrequency, setSettlementFrequency] =
    React.useState<SettlementFrequency>("Daily");

  React.useEffect(() => {
    if (
      merchant?.settlementFrequency === "Daily" ||
      merchant?.settlementFrequency === "Weekly"
    ) {
      setSettlementFrequency(merchant.settlementFrequency);
    }
  }, [merchant]);

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!merchant) return null;

  const notificationItems: {
    key: keyof NotificationSettings;
    label: string;
    description: string;
  }[] = [
    {
      key: "paymentReceived",
      label: "Payment received",
      description: "Get notified when a customer pays via NFC or wallet.",
    },
    {
      key: "settlementProcessed",
      label: "Settlement processed",
      description: "Alert when funds are transferred to your Jazz Cash.",
    },
    {
      key: "invoiceDiscountApproved",
      label: "Invoice discount approved",
      description: "Notify when early payout requests are approved.",
    },
    {
      key: "taxFiled",
      label: "Tax filed",
      description: "Confirmation when monthly tax is filed with FBR.",
    },
    {
      key: "lowBalanceAlert",
      label: "Low balance alert",
      description: "Warning when wallet balance drops below Rs. 10,000.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="card-base p-6">
        <h2 className="mb-4 text-base font-semibold text-dark-text">
          Business Profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              defaultValue={merchant.name}
              className="rounded-xl"
              disabled={!canManageSettings}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              defaultValue={merchant.ownerName}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC</Label>
            <Input
              id="cnic"
              defaultValue={merchant.cnic}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              defaultValue={merchant.businessType}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              defaultValue={merchant.address}
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      <section className="card-base p-6">
        <h2 className="mb-4 text-base font-semibold text-dark-text">
          Payment Settings
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jazzCash">Jazz Cash Wallet Number</Label>
            <div className="relative">
              <Input
                id="jazzCash"
                defaultValue={merchant.jazzCashNumber}
                className="rounded-xl pr-10"
                readOnly
              />
              <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-green" />
            </div>
            <p className="text-xs text-primary-green">Verified</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                defaultValue={merchant.bankName}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Input
                id="bankAccount"
                defaultValue={merchant.bankAccount}
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Settlement Frequency</Label>
            <Select
              value={settlementFrequency}
              onValueChange={(v) =>
                setSettlementFrequency(v as SettlementFrequency)
              }
              disabled={!canManageSettings}
            >
              <SelectTrigger className="w-full rounded-xl sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="card-base p-6">
        <h2 className="mb-4 text-base font-semibold text-dark-text">
          Notifications
        </h2>
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-xl border border-light-border p-4"
            >
              <div>
                <p className="label-text text-sm text-dark-text">
                  {item.label}
                </p>
                <p className="description-text text-xs">{item.description}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: checked,
                  }))
                }
                disabled={!canManageSettings}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
