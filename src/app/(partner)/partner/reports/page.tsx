"use client";

import * as React from "react";
import { FileBarChart, Store, Landmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { usePartnerSettings } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";

const reports = [
  { id: "settlement", title: "Monthly Settlement Report", description: "Complete breakdown of all settlements, fees, and taxes for any month.", icon: FileBarChart },
  { id: "merchant", title: "Merchant Performance Report", description: "Volume, growth, and payment method breakdown per merchant.", icon: Store },
  { id: "tax", title: "Tax Filing Report", description: "FBR-ready tax summary for the selected period.", icon: Landmark },
];

export default function ReportsPage() {
  const { data: settings, isLoading, isError, refetch } = usePartnerSettings();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeReport, setActiveReport] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [format, setFormat] = React.useState("PDF");

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.id} className="card-base p-5">
              <Icon className="mb-3 h-5 w-5 text-medium-text" strokeWidth={1.5} />
              <h3 className="font-semibold text-dark-text">{r.title}</h3>
              <p className="mt-2 text-sm text-medium-text">{r.description}</p>
              <Button
                className="mt-4 rounded-xl bg-sidebar text-white hover:bg-sidebar/90"
                onClick={() => { setActiveReport(r.title); setModalOpen(true); }}
              >
                Generate Report
              </Button>
            </div>
          );
        })}
      </div>

      <div className="card-base p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-dark-text">Scheduled Reports</h3>
          <Button variant="outline" size="sm" className="rounded-xl">Add New Schedule</Button>
        </div>
        <div className="space-y-2">
          {settings?.scheduledReports.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-light-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-medium-text">{r.frequency} · {r.format} · {r.recipient}</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Generate {activeReport}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label className="mb-2 block">Date Range</Label><DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} /></div>
            <div>
              <Label className="mb-2 block">Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v ?? "PDF")}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary-green text-white" onClick={() => setModalOpen(false)}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
