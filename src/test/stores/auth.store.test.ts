import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/stores/auth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });
  });

  it("should start with default state", () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.user).toBeNull();
  });

  describe("setUser", () => {
    it("should set the user and mark as authenticated", () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "user" as const,
        subscription: "free" as const,
      };

      useAuthStore.getState().setUser(mockUser);
      const state = useAuthStore.getState();

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("should handle null user (logout)", () => {
      useAuthStore.getState().setUser(null);
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("setLoading", () => {
    it("should update loading state", () => {
      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);

      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
    });
  });

  describe("logout", () => {
    it("should clear user and reset state", () => {
      // First set a user
      useAuthStore.getState().setUser({
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "admin",
        subscription: "premium",
      });

      // Then logout
      useAuthStore.getState().logout();
      const state = useAuthStore.getState();

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });
});
