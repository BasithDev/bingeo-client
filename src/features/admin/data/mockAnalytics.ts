/* ══════════════════════════════════════════════════
   Mock analytics data for admin dashboards.
   Backend contracts:
     GET /api/admin/analytics/users
     GET /api/admin/analytics/revenue
     GET /api/admin/analytics/engagement
   ══════════════════════════════════════════════════ */

/* ── Users Analytics ──────────────────────────── */

export const usersKPIs = {
  totalUsers: 4820,
  newSignups: 347,
  churnRate: 3.2,
  activeRate: 68.5,
};

export const userGrowthData = [
  { month: "Jan", signups: 280 },
  { month: "Feb", signups: 310 },
  { month: "Mar", signups: 295 },
  { month: "Apr", signups: 360 },
  { month: "May", signups: 410 },
  { month: "Jun", signups: 385 },
  { month: "Jul", signups: 440 },
  { month: "Aug", signups: 470 },
  { month: "Sep", signups: 425 },
  { month: "Oct", signups: 390 },
  { month: "Nov", signups: 415 },
  { month: "Dec", signups: 347 },
];

export const planDistribution = [
  { name: "Free", value: 2100, fill: "#94a3b8" },
  { name: "Basic", value: 1620, fill: "#3b82f6" },
  { name: "Premium", value: 1100, fill: "#7c3aed" },
];

export const ageDemographics = [
  { range: "18–24", count: 1450 },
  { range: "25–34", count: 1680 },
  { range: "35–44", count: 1020 },
  { range: "45+", count: 670 },
];

export const recentSignups = [
  {
    name: "Ananya Sharma",
    email: "ananya.sharma@gmail.com",
    plan: "premium" as const,
    joinedAt: "2025-12-28T10:30:00Z",
  },
  {
    name: "Vikram Rao",
    email: "vikram.rao@gmail.com",
    plan: "basic" as const,
    joinedAt: "2025-12-27T14:15:00Z",
  },
  {
    name: "Priya Nair",
    email: "priya.nair@gmail.com",
    plan: "free" as const,
    joinedAt: "2025-12-27T09:45:00Z",
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    plan: "basic" as const,
    joinedAt: "2025-12-26T18:20:00Z",
  },
  {
    name: "Diya Kapoor",
    email: "diya.kapoor@gmail.com",
    plan: "premium" as const,
    joinedAt: "2025-12-26T11:00:00Z",
  },
];

/* ── Revenue Analytics ────────────────────────── */

export const revenueKPIs = {
  totalRevenue: 2_84_500,
  mrr: 38_200,
  arpu: 59,
  growthPct: 12.4,
};

export const revenueOverTime = [
  { month: "Jan", revenue: 24800 },
  { month: "Feb", revenue: 26200 },
  { month: "Mar", revenue: 25600 },
  { month: "Apr", revenue: 28900 },
  { month: "May", revenue: 31400 },
  { month: "Jun", revenue: 30100 },
  { month: "Jul", revenue: 33500 },
  { month: "Aug", revenue: 35200 },
  { month: "Sep", revenue: 34000 },
  { month: "Oct", revenue: 36100 },
  { month: "Nov", revenue: 37800 },
  { month: "Dec", revenue: 38200 },
];

export const revenueByPlan = [
  { month: "Jan", basic: 8400, premium: 16400 },
  { month: "Feb", basic: 8900, premium: 17300 },
  { month: "Mar", basic: 8600, premium: 17000 },
  { month: "Apr", basic: 9800, premium: 19100 },
  { month: "May", basic: 10600, premium: 20800 },
  { month: "Jun", basic: 10200, premium: 19900 },
  { month: "Jul", basic: 11300, premium: 22200 },
  { month: "Aug", basic: 11900, premium: 23300 },
  { month: "Sep", basic: 11500, premium: 22500 },
  { month: "Oct", basic: 12200, premium: 23900 },
  { month: "Nov", basic: 12800, premium: 25000 },
  { month: "Dec", basic: 12900, premium: 25300 },
];

export const subscriptionFunnel = [
  { stage: "Free Users", count: 2100 },
  { stage: "Upgraded to Basic", count: 480 },
  { stage: "Upgraded to Premium", count: 195 },
];

export const recentTransactions = [
  { user: "Myra Verma", amount: 499, plan: "Premium", method: "UPI", date: "2025-12-28T10:30:00Z" },
  { user: "Rohan Joshi", amount: 199, plan: "Basic", method: "Card", date: "2025-12-28T09:15:00Z" },
  { user: "Kavya Iyer", amount: 499, plan: "Premium", method: "UPI", date: "2025-12-27T18:42:00Z" },
  {
    user: "Aditya Singh",
    amount: 199,
    plan: "Basic",
    method: "Net Banking",
    date: "2025-12-27T14:20:00Z",
  },
  {
    user: "Sneha Patel",
    amount: 499,
    plan: "Premium",
    method: "Card",
    date: "2025-12-26T22:05:00Z",
  },
];

/* ── Engagement Analytics ─────────────────────── */

export const engagementKPIs = {
  totalWatchHours: 148_320,
  avgSessionMin: 42,
  peakConcurrent: 1240,
  completionRate: 67.3,
};

export const watchHoursOverTime = [
  { week: "W1", hours: 10200 },
  { week: "W2", hours: 11400 },
  { week: "W3", hours: 10800 },
  { week: "W4", hours: 12100 },
  { week: "W5", hours: 13500 },
  { week: "W6", hours: 12900 },
  { week: "W7", hours: 14200 },
  { week: "W8", hours: 13800 },
  { week: "W9", hours: 12600 },
  { week: "W10", hours: 11900 },
  { week: "W11", hours: 13100 },
  { week: "W12", hours: 11800 },
];

export const peakViewingHours = [
  { hour: "6AM", viewers: 120 },
  { hour: "8AM", viewers: 340 },
  { hour: "10AM", viewers: 280 },
  { hour: "12PM", viewers: 410 },
  { hour: "2PM", viewers: 360 },
  { hour: "4PM", viewers: 450 },
  { hour: "6PM", viewers: 680 },
  { hour: "8PM", viewers: 1120 },
  { hour: "9PM", viewers: 1240 },
  { hour: "10PM", viewers: 980 },
  { hour: "11PM", viewers: 620 },
  { hour: "12AM", viewers: 310 },
];

export const topContent = [
  {
    title: "The Night Train",
    genre: "Thriller",
    views: 12400,
    watchHours: 8200,
    completionRate: 78,
  },
  { title: "Love in Mumbai", genre: "Romance", views: 10800, watchHours: 6900, completionRate: 72 },
  { title: "Code Red", genre: "Action", views: 9600, watchHours: 7100, completionRate: 81 },
  {
    title: "Whispers of Kerala",
    genre: "Drama",
    views: 8900,
    watchHours: 5800,
    completionRate: 65,
  },
  { title: "Comedy Nights", genre: "Comedy", views: 8200, watchHours: 4600, completionRate: 58 },
];

export const deviceBreakdown = [
  { name: "Mobile", value: 52, fill: "#3b82f6" },
  { name: "Desktop", value: 22, fill: "#7c3aed" },
  { name: "Smart TV", value: 18, fill: "#10b981" },
  { name: "Tablet", value: 8, fill: "#f59e0b" },
];
