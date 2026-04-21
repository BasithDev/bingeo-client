import { beforeEach, describe, expect, it, vi } from "vitest";

const logoutMock = vi.fn();

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
    logoutMock.mockClear();
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

      
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) }) 
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(mockData) }); 

      vi.stubGlobal("fetch", fetchMock);

      const result = await apiClient.get("/protected");

      expect(fetchMock).toHaveBeenCalledTimes(3);
      
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("/protected"),
        expect.anything(),
      );
      
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("/identity/auth/refresh"),
        expect.anything(),
      );
      
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("/protected"),
        expect.anything(),
      );

      expect(result).toEqual(mockData);
    });

    it("should logout if refresh fails", async () => {
      const { apiClient } = await import("@/services/api/client");

      
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) }) 
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) }) 
        .mockResolvedValue({
          ok: false,
          status: 401,
          json: () =>
            Promise.resolve({ message: "Unauthorized", code: "UNAUTHORIZED", status: 401 }),
        });

      vi.stubGlobal("fetch", fetchMock);

      await expect(apiClient.get("/protected")).rejects.toThrow();

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(logoutMock).toHaveBeenCalled();
      expect(window.location.href).toBe("/admin/login");
    });

    it("should allow concurrent requests to share a single refresh", async () => {
      const { apiClient } = await import("@/services/api/client");

      const fetchMock = vi
        .fn()
        
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) })
        
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({}) })
        
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({}) })
        
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) })
        
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ id: 2 }) });

      vi.stubGlobal("fetch", fetchMock);

      const [res1, res2] = await Promise.all([apiClient.get("/data/1"), apiClient.get("/data/2")]);

      
      expect(fetchMock).toHaveBeenCalledTimes(5);

      
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
