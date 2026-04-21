import { beforeEach, describe, expect, it } from "vitest";
import { useAdminSidebarStore } from "@/features/admin/stores/admin-sidebar.store";

describe("useAdminSidebarStore", () => {
  beforeEach(() => {
    useAdminSidebarStore.setState({ collapsed: false });
  });

  it("should initialize with collapsed = false", () => {
    const state = useAdminSidebarStore.getState();
    expect(state.collapsed).toBe(false);
  });

  it("should toggle collapsed state", () => {
    useAdminSidebarStore.getState().toggleCollapsed();
    expect(useAdminSidebarStore.getState().collapsed).toBe(true);

    useAdminSidebarStore.getState().toggleCollapsed();
    expect(useAdminSidebarStore.getState().collapsed).toBe(false);
  });

  it("should set collapsed to a specific value", () => {
    useAdminSidebarStore.getState().setCollapsed(true);
    expect(useAdminSidebarStore.getState().collapsed).toBe(true);

    useAdminSidebarStore.getState().setCollapsed(false);
    expect(useAdminSidebarStore.getState().collapsed).toBe(false);
  });

  it("should set collapsed to true even when already true", () => {
    useAdminSidebarStore.getState().setCollapsed(true);
    useAdminSidebarStore.getState().setCollapsed(true);
    expect(useAdminSidebarStore.getState().collapsed).toBe(true);
  });
});
