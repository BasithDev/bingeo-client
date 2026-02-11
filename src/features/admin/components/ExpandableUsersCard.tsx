import { useState, useRef, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Users, Crown, CreditCard, UserX, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface ExpandableUsersCardProps {
  stats: { total: number; premium: number; basic: number; free: number };
}

export function ExpandableUsersCard({ stats }: ExpandableUsersCardProps) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, stats]);

  const previousTotal = 45; // mock: last month's total
  const growthPct = Math.round(((stats.total - previousTotal) / previousTotal) * 100);

  const breakdown = [
    { label: "Premium", value: stats.premium, change: "+13%", icon: Crown, textColor: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Basic", value: stats.basic, change: "+6%", icon: CreditCard, textColor: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Free", value: stats.free, change: "+7%", icon: UserX, textColor: "text-slate-400", bg: "bg-slate-400/10" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full p-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Users className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-muted-foreground">Total Users</p>
            <NumberFlow
              value={stats.total}
              className="text-xl font-bold text-foreground"
              format={{ useGrouping: true }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-semibold text-emerald-500">↑ {growthPct}%</span>
            <p className="text-[10px] text-muted-foreground">vs last month ({previousTotal} → {stats.total})</p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded: horizontal plan cards */}
      <div
        className="transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: expanded ? `${contentHeight}px` : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-4 pb-4">
          <div className="border-t border-border pt-3">
            <div className="grid grid-cols-3 gap-2">
              {breakdown.map((item) => (
                <div key={item.label} className="rounded-xl bg-muted/50 p-2.5">
                  {/* Icon + label */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={cn("flex h-6 w-6 items-center justify-center rounded-lg", item.bg, item.textColor)}>
                      <item.icon className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  {/* Count + change — below the label */}
                  <div className="flex items-center gap-1.5 pl-8">
                    <NumberFlow value={item.value} className="text-lg font-bold text-foreground" />
                    <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
