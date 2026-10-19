"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { AdminRiderDrawer } from "@/admin-portal/components/riders/admin-rider-drawer";
import { FlagRiderModal } from "@/admin-portal/components/riders/flag-rider-modal";
import { ReassignRiderModal } from "@/admin-portal/components/riders/reassign-rider-modal";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
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
import { useAdminRiders, useAdminPartners, useSuspendRider } from "@/admin-portal/hooks/use-admin-entities";
import { QueryError } from "@/components/shared/query-error";
import type { AdminRider } from "@/admin-portal/types/entities";

export default function AdminRidersPage() {
  const { data: riders, isLoading, isError, refetch } = useAdminRiders();
  const { data: partners } = useAdminPartners();
  const suspend = useSuspendRider();
  const [search, setSearch] = React.useState("");
  const [city, setCity] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [partnerFilter, setPartnerFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<AdminRider | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [flagTarget, setFlagTarget] = React.useState<AdminRider | null>(null);
  const [reassignTarget, setReassignTarget] = React.useState<AdminRider | null>(null);

  const filtered = riders?.filter((r) => {
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (city !== "all" && r.city !== city) return false;
    if (status !== "all" && r.status !== status) return false;
    if (partnerFilter !== "all" && r.partnerId !== partnerFilter) return false;
    return true;
  });

  function openDrawer(rider: AdminRider) {
    setSelected(rider);
    setDrawerOpen(true);
  }

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative sm:w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-text" />
          <Input placeholder="Search riders..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
        </div>
        <Select value={partnerFilter} onValueChange={(v) => setPartnerFilter(v ?? "all")}>
          <SelectTrigger className="w-full rounded-xl sm:w-52"><SelectValue placeholder="Partner" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            {partners?.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="card-base overflow-hidden p-0">
        {isLoading ? (
          <Skeleton className="m-4 h-96 rounded-xl" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Rider Name</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Active Zone</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Today</TableHead>
                  <TableHead>This Month</TableHead>
                  <TableHead>Flagged</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => openDrawer(r)}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="max-w-[130px] truncate text-xs">{r.partnerName}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>{r.city}</TableCell>
                    <TableCell className="max-w-[140px] truncate text-xs">{r.activeZone}</TableCell>
                    <TableCell>{r.completedDeliveriesToday}/{r.deliveriesToday}</TableCell>
                    <TableCell><AmountText amount={r.todayCollections} className="text-sm" /></TableCell>
                    <TableCell><AmountText amount={r.totalThisMonth} className="text-sm" /></TableCell>
                    <TableCell>{r.flagged ? <span className="text-xs font-medium text-rider-red">Yes</span> : "—"}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AdminRiderDrawer
        rider={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onFlag={(r) => { setDrawerOpen(false); setFlagTarget(r); }}
        onSuspend={(r) => { suspend.mutate(r.id); setDrawerOpen(false); }}
        onReassign={(r) => { setDrawerOpen(false); setReassignTarget(r); }}
      />
      <FlagRiderModal rider={flagTarget} open={!!flagTarget} onOpenChange={(o) => !o && setFlagTarget(null)} />
      <ReassignRiderModal rider={reassignTarget} open={!!reassignTarget} onOpenChange={(o) => !o && setReassignTarget(null)} />
    </div>
  );
}
