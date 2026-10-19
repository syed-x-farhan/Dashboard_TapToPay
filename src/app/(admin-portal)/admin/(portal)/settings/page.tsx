"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminSettings,
  useSaveNotificationSettings,
  useSavePlatformSettings,
  useTestIntegration,
} from "@/admin-portal/hooks/use-admin-ops";
import { FeeConfigurationSection } from "@/admin-portal/components/settings/fee-configuration-section";
import { QueryError } from "@/components/shared/query-error";
import { useAdminRole } from "@/admin-portal/hooks/use-admin-session";
import { can } from "@/admin-portal/lib/rbac";
import { StatusBadge } from "@/components/shared/status-badge";
import type { NotificationSettings, PlatformSettings } from "@/admin-portal/types/ops";

const NOTIFICATION_ITEMS: { key: keyof NotificationSettings; label: string; description: string }[] = [
  { key: "newPartnerApplication", label: "New Partner Application", description: "When a partner submits signup for approval" },
  { key: "discountRequestPending", label: "Discount Request Pending", description: "When a new invoice discount request arrives" },
  { key: "settlementFailed", label: "Settlement Failed", description: "When Jazz Cash settlement fails" },
  { key: "fbrFilingDue", label: "FBR Filing Due", description: "Reminder before monthly tax filing deadline" },
  { key: "riskAlertTriggered", label: "Risk Alert Triggered", description: "When automatic risk rules flag an entity" },
];

export default function AdminSettingsPage() {
  const { data, isLoading, isError, refetch } = useAdminSettings();
  const savePlatform = useSavePlatformSettings();
  const saveNotifications = useSaveNotificationSettings();
  const testIntegration = useTestIntegration();
  const role = useAdminRole();

  const canEditSettings = role ? can(role, "manage_settings") : false;
  const canEditFees = role ? can(role, "change_fee_rates") : false;
  const canTestIntegrations = role ? can(role, "test_integrations") : false;

  const [platform, setPlatform] = React.useState<PlatformSettings | null>(null);
  const [notifications, setNotifications] = React.useState<NotificationSettings | null>(null);

  React.useEffect(() => {
    if (data) {
      setPlatform(data.platform);
      setNotifications(data.notifications);
    }
  }, [data]);

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading || !platform || !notifications) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {!canEditSettings && (
        <div className="rounded-xl border border-rider-amber/30 bg-amber-50/50 px-4 py-3 text-sm text-rider-amber">
          Your role has read-only access to settings. Contact a Super Admin to make changes.
        </div>
      )}

      <section className="card-base p-6">
        <h2 className="mb-4 font-semibold text-dark-text">Platform Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Platform Name</Label>
            <Input
              value={platform.platformName}
              onChange={(e) => setPlatform({ ...platform, platformName: e.target.value })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input
              value={platform.supportEmail}
              onChange={(e) => setPlatform({ ...platform, supportEmail: e.target.value })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Default Settlement Frequency</Label>
            <Select
              value={platform.settlementFrequency ?? "Daily"}
              onValueChange={(v) =>
                setPlatform({ ...platform, settlementFrequency: v as PlatformSettings["settlementFrequency"] })
              }
              disabled={!canEditSettings}
            >
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Min Transaction (PKR)</Label>
            <Input
              type="number"
              value={platform.minTransactionAmount}
              onChange={(e) => setPlatform({ ...platform, minTransactionAmount: Number(e.target.value) })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Transaction (PKR)</Label>
            <Input
              type="number"
              value={platform.maxTransactionAmount}
              onChange={(e) => setPlatform({ ...platform, maxTransactionAmount: Number(e.target.value) })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Discount Fee — Low Risk (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={platform.discountFeeLow}
              onChange={(e) => setPlatform({ ...platform, discountFeeLow: Number(e.target.value) })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Discount Fee — Medium Risk (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={platform.discountFeeMedium}
              onChange={(e) => setPlatform({ ...platform, discountFeeMedium: Number(e.target.value) })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Discount Fee — High Risk (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={platform.discountFeeHigh}
              onChange={(e) => setPlatform({ ...platform, discountFeeHigh: Number(e.target.value) })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
        </div>
        {canEditSettings && (
          <Button
            className="mt-4 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            disabled={savePlatform.isPending}
            onClick={() => savePlatform.mutate(platform)}
          >
            Save Platform Settings
          </Button>
        )}
      </section>

      <FeeConfigurationSection canEditFees={canEditFees} />

      <section className="card-base p-6">
        <h2 className="mb-4 font-semibold text-dark-text">Notification Settings</h2>
        <div className="space-y-3">
          {NOTIFICATION_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 rounded-xl border border-light-border p-4"
            >
              <div>
                <p className="text-sm font-medium text-dark-text">{item.label}</p>
                <p className="text-xs text-medium-text">{item.description}</p>
              </div>
              <Switch
                checked={Boolean(notifications[item.key])}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, [item.key]: checked })
                }
                disabled={!canEditSettings}
              />
            </div>
          ))}
          <div className="space-y-2 pt-2">
            <Label>Slack Webhook URL</Label>
            <Input
              value={notifications.slackWebhookUrl}
              onChange={(e) => setNotifications({ ...notifications, slackWebhookUrl: e.target.value })}
              className="rounded-xl font-mono text-sm"
              disabled={!canEditSettings}
            />
          </div>
          <div className="space-y-2">
            <Label>Critical Alert Emails</Label>
            <Input
              value={notifications.criticalAlertEmails}
              onChange={(e) => setNotifications({ ...notifications, criticalAlertEmails: e.target.value })}
              className="rounded-xl"
              disabled={!canEditSettings}
            />
          </div>
        </div>
        {canEditSettings && (
          <Button
            className="mt-4 rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            disabled={saveNotifications.isPending}
            onClick={() => saveNotifications.mutate(notifications)}
          >
            Save Notifications
          </Button>
        )}
      </section>

      <section className="card-base p-6">
        <h2 className="mb-4 font-semibold text-dark-text">Integrations</h2>
        <div className="space-y-3">
          {data?.integrations.map((integration) => (
            <div
              key={integration.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-light-border p-4"
            >
              <div>
                <p className="font-medium text-dark-text">{integration.name}</p>
                <p className="mt-0.5 font-mono text-xs text-medium-text">{integration.credentialMasked}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={integration.status === "Connected" ? "Active" : "Failed"} />
                {canTestIntegrations && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    disabled={testIntegration.isPending}
                    onClick={() => testIntegration.mutate(integration.id)}
                  >
                    Test Connection
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {!canTestIntegrations && (
          <p className="mt-3 text-xs text-medium-text">Integration testing requires Super Admin access.</p>
        )}
      </section>
    </div>
  );
}
