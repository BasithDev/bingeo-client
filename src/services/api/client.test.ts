import { describe, it, expect, vi, beforeEach } from "vitest";

// We need to test the ApiClient class directly, so let's import the module
// and mock fetch globally
describe("ApiClient (apiClient)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should be importable", async () => {
    const mod = await import("./client");
    expect(mod.apiClient).toBeDefined();
  });

  describe("GET requests", () => {
    it("should make a GET request with correct options", async () => {
      const mockData = { id: 1, name: "test" };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        }),
      );

      const { apiClient } = await import("./client");
      const result = await apiClient.get("/test");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({ method: "GET", credentials: "include" }),
      );
      expect(result).toEqual(mockData);
    });
  });

  describe("POST requests", () => {
    it("should make a POST request with body", async () => {
      const mockData = { success: true };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        }),
      );

      const { apiClient } = await import("./client");
      const payload = { email: "test@example.com" };
      const result = await apiClient.post("/login", payload);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
        }),
      );
      expect(result).toEqual(mockData);
    });

    it("should handle POST without body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.post("/logout");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/logout"),
        expect.objectContaining({
          method: "POST",
          body: undefined,
        }),
      );
    });
  });

  describe("PUT requests", () => {
    it("should make a PUT request", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ updated: true }),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.put("/user/1", { name: "Updated" });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/user/1"),
        expect.objectContaining({ method: "PUT" }),
      );
    });

    it("should handle PUT without body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.put("/user/1/activate");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/user/1/activate"),
        expect.objectContaining({ method: "PUT", body: undefined }),
      );
    });
  });

  describe("PATCH requests", () => {
    it("should make a PATCH request", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ patched: true }),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.patch("/user/1", { name: "Patched" });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/user/1"),
        expect.objectContaining({ method: "PATCH" }),
      );
    });

    it("should handle PATCH without body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.patch("/user/1/verify");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/user/1/verify"),
        expect.objectContaining({ method: "PATCH", body: undefined }),
      );
    });
  });

  describe("DELETE requests", () => {
    it("should make a DELETE request", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ deleted: true }),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.delete("/user/1");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/user/1"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("error handling", () => {
    it("should throw on non-ok response", async () => {
      const mockError = { message: "Not found", code: "NOT_FOUND", status: 404 };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: () => Promise.resolve(mockError),
        }),
      );

      const { apiClient } = await import("./client");
      await expect(apiClient.get("/missing")).rejects.toEqual(mockError);
    });

    it("should handle non-JSON error responses", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: () => Promise.reject(new Error("not json")),
        }),
      );

      const { apiClient } = await import("./client");
      await expect(apiClient.get("/error")).rejects.toEqual({
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        status: 500,
      });
    });
  });

  describe("204 No Content", () => {
    it("should handle 204 responses", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
        }),
      );

      const { apiClient } = await import("./client");
      const result = await apiClient.delete("/user/1");
      expect(result).toEqual({});
    });
  });

  describe("absolute URLs", () => {
    it("should use absolute URLs directly without prepending baseUrl", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );

      const { apiClient } = await import("./client");
      await apiClient.get("https://external.api.com/data");

      expect(fetch).toHaveBeenCalledWith(
        "https://external.api.com/data",
        expect.any(Object),
      );
    });
  });
});
