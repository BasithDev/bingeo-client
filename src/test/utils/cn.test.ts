import { describe, expect, it } from "vitest";
import { cn } from "@/utils/cn";

describe("cn (class name merger)", () => {
  it("should merge simple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("should resolve tailwind conflicts (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("should handle arrays of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle undefined and null gracefully", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("should merge complex tailwind classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle object syntax from clsx", () => {
    expect(cn({ "font-bold": true, "text-sm": false })).toBe("font-bold");
  });
});
