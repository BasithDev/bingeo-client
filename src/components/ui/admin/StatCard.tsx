import NumberFlow from "@number-flow/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export interface IStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  change?: string;
  color?: string;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, change, color, className }: IStatCardProps) {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5",
        "transition-shadow duration-200 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", color)}>
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <NumberFlow
          value={value}
          className="text-2xl font-bold text-foreground"
          format={{ useGrouping: true }}
        />
        {change && (
          <span
            className={cn(
              "text-xs font-semibold",
              isPositive && "text-emerald-500",
              isNegative && "text-red-500",
              !isPositive && !isNegative && "text-muted-foreground",
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
