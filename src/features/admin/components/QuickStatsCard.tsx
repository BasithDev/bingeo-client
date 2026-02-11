import { useMemo } from "react";
import { Play, UserMinus, UserPlus } from "lucide-react";
import { cn } from "@/utils/cn";
import type { AdminUser } from "../types/admin.types";

interface QuickStatsCardProps {
  users: AdminUser[];
}

export function QuickStatsCard({ users }: QuickStatsCardProps) {
  const quickStats = useMemo(() => [
    {
      icon: Play,
      label: "Avg Watch Hours",
      value: `${Math.round(users.reduce((s, u) => s + u.totalWatchHours, 0) / users.length)}h`,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      icon: UserMinus,
      label: "Blocked Users",
      value: String(users.filter((u) => u.isBlocked).length),
      color: "text-red-500 bg-red-500/10",
    },
    {
      icon: UserPlus,
      label: "New This Month",
      value: String(
        users.filter(
          (u) =>
            new Date(u.joinedAt) >=
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        ).length,
      ),
      color: "text-violet-500 bg-violet-500/10",
    },
  ], [users]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3
        className="text-sm font-semibold text-foreground mb-3"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Quick Stats
      </h3>
      <div className="space-y-2.5">
        {quickStats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <span className="text-sm font-bold text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
