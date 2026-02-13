import { describe, it, expect } from "vitest";
import { apiConfig } from "./api.config";

describe("apiConfig", () => {
  it("should have a baseUrl", () => {
    expect(apiConfig.baseUrl).toBeDefined();
    expect(typeof apiConfig.baseUrl).toBe("string");
  });

  describe("identity endpoints", () => {
    it("should have all required identity endpoints", () => {
      const { identity } = apiConfig.endpoints;
      expect(identity.base).toContain("/api/identity");
      expect(identity.login).toContain("/auth/login");
      expect(identity.register).toContain("/auth/register");
      expect(identity.logout).toContain("/auth/logout");
      expect(identity.refresh).toContain("/auth/refresh");
      expect(identity.profile).toContain("/users/me");
      expect(identity.devices).toContain("/devices");
    });
  });

  describe("payment endpoints", () => {
    it("should have all required payment endpoints", () => {
      const { payment } = apiConfig.endpoints;
      expect(payment.base).toContain("/api/payment");
      expect(payment.plans).toContain("/plans");
      expect(payment.subscription).toContain("/subscription");
      expect(payment.checkout).toContain("/checkout");
    });
  });

  describe("content endpoints", () => {
    it("should have all required content endpoints", () => {
      const { content } = apiConfig.endpoints;
      expect(content.base).toContain("/api/content");
      expect(content.movies).toContain("/movies");
      expect(content.series).toContain("/series");
      expect(content.categories).toContain("/categories");
      expect(content.search).toContain("/search");
      expect(content.watchlist).toContain("/watchlist");
    });
  });

  describe("streaming endpoints", () => {
    it("should have all required streaming endpoints", () => {
      const { streaming } = apiConfig.endpoints;
      expect(streaming.base).toContain("/api/streaming");
      expect(streaming.playback).toContain("/playback");
      expect(streaming.token).toContain("/token");
      expect(streaming.progress).toContain("/progress");
    });
  });

  it("all endpoints should use the same baseUrl prefix", () => {
    const allEndpoints = [
      ...Object.values(apiConfig.endpoints.identity),
      ...Object.values(apiConfig.endpoints.payment),
      ...Object.values(apiConfig.endpoints.content),
      ...Object.values(apiConfig.endpoints.streaming),
    ];

    for (const url of allEndpoints) {
      expect(url).toContain(apiConfig.baseUrl);
    }
  });
});
