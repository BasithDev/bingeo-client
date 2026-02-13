import { describe, it, expect } from "vitest";
import {
  usersKPIs,
  userGrowthData,
  planDistribution,
  ageDemographics,
  recentSignups,
  revenueKPIs,
  revenueOverTime,
  revenueByPlan,
  subscriptionFunnel,
  recentTransactions,
  engagementKPIs,
  watchHoursOverTime,
  peakViewingHours,
  topContent,
  deviceBreakdown,
} from "./mockAnalytics";

describe("mockAnalytics data", () => {
  /* ── Users Analytics ──────────────────────── */

  describe("usersKPIs", () => {
    it("should have totalUsers, newSignups, churnRate, activeRate", () => {
      expect(typeof usersKPIs.totalUsers).toBe("number");
      expect(typeof usersKPIs.newSignups).toBe("number");
      expect(typeof usersKPIs.churnRate).toBe("number");
      expect(typeof usersKPIs.activeRate).toBe("number");
    });
  });

  describe("userGrowthData", () => {
    it("should have 12 months of data", () => {
      expect(userGrowthData).toHaveLength(12);
    });

    it("each entry should have month and signups", () => {
      for (const entry of userGrowthData) {
        expect(entry.month).toBeDefined();
        expect(typeof entry.signups).toBe("number");
      }
    });
  });

  describe("planDistribution", () => {
    it("should be a non-empty array", () => {
      expect(planDistribution.length).toBeGreaterThan(0);
    });

    it("each entry should have name, value, and fill", () => {
      for (const entry of planDistribution) {
        expect(entry.name).toBeDefined();
        expect(typeof entry.value).toBe("number");
        expect(entry.fill).toBeDefined();
      }
    });
  });

  describe("ageDemographics", () => {
    it("should have 4 age ranges", () => {
      expect(ageDemographics).toHaveLength(4);
    });

    it("each entry should have range and count", () => {
      for (const entry of ageDemographics) {
        expect(entry.range).toBeDefined();
        expect(typeof entry.count).toBe("number");
      }
    });
  });

  describe("recentSignups", () => {
    it("should have 5 recent signups", () => {
      expect(recentSignups).toHaveLength(5);
    });

    it("each entry should have name, email, plan, joinedAt", () => {
      for (const entry of recentSignups) {
        expect(entry.name).toBeDefined();
        expect(entry.email).toContain("@");
        expect(entry.plan).toBeDefined();
        expect(entry.joinedAt).toBeDefined();
      }
    });
  });

  /* ── Revenue Analytics ────────────────────── */

  describe("revenueKPIs", () => {
    it("should have totalRevenue, mrr, arpu, growthPct", () => {
      expect(typeof revenueKPIs.totalRevenue).toBe("number");
      expect(typeof revenueKPIs.mrr).toBe("number");
      expect(typeof revenueKPIs.arpu).toBe("number");
      expect(typeof revenueKPIs.growthPct).toBe("number");
    });
  });

  describe("revenueOverTime", () => {
    it("should have 12 months of data", () => {
      expect(revenueOverTime).toHaveLength(12);
    });

    it("each entry should have month and revenue", () => {
      for (const entry of revenueOverTime) {
        expect(entry.month).toBeDefined();
        expect(typeof entry.revenue).toBe("number");
      }
    });
  });

  describe("revenueByPlan", () => {
    it("should have 12 months of data", () => {
      expect(revenueByPlan).toHaveLength(12);
    });

    it("each entry should have month, basic, and premium", () => {
      for (const entry of revenueByPlan) {
        expect(entry.month).toBeDefined();
        expect(typeof entry.basic).toBe("number");
        expect(typeof entry.premium).toBe("number");
      }
    });
  });

  describe("subscriptionFunnel", () => {
    it("should have 3 funnel stages", () => {
      expect(subscriptionFunnel).toHaveLength(3);
    });

    it("each entry should have stage and count", () => {
      for (const entry of subscriptionFunnel) {
        expect(entry.stage).toBeDefined();
        expect(typeof entry.count).toBe("number");
      }
    });
  });

  describe("recentTransactions", () => {
    it("should have 5 transactions", () => {
      expect(recentTransactions).toHaveLength(5);
    });

    it("each entry should have user, amount, plan, method, date", () => {
      for (const entry of recentTransactions) {
        expect(entry.user).toBeDefined();
        expect(typeof entry.amount).toBe("number");
        expect(entry.plan).toBeDefined();
        expect(entry.method).toBeDefined();
        expect(entry.date).toBeDefined();
      }
    });
  });

  /* ── Engagement Analytics ─────────────────── */

  describe("engagementKPIs", () => {
    it("should have totalWatchHours, avgSessionMin, peakConcurrent, completionRate", () => {
      expect(typeof engagementKPIs.totalWatchHours).toBe("number");
      expect(typeof engagementKPIs.avgSessionMin).toBe("number");
      expect(typeof engagementKPIs.peakConcurrent).toBe("number");
      expect(typeof engagementKPIs.completionRate).toBe("number");
    });
  });

  describe("watchHoursOverTime", () => {
    it("should have 12 weeks of data", () => {
      expect(watchHoursOverTime).toHaveLength(12);
    });

    it("each entry should have week and hours", () => {
      for (const entry of watchHoursOverTime) {
        expect(entry.week).toBeDefined();
        expect(typeof entry.hours).toBe("number");
      }
    });
  });

  describe("peakViewingHours", () => {
    it("should have 12 time slots", () => {
      expect(peakViewingHours).toHaveLength(12);
    });

    it("each entry should have hour and viewers", () => {
      for (const entry of peakViewingHours) {
        expect(entry.hour).toBeDefined();
        expect(typeof entry.viewers).toBe("number");
      }
    });
  });

  describe("topContent", () => {
    it("should have 5 entries", () => {
      expect(topContent).toHaveLength(5);
    });

    it("each entry should have title, genre, views, watchHours, completionRate", () => {
      for (const entry of topContent) {
        expect(entry.title).toBeDefined();
        expect(entry.genre).toBeDefined();
        expect(typeof entry.views).toBe("number");
        expect(typeof entry.watchHours).toBe("number");
        expect(typeof entry.completionRate).toBe("number");
      }
    });

    it("completion rates should be between 0 and 100", () => {
      for (const entry of topContent) {
        expect(entry.completionRate).toBeGreaterThanOrEqual(0);
        expect(entry.completionRate).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("deviceBreakdown", () => {
    it("should have 4 devices", () => {
      expect(deviceBreakdown).toHaveLength(4);
    });

    it("each entry should have name, value, and fill", () => {
      for (const entry of deviceBreakdown) {
        expect(entry.name).toBeDefined();
        expect(typeof entry.value).toBe("number");
        expect(entry.fill).toBeDefined();
      }
    });
  });
});
