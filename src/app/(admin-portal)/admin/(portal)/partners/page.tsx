"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ApprovePartnerModal } from "@/admin-portal/components/partners/approve-partner-modal";
import { SuspendPartnerModal } from "@/admin-portal/components/partners/suspend-partner-modal";
import { AddPartnerModal } from "@/admin-portal/components/partners/add-partner-modal";
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
import { useAdminPartners } from "@/admin-portal/hooks/use-admin-entities";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";
import type { AdminPartner } from "@/admin-portal/types/entities";

export default function AdminPartnersPage() {
  const { data: partners, isLoading, isError, refetch } = useAdminPartners();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [addOpen, setAddOpen] = React.useState(false);
  const [approveTarget, setApproveTarget] = React.useState<AdminPartner | null>(null);
  const [suspendTarget, setSuspendTarget] = React.useState<AdminPartner | null>(null);

  const filtered = partners?.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (status !== "all" && p.status !== status) return false;
    if (type !== "all" && p.type !== type) return false;
    return true;
  });

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-text" />
            <Input placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(v) => setType(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-44"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Food Delivery">Food Delivery</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Direct Restaurant">Direct Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Can portal="admin" action="manage_partners">
          <Button className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Partner
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
                  <TableHead>Partner Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Merchants</TableHead>
                  <TableHead>Riders</TableHead>
                  <TableHead>Monthly Volume</TableHead>
                  <TableHead>Fee Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.type}</TableCell>
                    <TableCell>{p.city}</TableCell>
                    <TableCell>{p.totalMerchants}</TableCell>
                    <TableCell>{p.totalRiders}</TableCell>
                    <TableCell><AmountText amount={p.monthlyVolume} className="text-sm" /></TableCell>
                    <TableCell>{p.feeRate}%</TableCell>
                    <TableCell><StatusBadge status={p.status === "Pending Approval" ? "Pending" : p.status} /></TableCell>
                    <TableCell className="text-xs text-medium-text">{p.joinedDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/partners/${p.id}`} className="text-sm font-medium text-rider-blue hover:underline">View</Link>
                        <Can portal="admin" action="manage_partners">
                          {p.status === "Pending Approval" && (
                            <button type="button" className="text-sm font-medium text-primary-green hover:underline" onClick={() => setApproveTarget(p)}>Approve</button>
                          )}
                          {p.status === "Active" && (
                            <button type="button" className="text-sm font-medium text-rider-red hover:underline" onClick={() => setSuspendTarget(p)}>Suspend</button>
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

      <AddPartnerModal open={addOpen} onOpenChange={setAddOpen} />
      <ApprovePartnerModal partner={approveTarget} open={!!approveTarget} onOpenChange={(o) => !o && setApproveTarget(null)} />
      <SuspendPartnerModal partner={suspendTarget} open={!!suspendTarget} onOpenChange={(o) => !o && setSuspendTarget(null)} />
    </div>
  );
}
