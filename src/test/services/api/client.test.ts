import { beforeEach, describe, expect, it, vi } from "vitest";

// Define a stable mock for logout
const logoutMock = vi.fn();

// Mock the auth store module
vi.mock("@/stores/auth.store", () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      logout: logoutMock,
    })),
  },
}));

describe("ApiClient (apiClient)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    logoutMock.mockClear(); // Clear specific mock
    vi.stubGlobal("window", { location: { href: "" } } as unknown as Window);
  });

  it("should be importable", async () => {
    const mod = await import("@/services/api/client");
    expect(mod.apiClient).toBeDefined();
  });

  describe("401 Interceptor", () => {
    it("should refresh token and retry request on 401", async () => {
      const mockData = { success: true };
      const { apiClient } = await import("@/services/api/client");

      // First call returns 401, refresh returns 200, retry returns 200
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) }) // Original 401
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) }) // Refresh success
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(mockData) }); // Retry success

      vi.stubGlobal("fetch", fetchMock);

      const result = await apiClient.get("/protected");

      expect(fetchMock).toHaveBeenCalledTimes(3);
      // 1. Original request
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("/protected"),
        expect.anything(),
      );
      // 2. Refresh request
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("/api/auth/refresh"),
        expect.anything(),
      );
      // 3. Retry request
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("/protected"),
        expect.anything(),
      );

      expect(result).toEqual(mockData);
    });

    it("should logout if refresh fails", async () => {
      const { apiClient } = await import("@/services/api/client");

      // First call 401, refresh also 401
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) }) // Original 401
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) }) // Refresh failed
        .mockResolvedValue({
          ok: false,
          status: 401,
          json: () =>
            Promise.resolve({ message: "Unauthorized", code: "UNAUTHORIZED", status: 401 }),
        }); // Retry (should not happen but just in case)

      vi.stubGlobal("fetch", fetchMock);

      await expect(apiClient.get("/protected")).rejects.toThrow();

      expect(fetchMock).toHaveBeenCalledTimes(2); // Original + Refresh
      expect(logoutMock).toHaveBeenCalled();
      expect(window.location.href).toBe("/admin/login");
    });

    it("should allow concurrent requests to share a single refresh", async () => {
      const { apiClient } = await import("@/services/api/client");

      // Two concurrent requests both get 401
      const fetchMock = vi
        .fn()
        // Req 1 -> 401
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) })
        // Req 2 -> 401
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) })
        // Refresh (only called once!) -> 200
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
        // Req 1 retry -> 200
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) })
        // Req 2 retry -> 200
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: 2 }) });

      vi.stubGlobal("fetch", fetchMock);

      const [res1, res2] = await Promise.all([apiClient.get("/data/1"), apiClient.get("/data/2")]);

      // Count calls: Req1(401) + Req2(401) + Refresh(200) + Retry1(200) + Retry2(200) = 5
      expect(fetchMock).toHaveBeenCalledTimes(5);

      // Verify refresh was only called once
      const refreshCalls = fetchMock.mock.calls.filter((call) => call[0].includes("/auth/refresh"));
      expect(refreshCalls).toHaveLength(1);

      expect(res1).toEqual({ id: 1 });
      expect(res2).toEqual({ id: 2 });
    });

    it("should NOT refresh for auth endpoints to prevent loops", async () => {
      const { apiClient } = await import("@/services/api/client");

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Auth failed", code: "AUTH_FAILED", status: 401 }),
      });

      vi.stubGlobal("fetch", fetchMock);

      await expect(apiClient.post("/auth/login", {})).rejects.toThrow();

      // Should not call refresh
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const refreshCalls = fetchMock.mock.calls.filter((call) => call[0].includes("/auth/refresh"));
      expect(refreshCalls).toHaveLength(0);
    });
  });

  describe("Standard Request Methods", () => {
    it("GET should function correctly", async () => {
      const mockData = { id: 1 };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        }),
      );

      const { apiClient } = await import("@/services/api/client");
      const result = await apiClient.get("/test");
      expect(result).toEqual(mockData);
    });

    it("POST should function correctly", async () => {
      const mockData = { success: true };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        }),
      );

      const { apiClient } = await import("@/services/api/client");
      await apiClient.post("/data", { foo: "bar" });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/data"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ foo: "bar" }),
        }),
      );
    });

    it("PUT should function correctly", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );
      const { apiClient } = await import("@/services/api/client");
      await apiClient.put("/data", {});
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: "PUT" }),
      );
    });

    it("PATCH should function correctly", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );
      const { apiClient } = await import("@/services/api/client");
      await apiClient.patch("/data", {});
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    it("DELETE should function correctly", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );
      const { apiClient } = await import("@/services/api/client");
      await apiClient.delete("/data");
      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should handle 204 No Content", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
        }),
      );
      const { apiClient } = await import("@/services/api/client");
      const result = await apiClient.delete("/data");
      expect(result).toEqual({});
    });
  });
});
