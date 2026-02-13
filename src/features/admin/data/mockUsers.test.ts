import { describe, it, expect } from "vitest";
import { mockUsers } from "./mockUsers";

describe("mockUsers", () => {
  it("should be a non-empty array", () => {
    expect(mockUsers.length).toBeGreaterThan(0);
  });

  it("each user should have required fields", () => {
    for (const user of mockUsers) {
      expect(user.id).toBeDefined();
      expect(user.name).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.phone).toBeDefined();
      expect(typeof user.age).toBe("number");
      expect(user.plan).toBeDefined();
      expect(typeof user.isBlocked).toBe("boolean");
      expect(typeof user.totalPaid).toBe("number");
      expect(typeof user.totalWatchHours).toBe("number");
      expect(user.joinedAt).toBeDefined();
    }
  });

  it("should have unique IDs", () => {
    const ids = mockUsers.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have unique emails", () => {
    const emails = mockUsers.map((u) => u.email);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it("all plans should be valid types", () => {
    const validPlans = ["free", "basic", "premium"];
    for (const user of mockUsers) {
      expect(validPlans).toContain(user.plan);
    }
  });

  it("ages should be reasonable (13-100)", () => {
    for (const user of mockUsers) {
      expect(user.age).toBeGreaterThanOrEqual(13);
      expect(user.age).toBeLessThanOrEqual(100);
    }
  });

  it("totalPaid should be non-negative", () => {
    for (const user of mockUsers) {
      expect(user.totalPaid).toBeGreaterThanOrEqual(0);
    }
  });

  it("totalWatchHours should be non-negative", () => {
    for (const user of mockUsers) {
      expect(user.totalWatchHours).toBeGreaterThanOrEqual(0);
    }
  });

  it("joinedAt should be valid ISO dates", () => {
    for (const user of mockUsers) {
      const date = new Date(user.joinedAt);
      expect(date.getTime()).not.toBeNaN();
    }
  });

  it("emails should contain @", () => {
    for (const user of mockUsers) {
      expect(user.email).toContain("@");
    }
  });

  it("phones should start with +91", () => {
    for (const user of mockUsers) {
      expect(user.phone.startsWith("+91")).toBe(true);
    }
  });
});
