"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { RiderDrawer } from "@/components/partner/riders/rider-drawer";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { usePartnerRiders } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import { normalizePartnerRider } from "@/lib/partner-mock-data";
import type { PartnerRider } from "@/types/partner";

export default function RidersPage() {
  const { data: rawRiders, isLoading, isError, refetch } = usePartnerRiders();
  const riders = React.useMemo(
    () => rawRiders?.map(normalizePartnerRider),
    [rawRiders]
  );
  const [search, setSearch] = React.useState("");
  const [city, setCity] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [selected, setSelected] = React.useState<PartnerRider | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const filtered = riders?.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (city !== "all" && r.city !== city) return false;
    if (status !== "all" && r.status !== status) return false;
    return true;
  });

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-text" />
            <Input placeholder="Search riders..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
          </div>
          <Select value={city} onValueChange={(v) => setCity(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-36"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Can portal="partner" action="manage_riders">
          <Button className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90">
            <Plus className="mr-2 h-4 w-4" /> Add Rider
          </Button>
        </Can>
      </div>

      <div className="card-base overflow-hidden p-0">
        {isLoading ? (
          <Skeleton className="m-4 h-96 rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Rider Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Active Zone</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Pickup From</TableHead>
                  <TableHead>Today&apos;s Collections</TableHead>
                  <TableHead>Total This Month</TableHead>
                  <TableHead>NFC</TableHead>
                  <TableHead>Cash</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((r) => (
                  <TableRow
                    key={r.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelected(r);
                      setDrawerOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell className="text-xs">{r.cnic}</TableCell>
                    <TableCell>{r.city}</TableCell>
                    <TableCell className="max-w-[160px] truncate text-xs">{r.activeZone}</TableCell>
                    <TableCell>
                      {r.completedDeliveriesToday}/{r.deliveriesToday}
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate text-xs">
                      {r.pickupMerchants.join(", ") || "—"}
                    </TableCell>
                    <TableCell><AmountText amount={r.todayCollections} className="text-sm" /></TableCell>
                    <TableCell><AmountText amount={r.totalThisMonth} className="text-sm" /></TableCell>
                    <TableCell>{r.nfcPaymentsCount}</TableCell>
                    <TableCell>{r.cashCollections}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <RiderDrawer rider={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
