import { beforeEach, describe, expect, it } from "vitest";
import {
  type AdminThemeState,
  useAdminThemeStore,
} from "@/features/admin/stores/admin-theme.store";

describe("useAdminThemeStore", () => {
  beforeEach(() => {
    useAdminThemeStore.setState({ theme: "light" });
  });

  it("should initialize with light theme", () => {
    const state = useAdminThemeStore.getState();
    expect(state.theme).toBe("light");
  });

  it("should set theme to dark", () => {
    useAdminThemeStore.getState().setTheme("dark");
    expect(useAdminThemeStore.getState().theme).toBe("dark");
  });

  it("should set theme to light", () => {
    useAdminThemeStore.getState().setTheme("dark");
    useAdminThemeStore.getState().setTheme("light");
    expect(useAdminThemeStore.getState().theme).toBe("light");
  });

  it("should toggle from light to dark", () => {
    useAdminThemeStore.getState().toggleTheme();
    expect(useAdminThemeStore.getState().theme).toBe("dark");
  });

  it("should toggle from dark to light", () => {
    useAdminThemeStore.setState({ theme: "dark" });
    useAdminThemeStore.getState().toggleTheme();
    expect(useAdminThemeStore.getState().theme).toBe("light");
  });

  it("should toggle back and forth correctly", () => {
    useAdminThemeStore.getState().toggleTheme();
    expect(useAdminThemeStore.getState().theme).toBe("dark");

    useAdminThemeStore.getState().toggleTheme();
    expect(useAdminThemeStore.getState().theme).toBe("light");
  });

  it("should not set DOM attributes directly (AdminLayout handles that)", () => {
    useAdminThemeStore.getState().setTheme("dark");
    expect(useAdminThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-admin-theme")).toBeNull();
  });

  describe("onRehydrate", () => {
    it("should set data-admin-theme when rehydrated with valid state", () => {
      const { persist } = useAdminThemeStore;
      const options = persist.getOptions() as {
        onRehydrateStorage?: () => (state?: AdminThemeState) => void;
      };
      if (options.onRehydrateStorage) {
        const callback = options.onRehydrateStorage();
        if (callback) {
          callback({ theme: "dark", setTheme: () => {}, toggleTheme: () => {} });
          expect(document.documentElement.getAttribute("data-admin-theme")).toBe("dark");
        }
      }
    });

    it("should handle undefined state in onRehydrate", () => {
      const { persist } = useAdminThemeStore;
      const options = persist.getOptions() as {
        onRehydrateStorage?: () => (state?: AdminThemeState) => void;
      };
      if (options.onRehydrateStorage) {
        const callback = options.onRehydrateStorage();
        if (callback) {
          expect(() => callback(undefined)).not.toThrow();
        }
      }
    });
  });
});
