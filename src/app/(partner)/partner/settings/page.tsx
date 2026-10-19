"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { usePartnerSettings } from "@/hooks/use-partner-data";
import { QueryError } from "@/components/shared/query-error";
import { Can } from "@/components/rbac/can";

export default function PartnerSettingsPage() {
  const { data: settings, isLoading, isError, refetch } = usePartnerSettings();
  const p = settings?.partner;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (isError) return <QueryError refetch={refetch} />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="card-base p-6">
        <h2 className="mb-4 font-semibold text-dark-text">Company Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Company Name</Label><Input defaultValue={p?.name} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Contact Person</Label><Input defaultValue={p?.contactPerson} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Work Email</Label><Input defaultValue={p?.contactEmail} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue={p?.phone} className="rounded-xl" /></div>
          <div className="space-y-2"><Label>Company Type</Label><Input defaultValue={p?.companyType} className="rounded-xl" readOnly /></div>
          <div className="space-y-2"><Label>NTN Number</Label><Input defaultValue={p?.ntn} className="rounded-xl" /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Registered Address</Label><Input defaultValue={p?.address} className="rounded-xl" /></div>
        </div>
      </section>

      <section className="card-base p-6">
        <h2 className="mb-4 font-semibold text-dark-text">Branding</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload Logo</Label>
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-light-border bg-content text-sm text-medium-text">
              Click to upload logo (shown in sidebar)
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Primary Color</Label><Input type="color" defaultValue="#00C896" className="h-10 rounded-xl" /></div>
            <div className="space-y-2"><Label>Company Display Name</Label><Input defaultValue="Leopards Courier" className="rounded-xl" /></div>
          </div>
        </div>
      </section>

      <section className="card-base p-6">
        <h2 className="mb-4 font-semibold text-dark-text">Settlement Preferences</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Default Settlement Frequency</Label>
            <Select defaultValue="Daily">
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Minimum Settlement Amount (PKR)</Label><Input type="number" defaultValue="5000" className="rounded-xl" /></div>
          <div className="space-y-2">
            <Label>Preferred Payout Method</Label>
            <Select defaultValue="Jazz Cash">
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Jazz Cash">Jazz Cash</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="card-base p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-dark-text">Team Members</h2>
          <Can portal="partner" action="manage_settings">
            <Button className="rounded-xl bg-primary-green text-white">Invite Member</Button>
          </Can>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings?.teamMembers.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell className="text-medium-text">{m.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <Can portal="partner" action="manage_settings">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Can>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
