"use client";

import * as React from "react";
import { Activity, Clock, AlertCircle, Wifi } from "lucide-react";
import { ApiResponseChart } from "@/admin-portal/components/system-health/api-response-chart";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useSystemHealth } from "@/admin-portal/hooks/use-admin-ops";
import { QueryError } from "@/components/shared/query-error";
import type { ServiceStatus } from "@/admin-portal/types/ops";

const SERVICE_COLORS: Record<ServiceStatus, string> = {
  Operational: "bg-primary-green",
  Degraded: "bg-rider-amber",
  Down: "bg-rider-red",
};

export default function AdminSystemHealthPage() {
  const { data, isLoading, isError, refetch } = useSystemHealth();
  const [serviceFilter, setServiceFilter] = React.useState("all");
  const [severityFilter, setSeverityFilter] = React.useState("all");

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  const filteredErrors = data.errorLogs.filter((e) => {
    if (serviceFilter !== "all" && e.service !== serviceFilter) return false;
    if (severityFilter !== "all" && e.severity !== severityFilter) return false;
    return true;
  });

  const services = Array.from(new Set(data.errorLogs.map((e) => e.service)));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="card-base border-l-[3px] border-l-primary-green p-4">
          <p className="text-xs text-medium-text">API Uptime</p>
          <p className="amount mt-1 text-2xl text-primary-green">{data.stats.apiUptime}%</p>
          <Activity className="mt-2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="card-base border-l-[3px] border-l-rider-blue p-4">
          <p className="text-xs text-medium-text">Avg Response Time</p>
          <p className="amount mt-1 text-2xl">{data.stats.avgResponseTimeMs} ms</p>
          <Clock className="mt-2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="card-base border-l-[3px] border-l-rider-amber p-4">
          <p className="text-xs text-medium-text">Failed Requests Today</p>
          <p className="amount mt-1 text-2xl text-rider-amber">{data.stats.failedRequestsToday}</p>
          <AlertCircle className="mt-2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="card-base border-l-[3px] border-l-primary-green p-4">
          <p className="text-xs text-medium-text">Jazz Cash API</p>
          <p className={`amount mt-1 text-lg ${data.stats.jazzCashStatus === "Connected" ? "text-primary-green" : "text-rider-red"}`}>
            {data.stats.jazzCashStatus}
          </p>
          <Wifi className="mt-2 h-4 w-4 text-gray-400" strokeWidth={1.5} />
        </div>
      </div>

      <div className="card-base p-5">
        <h2 className="mb-4 font-semibold text-dark-text">Service Status</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.services.map((svc) => (
            <div key={svc.id} className="rounded-xl border border-light-border p-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${SERVICE_COLORS[svc.status]}`} />
                <span className="text-sm font-medium">{svc.name}</span>
              </div>
              <p className="mt-2 text-xs text-medium-text">{svc.status}</p>
              <p className="mt-1 text-xs text-medium-text">{svc.latencyMs} ms · {svc.lastChecked}</p>
            </div>
          ))}
        </div>
      </div>

      <ApiResponseChart data={data.apiResponseData} />

      <div className="card-base overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-light-border px-5 py-4">
          <h2 className="font-semibold text-dark-text">Error Log</h2>
          <div className="flex gap-2">
            <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v ?? "all")}>
              <SelectTrigger className="h-8 w-40 rounded-xl text-xs"><SelectValue placeholder="Service" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v ?? "all")}>
              <SelectTrigger className="h-8 w-32 rounded-xl text-xs"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Timestamp</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Resolved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.map((err) => (
                <TableRow key={err.id}>
                  <TableCell className="whitespace-nowrap text-xs">{err.timestamp}</TableCell>
                  <TableCell className="text-sm">{err.service}</TableCell>
                  <TableCell className="font-mono text-xs">{err.errorCode}</TableCell>
                  <TableCell className="max-w-[220px] text-sm text-medium-text">{err.message}</TableCell>
                  <TableCell className="text-sm">{err.affectedEntity}</TableCell>
                  <TableCell>
                    <StatusBadge status={err.resolved ? "Completed" : "Failed"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-light-border px-5 py-4">
          <h2 className="font-semibold text-dark-text">Webhook Delivery Log</h2>
          <p className="text-sm text-medium-text">
            Success rate: <span className="amount text-primary-green">{data.webhookSuccessRate}%</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Partner</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.webhooks.map((wh) => (
                <TableRow key={wh.id}>
                  <TableCell className="font-medium">{wh.partnerName}</TableCell>
                  <TableCell className="font-mono text-xs">{wh.event}</TableCell>
                  <TableCell className="text-sm">{wh.timestamp}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={
                        wh.status === "Success"
                          ? "Completed"
                          : wh.status === "Retrying"
                            ? "Processing"
                            : "Failed"
                      }
                    />
                  </TableCell>
                  <TableCell>{wh.attempts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
