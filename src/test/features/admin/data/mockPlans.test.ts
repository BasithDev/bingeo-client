import { describe, expect, it } from "vitest";
import { mockPlans } from "@/features/admin/data/mockPlans";

describe("mockPlans", () => {
  it("should have 3 plans", () => {
    expect(mockPlans).toHaveLength(3);
  });

  it("should include Free, Basic, and Premium plans", () => {
    const names = mockPlans.map((p) => p.name);
    expect(names).toContain("Free");
    expect(names).toContain("Basic");
    expect(names).toContain("Premium");
  });

  it("each plan should have required fields", () => {
    for (const plan of mockPlans) {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(typeof plan.price).toBe("number");
      expect(plan.billingCycle).toBeDefined();
      expect(typeof plan.maxStreams).toBe("number");
      expect(plan.maxQuality).toBeDefined();
      expect(plan.contentAccess).toBeDefined();
      expect(plan.features).toBeInstanceOf(Array);
      expect(typeof plan.isActive).toBe("boolean");
      expect(typeof plan.subscriberCount).toBe("number");
      expect(plan.color).toBeDefined();
    }
  });

  it("should have unique IDs", () => {
    const ids = mockPlans.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("Free plan should have price 0", () => {
    const free = mockPlans.find((p) => p.name === "Free");
    expect(free?.price).toBe(0);
  });

  it("plans should have increasing prices", () => {
    const prices = mockPlans.map((p) => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  it("plans should have increasing max streams", () => {
    const streams = mockPlans.map((p) => p.maxStreams);
    for (let i = 1; i < streams.length; i++) {
      expect(streams[i]).toBeGreaterThanOrEqual(streams[i - 1]);
    }
  });

  it("all plans should be active", () => {
    for (const plan of mockPlans) {
      expect(plan.isActive).toBe(true);
    }
  });

  it("each plan should have at least one feature", () => {
    for (const plan of mockPlans) {
      expect(plan.features.length).toBeGreaterThan(0);
    }
  });

  it("colors should be valid hex values", () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    for (const plan of mockPlans) {
      expect(hexRegex.test(plan.color)).toBe(true);
    }
  });
});
