import { describe, it, expect } from "vitest";
import { adminLoginSchema } from "./loginSchema";

describe("adminLoginSchema", () => {
  it("should validate correct login data", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@bingeo.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty email", () => {
    const result = adminLoginSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid email format", () => {
    const result = adminLoginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@bingeo.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject password shorter than 6 characters", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@bingeo.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("should accept password exactly 6 characters", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@bingeo.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing fields entirely", () => {
    const result = adminLoginSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should reject missing email field", () => {
    const result = adminLoginSchema.safeParse({
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing password field", () => {
    const result = adminLoginSchema.safeParse({
      email: "admin@bingeo.com",
    });
    expect(result.success).toBe(false);
  });
});
