import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAdminSidebarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useAdminSidebarStore = create<IAdminSidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    { name: "bingeo-admin-sidebar" },
  ),
);
