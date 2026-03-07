import { describe, expect, it } from "vitest";
import { apiConfig } from "@/services/config/api.config";

describe("apiConfig", () => {
  it("should have a valid baseUrl", () => {
    expect(apiConfig.baseUrl).toBeDefined();
    expect(typeof apiConfig.baseUrl).toBe("string");
  });

  describe("identity endpoints", () => {
    it("should have all required identity endpoints", () => {
      const { identity } = apiConfig.endpoints;
      // base points to the identity service root (no prefix — single service in dev)
      expect(identity.base).toBeDefined();
      expect(identity.login).toContain("/auth/login");
      expect(identity.register).toContain("/auth/register");
      expect(identity.logout).toContain("/auth/logout");
      expect(identity.refresh).toContain("/auth/refresh");
      expect(identity.me).toContain("/auth/me");
    });

    it("all identity endpoint URLs should start with baseUrl", () => {
      const { identity } = apiConfig.endpoints;
      for (const url of Object.values(identity)) {
        expect(url).toContain(apiConfig.baseUrl);
      }
    });
  });
});
