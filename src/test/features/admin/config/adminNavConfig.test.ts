import { describe, expect, it } from "vitest";
import { adminNavConfig } from "@/features/admin/config/adminNavConfig";

describe("adminNavConfig", () => {
  it("should be a non-empty array", () => {
    expect(adminNavConfig).toBeInstanceOf(Array);
    expect(adminNavConfig.length).toBeGreaterThan(0);
  });

  it("should include Dashboard as a top-level item", () => {
    const dashboard = adminNavConfig.find((nav) => nav.title === "Dashboard");
    expect(dashboard).toBeDefined();
    expect(dashboard?.path).toBe("/admin/dashboard");
  });

  it("should include Plans with children", () => {
    const plans = adminNavConfig.find((nav) => nav.title === "Plans");
    expect(plans).toBeDefined();
    expect(plans?.children).toBeDefined();
    expect(plans?.children?.length).toBeGreaterThanOrEqual(2);
  });

  it("should include Content section with Upload, Drafts, Manage", () => {
    const content = adminNavConfig.find((nav) => nav.title === "Content");
    expect(content).toBeDefined();
    expect(content?.children).toBeDefined();

    const titles = content?.children?.map((c) => c.title);
    expect(titles).toContain("Upload");
    expect(titles).toContain("Drafts");
    expect(titles).toContain("Manage");
  });

  it("should include Users as a standalone item", () => {
    const users = adminNavConfig.find((nav) => nav.title === "Users");
    expect(users).toBeDefined();
    expect(users?.path).toBe("/admin/users");
  });

  it("should include Analytics with child routes", () => {
    const analytics = adminNavConfig.find((nav) => nav.title === "Analytics");
    expect(analytics).toBeDefined();
    expect(analytics?.children).toBeDefined();

    const titles = analytics?.children?.map((c) => c.title);
    expect(titles).toContain("Users");
    expect(titles).toContain("Revenue");
    expect(titles).toContain("Engagement");
  });

  it("should include Settings with children", () => {
    const settings = adminNavConfig.find((nav) => nav.title === "Settings");
    expect(settings).toBeDefined();
    expect(settings?.children).toBeDefined();

    const titles = settings?.children?.map((c) => c.title);
    expect(titles).toContain("General");
    expect(titles).toContain("Appearance");
  });

  it("all items should have icons", () => {
    for (const item of adminNavConfig) {
      expect(item.icon).toBeDefined();
    }
  });

  it("all child items should have paths", () => {
    for (const item of adminNavConfig) {
      if (item.children) {
        for (const child of item.children) {
          expect(child.path).toBeDefined();
          expect(child.path.startsWith("/admin/")).toBe(true);
        }
      }
    }
  });

  it("all paths should start with /admin/", () => {
    for (const item of adminNavConfig) {
      if (item.path) {
        expect(item.path.startsWith("/admin/")).toBe(true);
      }
      if (item.children) {
        for (const child of item.children) {
          expect(child.path.startsWith("/admin/")).toBe(true);
        }
      }
    }
  });
});
