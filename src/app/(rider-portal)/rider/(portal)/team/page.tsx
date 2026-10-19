"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Plus } from "lucide-react";
import { Can } from "@/components/rbac/can";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmountText } from "@/components/shared/amount-text";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRiderCan } from "@/hooks/use-permission";

const team = [
  { id: "r1", name: "Ahmed Raza", city: "Lahore", deliveries: "48/50", collections: 48200, status: "Active" },
  { id: "r2", name: "Bilal Hassan", city: "Lahore", deliveries: "42/45", collections: 39800, status: "Active" },
  { id: "r3", name: "Hamza Tariq", city: "Lahore", deliveries: "35/40", collections: 28400, status: "Inactive" },
];

export default function RiderTeamPage() {
  const router = useRouter();
  const canViewTeam = useRiderCan("view_team");

  React.useEffect(() => {
    if (!canViewTeam) {
      router.replace("/rider");
    }
  }, [canViewTeam, router]);

  if (!canViewTeam) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-text">Rider Team</h1>
        <Can portal="rider" action="manage_riders">
          <Button className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90">
            <Plus className="mr-2 h-4 w-4" /> Add Rider
          </Button>
        </Can>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Collections</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.city}</TableCell>
                  <TableCell>{r.deliveries}</TableCell>
                  <TableCell><AmountText amount={r.collections} className="text-sm" /></TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
