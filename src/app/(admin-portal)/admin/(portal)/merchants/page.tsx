"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AddMerchantModal } from "@/admin-portal/components/merchants/add-merchant-modal";
import { ReassignPartnerModal } from "@/admin-portal/components/merchants/reassign-partner-modal";
import { SuspendMerchantModal } from "@/admin-portal/components/merchants/suspend-merchant-modal";
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
import { useAdminMerchants, useAdminPartners } from "@/admin-portal/hooks/use-admin-entities";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import type { AdminMerchant } from "@/admin-portal/types/entities";

export default function AdminMerchantsPage() {
  const { data: merchants, isLoading, isError, refetch } = useAdminMerchants();
  const { data: partners } = useAdminPartners();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [partnerFilter, setPartnerFilter] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [reassignTarget, setReassignTarget] = React.useState<AdminMerchant | null>(null);
  const [suspendTarget, setSuspendTarget] = React.useState<AdminMerchant | null>(null);

  const filtered = merchants?.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (status !== "all" && m.status !== status) return false;
    if (partnerFilter !== "all" && m.partnerId !== partnerFilter) return false;
    return true;
  });

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative sm:w-56">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-text" />
          <Input placeholder="Search merchants..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
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
        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="w-full rounded-xl sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
          </SelectContent>
        </Select>
        </div>
        <Can portal="admin" action="manage_merchants">
          <Button
            className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Merchant
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
                  <TableHead>Merchant Name</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Volume This Month</TableHead>
                  <TableHead>Pending Settlement</TableHead>
                  <TableHead>Riders</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell className="max-w-[140px] truncate text-xs">{m.partnerName}</TableCell>
                    <TableCell>{m.city}</TableCell>
                    <TableCell>{m.category}</TableCell>
                    <TableCell><AmountText amount={m.volumeThisMonth} className="text-sm" /></TableCell>
                    <TableCell><AmountText amount={m.pendingSettlement} className="text-sm" /></TableCell>
                    <TableCell>{m.activeRiders}</TableCell>
                    <TableCell><StatusBadge status={m.riskLevel} /></TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/merchants/${m.id}`} className="text-sm font-medium text-rider-blue hover:underline">View</Link>
                        <Can portal="admin" action="manage_merchants">
                          <button type="button" className="text-sm font-medium text-medium-text hover:underline" onClick={() => setReassignTarget(m)}>Reassign</button>
                          {m.status === "Active" && (
                            <button type="button" className="text-sm font-medium text-rider-red hover:underline" onClick={() => setSuspendTarget(m)}>Suspend</button>
                          )}
                        </Can>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AddMerchantModal open={addOpen} onOpenChange={setAddOpen} />
      <ReassignPartnerModal merchant={reassignTarget} open={!!reassignTarget} onOpenChange={(o) => !o && setReassignTarget(null)} />
      <SuspendMerchantModal merchant={suspendTarget} open={!!suspendTarget} onOpenChange={(o) => !o && setSuspendTarget(null)} />
    </div>
  );
}
