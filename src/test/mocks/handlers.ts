import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/admin/analytics/users", () => {
    return HttpResponse.json({
      totalUsers: 4820,
      newSignups: 347,
      churnRate: 3.2,
      activeRate: 68.5,
    });
  }),

  http.get("/api/admin/analytics/revenue", () => {
    return HttpResponse.json({
      totalRevenue: 284500,
      mrr: 38200,
      arpu: 59,
      growthPct: 12.4,
    });
  }),

  http.post("/api/admin/content", async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({ success: true, data }, { status: 201 });
  }),
];
