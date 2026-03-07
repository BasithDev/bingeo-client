import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminTheme = "light" | "dark";

export interface AdminThemeState {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  toggleTheme: () => void;
}

export const useAdminThemeStore = create<AdminThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
      },
    }),
    {
      name: "bingeo-admin-theme",
    },
  ),
);
