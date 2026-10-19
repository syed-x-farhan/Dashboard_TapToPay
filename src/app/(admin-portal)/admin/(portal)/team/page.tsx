"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";
import { EditRoleModal, InviteMemberModal } from "@/admin-portal/components/team/team-modals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useDeactivateTeamMember, useTeamData } from "@/admin-portal/hooks/use-admin-ops";
import { QueryError } from "@/components/shared/query-error";
import { useAdminRole } from "@/admin-portal/hooks/use-admin-session";
import { getAdminRoleLabel } from "@/admin-portal/lib/auth";
import { can } from "@/admin-portal/lib/rbac";
import { StatusBadge } from "@/components/shared/status-badge";
import type { TeamMember } from "@/admin-portal/types/ops";

const ROLE_BADGE: Record<string, string> = {
  super_admin: "bg-red-50 text-rider-red border-rider-red/20",
  admin: "bg-blue-50 text-rider-blue border-rider-blue/20",
  ops: "bg-green-50 text-primary-green border-primary-green/20",
};

export default function AdminTeamPage() {
  const { data, isLoading, isError, refetch } = useTeamData();
  const deactivate = useDeactivateTeamMember();
  const role = useAdminRole();
  const canManageTeam = role ? can(role, "manage_team") : false;

  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<TeamMember | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [adminFilter, setAdminFilter] = React.useState("all");

  const filteredLog = React.useMemo(() => {
    if (!data?.activityLog) return [];
    if (adminFilter === "all") return data.activityLog;
    return data.activityLog.filter((e) => e.adminName === adminFilter);
  }, [data?.activityLog, adminFilter]);

  const adminNames = React.useMemo(
    () => Array.from(new Set(data?.activityLog.map((e) => e.adminName) ?? [])),
    [data?.activityLog]
  );

  if (isError) return <QueryError refetch={refetch} />;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-dark-text">Team Members</h2>
          <p className="text-xs text-medium-text">
            Super Admin manages roles. Admin and Ops have limited permissions.
          </p>
        </div>
        {canManageTeam && (
          <Button
            className="rounded-xl bg-primary-green text-white hover:bg-primary-green/90"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="mr-1.5 h-4 w-4" />
            Invite Team Member
          </Button>
        )}
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                {canManageTeam && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-sm text-medium-text">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-full text-xs ${ROLE_BADGE[member.role]}`}>
                      {getAdminRoleLabel(member.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{member.lastLogin}</TableCell>
                  <TableCell>
                    <StatusBadge status={member.status === "Active" ? "Active" : "Inactive"} />
                  </TableCell>
                  {canManageTeam && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rider-blue"
                          onClick={() => {
                            setEditTarget(member);
                            setEditOpen(true);
                          }}
                        >
                          Edit Role
                        </Button>
                        {member.status === "Active" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rider-red"
                            disabled={deactivate.isPending}
                            onClick={() => deactivate.mutate(member.id)}
                          >
                            Deactivate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="card-base overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-light-border px-5 py-4">
          <h2 className="font-semibold text-dark-text">Activity Log</h2>
          <Select value={adminFilter} onValueChange={(v) => setAdminFilter(v ?? "all")}>
            <SelectTrigger className="h-8 w-44 rounded-xl text-xs"><SelectValue placeholder="Filter by admin" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Admins</SelectItem>
              {adminNames.map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Affected</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.adminName}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell className="text-sm text-medium-text">{entry.entityAffected}</TableCell>
                  <TableCell className="text-sm">{entry.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <InviteMemberModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <EditRoleModal member={editTarget} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
