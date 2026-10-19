import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function PageHeader({
  title,
  viewAllHref,
  viewAllLabel = "View All",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      <h2 className="text-base font-semibold text-dark-text">{title}</h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-rider-blue hover:underline"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
