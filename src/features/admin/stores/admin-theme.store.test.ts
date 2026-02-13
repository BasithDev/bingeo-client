import { describe, it, expect, beforeEach } from "vitest";
import { useAdminThemeStore } from "./admin-theme.store";

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

  it("should set data-admin-theme attribute on document", () => {
    useAdminThemeStore.getState().setTheme("dark");
    expect(document.documentElement.getAttribute("data-admin-theme")).toBe("dark");
  });

  it("should set data-admin-theme attribute on toggle", () => {
    useAdminThemeStore.getState().toggleTheme();
    expect(document.documentElement.getAttribute("data-admin-theme")).toBe("dark");
  });
});
