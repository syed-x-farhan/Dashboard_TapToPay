"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AddMerchantModal } from "@/components/partner/merchants/add-merchant-modal";
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
import { usePartnerMerchants } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";

export default function MerchantsPage() {
  const { data: merchants, isLoading, isError, refetch } = usePartnerMerchants();
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [city, setCity] = React.useState("all");
  const [modalOpen, setModalOpen] = React.useState(false);

  const filtered = merchants?.filter((m) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (status !== "all" && m.status !== status) return false;
    if (city !== "all" && m.city !== city) return false;
    return true;
  });

  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="space-y-4">
      <div className="card-base flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-medium-text" />
            <Input placeholder="Search merchants..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-xl pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
            <SelectTrigger className="w-full rounded-xl sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
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
        </div>
        <Can portal="partner" action="manage_merchants">
          <Button className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90" onClick={() => setModalOpen(true)}>
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
                  <TableHead>City</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Volume This Month</TableHead>
                  <TableHead>Pending Settlement</TableHead>
                  <TableHead>Active Riders</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.city}</TableCell>
                    <TableCell>{m.category}</TableCell>
                    <TableCell><AmountText amount={m.volumeThisMonth} className="text-sm" /></TableCell>
                    <TableCell><AmountText amount={m.pendingSettlement} className="text-sm" /></TableCell>
                    <TableCell>{m.activeRiders}</TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                    <TableCell className="text-right">
                      <Link href={`/partner/merchants/${m.id}`} className="text-sm font-medium text-rider-blue hover:underline">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AddMerchantModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
