import NumberFlow from "@number-flow/react";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/utils/cn";

import { mockGrowth, mockGrowthChart } from "../data/mockUsers";

/* ── Growth period types ──────────────────────────── */

type GrowthPeriod = "week" | "month" | "year";

const growthPeriods: { label: string; value: GrowthPeriod }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

/* ── Chart tooltip ────────────────────────────────── */

interface ChartPayloadEntry {
  name: string;
  value: number;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartPayloadEntry[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ── Component ────────────────────────────────────── */

export function UserGrowthCard() {
  const [growthPeriod, setGrowthPeriod] = useState<GrowthPeriod>("month");
  const growth = mockGrowth[growthPeriod];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            User Growth
          </h3>
        </div>
        <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg">
          {growthPeriods.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setGrowthPeriod(p.value)}
              className={cn(
                "px-2 py-1 rounded-md text-[10px] font-medium cursor-pointer",
                "transition-colors duration-150",
                growthPeriod === p.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">+</span>
          <NumberFlow
            value={growth.count}
            className="text-2xl font-bold text-foreground"
            format={{ useGrouping: true }}
          />
          <span className="text-xs font-semibold text-emerald-500">{growth.change}</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">new users this {growthPeriod}</p>
      </div>

      {/* Area Chart */}
      <div className="h-[160px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockGrowthChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBasic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFree" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="premium"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#gradPremium)"
              name="Premium"
            />
            <Area
              type="monotone"
              dataKey="basic"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gradBasic)"
              name="Basic"
            />
            <Area
              type="monotone"
              dataKey="free"
              stroke="#94a3b8"
              strokeWidth={1.5}
              fill="url(#gradFree)"
              name="Free"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
