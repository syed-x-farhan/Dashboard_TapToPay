import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/format";

interface AmountTextProps {
  amount: number | null | undefined;
  variant?: "default" | "positive" | "negative" | "pending";
  className?: string;
  prefix?: string;
}

const variantClasses = {
  default: "text-dark-text",
  positive: "text-primary-green",
  negative: "text-rider-red",
  pending: "text-rider-amber",
};

export function AmountText({
  amount,
  variant = "default",
  className,
  prefix,
}: AmountTextProps) {
  return (
    <span className={cn("amount", variantClasses[variant], className)}>
      {prefix}
      {formatPKR(amount)}
    </span>
  );
}
