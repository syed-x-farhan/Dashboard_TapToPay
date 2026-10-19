import Link from "next/link";
import { cn } from "@/lib/utils";

export function DemoAccountsLink({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-xs text-medium-text", className)}>
      <Link
        href="/demo-accounts"
        className="font-semibold text-dark-text underline decoration-primary-green/40 underline-offset-4 transition-colors hover:text-primary-green hover:decoration-primary-green"
      >
        View demo accounts
      </Link>
    </p>
  );
}
