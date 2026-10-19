"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteTeamMember, useUpdateTeamRole } from "@/admin-portal/hooks/use-admin-ops";
import { getAdminRoleLabel } from "@/admin-portal/lib/auth";
import type { AdminRole } from "@/admin-portal/types";
import type { TeamMember } from "@/admin-portal/types/ops";

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
  const invite = useInviteTeamMember();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<AdminRole>("ops");

  function handleSubmit() {
    invite.mutate(
      { name, email, role },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setRole("ops");
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" placeholder="Sara Ahmed" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" placeholder="sara@riderpay.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole((v ?? "ops") as AdminRole)}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="ops">Ops</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-medium-text">
            An invite email with a temporary password will be sent automatically.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            disabled={!name || !email || invite.isPending}
            onClick={handleSubmit}
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditRoleModalProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoleModal({ member, open, onOpenChange }: EditRoleModalProps) {
  const updateRole = useUpdateTeamRole();
  const [role, setRole] = React.useState<AdminRole>("ops");

  React.useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role — {member.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-medium-text">{member.email}</p>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole((v ?? "ops") as AdminRole)}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="ops">Ops</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-medium-text">
            Current role: {getAdminRoleLabel(member.role)}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            disabled={updateRole.isPending}
            onClick={() =>
              updateRole.mutate(
                { id: member.id, role },
                { onSuccess: () => onOpenChange(false) }
              )
            }
          >
            Save Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
