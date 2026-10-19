"use client";

import * as React from "react";
import { Copy, Eye, EyeOff, RefreshCw, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Can } from "@/components/rbac/can";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { usePartnerSettings } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";

function MaskedKey({ value }: { value: string }) {
  const [revealed, setRevealed] = React.useState(false);
  const display = revealed ? value : value.replace(/(?<=rp_(live|test)_).+/g, "••••••••••••••••");

  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 rounded-lg bg-content px-3 py-2 font-mono text-xs">{display}</code>
      <Button variant="ghost" size="icon-sm" onClick={() => setRevealed(!revealed)}>
        {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => navigator.clipboard.writeText(value)}>
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm"><RefreshCw className="h-4 w-4" /></Button>
    </div>
  );
}

export default function ApiWebhooksPage() {
  const { data: settings, isLoading, isError, refetch } = usePartnerSettings();
  const [webhookOpen, setWebhookOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-6">
      <div className="card-base p-5">
        <h3 className="mb-4 font-semibold text-dark-text">API Keys</h3>
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm">Live API Key</Label>
            <MaskedKey value={settings?.apiKeys.live ?? ""} />
          </div>
          <div>
            <Label className="mb-2 block text-sm">Test API Key</Label>
            <MaskedKey value={settings?.apiKeys.test ?? ""} />
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4">
          <h3 className="font-semibold text-dark-text">Webhooks</h3>
          <Can portal="partner" action="manage_webhooks">
            <Button size="sm" className="rounded-xl bg-primary-green text-white" onClick={() => setWebhookOpen(true)}>
              Add Webhook
            </Button>
          </Can>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Event Type</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Triggered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings?.webhooks.map((wh) => (
              <TableRow key={wh.id}>
                <TableCell>{wh.eventType}</TableCell>
                <TableCell className="max-w-[200px] truncate font-mono text-xs">{wh.url}</TableCell>
                <TableCell><StatusBadge status={wh.status} /></TableCell>
                <TableCell className="text-medium-text">{wh.lastTriggered}</TableCell>
                <TableCell className="text-right">
                  <Can portal="partner" action="manage_webhooks">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Can>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="card-base p-5">
        <h3 className="mb-2 font-semibold text-dark-text">API Documentation</h3>
        <p className="mb-4 text-sm text-medium-text">Integrate RiderPay with your existing systems.</p>
        <Button variant="outline" className="rounded-xl">
          <ExternalLink className="mr-2 h-4 w-4" /> View Full API Docs
        </Button>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-sidebar p-4 text-xs text-gray-300">{`{
  "event": "payment.completed",
  "merchant_id": "m1",
  "order_id": "ORD-4521",
  "amount": 4200,
  "currency": "PKR",
  "timestamp": "2025-06-27T14:32:00Z"
}`}</pre>
      </div>

      <Dialog open={webhookOpen} onOpenChange={setWebhookOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Add Webhook</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Event Type</Label>
              <Select defaultValue="Payment Completed">
                <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Payment Completed">Payment Completed</SelectItem>
                  <SelectItem value="Settlement Processed">Settlement Processed</SelectItem>
                  <SelectItem value="Invoice Discount Approved">Invoice Discount Approved</SelectItem>
                  <SelectItem value="Merchant Added">Merchant Added</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Webhook URL</Label><Input placeholder="https://api.example.com/webhook" className="mt-1 rounded-xl" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookOpen(false)}>Cancel</Button>
            <Button className="bg-primary-green text-white" onClick={() => setWebhookOpen(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
