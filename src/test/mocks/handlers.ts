import { HttpResponse, http } from "msw";

/* ══════════════════════════════════════════════════
   Mock Handlers
   Backend contracts from features/admin/data/mockAnalytics.ts
   ══════════════════════════════════════════════════ */

export const handlers = [
  // Analytics - Users
  http.get("/api/admin/analytics/users", () => {
    return HttpResponse.json({
      totalUsers: 4820,
      newSignups: 347,
      churnRate: 3.2,
      activeRate: 68.5,
    });
  }),

  // Analytics - Revenue
  http.get("/api/admin/analytics/revenue", () => {
    return HttpResponse.json({
      totalRevenue: 284500,
      mrr: 38200,
      arpu: 59,
      growthPct: 12.4,
    });
  }),

  // Content Upload flow (when needed)
  http.post("/api/admin/content", async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ success: true, data }, { status: 201 });
  }),
];
