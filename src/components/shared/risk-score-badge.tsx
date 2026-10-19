import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { RiskScore } from "@/types/partner";

const styles: Record<RiskScore, string> = {
  Low: "bg-green-50 text-primary-green border-primary-green/20",
  Medium: "bg-amber-50 text-rider-amber border-rider-amber/20",
  High: "bg-red-50 text-rider-red border-rider-red/20",
};

export function RiskScoreBadge({ score }: { score: RiskScore }) {
  return (
    <Badge variant="outline" className={cn("rounded-full text-xs font-medium", styles[score])}>
      {score}
    </Badge>
  );
}
