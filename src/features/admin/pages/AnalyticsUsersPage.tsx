import {
  Users, UserPlus, UserMinus, Activity,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Label,
  BarChart, Bar,
  LineChart, Line,
} from "recharts";

import { StatCard } from "@/components/ui/admin/StatCard";
import { ChartCard, type ChartStyle } from "../components/ChartCard";
import {
  usersKPIs, userGrowthData, planDistribution,
  ageDemographics,
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

function renderDonutLabel(total: number) {
  return (props: any) => {
    const { viewBox } = props;
    const cx = viewBox?.cx ?? 0;
    const cy = viewBox?.cy ?? 0;
    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
        <tspan x={cx} dy="-6" className="fill-foreground text-lg font-bold">
          {total.toLocaleString("en-IN")}
        </tspan>
        <tspan x={cx} dy="18" className="fill-muted-foreground text-[10px]">
          total
        </tspan>
      </text>
    );
  };
}

/* ── Plan badge ──────────────────────────────── */


/* ── Switchable chart renderer ────────────────── */

function SignupsChart({ style }: { style: ChartStyle }) {
  const sharedMargin = { top: 4, right: 4, left: -20, bottom: 0 };
  const xProps = { dataKey: "month", tick: { fontSize: 10, fill: "var(--muted-foreground)" }, axisLine: false, tickLine: false } as const;
  const yProps = { tick: { fontSize: 10, fill: "var(--muted-foreground)" }, axisLine: false, tickLine: false } as const;

  if (style === "bar") {
    return (
      <BarChart data={userGrowthData} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} cursor={false} />
        <Bar dataKey="signups" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Signups" barSize={24} />
      </BarChart>
    );
  }

  if (style === "line") {
    return (
      <LineChart data={userGrowthData} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Line type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} name="Signups" />
      </LineChart>
    );
  }

  // Default: area
  return (
    <AreaChart data={userGrowthData} margin={sharedMargin}>
      <defs>
        <linearGradient id="gradSignups" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      <XAxis {...xProps} />
      <YAxis {...yProps} />
      <Tooltip content={<ChartTip />} />
      <Area type="monotone" dataKey="signups" stroke="#3b82f6" strokeWidth={2} fill="url(#gradSignups)" name="Signups" />
    </AreaChart>
  );
}

/* ══════════════════════════════════════════════════
   Analytics – Users Page
   Layout:  KPIs → full-width growth chart
            3-col: donut | age bar | recent signups
   ══════════════════════════════════════════════════ */

export function AnalyticsUsersPage() {
  const total = planDistribution.reduce((s, p) => s + p.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          User Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          User growth, demographics, and plan distribution.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={usersKPIs.totalUsers} color="text-blue-500 bg-blue-500/10" />
        <StatCard icon={UserPlus} label="New Signups" value={usersKPIs.newSignups} change="+12%" color="text-emerald-500 bg-emerald-500/10" />
        <StatCard icon={UserMinus} label="Churn Rate" value={usersKPIs.churnRate} change="-0.4%" color="text-red-500 bg-red-500/10" />
        <StatCard icon={Activity} label="Active Rate" value={usersKPIs.activeRate} change="+2.1%" color="text-violet-500 bg-violet-500/10" />
      </div>

      {/* Full-width growth chart — switchable */}
      <ChartCard
        title="Signups Overview"
        subtitle="New user registrations over time"
        chartStyles={["area", "bar", "line"]}
        defaultStyle="area"
      >
        {(style) => (
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <SignupsChart style={style} />
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      {/* 2-column row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Plan Distribution — donut */}
        <ChartCard title="Plan Distribution" controls={false}>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  <Label content={renderDonutLabel(total)} position="center" />
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-2">
            {planDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-[11px] text-muted-foreground">{d.name}</span>
                <span className="text-[11px] font-semibold text-foreground">
                  {Math.round((d.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Age Demographics — horizontal bar */}
        <ChartCard title="Age Demographics" controls={false}>
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDemographics} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="range" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={48} />
                <Tooltip content={<ChartTip />} cursor={false} />
                <Bar dataKey="count" fill="#7c3aed" radius={[0, 6, 6, 0]} name="Users" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
