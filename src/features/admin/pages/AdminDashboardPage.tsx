import {
  LayoutDashboard,
  Users,
  Film,
  TrendingUp,
} from "lucide-react";

/**
 * Admin Dashboard — placeholder page with stat cards.
 * Will be replaced with real data once APIs are ready.
 */
export function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-blue-500 bg-blue-50" },
    { label: "Active Content", value: "1,024", change: "+3%", icon: Film, color: "text-violet bg-violet/10" },
    { label: "Revenue (MTD)", value: "₹4.2L", change: "+18%", icon: TrendingUp, color: "text-emerald-500 bg-emerald-50" },
    { label: "Active Sessions", value: "2,391", change: "+5%", icon: LayoutDashboard, color: "text-amber-500 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-[18px] w-[18px]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs font-semibold text-emerald-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity placeholder */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-4">
            <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Activity feed will appear here once connected to the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
