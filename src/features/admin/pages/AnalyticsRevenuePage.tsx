import { BarChart3, DollarSign, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "@/components/ui/admin/StatCard";
import { ChartCard, type ChartStyle } from "../components/ChartCard";
import {
  recentTransactions,
  revenueByPlan,
  revenueKPIs,
  revenueOverTime,
  subscriptionFunnel,
} from "../data/mockAnalytics";
import { formatCurrency, formatDate } from "../utils/helpers";


interface IChartPayloadEntry {
  name: string;
  value: number;
  color?: string;
  fill?: string;
}

interface IChartTipProps {
  active?: boolean;
  payload?: IChartPayloadEntry[];
  label?: string;
}

function ChartTip({ active, payload, label }: IChartTipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((e) => (
        <p key={e.name} style={{ color: e.color ?? e.fill }}>
          {e.name}: {formatCurrency(e.value)}
        </p>
      ))}
    </div>
  );
}


const funnelColors = ["#94a3b8", "#3b82f6", "#7c3aed"];


const xProps = {
  dataKey: "month",
  tick: { fontSize: 10, fill: "var(--muted-foreground)" },
  axisLine: false,
  tickLine: false,
} as const;
const yProps = {
  tick: { fontSize: 10, fill: "var(--muted-foreground)" },
  axisLine: false,
  tickLine: false,
  tickFormatter: (v: number) => `₹${(v / 1000).toFixed(0)}k`,
} as const;
const sharedMargin = { top: 4, right: 4, left: -10, bottom: 0 };


function RevenueChart({ style }: { style: ChartStyle }) {
  if (style === "bar") {
    return (
      <BarChart data={revenueOverTime} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} cursor={false} />
        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" barSize={24} />
      </BarChart>
    );
  }

  if (style === "line") {
    return (
      <LineChart data={revenueOverTime} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3, fill: "#10b981" }}
          name="Revenue"
        />
      </LineChart>
    );
  }

  return (
    <AreaChart data={revenueOverTime} margin={sharedMargin}>
      <defs>
        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      <XAxis {...xProps} />
      <YAxis {...yProps} />
      <Tooltip content={<ChartTip />} />
      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#10b981"
        strokeWidth={2}
        fill="url(#gradRevenue)"
        name="Revenue"
      />
    </AreaChart>
  );
}


function RevenueByPlanChart({ style }: { style: ChartStyle }) {
  if (style === "area") {
    return (
      <AreaChart data={revenueByPlan} margin={sharedMargin}>
        <defs>
          <linearGradient id="gradBasicRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradPremRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Area
          type="monotone"
          dataKey="basic"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#gradBasicRev)"
          name="Basic"
        />
        <Area
          type="monotone"
          dataKey="premium"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#gradPremRev)"
          name="Premium"
        />
      </AreaChart>
    );
  }

  if (style === "line") {
    return (
      <LineChart data={revenueByPlan} margin={sharedMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis {...xProps} />
        <YAxis {...yProps} />
        <Tooltip content={<ChartTip />} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="basic"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 3, fill: "#3b82f6" }}
          name="Basic"
        />
        <Line
          type="monotone"
          dataKey="premium"
          stroke="#7c3aed"
          strokeWidth={2}
          dot={{ r: 3, fill: "#7c3aed" }}
          name="Premium"
        />
      </LineChart>
    );
  }

  return (
    <BarChart data={revenueByPlan} margin={sharedMargin}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
      <XAxis {...xProps} />
      <YAxis {...yProps} />
      <Tooltip content={<ChartTip />} cursor={false} />
      <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      <Bar dataKey="basic" stackId="rev" fill="#3b82f6" name="Basic" radius={[0, 0, 0, 0]} />
      <Bar dataKey="premium" stackId="rev" fill="#7c3aed" name="Premium" radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}

export function AnalyticsRevenuePage() {
  const funnelMax = subscriptionFunnel[0].count;

  return (
    <div className="space-y-6">
      
      <div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Revenue Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revenue trends, plan breakdown, and subscription conversions.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={revenueKPIs.totalRevenue}
          color="text-emerald-500 bg-emerald-500/10"
        />
        <StatCard
          icon={TrendingUp}
          label="MRR"
          value={revenueKPIs.mrr}
          change="+8.2%"
          color="text-blue-500 bg-blue-500/10"
        />
        <StatCard
          icon={Users}
          label="ARPU"
          value={revenueKPIs.arpu}
          change="+₹4"
          color="text-violet-500 bg-violet-500/10"
        />
        <StatCard
          icon={BarChart3}
          label="Growth"
          value={revenueKPIs.growthPct}
          change="+12.4%"
          color="text-amber-500 bg-amber-500/10"
        />
      </div>

      
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <ChartCard
          title="Revenue Overview"
          subtitle="Total earnings over time"
          className="xl:col-span-3"
          chartStyles={["area", "bar", "line"]}
          defaultStyle="area"
        >
          {(style) => (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RevenueChart style={style} />
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        
        <ChartCard
          title="Subscription Funnel"
          subtitle="Free → paid conversion"
          className="xl:col-span-2"
          controls={false}
        >
          <div className="space-y-5 mt-2">
            {subscriptionFunnel.map((step, i) => {
              const pct = Math.round((step.count / funnelMax) * 100);
              return (
                <div key={step.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground">{step.stage}</span>
                    <span className="text-muted-foreground font-semibold">
                      {step.count.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="h-5 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: funnelColors[i] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-6 text-center">
            {Math.round((subscriptionFunnel[2].count / subscriptionFunnel[0].count) * 100)}% of free
            users convert to Premium
          </p>
        </ChartCard>
      </div>

      
      <ChartCard
        title="Revenue by Plan"
        subtitle="Basic vs Premium contribution per month"
        chartStyles={["bar", "area", "line"]}
        defaultStyle="bar"
      >
        {(style) => (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RevenueByPlanChart style={style} />
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard title="Recent Transactions" subtitle="Latest 5 payments" controls={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">User</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Amount</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Plan</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Method</th>
                <th className="pb-2 text-left text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-medium text-foreground">{t.user}</td>
                  <td className="py-2.5 text-emerald-500 font-semibold">
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="py-2.5 text-foreground">{t.plan}</td>
                  <td className="py-2.5 text-muted-foreground">{t.method}</td>
                  <td className="py-2.5 text-muted-foreground text-xs">{formatDate(t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
