import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "@/features/admin/utils/helpers";

describe("formatDate", () => {
  it("should format ISO date to readable format", () => {
    const result = formatDate("2025-12-20T10:30:00Z");
    // en-IN locale: "20 Dec 2025"
    expect(result).toContain("Dec");
    expect(result).toContain("2025");
    expect(result).toContain("20");
  });

  it("should handle different dates correctly", () => {
    const result = formatDate("2026-01-15T08:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });

  it("should format start-of-year dates", () => {
    const result = formatDate("2026-01-01T00:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });

  it("should format end-of-year dates", () => {
    const result = formatDate("2025-12-31T23:59:59Z");
    // In IST (+5:30), this becomes Jan 1 2026, so check for either year
    expect(result).toMatch(/2025|2026/);
  });
});

describe("formatCurrency", () => {
  it("should return dash for zero amount", () => {
    expect(formatCurrency(0)).toBe("—");
  });

  it("should format positive amounts with ₹ prefix", () => {
    const result = formatCurrency(1999);
    expect(result).toContain("₹");
    expect(result).toContain("1");
    expect(result).toContain("999");
  });

  it("should format large amounts with locale separators", () => {
    const result = formatCurrency(100000);
    expect(result).toContain("₹");
    expect(result).toContain("00");
  });

  it("should handle small amounts", () => {
    const result = formatCurrency(99);
    expect(result).toBe("₹99");
  });

  it("should handle single digit", () => {
    const result = formatCurrency(1);
    expect(result).toBe("₹1");
  });
});
