import { Clock, Timer, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "@/components/ui/admin/StatCard";
import { ChartCard, type ChartStyle } from "../components/ChartCard";
import {
  deviceBreakdown,
  engagementKPIs,
  peakViewingHours,
  topContent,
  watchHoursOverTime,
} from "../data/mockAnalytics";

/* ── Chart tooltip ────────────────────────────── */

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((e: any) => (
        <p key={e.name} style={{ color: e.color ?? e.fill }}>
          {e.name}: {e.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

/* ── Donut center label ───────────────────────── */

function renderDonutLabel(props: any) {
  const { viewBox } = props;
  const cx = viewBox?.cx ?? 0;
  const cy = viewBox?.cy ?? 0;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-6" className="fill-foreground text-lg font-bold">
        100%
      </tspan>
      <tspan x={cx} dy="18" className="fill-muted-foreground text-[10px]">
        devices
      </tspan>
    </text>
  );
}

/* ── Completion rate bar ─────────────────────── */

function CompletionBar({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${rate}%`,
            backgroundColor: rate >= 70 ? "#10b981" : rate >= 50 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
      <span className="text-xs text-foreground font-medium">{rate}%</span>
    </div>
  );
}

/* ── Switchable watch hours chart ─────────────── */

function WatchHoursChart({ style }: { style: ChartStyle }) {
  const sharedMargin = { top: 4, right: 4, left: -10, bottom: 0 };
  const xProps = {
    dataKey: "week",
    tick: { fontSize: 10, fill: "var(--muted-foreground)" },
    axisLine: false,
    tickLine: false,
  } as const;
  const yProps = {
    tick: { fontSize: 10, fill: "var(--muted-foreground)" },
    axisLine: false,
    tickLine: false,
    tickFormatter: (v: number) => `${(v / 1000).toFixed(0)}k`,
  } as const;

  if (style === "bar") {
    return (
      <BarChart data={watchHoursOverTime} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} cursor={false} />
        <Bar dataKey="hours" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Hours" barSize={20} />
      </BarChart>
    );
  }

  if (style === "line") {
    return (
      <LineChart data={watchHoursOverTime} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={{ r: 3, fill: "#7c3aed" }}
          name="Hours"
        />
      </LineChart>
    );
  }

  return (
    <AreaChart data={watchHoursOverTime} margin={sharedMargin}>
      <defs>
        <linearGradient id="gradWatch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      <XAxis {...xProps} />
      <YAxis {...yProps} />
      <Tooltip content={<ChartTip />} />
      <Area
        type="monotone"
        dataKey="hours"
        stroke="#7c3aed"
        strokeWidth={2}
        fill="url(#gradWatch)"
        name="Hours"
      />
    </AreaChart>
  );
}

/* ── Switchable peak viewing hours chart ──────── */

function PeakHoursChart({ style }: { style: ChartStyle }) {
  const sharedMargin = { top: 4, right: 4, left: -10, bottom: 0 };
  const xProps = {
    dataKey: "hour",
    tick: { fontSize: 9, fill: "var(--muted-foreground)" },
    axisLine: false,
    tickLine: false,
  } as const;
  const yProps = {
    tick: { fontSize: 10, fill: "var(--muted-foreground)" },
    axisLine: false,
    tickLine: false,
  } as const;

  if (style === "area") {
    return (
      <AreaChart data={peakViewingHours} margin={sharedMargin}>
        <defs>
          <linearGradient id="gradPeak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Area
          type="monotone"
          dataKey="viewers"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#gradPeak)"
          name="Viewers"
        />
      </AreaChart>
    );
  }

  if (style === "line") {
    return (
      <LineChart data={peakViewingHours} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Line
          type="monotone"
          dataKey="viewers"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3, fill: "#3b82f6" }}
          name="Viewers"
        />
      </LineChart>
    );
  }

  return (
    <BarChart data={peakViewingHours} margin={sharedMargin}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis {...xProps} />
      <YAxis {...yProps} />
      <Tooltip content={<ChartTip />} cursor={false} />
      <Bar dataKey="viewers" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Viewers" barSize={18} />
    </BarChart>
  );
}

/* ══════════════════════════════════════════════════
   Analytics – Engagement Page
   Layout:  KPIs
            3/5 + 2/5: watch hours | device donut
            2-col: peak hours | top content
   ══════════════════════════════════════════════════ */

export function AnalyticsEngagementPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Engagement Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Watch time, content performance, and viewing patterns.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Total Watch Hours"
          value={engagementKPIs.totalWatchHours}
          color="text-blue-500 bg-blue-500/10"
        />
        <StatCard
          icon={Timer}
          label="Avg Session"
          value={engagementKPIs.avgSessionMin}
          change="+3 min"
          color="text-emerald-500 bg-emerald-500/10"
        />
        <StatCard
          icon={Users}
          label="Peak Concurrent"
          value={engagementKPIs.peakConcurrent}
          change="+18%"
          color="text-violet-500 bg-violet-500/10"
        />
        <StatCard
          icon={TrendingUp}
          label="Completion Rate"
          value={engagementKPIs.completionRate}
          change="+2.5%"
          color="text-amber-500 bg-amber-500/10"
        />
      </div>

      {/* Watch hours (wide) | Device donut (narrow) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <ChartCard
          title="Watch Hours Overview"
          subtitle="Streaming hours per week"
          className="xl:col-span-3"
          chartStyles={["area", "bar", "line"]}
          defaultStyle="area"
        >
          {(style) => (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <WatchHoursChart style={style} />
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Device Breakdown" controls={false} className="xl:col-span-2">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  <Label content={renderDonutLabel} position="center" />
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {deviceBreakdown.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-[11px] text-muted-foreground">{d.name}</span>
                <span className="text-[11px] font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Peak hours | Top content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard
          title="Peak Viewing Hours"
          subtitle="Viewer distribution across the day"
          chartStyles={["bar", "area", "line"]}
          defaultStyle="bar"
        >
          {(style) => (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PeakHoursChart style={style} />
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Top Content" subtitle="Most watched titles">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Genre
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Views
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Completion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topContent.map((c) => (
                  <tr key={c.title}>
                    <td className="py-2.5">
                      <span className="font-medium text-foreground block">{c.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {c.watchHours.toLocaleString("en-IN")} hrs
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{c.genre}</td>
                    <td className="py-2.5 text-foreground">{c.views.toLocaleString("en-IN")}</td>
                    <td className="py-2.5">
                      <CompletionBar rate={c.completionRate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
