import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthFormHeaderProps {
  title: string;
  description: React.ReactNode;
  badge?: string;
  className?: string;
}

export function AuthFormHeader({
  title,
  description,
  badge = "Merchant Portal",
  className,
}: AuthFormHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <span className="inline-flex items-center rounded-full border border-primary-green/20 bg-primary-green/[0.06] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary-green">
        {badge}
      </span>
      <h2 className="mt-4 text-[1.65rem] font-bold leading-tight tracking-tight text-dark-text">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-medium-text">
        {description}
      </p>
    </div>
  );
}

interface AuthFormLinkProps {
  href: string;
  children: React.ReactNode;
}

export function AuthFormLink({ href, children }: AuthFormLinkProps) {
  return (
    <Link
      href={href}
      className="font-semibold text-dark-text underline decoration-primary-green/40 underline-offset-4 transition-colors hover:text-primary-green hover:decoration-primary-green"
    >
      {children}
    </Link>
  );
}
