import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminSidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useAdminSidebarStore = create<AdminSidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    { name: "bingeo-admin-sidebar" },
  ),
);
