import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Completed: "bg-green-50 text-primary-green border-primary-green/20",
  Approved: "bg-green-50 text-primary-green border-primary-green/20",
  "Paid Out": "bg-green-50 text-primary-green border-primary-green/20",
  Filed: "bg-green-50 text-primary-green border-primary-green/20",
  Active: "bg-green-50 text-primary-green border-primary-green/20",
  Pending: "bg-amber-50 text-rider-amber border-rider-amber/20",
  "Pending Approval": "bg-amber-50 text-rider-amber border-rider-amber/20",
  Processing: "bg-amber-50 text-rider-amber border-rider-amber/20",
  Failed: "bg-red-50 text-rider-red border-rider-red/20",
  Rejected: "bg-red-50 text-rider-red border-rider-red/20",
  Suspended: "bg-red-50 text-rider-red border-rider-red/20",
  Inactive: "bg-gray-50 text-medium-text border-gray-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-gray-50 text-medium-text",
        className
      )}
    >
      {status}
    </Badge>
  );
}
